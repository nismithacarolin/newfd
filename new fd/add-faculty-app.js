function AddFaculty() {
    const user = Auth.getCurrentUser();
    const departments = Storage.getDepartments();

    const [formData, setFormData] = React.useState({
        firstName: '',
        lastName: '',
        age: '',
        dob: '',
        gender: 'Male',
        department: departments[0]?.name || '',
        specialization: '',
        experience: '',
        qualification: '',
        registerNo: '',
        email: '',
        address: '',
        type: 'Aided',
        shift: 'Shift I',
        awards: '',
        publications: '',
        certifications: null
    });

    const [message, setMessage] = React.useState({ type: '', text: '' });

    // Unauthorized Access
    if (!user || user.role !== 'admin') {
        return (
            <Layout activePage="Unauthorized">
                <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                    <h2 className="text-2xl font-bold text-red-600">Access Denied</h2>
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.firstName || !formData.email || !formData.registerNo) {
            setMessage({ type: 'error', text: 'Please fill required fields.' });
            return;
        }

        const newFaculty = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            department: formData.department,
            specialization: formData.specialization,
            experience: formData.experience,
            type: formData.type,
            shift: formData.shift,
            registerNo: formData.registerNo,
            joinedDate: new Date().toISOString().split('T')[0]
        };

        try {
            const res = await Storage.addFaculty(newFaculty);

            if (res === "success") {
                setMessage({ type: 'success', text: 'Faculty added successfully!' });

                setFormData({
                    firstName: '', lastName: '', age: '', dob: '', gender: 'Male',
                    department: departments[0]?.name || '', specialization: '',
                    experience: '', qualification: '', registerNo: '',
                    email: '', address: '', type: 'Aided',
                    shift: 'Shift I', awards: '', publications: '', certifications: null
                });

                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                setMessage({ type: 'error', text: 'Database error occurred.' });
            }
        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: 'Server error.' });
        }
    };

    return (
        <Layout activePage="Add New Faculty">
            <div className="max-w-4xl mx-auto">
                <div className="card">
                    {message.text && (
                        <div className={`p-4 mb-4 ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* FORM CONTENT UNCHANGED */}
                        {/* Your existing JSX stays exactly the same */}
                        <button type="submit" className="btn btn-primary">Save Faculty</button>
                    </form>
                </div>
            </div>
        </Layout>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<AddFaculty />);
