function EditFaculty() {
    const user = Auth.getCurrentUser();
    const [departments, setDepartments] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    const [formData, setFormData] = React.useState({
        firstName: '',
        lastName: '',
        department: '',
        email: '',
        type: 'Aided',
        shift: 'Shift I',
        designation: '',
        profileImage: '',
        profileImageFile: null,
        isHod: false,
        specialization: '',
        education: '',
        otherQualifications: '',
        expTeaching: '',
        expResearch: '',
        expIndustry: '',
        mobile: '',
        irinsLink: '',
        linkedinLink: '',
        resMphil: '',
        resPhdCompleted: '',
        resPhdProgress: '',
        pubUgc: '',
        pubScopus: '',
        pubPeerReviewed: '',
        pubProceedings: '',
        bookAuthor: '',
        bookCoAuthor: '',
        bookChapters: '',
        journalEditor: '',
        journalReviewer: ''
    });

    const [facultyId, setFacultyId] = React.useState(null);

    React.useEffect(() => {
        // Fetch Departments first
        DataService.getDepartments().then(data => {
            setDepartments(data);
        });

        // Get ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');

        if (id) {
            setFacultyId(id);
            DataService.getFaculty().then(allFaculty => {
                const found = allFaculty.find(f => f.id == id);
                if (found) {
                    // Populate Form
                    setFormData({
                        firstName: found.firstName || '',
                        lastName: found.lastName || '',
                        department: found.department || '',
                        email: found.email || '',
                        type: found.type || 'Aided',
                        shift: found.shift || 'Shift I',
                        designation: found.designation || '',
                        profileImage: found.profileImage || '',
                        isHod: false, // You might need backend logic to know if they are HOD, for now default false or check Dept
                        specialization: found.specialization || '',
                        education: found.education || '',
                        otherQualifications: found.otherQualifications || '',
                        expTeaching: found.expTeaching || '',
                        expResearch: found.expResearch || '',
                        expIndustry: found.expIndustry || '',
                        mobile: found.mobile || '',
                        irinsLink: found.irinsLink || '',
                        linkedinLink: found.linkedinLink || '',
                        resMphil: found.resMphil || '',
                        resPhdCompleted: found.resPhdCompleted || '',
                        resPhdProgress: found.resPhdProgress || '',
                        pubUgc: found.pubUgc || '',
                        pubScopus: found.pubScopus || '',
                        pubPeerReviewed: found.pubPeerReviewed || '',
                        pubProceedings: found.pubProceedings || '',
                        bookAuthor: found.bookAuthor || '',
                        bookCoAuthor: found.bookCoAuthor || '',
                        bookChapters: found.bookChapters || '',
                        journalEditor: found.journalEditor || '',
                        journalReviewer: found.journalReviewer || ''
                    });
                }
                setLoading(false);
            });
        } else {
            setLoading(false);
            window.location.href = 'faculty-list.html'; // Redirect if no ID
        }
    }, []);

    const [message, setMessage] = React.useState({ type: '', text: '' });
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    // Unauthorized Access Check
    if (!user || user.role !== 'admin') {
        return (
            <Layout activePage="Unauthorized">
                <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
                        <div className="icon-shield-alert text-4xl text-red-600"></div>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
                    <p className="text-gray-500 max-w-md">You do not have permission to view this page. This area is restricted to administrators only.</p>
                </div>
            </Layout>
        );
    }

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (type === 'file') {
            setFormData(prev => ({ ...prev, [name]: files[0] }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });
        setIsSubmitting(true);

        try {
            // Basic validation
            if (!formData.firstName || !formData.email || !formData.mobile) {
                setMessage({ type: 'error', text: 'Please fill in Name, Email, and Mobile.' });
                setIsSubmitting(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }

            // Create FormData
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                if (key === 'profileImageFile' && formData[key]) {
                    data.append('profileImageFile', formData[key]);
                } else if (key !== 'profileImageFile') {
                    data.append(key, formData[key]);
                }
            });

            await DataService.updateFaculty(facultyId, data);

            setMessage({ type: 'success', text: 'Faculty profile updated successfully!' });

            // Redirect after delay
            setTimeout(() => {
                window.location.href = `faculty-detail.html?id=${facultyId}`;
            }, 1000);

        } catch (err) {
            console.error('Submission Error:', err);
            setMessage({ type: 'error', text: err.message || 'An error occurred while saving.' });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <Layout activePage="Faculty Details"><div className="p-10 text-center">Loading...</div></Layout>;

    return (
        <Layout activePage="Faculty Details">
            <div className="max-w-5xl mx-auto mb-12">
                <div className="card">
                    <div className="flex items-center mb-6 pb-4 border-b border-gray-100">
                        <div className="p-3 bg-blue-50 rounded-lg mr-4">
                            <div className="icon-edit text-2xl text-[var(--primary-color)]"></div>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Edit Faculty Profile</h2>
                            <p className="text-sm text-gray-500">Update the details for {formData.firstName} {formData.lastName}.</p>
                        </div>
                    </div>

                    {message.text && (
                        <div className={`p-4 rounded-lg mb-6 flex items-center ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            <div className={`mr-2 icon-${message.type === 'success' ? 'check-circle' : 'alert-circle'}`}></div>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Section 1: Basic Info */}
                        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Basic Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                <div><label className="input-label">First Name *</label><input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="input-field" required /></div>
                                <div><label className="input-label">Last Name *</label><input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="input-field" required /></div>
                                <div><label className="input-label">Email *</label><input type="email" name="email" value={formData.email} onChange={handleChange} className="input-field" required /></div>
                                <div>
                                    <label className="input-label">Department *</label>
                                    <select name="department" value={formData.department} onChange={handleChange} className="input-field">
                                        <option value="" disabled>Select Department</option>
                                        {departments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                                    </select>
                                    <div className="mt-2 flex items-center">
                                        <input
                                            type="checkbox"
                                            name="isHod"
                                            id="isHod"
                                            checked={formData.isHod || false}
                                            onChange={handleChange}
                                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                        />
                                        <label htmlFor="isHod" className="ml-2 text-sm text-gray-700 font-medium cursor-pointer">Assign as Head of Department</label>
                                    </div>
                                </div>
                                <div><label className="input-label">Designation</label><input type="text" name="designation" value={formData.designation} onChange={handleChange} className="input-field" placeholder="e.g. Assistant Professor" /></div>
                                <div>
                                    <label className="input-label">Type</label>
                                    <select name="type" value={formData.type} onChange={handleChange} className="input-field">
                                        <option value="Aided">Aided</option>
                                        <option value="Self Finance">Self Finance</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="input-label">Shift</label>
                                    <select name="shift" value={formData.shift} onChange={handleChange} className="input-field">
                                        <option value="Shift I">Shift I</option>
                                        <option value="Shift II">Shift II</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="input-label">Profile Image Upload</label>
                                    <input type="file" name="profileImageFile" onChange={handleChange} className="input-field p-1" accept="image/*" />
                                    {formData.profileImage && typeof formData.profileImage === 'string' && (
                                        <p className="text-xs text-gray-500 mt-1">Current: {formData.profileImage.split('/').pop()}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Qualifications */}
                        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Qualifications</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div><label className="input-label">Area of Specialisation</label><input type="text" name="specialization" value={formData.specialization} onChange={handleChange} className="input-field" /></div>
                                <div>
                                    <label className="input-label">Degree</label>
                                    <select name="education" value={formData.education} onChange={handleChange} className="input-field">
                                        <option value="">Select Degree</option>
                                        <option value="Ph.D">Ph.D</option>
                                        <option value="M.Phil">M.Phil</option>
                                        <option value="M.Sc">M.Sc</option>
                                        <option value="MBA">MBA</option>
                                        <option value="B.Sc">B.Sc</option>
                                        <option value="BBA">BBA</option>
                                        <option value="B.Com">B.Com</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2"><label className="input-label">Other Qualifications</label><input type="text" name="otherQualifications" value={formData.otherQualifications} onChange={handleChange} className="input-field" placeholder="e.g. NET, SET" /></div>
                            </div>
                        </div>

                        {/* Section 3: Experience */}
                        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Professional Experience (in years)</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                <div><label className="input-label">Teaching</label><input type="text" name="expTeaching" value={formData.expTeaching} onChange={handleChange} className="input-field" /></div>
                                <div><label className="input-label">Research</label><input type="text" name="expResearch" value={formData.expResearch} onChange={handleChange} className="input-field" /></div>
                                <div><label className="input-label">Industry</label><input type="text" name="expIndustry" value={formData.expIndustry} onChange={handleChange} className="input-field" /></div>
                            </div>
                        </div>

                        {/* Section 4: Contact Details */}
                        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Contact Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                <div><label className="input-label">Mobile *</label><input type="text" name="mobile" value={formData.mobile} onChange={handleChange} className="input-field" required /></div>
                                <div><label className="input-label">IRINS Link</label><input type="text" name="irinsLink" value={formData.irinsLink} onChange={handleChange} className="input-field" /></div>
                                <div><label className="input-label">LinkedIn Link</label><input type="text" name="linkedinLink" value={formData.linkedinLink} onChange={handleChange} className="input-field" /></div>
                            </div>
                        </div>

                        {/* Section 5: Research Supervision */}
                        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Research Supervision/Guideship</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                <div><label className="input-label">M.Phil.</label><input type="text" name="resMphil" value={formData.resMphil} onChange={handleChange} className="input-field" /></div>
                                <div><label className="input-label">Ph.D. (Completed)</label><input type="text" name="resPhdCompleted" value={formData.resPhdCompleted} onChange={handleChange} className="input-field" /></div>
                                <div><label className="input-label">Ph.D. (In Progress)</label><input type="text" name="resPhdProgress" value={formData.resPhdProgress} onChange={handleChange} className="input-field" /></div>
                            </div>
                        </div>

                        {/* Section 6: Publications - Articles */}
                        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Publications – Articles</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                                <div><label className="input-label">UGC</label><input type="text" name="pubUgc" value={formData.pubUgc} onChange={handleChange} className="input-field" /></div>
                                <div><label className="input-label">SCOPUS-indexed</label><input type="text" name="pubScopus" value={formData.pubScopus} onChange={handleChange} className="input-field" /></div>
                                <div><label className="input-label">Peer Reviewed</label><input type="text" name="pubPeerReviewed" value={formData.pubPeerReviewed} onChange={handleChange} className="input-field" /></div>
                                <div><label className="input-label">Seminar Proceedings</label><input type="text" name="pubProceedings" value={formData.pubProceedings} onChange={handleChange} className="input-field" /></div>
                            </div>
                        </div>

                        {/* Section 7: Publications - Books */}
                        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Publications – Books & Chapters</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                <div><label className="input-label">As Author</label><input type="text" name="bookAuthor" value={formData.bookAuthor} onChange={handleChange} className="input-field" /></div>
                                <div><label className="input-label">As Co-Author</label><input type="text" name="bookCoAuthor" value={formData.bookCoAuthor} onChange={handleChange} className="input-field" /></div>
                                <div><label className="input-label">Chapters Published</label><input type="text" name="bookChapters" value={formData.bookChapters} onChange={handleChange} className="input-field" /></div>
                            </div>
                        </div>

                        {/* Section 8: Journal */}
                        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Journal Roles</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div><label className="input-label">Editor</label><input type="text" name="journalEditor" value={formData.journalEditor} onChange={handleChange} className="input-field" /></div>
                                <div><label className="input-label">Reviewer/Member</label><input type="text" name="journalReviewer" value={formData.journalReviewer} onChange={handleChange} className="input-field" /></div>
                            </div>
                        </div>

                        <div className="pt-6 flex justify-end gap-4">
                            <button type="button" onClick={() => window.history.back()} className="btn btn-secondary" disabled={isSubmitting}>Cancel</button>
                            <button type="submit" className="btn btn-primary px-8" disabled={isSubmitting}>
                                {isSubmitting ? 'Updating...' : 'Update Faculty'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<EditFaculty />);
