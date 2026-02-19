
// Vanilla JS Departments Logic

document.addEventListener('DOMContentLoaded', async () => {
    const container = initLayout('Departments');

    // Fetch Data
    const departments = await DataService.getDepartments();
    const user = Auth.getCurrentUser();
    const isAdmin = user && user.role === 'admin';

    container.innerHTML = `
        <div class="max-w-6xl mx-auto space-y-6">
            <div class="flex justify-between items-center">
                <h1 class="text-3xl font-bold text-gray-900">Departments</h1>
                ${isAdmin ? `
                    <button onclick="openAddModal()" class="px-4 py-2 bg-blue-900 text-white rounded-lg flex items-center gap-2 hover:bg-blue-800">
                        <i data-lucide="plus" class="w-4 h-4"></i> Add New Department
                    </button>
                ` : ''}
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${departments.map(dept => `
                    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                        <div class="p-6 border-b border-gray-100 flex items-center gap-4">
                            <div class="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-700 font-bold text-lg">
                                ${dept.code}
                            </div>
                            <div>
                                <h3 class="font-bold text-gray-900 line-clamp-1" title="${dept.name}">${dept.name}</h3>
                                <p class="text-sm text-gray-500">Code: ${dept.code}</p>
                            </div>
                        </div>
                        <div class="p-6 bg-gray-50/50">
                            <div class="flex items-start gap-3">
                                <div class="p-2 bg-amber-50 rounded-full text-amber-600">
                                    <i data-lucide="user-check" class="w-4 h-4"></i>
                                </div>
                                <div>
                                    <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">HOD</p>
                                    <p class="font-medium text-gray-900">${dept.hod || 'Not Assigned'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('')}
                
                ${departments.length === 0 ? '<p class="text-gray-500 col-span-full text-center py-10">No departments found.</p>' : ''}
            </div>
        </div>

        <!-- Add Modal (Hidden by default) -->
        <div id="add-modal" class="fixed inset-0 bg-black/50 z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-scale-in">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-xl font-bold">Add Department</h3>
                    <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600"><i data-lucide="x" class="w-5 h-5"></i></button>
                </div>
                <form id="add-dept-form" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium mb-1">Department Name</label>
                        <input type="text" name="name" class="w-full px-3 py-2 border rounded-lg" required>
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-1">Code (e.g., CS)</label>
                        <input type="text" name="code" class="w-full px-3 py-2 border rounded-lg" required>
                    </div>
                    <div class="flex justify-end gap-2 mt-6">
                        <button type="button" onclick="closeModal()" class="px-4 py-2 border rounded-lg">Cancel</button>
                        <button type="submit" class="px-4 py-2 bg-blue-900 text-white rounded-lg">Add</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    window.lucide.createIcons();
});

window.openAddModal = () => {
    document.getElementById('add-modal').classList.remove('hidden');
}

window.closeModal = () => {
    document.getElementById('add-modal').classList.add('hidden');
}

document.addEventListener('submit', async (e) => {
    if (e.target.id !== 'add-dept-form') return;
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = {
        name: formData.get('name'),
        code: formData.get('code')
    };

    try {
        await DataService.addDepartment(data);
        alert('Department added!');
        window.location.reload();
    } catch (err) {
        alert('Error: ' + err.message);
    }
});
