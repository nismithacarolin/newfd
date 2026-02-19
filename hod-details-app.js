
// Vanilla JS HOD Details Logic

document.addEventListener('DOMContentLoaded', async () => {
    const container = initLayout('HOD Details');

    // Fetch Data
    const [departments, faculty] = await Promise.all([
        DataService.getDepartments(),
        DataService.getFaculty()
    ]);

    // Map HODs
    // Simple logic: Use department.hod field (string name). 
    // Ideally we might want to link to faculty profile if possible, but string is what we have in DB usually.
    // wait, we can try to find the faculty member whose name matches the HOD name to show their image.

    container.innerHTML = `
        <div class="max-w-6xl mx-auto space-y-8 animate-fade-in">
            <div class="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div>
                     <h1 class="text-3xl font-bold text-gray-900">Head of Departments</h1>
                     <p class="text-gray-500 mt-1">Department leaders and contact information</p>
                </div>
                <div class="p-3 bg-blue-50 rounded-full text-blue-800">
                    <i data-lucide="crown" class="w-8 h-8"></i>
                </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${departments.map(dept => {
        const hodName = dept.hod;
        const hodFac = faculty.find(f => `${f.firstName} ${f.lastName}` === hodName || f.firstName === hodName);

        return `
                        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center gap-5 hover:shadow-md transition-all hover:border-blue-200 group relative overflow-hidden">
                            <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-50 to-transparent -mr-8 -mt-8 rounded-full opacity-50"></div>
                            
                            <div class="relative w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xl overflow-hidden shrink-0 ring-4 ring-white shadow-sm">
                                ${hodFac && hodFac.profileImage
                ? `<img src="${hodFac.profileImage}" class="w-full h-full object-cover">`
                : (hodName ? hodName[0] : '?')
            }
                            </div>
                            
                            <div class="relative flex-1 min-w-0">
                                <h3 class="font-bold text-gray-900 truncate text-lg" title="${hodName}">${hodName || 'Not Assigned'}</h3>
                                <div class="flex items-center gap-2 mt-1">
                                    <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                                        ${dept.code}
                                    </span>
                                    <span class="text-xs text-gray-500 truncate" title="${dept.name}">${dept.name}</span>
                                </div>
                                <p class="text-xs text-gray-400 mt-2 font-medium uppercase tracking-wide">Head of Department</p>
                            </div>
                        </div>
                    `;
    }).join('')}
            </div>
             ${departments.length === 0 ? '<div class="bg-white p-12 rounded-xl border border-dashed border-gray-300 text-center"><i data-lucide="inbox" class="w-12 h-12 text-gray-300 mx-auto mb-3"></i><p class="text-gray-500">No departments found.</p></div>' : ''}
        </div>
    `;

    window.lucide.createIcons();
});
