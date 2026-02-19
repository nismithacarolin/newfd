
// Vanilla JS Faculty List Logic

document.addEventListener('DOMContentLoaded', async () => {
    const container = initLayout('Faculty Details');

    // Initial Render
    container.innerHTML = `
        <div class="max-w-6xl mx-auto space-y-6">
            <div class="flex justify-between items-center">
                <h1 class="text-3xl font-bold text-gray-900">Faculty Details</h1>
                
                <!-- Search -->
                <div class="relative flex-1 max-w-2xl">
                    <input type="text" id="search-input" placeholder="Search faculty by name or department..." 
                           class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:outline-none"
                           onkeyup="filterFaculty()">
                    <div class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <i data-lucide="search" class="w-4 h-4"></i>
                    </div>
                </div>
            </div>

            <!-- Table Card -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
                                <th class="p-4">Faculty Name</th>
                                <th class="p-4">Department</th>
                                <th class="p-4">Designation</th>
                                <th class="p-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="faculty-table-body" class="divide-y divide-gray-100 text-sm">
                            <tr><td colspan="4" class="p-4 text-center text-gray-500">Loading...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div class="flex justify-end p-4 border-t border-gray-100 bg-gray-50">
                 <button onclick="exportToExcel()" class="flex items-center gap-2 text-green-700 bg-green-50 hover:bg-green-100 px-4 py-2 rounded-lg transition-colors border border-green-200 font-medium">
                        <i data-lucide="sheet" class="w-4 h-4"></i> Export to Excel
                 </button>
            </div>
        </div>
    `;

    // Fetch Data
    const allFaculty = await DataService.getFaculty();
    window.allFacultyData = allFaculty; // Store for filtering
    renderTable(allFaculty);
});

function renderTable(data) {
    const tbody = document.getElementById('faculty-table-body');
    if (data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="p-4 text-center text-gray-500">No faculty found.</td></tr>`;
        return;
    }

    const user = Auth.getCurrentUser();
    const isAdmin = user && user.role === 'admin';

    tbody.innerHTML = data.map(f => `
        <tr class="hover:bg-blue-50/40 transition-colors group border-b border-gray-50 last:border-0 text-sm">
            <td class="p-4 font-medium text-gray-900">
                <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs shrink-0 overflow-hidden ring-2 ring-white shadow-sm">
                         ${f.profileImage
            ? `<img src="${f.profileImage}" class="w-full h-full object-cover">`
            : `${f.firstName[0] || ''}${f.lastName[0] || ''}`
        }
                    </div>
                    <div>
                        <span class="block text-gray-900 font-semibold">${f.firstName} ${f.lastName}</span>
                        <span class="block text-gray-400 text-xs font-normal">${f.email}</span>
                    </div>
                </div>
            </td>
            <td class="p-4">
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                   ${f.department}
                </span>
            </td>
            <td class="p-4">
                 <div class="flex flex-col">
                    <span class="text-gray-700 font-medium">${f.designation}</span>
                    <span class="text-xs text-gray-400">${f.type || 'Regular'}</span>
                 </div>
            </td>
            <td class="p-4 text-center">
                <div class="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onclick="viewDetails(${f.id})" class="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors shadow-sm" title="View Details">
                        <i data-lucide="eye" class="w-4 h-4"></i>
                    </button>
                    ${isAdmin ? `
                        <button onclick="window.location.href='edit-faculty.html?id=${f.id}'" class="p-2 text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors shadow-sm" title="Edit">
                            <i data-lucide="pencil" class="w-4 h-4"></i>
                        </button>
                        <button onclick="deleteFaculty(${f.id})" class="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors shadow-sm" title="Delete">
                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                        </button>
                    ` : ''}
                </div>
            </td>
        </tr>
    `).join('');

    window.lucide.createIcons();
}

window.filterFaculty = () => {
    const query = document.getElementById('search-input').value.toLowerCase();
    const filtered = window.allFacultyData.filter(f =>
        f.firstName.toLowerCase().includes(query) ||
        f.lastName.toLowerCase().includes(query) ||
        f.department.toLowerCase().includes(query)
    );
    renderTable(filtered);
}

window.viewDetails = (id) => {
    window.location.href = `faculty-detail.html?id=${id}`;
    // Assuming faculty-detail.html exists or will be created? 
    // Wait, the user has `faculty-detail.html` in file list. I should check if I need to convert it too.
    // Yes, I see `faculty-detail.html` in the file list earlier.
}

window.deleteFaculty = async (id) => {
    if (confirm('Are you sure you want to delete this faculty member?')) {
        await DataService.deleteFaculty(id);
        const newData = await DataService.getFaculty();
        window.allFacultyData = newData;
        renderTable(newData);
    }
}

window.exportToExcel = () => {
    alert("Export functionality would go here (requires external library like SheetJS, which isn't included).");
}
