function AddFaculty() {
    const user = Auth.getCurrentUser();
    const [departments, setDepartments] = React.useState([]);

    const [formData, setFormData] = React.useState({
        firstName: '',
        lastName: '',
        age: '',
        dob: '',
        gender: 'Male',
        department: '',
        specialization: '',
        experience: '',
        qualification: '',
        registerNo: '',
        email: '',
        address: '',
        type: 'Aided', // Aided or Self Finance
        shift: 'Shift I',
        awards: '',
        publications: '',
        certifications: null // file simulation
    });

    React.useEffect(() => {
        Storage.getDepartments().then(data => {
            setDepartments(data);
            if (data.length > 0) {
                setFormData(prev => ({ ...prev, department: data[0].name }));
            }
        });
    }, []);

    const [message, setMessage] = React.useState({ type: '', text: '' });

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
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            setFormData(prev => ({ ...prev, [name]: files[0] ? files[0].name : null }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        try {
            // Basic validation
            if (!formData.firstName || !formData.email || !formData.registerNo) {
                setMessage({ type: 'error', text: 'Please fill in all required fields.' });
                return;
            }

            const newFaculty = {
                ...formData,
                joinedDate: new Date().toISOString().split('T')[0],
                // Simulate file upload by just storing the name
                certifications: formData.certifications ? `Uploaded: ${formData.certifications}` : 'None'
            };

            Storage.addFaculty(newFaculty).then(() => {
                setMessage({ type: 'success', text: 'Faculty added successfully!' });

                // Reset form (optional)
                setFormData({
                    firstName: '', lastName: '', age: '', dob: '', gender: 'Male',
                    department: departments[0]?.name || '', specialization: '', experience: '',
                    qualification: '', registerNo: '', email: '', address: '',
                    type: 'Aided', shift: 'Shift I', awards: '', publications: '', certifications: null
                });

                // Scroll to top
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });

        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: 'An error occurred while saving.' });
        }
    };

    return (
        <Layout activePage="Add New Faculty">
            <div className="max-w-4xl mx-auto">
                <div className="card">
                    <div className="flex items-center mb-6 pb-4 border-b border-gray-100">
                        <div className="p-3 bg-blue-50 rounded-lg mr-4">
                            <div className="icon-user-plus text-2xl text-[var(--primary-color)]"></div>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Faculty Registration Form</h2>
                            <p className="text-sm text-gray-500">Enter the details of the new faculty member.</p>
                        </div>
                    </div>

                    {message.text && (
                        <div className={`p-4 rounded-lg mb-6 flex items-center ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            <div className={`mr-2 icon-${message.type === 'success' ? 'check-circle' : 'alert-circle'}`}></div>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Personal Details */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                <span className="w-1 h-6 bg-[var(--secondary-color)] rounded-full mr-2"></span>
                                Personal Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                <div>
                                    <label className="input-label">First Name *</label>
                                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="input-field" required />
                                </div>
                                <div>
                                    <label className="input-label">Last Name *</label>
                                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="input-field" required />
                                </div>
                                <div>
                                    <label className="input-label">Date of Birth</label>
                                    <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="input-field" />
                                </div>
                                <div>
                                    <label className="input-label">Age</label>
                                    <input type="number" name="age" value={formData.age} onChange={handleChange} className="input-field" />
                                </div>
                                <div>
                                    <label className="input-label">Gender</label>
                                    <select name="gender" value={formData.gender} onChange={handleChange} className="input-field">
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="input-field" required />
                                </div>
                                <div>
                                    <label className="input-label">Phone Number *</label>
                                    <input type="tel" name="phoneNumber" value={formData.phoneNumber || ''} onChange={handleChange} className="input-field" placeholder="Mobile Number" required />
                                </div>
                                <div className="md:col-span-3">
                                    <label className="input-label">Address</label>
                                    <textarea name="address" value={formData.address} onChange={handleChange} className="input-field" rows="2"></textarea>
                                </div>
                            </div>
                        </div>

                        {/* Professional Details */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center mt-8">
                                <span className="w-1 h-6 bg-[var(--secondary-color)] rounded-full mr-2"></span>
                                Professional Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                <div>
                                    <label className="input-label">Register No / ID *</label>
                                    <input type="text" name="registerNo" value={formData.registerNo} onChange={handleChange} className="input-field" required />
                                </div>
                                <div>
                                    <label className="input-label">Department *</label>
                                    <select name="department" value={formData.department} onChange={handleChange} className="input-field" required>
                                        <option value="" disabled>Select Department</option>
                                        {departments.map(d => (
                                            <option key={d.id} value={d.name}>{d.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="input-label">Specialization</label>
                                    <input type="text" name="specialization" value={formData.specialization} onChange={handleChange} className="input-field" placeholder="e.g. AI, Data Science" />
                                </div>
                                <div>
                                    <label className="input-label">Category</label>
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
                                <div>
                                    <label className="input-label">Experience (Years)</label>
                                    <input type="text" name="experience" value={formData.experience} onChange={handleChange} className="input-field" />
                                </div>
                            </div>
                        </div>

                        {/* Achievements & Uploads */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center mt-8">
                                <span className="w-1 h-6 bg-[var(--secondary-color)] rounded-full mr-2"></span>
                                Achievements & Documents
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="input-label">Awards & Recognitions</label>
                                    <textarea name="awards" value={formData.awards} onChange={handleChange} className="input-field" rows="3" placeholder="List key awards..."></textarea>
                                </div>
                                <div>
                                    <label className="input-label">Publications</label>
                                    <textarea name="publications" value={formData.publications} onChange={handleChange} className="input-field" rows="3" placeholder="List key publications..."></textarea>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="input-label">Certifications Upload</label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
                                        <div className="icon-cloud-upload text-3xl text-gray-400 mb-2"></div>
                                        <p className="text-sm text-gray-500 mb-2">Drag and drop or click to upload PDF/JPG</p>
                                        <input
                                            type="file"
                                            name="certifications"
                                            onChange={handleChange}
                                            className="block w-full text-sm text-gray-500
                                            file:mr-4 file:py-2 file:px-4
                                            file:rounded-full file:border-0
                                            file:text-sm file:font-semibold
                                            file:bg-blue-50 file:text-blue-700
                                            hover:file:bg-blue-100 mx-auto max-w-xs"
                                        />
                                        {formData.certifications && (
                                            <p className="text-green-600 text-sm mt-2 flex items-center justify-center">
                                                <div className="icon-check-circle w-4 h-4 mr-1"></div>
                                                Selected: {formData.certifications}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 flex justify-end gap-4">
                            <button type="button" onClick={() => window.history.back()} className="btn btn-secondary">
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary px-8">
                                <div className="icon-save"></div>
                                Save Faculty
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<AddFaculty />);