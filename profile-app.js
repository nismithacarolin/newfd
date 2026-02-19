
// Vanilla JS Profile Logic

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Initialize Layout
    const contentContainer = initLayout('Profile'); // Returns wrapper div

    // 2. Fetch User Data
    const user = Auth.getCurrentUser();
    let facultyData = null;

    if (user.role === 'faculty') {
        const allFaculty = await DataService.getFaculty();
        facultyData = allFaculty.find(f => f.id === user.facultyId) ||
            allFaculty.find(f => f.firstName === user.name);
    }

    // 3. Render Content
    renderProfile(contentContainer, user, facultyData);
});

function renderProfile(container, user, facultyData) {
    if (user.role === 'admin') {
        renderAdminView(container, user);
    } else {
        renderFacultyView(container, user, facultyData);
    }
    // Re-init icons
    window.lucide.createIcons();
}

// --- ADMIN VIEW ---
async function renderAdminView(container, user) {
    const requests = await DataService.getRequests(); // Fetch requests

    let requestsHTML = '';
    if (requests.length === 0) {
        requestsHTML = `<div class="p-8 text-center text-gray-500">No pending requests found.</div>`;
    } else {
        requestsHTML = `<div class="divide-y divide-gray-100">
            ${requests.map(req => `
                <div class="p-6 hover:bg-gray-50 transition-colors">
                    <div class="flex justify-between items-start mb-2">
                        <div>
                            <span class="font-bold text-gray-900">${req.facultyName}</span>
                            <span class="text-gray-500 text-sm ml-2">ID: ${req.facultyId}</span>
                        </div>
                        <span class="px-2 py-1 rounded text-xs font-semibold ${req.status === 'Resolved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">
                            ${req.status}
                        </span>
                    </div>
                    <p class="text-gray-700 bg-gray-50 p-3 rounded border border-gray-100 mb-3 text-sm">
                        ${req.requestText}
                    </p>
                    <div class="flex justify-between items-center text-sm">
                        <span class="text-gray-400">${req.createdAt || ''}</span>
                        ${req.status !== 'Resolved' ? `
                            <button onclick="resolveRequest(${req.id})" class="text-green-600 hover:text-green-700 font-medium flex items-center gap-1">
                                <i data-lucide="check-circle" class="w-4 h-4"></i> Mark as Resolved
                            </button>
                        ` : ''}
                    </div>
                </div>
            `).join('')}
        </div>`;
    }

    container.innerHTML = `
        <div class="max-w-6xl mx-auto mb-12 animate-fade-in">
            <h1 class="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
            
            <div class="space-y-6">
                 <!-- Admin Card -->
                <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center gap-4">
                    <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold">A</div>
                    <div>
                        <h2 class="text-xl font-bold text-gray-800">System Administrator</h2>
                        <p class="text-gray-500">Manage faculty requests and system settings.</p>
                    </div>
                </div>

                <!-- Requests List -->
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div class="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                        <h3 class="text-lg font-bold text-gray-800">Change Requests</h3>
                        <button onclick="window.location.reload()" class="text-sm text-blue-600 hover:underline">Refresh</button>
                    </div>
                    ${requestsHTML}
                </div>
            </div>
        </div>
    `;
}

window.resolveRequest = async (id) => {
    if (confirm('Mark this request as resolved?')) {
        await DataService.updateRequestStatus(id, 'Resolved');
        window.location.reload();
    }
};

// --- FACULTY VIEW ---
function renderFacultyView(container, user, data) {
    if (!data) {
        container.innerHTML = `<div class="text-center py-12"><p class="text-gray-500">Profile data not found.</p></div>`;
        return;
    }

    const detailRow = (label, value) => `
        <tr class="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
            <td class="py-2 px-4 w-1/3 font-semibold text-gray-600 text-sm">${label}</td>
            <td class="py-2 px-4 text-gray-900 font-medium text-sm">${value || '-'}</td>
        </tr>
    `;

    const sectionHeader = (title, icon) => `
        <div class="px-6 py-3 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
            <i data-lucide="${icon || 'info'}" class="w-4 h-4 text-blue-800"></i>
            <h3 class="font-bold text-gray-800 text-sm uppercase tracking-wide">${title}</h3>
        </div>
    `;

    container.innerHTML = `
        <div class="max-w-6xl mx-auto mb-12 animate-fade-in">
            <h1 class="text-3xl font-bold text-gray-900 mb-6">My Profile</h1>
            
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Left: Profile Details -->
                <div class="lg:col-span-2 space-y-6">
                    <!-- Identity Card -->
                    <div class="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
                        <div class="bg-gradient-to-r from-blue-900 to-blue-700 p-6 text-white flex items-center gap-5">
                            <!-- Image Upload -->
                            <div class="relative group cursor-pointer" onclick="document.getElementById('file-upload').click()">
                                <div class="w-24 h-24 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-3xl font-bold shadow-inner overflow-hidden border-2 border-white/50 group-hover:border-white transition-colors">
                                    ${data.profileImage ? `<img src="${data.profileImage}" class="w-full h-full object-cover">` : `<span>${data.firstName[0]}${data.lastName[0]}</span>`}
                                </div>
                                <div class="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <i data-lucide="camera" class="text-white w-6 h-6"></i>
                                </div>
                                <input type="file" id="file-upload" class="hidden" accept="image/*" onchange="uploadProfileImage(this, ${data.id})">
                            </div>

                            <div>
                                <h2 class="text-2xl font-bold">${data.firstName} ${data.lastName}</h2>
                                <p class="text-blue-100 opacity-90">${data.designation}</p>
                                <div class="flex gap-2 text-xs mt-2 opacity-75">
                                    <span class="bg-white/20 px-2 py-0.5 rounded">${data.department}</span>
                                    <span class="bg-white/20 px-2 py-0.5 rounded">${data.type}</span>
                                </div>
                            </div>
                        </div>

                        <div class="p-0">
                             ${sectionHeader('Personal & Academic', 'user')}
                             <table class="w-full">
                                <tbody>
                                    ${detailRow("Mobile", data.mobile)}
                                    ${detailRow("Email", data.email)}
                                    ${detailRow("Education", data.education)}
                                    ${detailRow("Specialization", data.specialization)}
                                    ${detailRow("IRINS", data.irinsLink ? `<a href="${data.irinsLink}" target="_blank" class="text-blue-600 hover:underline">Link</a>` : '-')}
                                </tbody>
                             </table>
                        </div>
                    </div>

                    <!-- Experience & Research -->
                    <div class="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-200">
                         ${sectionHeader('Professional Experience', 'briefcase')}
                         <table class="w-full">
                            <tbody>
                                ${detailRow("Teaching Experience", `${data.expTeaching || 0} Years`)}
                                ${detailRow("Research Experience", `${data.expResearch || 0} Years`)}
                                ${detailRow("Industry Experience", `${data.expIndustry || 0} Years`)}
                            </tbody>
                         </table>
                    </div>

                    <!-- Research Guidance -->
                    <div class="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-200">
                         ${sectionHeader('Research Supervision', 'users')}
                         <div class="p-4 grid grid-cols-3 gap-4 text-center">
                            <div class="p-3 bg-gray-50 rounded-lg">
                                <span class="block text-xl font-bold text-gray-900">${data.resMphil || '-'}</span>
                                <span class="text-xs text-gray-500 uppercase">M.Phil</span>
                            </div>
                            <div class="p-3 bg-gray-50 rounded-lg">
                                <span class="block text-xl font-bold text-gray-900">${data.resPhdCompleted || '-'}</span>
                                <span class="text-xs text-gray-500 uppercase">Ph.D (Done)</span>
                            </div>
                            <div class="p-3 bg-gray-50 rounded-lg">
                                <span class="block text-xl font-bold text-gray-900">${data.resPhdProgress || '-'}</span>
                                <span class="text-xs text-gray-500 uppercase">Ph.D (Ongoing)</span>
                            </div>
                         </div>
                    </div>

                     <!-- Publications -->
                    <div class="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-200">
                         ${sectionHeader('Publications Summary', 'book-open')}
                         <div class="p-4 space-y-4">
                            <div>
                                <h4 class="text-xs font-bold text-gray-400 uppercase mb-2">Articles</h4>
                                <div class="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                                    <div class="p-2 border rounded">UGC: <b>${data.pubUgc || '-'}</b></div>
                                    <div class="p-2 border rounded">Scopus: <b>${data.pubScopus || '-'}</b></div>
                                    <div class="p-2 border rounded">Peer: <b>${data.pubPeerReviewed || '-'}</b></div>
                                    <div class="p-2 border rounded">Proc: <b>${data.pubProceedings || '-'}</b></div>
                                </div>
                            </div>
                            <div>
                                <h4 class="text-xs font-bold text-gray-400 uppercase mb-2">Books</h4>
                                <div class="grid grid-cols-3 gap-2 text-sm">
                                    <div class="p-2 border rounded">Author: <b>${data.bookAuthor || '-'}</b></div>
                                    <div class="p-2 border rounded">Co-Author: <b>${data.bookCoAuthor || '-'}</b></div>
                                    <div class="p-2 border rounded">Chapters: <b>${data.bookChapters || '-'}</b></div>
                                </div>
                            </div>
                         </div>
                    </div>

                </div>

                <!-- Right: Request Box -->
                <div class="lg:col-span-1">
                    <div class="bg-white p-6 rounded-xl shadow-md border border-gray-200 sticky top-6">
                        <h3 class="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
                             <i data-lucide="message-square" class="w-5 h-5 text-amber-500"></i> Request Changes
                        </h3>
                        <p class="text-sm text-gray-500 mb-4">Found an error in your profile? Submit a request to the administrator.</p>
                        <form onsubmit="submitRequest(event, ${user.id}, '${data.firstName} ${data.lastName}')">
                            <textarea id="req-text" class="w-full p-3 border border-gray-300 rounded-lg mb-4 text-sm focus:ring-2 focus:ring-blue-900 focus:outline-none" rows="4" placeholder="Describe changes needed..." required></textarea>
                            <button type="submit" class="w-full bg-blue-900 text-white py-2.5 rounded-lg font-medium hover:bg-blue-800 shadow-lg shadow-blue-900/20 transition-all">Send Request</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;
}

window.uploadProfileImage = async (input, userId) => {
    const file = input.files[0];
    if (!file) return;

    if (!confirm("Upload this image?")) return;

    try {
        const formData = new FormData();
        formData.append('profileImageFile', file);
        const updatedFac = await DataService.updateFaculty(userId, formData);

        // Update Local Storage
        const currentUser = Auth.getCurrentUser();
        currentUser.profileImage = updatedFac.profileImage;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        alert("Image Updated!");
        window.location.reload();
    } catch (e) {
        alert("Upload failed: " + e.message);
    }
}

window.submitRequest = async (e, userId, userName) => {
    e.preventDefault();
    const text = document.getElementById('req-text').value;
    try {
        await DataService.addRequest({
            facultyId: userId,
            facultyName: userName,
            requestText: text
        });
        alert("Request Sent!");
        e.target.reset();
    } catch (err) {
        alert("Failed to send");
    }
}
