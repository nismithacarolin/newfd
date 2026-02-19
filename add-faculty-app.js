
// Vanilla JS Add Faculty Logic

document.addEventListener('DOMContentLoaded', async () => {
    const container = initLayout('Add New Faculty');

    // Fetch Departments for Dropdown
    const depts = await DataService.getDepartments();

    container.innerHTML = `
        <div class="max-w-5xl mx-auto mb-12 animate-fade-in">
            <div class="flex items-center gap-4 mb-6">
                 <button onclick="window.history.back()" class="p-2 bg-white border border-gray-200 rounded-full hover:bg-gray-50 text-gray-600 transition-colors shadow-sm">
                    <i data-lucide="arrow-left" class="w-5 h-5"></i>
                </button>
                <h1 class="text-3xl font-bold text-gray-900">Add New Faculty</h1>
            </div>

            <form id="add-faculty-form" class="space-y-6">
                <!-- Basic Information -->
                <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div class="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                         <h3 class="text-lg font-bold text-gray-800">Basic Information</h3>
                    </div>
                    <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div><label class="input-label">First Name <span class="text-red-500">*</span></label><input type="text" name="firstName" class="input-field" required></div>
                        <div><label class="input-label">Last Name <span class="text-red-500">*</span></label><input type="text" name="lastName" class="input-field" required></div>
                        <div><label class="input-label">Email <span class="text-red-500">*</span></label><input type="email" name="email" class="input-field" required></div>
                        <div><label class="input-label">Mobile</label><input type="tel" name="mobile" class="input-field"></div>
                        
                        <div>
                            <label class="input-label">Department <span class="text-red-500">*</span></label>
                            <select name="department" class="input-field" required>
                                <option value="">Select Department</option>
                                ${depts.map(d => `<option value="${d.name}">${d.name}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label class="input-label">Designation <span class="text-red-500">*</span></label>
                            <select name="designation" class="input-field" required>
                                <option value="">Select Designation</option>
                                <option value="Assistant Professor">Assistant Professor</option>
                                <option value="Associate Professor">Associate Professor</option>
                                <option value="Professor">Professor</option>
                                <option value="HOD">HOD</option>
                            </select>
                        </div>
                         
                        <div>
                            <label class="input-label">Staff Type</label>
                            <select name="type" class="input-field">
                                <option value="Aided">Aided</option>
                                <option value="Self Finance">Self Finance</option>
                            </select>
                        </div>
                        <div>
                            <label class="input-label">Shift</label>
                            <select name="shift" class="input-field">
                                <option value="Shift I">Shift I</option>
                                <option value="Shift II">Shift II</option>
                            </select>
                        </div>

                         <div class="md:col-span-2">
                            <label class="flex items-center gap-2 cursor-pointer p-3 border border-blue-100 bg-blue-50/50 rounded-lg hover:bg-blue-50 transition-colors">
                                <input type="checkbox" name="isHod" class="w-5 h-5 text-blue-900 rounded focus:ring-blue-900 border-gray-300">
                                <span class="text-gray-700 font-medium">Assign as Head of Department (HOD)</span>
                            </label>
                         </div>

                        <div class="md:col-span-2">
                             <label class="input-label">Profile Image</label>
                             <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:bg-gray-50 transition-colors">
                                <div class="space-y-1 text-center">
                                    <div class="mx-auto h-12 w-12 text-gray-400"><i data-lucide="image"></i></div>
                                    <div class="flex text-sm text-gray-600 justify-center">
                                        <label for="file-upload" class="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                                            <span>Upload a file</span>
                                            <input id="file-upload" name="profileImageFile" type="file" class="sr-only" accept="image/*" onchange="document.getElementById('file-name').innerText = this.files[0].name">
                                        </label>
                                    </div>
                                    <p id="file-name" class="text-sm text-gray-800 font-medium mt-2"></p>
                                </div>
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
                        <div><label class="input-label">Teaching</label><input type="text" name="expTeaching" class="input-field"></div>
                        <div><label class="input-label">Research</label><input type="text" name="expResearch" class="input-field"></div>
                        <div><label class="input-label">Industry</label><input type="text" name="expIndustry" class="input-field"></div>
                    </div>
                </div>

                <!-- Academic Details -->
                <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div class="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                         <h3 class="text-lg font-bold text-gray-800">Academic Details</h3>
                    </div>
                     <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div><label class="input-label">Specialization</label><input type="text" name="specialization" class="input-field"></div>
                        <div><label class="input-label">Education (e.g. M.Sc, Ph.D)</label><input type="text" name="education" class="input-field"></div>
                        <div><label class="input-label">Other Qualifications (NET/SET)</label><input type="text" name="otherQualifications" class="input-field"></div>
                    </div>
                </div>

                <!-- Contact Details -->
                <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div class="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                         <h3 class="text-lg font-bold text-gray-800">Contact Links</h3>
                    </div>
                     <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div><label class="input-label">IRINS Link</label><input type="url" name="irinsLink" class="input-field" placeholder="https://..."></div>
                        <div><label class="input-label">LinkedIn Link</label><input type="url" name="linkedinLink" class="input-field" placeholder="https://..."></div>
                    </div>
                </div>
                
                 <!-- Research Supervision -->
                <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div class="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                         <h3 class="text-lg font-bold text-gray-800">Research Supervision</h3>
                    </div>
                     <div class="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div><label class="input-label">M.Phil.</label><input type="text" name="resMphil" class="input-field"></div>
                        <div><label class="input-label">Ph.D. (Completed)</label><input type="text" name="resPhdCompleted" class="input-field"></div>
                        <div><label class="input-label">Ph.D. (In Progress)</label><input type="text" name="resPhdProgress" class="input-field"></div>
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
                                <div><label class="input-label">UGC</label><input type="text" name="pubUgc" class="input-field"></div>
                                <div><label class="input-label">SCOPUS-indexed</label><input type="text" name="pubScopus" class="input-field"></div>
                                <div><label class="input-label">Peer Reviewed</label><input type="text" name="pubPeerReviewed" class="input-field"></div>
                                <div><label class="input-label">Seminar Proceedings</label><input type="text" name="pubProceedings" class="input-field"></div>
                            </div>
                        </div>
                        <div>
                            <h4 class="font-semibold text-gray-700 mb-3 border-b pb-1">Publications – Books & Chapters</h4>
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div><label class="input-label">Books (Author)</label><input type="text" name="bookAuthor" class="input-field"></div>
                                <div><label class="input-label">Books (Co-Author)</label><input type="text" name="bookCoAuthor" class="input-field"></div>
                                <div><label class="input-label">Chapters Published</label><input type="text" name="bookChapters" class="input-field"></div>
                            </div>
                        </div>
                         <div>
                            <h4 class="font-semibold text-gray-700 mb-3 border-b pb-1">Journal</h4>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div><label class="input-label">Editor</label><input type="text" name="journalEditor" class="input-field"></div>
                                <div><label class="input-label">Reviewer/Member</label><input type="text" name="journalReviewer" class="input-field"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex justify-end gap-3 pt-4 pb-8">
                    <button type="button" onclick="window.history.back()" class="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors">Cancel</button>
                    <button type="submit" class="px-6 py-2.5 bg-blue-900 text-white rounded-lg hover:bg-blue-800 font-medium shadow-md shadow-blue-900/20 transition-colors flex items-center gap-2">
                        <i data-lucide="save" class="w-4 h-4"></i> Save Faculty
                    </button>
                </div>
            </form>
        </div>
    `;

    window.lucide.createIcons();
});

document.addEventListener('submit', async (e) => {
    if (e.target.id !== 'add-faculty-form') return;
    e.preventDefault();

    const form = e.target;
    // Construct FormData
    const formData = new FormData(form);

    // Handle Checkbox Manually if needed? No, FormData usually handles checkboxes (value='on' if checked, missing if not).
    // Backend expects 'isHod' key to trigger logic.
    // If unchecked, FormData won't send it. If checked, it sends 'on'.
    // server.py checks: if data.get('isHod'): 
    // 'on' is truthy, so it should work.

    try {
        await DataService.addFaculty(formData);
        alert('Faculty added successfully!');
        window.location.href = 'faculty-list.html';
    } catch (err) {
        alert('Error adding faculty: ' + err.message);
    }
});
