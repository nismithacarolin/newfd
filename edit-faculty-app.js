
// Vanilla JS Edit Faculty Logic (Full Field Support)

document.addEventListener('DOMContentLoaded', async () => {
    const container = initLayout('Faculty Details');

    // Get ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    if (!id) {
        alert('No ID provided');
        window.location.href = 'faculty-list.html';
        return;
    }

    // Fetch Data
    const [allFaculty, depts] = await Promise.all([
        DataService.getFaculty(),
        DataService.getDepartments()
    ]);

    const faculty = allFaculty.find(f => f.id == id);
    if (!faculty) {
        alert('Faculty not found');
        window.location.href = 'faculty-list.html';
        return;
    }

    container.innerHTML = `
        <div class="max-w-5xl mx-auto mb-12 animate-fade-in">
            <div class="flex items-center gap-4 mb-6">
                <button onclick="window.history.back()" class="p-2 bg-white border border-gray-200 rounded-full hover:bg-gray-50 text-gray-600 transition-colors shadow-sm">
                    <i data-lucide="arrow-left" class="w-5 h-5"></i>
                </button>
                <h1 class="text-3xl font-bold text-gray-900">Edit Faculty: ${faculty.firstName}</h1>
            </div>

            <form id="edit-faculty-form" class="space-y-6">
                <input type="hidden" name="id" value="${faculty.id}">

                <!-- Basic Information -->
                <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div class="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                         <h3 class="text-lg font-bold text-gray-800">Basic Information</h3>
                    </div>
                    <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label class="input-label">First Name <span class="text-red-500">*</span></label>
                            <input type="text" name="firstName" value="${faculty.firstName || ''}" class="input-field" required>
                        </div>
                        <div>
                            <label class="input-label">Last Name <span class="text-red-500">*</span></label>
                            <input type="text" name="lastName" value="${faculty.lastName || ''}" class="input-field" required>
                        </div>
                        <div>
                            <label class="input-label">Email <span class="text-red-500">*</span></label>
                            <input type="email" name="email" value="${faculty.email || ''}" class="input-field" required>
                        </div>
                        <div>
                            <label class="input-label">Mobile</label>
                            <input type="tel" name="mobile" value="${faculty.mobile || ''}" class="input-field">
                        </div>
                        
                        <div>
                            <label class="input-label">Department <span class="text-red-500">*</span></label>
                            <select name="department" class="input-field" required>
                                <option value="">Select Department</option>
                                ${depts.map(d => `<option value="${d.name}" ${faculty.department === d.name ? 'selected' : ''}>${d.name}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label class="input-label">Designation <span class="text-red-500">*</span></label>
                            <select name="designation" class="input-field" required>
                                <option value="">Select Designation</option>
                                ${['Assistant Professor', 'Associate Professor', 'Professor', 'HOD'].map(opt => `<option value="${opt}" ${faculty.designation === opt ? 'selected' : ''}>${opt}</option>`).join('')}
                            </select>
                        </div>
                         
                        <div>
                            <label class="input-label">Staff Type</label>
                            <select name="type" class="input-field">
                                ${['Aided', 'Self Finance'].map(opt => `<option value="${opt}" ${faculty.type === opt ? 'selected' : ''}>${opt}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label class="input-label">Shift</label>
                             <select name="shift" class="input-field">
                                ${['Shift I', 'Shift II'].map(opt => `<option value="${opt}" ${faculty.shift === opt ? 'selected' : ''}>${opt}</option>`).join('')}
                            </select>
                        </div>

                         <div class="md:col-span-2">
                             <label class="flex items-center gap-2 cursor-pointer p-3 border border-blue-100 bg-blue-50/50 rounded-lg hover:bg-blue-50 transition-colors">
                                <input type="checkbox" name="isHod" class="w-5 h-5 text-blue-900 rounded focus:ring-blue-900 border-gray-300">
                                <span class="text-gray-700 font-medium">Assign as Head of Department (HOD)</span>
                            </label>
                         </div>

                        <div class="md:col-span-2">
                             <label class="input-label">Update Profile Image</label>
                             <div class="mt-1 flex items-center gap-4">
                                <div class="relative w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-300 shrink-0">
                                    ${faculty.profileImage ? `<img src="${faculty.profileImage}" class="w-full h-full object-cover">` : `<i data-lucide="user" class="text-gray-400"></i>`}
                                </div>
                                <input type="file" name="profileImageFile" class="block w-full text-sm text-gray-500
                                  file:mr-4 file:py-2 file:px-4
                                  file:rounded-full file:border-0
                                  file:text-sm file:font-semibold
                                  file:bg-blue-50 file:text-blue-700
                                  hover:file:bg-blue-100
                                " accept="image/*">
                             </div>
                        </div>
                    </div>
                </div>

                <!-- Professional Experience -->
                <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div class="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                         <h3 class="text-lg font-bold text-gray-800">Professional Experience (in years)</h3>
                    </div>
                     <div class="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div><label class="input-label">Teaching</label><input type="text" name="expTeaching" value="${faculty.expTeaching || ''}" class="input-field"></div>
                        <div><label class="input-label">Research</label><input type="text" name="expResearch" value="${faculty.expResearch || ''}" class="input-field"></div>
                        <div><label class="input-label">Industry</label><input type="text" name="expIndustry" value="${faculty.expIndustry || ''}" class="input-field"></div>
                    </div>
                </div>

                <!-- Academic Details -->
                <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div class="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                         <h3 class="text-lg font-bold text-gray-800">Academic Details</h3>
                    </div>
                     <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div><label class="input-label">Specialization</label><input type="text" name="specialization" value="${faculty.specialization || ''}" class="input-field"></div>
                        <div><label class="input-label">Education (e.g. M.Sc, Ph.D)</label><input type="text" name="education" value="${faculty.education || ''}" class="input-field"></div>
                        <div><label class="input-label">Other Qualifications (NET/SET)</label><input type="text" name="otherQualifications" value="${faculty.otherQualifications || ''}" class="input-field"></div>
                    </div>
                </div>

                <!-- Contact Details -->
                <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div class="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                         <h3 class="text-lg font-bold text-gray-800">Contact Links</h3>
                    </div>
                     <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div><label class="input-label">IRINS Link</label><input type="url" name="irinsLink" value="${faculty.irinsLink || ''}" class="input-field" placeholder="https://..."></div>
                        <div><label class="input-label">LinkedIn Link</label><input type="url" name="linkedinLink" value="${faculty.linkedinLink || ''}" class="input-field" placeholder="https://..."></div>
                    </div>
                </div>
                
                 <!-- Research Supervision -->
                <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div class="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                         <h3 class="text-lg font-bold text-gray-800">Research Supervision</h3>
                    </div>
                     <div class="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div><label class="input-label">M.Phil.</label><input type="text" name="resMphil" value="${faculty.resMphil || ''}" class="input-field"></div>
                        <div><label class="input-label">Ph.D. (Completed)</label><input type="text" name="resPhdCompleted" value="${faculty.resPhdCompleted || ''}" class="input-field"></div>
                        <div><label class="input-label">Ph.D. (In Progress)</label><input type="text" name="resPhdProgress" value="${faculty.resPhdProgress || ''}" class="input-field"></div>
                    </div>
                </div>
                
                <!-- Professional Highlights -->
                <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div class="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                         <h3 class="text-lg font-bold text-gray-800">Professional Highlights</h3>
                    </div>
                     <div class="p-6 space-y-6">
                        <div>
                            <h4 class="font-semibold text-gray-700 mb-3 border-b pb-1">Publications – Articles</h4>
                            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div><label class="input-label">UGC</label><input type="text" name="pubUgc" value="${faculty.pubUgc || ''}" class="input-field"></div>
                                <div><label class="input-label">SCOPUS-indexed</label><input type="text" name="pubScopus" value="${faculty.pubScopus || ''}" class="input-field"></div>
                                <div><label class="input-label">Peer Reviewed</label><input type="text" name="pubPeerReviewed" value="${faculty.pubPeerReviewed || ''}" class="input-field"></div>
                                <div><label class="input-label">Seminar Proceedings</label><input type="text" name="pubProceedings" value="${faculty.pubProceedings || ''}" class="input-field"></div>
                            </div>
                        </div>
                        <div>
                            <h4 class="font-semibold text-gray-700 mb-3 border-b pb-1">Publications – Books & Chapters</h4>
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div><label class="input-label">Books (Author)</label><input type="text" name="bookAuthor" value="${faculty.bookAuthor || ''}" class="input-field"></div>
                                <div><label class="input-label">Books (Co-Author)</label><input type="text" name="bookCoAuthor" value="${faculty.bookCoAuthor || ''}" class="input-field"></div>
                                <div><label class="input-label">Chapters Published</label><input type="text" name="bookChapters" value="${faculty.bookChapters || ''}" class="input-field"></div>
                            </div>
                        </div>
                         <div>
                            <h4 class="font-semibold text-gray-700 mb-3 border-b pb-1">Journal</h4>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div><label class="input-label">Editor</label><input type="text" name="journalEditor" value="${faculty.journalEditor || ''}" class="input-field"></div>
                                <div><label class="input-label">Reviewer/Member</label><input type="text" name="journalReviewer" value="${faculty.journalReviewer || ''}" class="input-field"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex justify-end gap-3 pt-4 pb-8">
                    <button type="button" onclick="window.history.back()" class="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors">Cancel</button>
                    <button type="submit" class="px-6 py-2.5 bg-blue-900 text-white rounded-lg hover:bg-blue-800 font-medium shadow-md shadow-blue-900/20 transition-colors flex items-center gap-2">
                        <i data-lucide="save" class="w-4 h-4"></i> Save Changes
                    </button>
                </div>
            </form>
        </div>
    `;

    window.lucide.createIcons();
});


document.addEventListener('submit', async (e) => {
    if (e.target.id !== 'edit-faculty-form') return;
    e.preventDefault();
    const form = e.target;
    // Get ID manually
    const id = form.querySelector('input[name="id"]').value;
    const formData = new FormData(form);

    try {
        await DataService.updateFaculty(id, formData);
        alert('Faculty updated successfully!');
        window.history.back(); // Go back to where we came from (Details or List)
    } catch (err) {
        alert('Error updating faculty: ' + err.message);
    }
});
