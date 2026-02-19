
// Vanilla JS Faculty Detail View

document.addEventListener('DOMContentLoaded', async () => {
    const container = initLayout('Faculty Details');

    // Get ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    if (!id) {
        window.location.href = 'faculty-list.html';
        return;
    }

    const allFaculty = await DataService.getFaculty();
    const faculty = allFaculty.find(f => f.id == id);

    if (!faculty) {
        container.innerHTML = `<div class="p-8 text-center text-gray-500">Faculty not found.</div>`;
        return;
    }

    const detailRow = (label, value) => `
        <tr class="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
            <td class="py-3 px-4 w-1/3 font-semibold text-gray-600 text-sm">${label}</td>
            <td class="py-3 px-4 text-gray-900 font-medium text-sm">${value || '-'}</td>
        </tr>
    `;

    const sectionHeader = (title, icon) => `
        <div class="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
            <i data-lucide="${icon || 'info'}" class="w-5 h-5 text-blue-800"></i>
            <h3 class="text-lg font-bold text-gray-800">${title}</h3>
        </div>
    `;

    container.innerHTML = `
        <div class="max-w-5xl mx-auto space-y-6 pb-12 animate-fade-in">
            <div class="flex items-center gap-4 mb-4">
                 <button onclick="window.history.back()" class="p-2 hover:bg-white bg-gray-50 border border-gray-200 rounded-full transition-colors shadow-sm">
                    <i data-lucide="arrow-left" class="w-5 h-5 text-gray-600"></i>
                </button>
                 <h1 class="text-3xl font-bold text-gray-900">Faculty Profile</h1>
            </div>

            <!-- Header Card -->
            <div class="bg-white shadow-md rounded-xl overflow-hidden border border-gray-200">
                <div class="bg-gradient-to-r from-blue-900 to-blue-800 p-8 text-white flex flex-col md:flex-row items-center gap-8">
                    <div class="w-32 h-32 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-4xl font-bold shadow-2xl overflow-hidden border-4 border-white/30 shrink-0">
                        ${faculty.profileImage ? `<img src="${faculty.profileImage}" class="w-full h-full object-cover">` : `<span>${faculty.firstName[0]}${faculty.lastName[0]}</span>`}
                    </div>
                    <div class="text-center md:text-left space-y-2">
                        <h2 class="text-3xl font-bold text-white tracking-tight">${faculty.firstName} ${faculty.lastName}</h2>
                        <p class="text-blue-200 text-lg font-medium">${faculty.designation}</p>
                        <div class="flex flex-wrap justify-center md:justify-start gap-3 text-sm mt-3 opacity-90">
                            <span class="bg-white/20 px-3 py-1 rounded-full border border-white/10 flex items-center gap-1"><i data-lucide="building-2" class="w-3 h-3"></i> ${faculty.department}</span>
                            <span class="bg-white/20 px-3 py-1 rounded-full border border-white/10 flex items-center gap-1"><i data-lucide="badge-check" class="w-3 h-3"></i> ${faculty.type}</span>
                            <span class="bg-white/20 px-3 py-1 rounded-full border border-white/10 flex items-center gap-1"><i data-lucide="clock" class="w-3 h-3"></i> ${faculty.shift}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Personal Info -->
                <div class="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-200 h-full">
                    ${sectionHeader('Contact Information', 'contact')}
                    <div class="p-0">
                        <table class="w-full text-left">
                            <tbody>
                                ${detailRow("Mobile", faculty.mobile)}
                                ${detailRow("Email", faculty.email)}
                                ${detailRow("IRINS Link", faculty.irinsLink ? `<a href="${faculty.irinsLink}" target="_blank" class="text-blue-600 hover:underline break-all">View Profile</a>` : '-')}
                                ${detailRow("LinkedIn", faculty.linkedinLink ? `<a href="${faculty.linkedinLink}" target="_blank" class="text-blue-600 hover:underline break-all">View Profile</a>` : '-')}
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Experience -->
                <div class="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-200 h-full">
                    ${sectionHeader('Professional Experience (Years)', 'briefcase')}
                    <div class="p-0">
                        <table class="w-full text-left">
                            <tbody>
                                ${detailRow("Teaching", faculty.expTeaching)}
                                ${detailRow("Research", faculty.expResearch)}
                                ${detailRow("Industry", faculty.expIndustry)}
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Academic -->
                <div class="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-200 h-full">
                    ${sectionHeader('Academic Qualification', 'graduation-cap')}
                    <div class="p-0">
                        <table class="w-full text-left">
                            <tbody>
                                ${detailRow("Education", faculty.education)}
                                ${detailRow("Specialization", faculty.specialization)}
                                ${detailRow("Other Qualifications", faculty.otherQualifications)}
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Research Guidance -->
                <div class="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-200 h-full">
                    ${sectionHeader('Research Supervision', 'users')}
                    <div class="p-0">
                        <table class="w-full text-left">
                            <tbody>
                                ${detailRow("M.Phil.", faculty.resMphil)}
                                ${detailRow("Ph.D. (Completed)", faculty.resPhdCompleted)}
                                ${detailRow("Ph.D. (In Progress)", faculty.resPhdProgress)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Publications -->
            <div class="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-200">
                ${sectionHeader('Professional Highlights', 'star')}
                <div class="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                     <!-- Articles -->
                     <div class="space-y-3">
                        <h4 class="font-bold text-gray-700 border-b pb-2 text-sm uppercase tracking-wide">Journal Articles</h4>
                        <ul class="space-y-2 text-sm text-gray-600">
                             <li class="flex justify-between"><span class="font-medium">UGC:</span> <span>${faculty.pubUgc || '-'}</span></li>
                             <li class="flex justify-between"><span class="font-medium">SCOPUS:</span> <span>${faculty.pubScopus || '-'}</span></li>
                             <li class="flex justify-between"><span class="font-medium">Peer Reviewed:</span> <span>${faculty.pubPeerReviewed || '-'}</span></li>
                             <li class="flex justify-between"><span class="font-medium">Proceedings:</span> <span>${faculty.pubProceedings || '-'}</span></li>
                        </ul>
                     </div>

                     <!-- Books -->
                     <div class="space-y-3">
                        <h4 class="font-bold text-gray-700 border-b pb-2 text-sm uppercase tracking-wide">Books & Chapters</h4>
                        <ul class="space-y-2 text-sm text-gray-600">
                             <li class="flex justify-between"><span class="font-medium">Author:</span> <span>${faculty.bookAuthor || '-'}</span></li>
                             <li class="flex justify-between"><span class="font-medium">Co-Author:</span> <span>${faculty.bookCoAuthor || '-'}</span></li>
                             <li class="flex justify-between"><span class="font-medium">Chapters:</span> <span>${faculty.bookChapters || '-'}</span></li>
                        </ul>
                     </div>

                     <!-- Editorial -->
                     <div class="space-y-3">
                        <h4 class="font-bold text-gray-700 border-b pb-2 text-sm uppercase tracking-wide">Editorial Roles</h4>
                         <ul class="space-y-2 text-sm text-gray-600">
                             <li class="flex justify-between"><span class="font-medium">Editor:</span> <span>${faculty.journalEditor || '-'}</span></li>
                             <li class="flex justify-between"><span class="font-medium">Reviewer:</span> <span>${faculty.journalReviewer || '-'}</span></li>
                        </ul>
                     </div>
                </div>
            </div>
            
        </div>
    `;

    window.lucide.createIcons();
});
