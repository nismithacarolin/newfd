function FacultyDetail() {
    const user = Auth.getCurrentUser();
    const [faculty, setFaculty] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');

        if (id) {
            DataService.getFaculty().then(allFaculty => {
                // Ensure ID comparison works for both string/int
                const found = allFaculty.find(f => f.id == id);
                setFaculty(found);
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    }, []);

    const handleDownloadPDF = () => {
        const element = document.getElementById('faculty-profile-content');
        const opt = {
            margin: 10,
            filename: `${faculty.firstName}_${faculty.lastName}_Profile.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        // Hide button during generation if needed, but here we select specific ID
        html2pdf().set(opt).from(element).save();
    };

    if (!user) return null;

    if (loading) {
        return (
            <Layout activePage="Faculty Details">
                <div className="flex items-center justify-center h-64">
                    <div className="text-gray-500">Loading details...</div>
                </div>
            </Layout>
        );
    }

    if (!faculty) {
        return (
            <Layout activePage="Faculty Details">
                <div className="flex flex-col items-center justify-center h-64 text-center">
                    <div className="icon-search-x text-4xl text-gray-300 mb-2"></div>
                    <div className="text-gray-500 mb-4">Faculty member not found.</div>
                    <a href="faculty-list.html" className="btn btn-primary">Back to Directory</a>
                </div>
            </Layout>
        );
    }

    return (
        <Layout activePage="Faculty Detail View">
            <div className="max-w-4xl mx-auto mb-8">
                <button
                    onClick={() => window.location.href = 'faculty-list.html'}
                    className="flex items-center text-sm text-gray-500 hover:text-[var(--primary-color)] mb-4 transition-colors"
                >
                    <div className="icon-arrow-left text-lg mr-1"></div>
                    Back to Directory
                </button>

                {/* Content to Print */}
                <div id="faculty-profile-content" className="card p-0 overflow-hidden bg-white print:shadow-none">
                    {/* Header Banner in PDF */}
                    <div className="h-32 bg-gradient-to-r from-[var(--primary-color)] to-blue-800 relative">
                        <div className="absolute -bottom-12 left-8">
                            <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-100 flex items-center justify-center text-3xl font-bold text-gray-600">
                                {faculty.firstName[0]}{faculty.lastName[0]}
                            </div>
                        </div>
                    </div>

                    <div className="pt-16 px-8 pb-8">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">{faculty.firstName} {faculty.lastName}</h1>
                                <p className="text-[var(--primary-color)] font-medium text-lg">{faculty.designation || 'Faculty Member'}</p>
                                <div className="flex gap-2 mt-2">
                                    <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold border border-blue-100">
                                        {faculty.department}
                                    </span>
                                    <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-semibold border border-amber-100">
                                        {faculty.type}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 mt-8">
                            <div className="space-y-6">
                                <div className="border-b border-gray-100 pb-2 mb-4">
                                    <h3 className="text-lg font-bold text-gray-800 flex items-center">
                                        <div className="icon-user w-5 h-5 mr-2 text-gray-400"></div>
                                        Personal Info
                                    </h3>
                                </div>
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="flex justify-between border-b border-gray-50 pb-2">
                                        <span className="text-gray-500 text-sm">Gender</span>
                                        <span className="font-medium text-gray-800">{faculty.gender || '-'}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-50 pb-2">
                                        <span className="text-gray-500 text-sm">DOB</span>
                                        <span className="font-medium text-gray-800">{faculty.dob || '-'}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-50 pb-2">
                                        <span className="text-gray-500 text-sm">Age</span>
                                        <span className="font-medium text-gray-800">{faculty.age || '-'}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 text-sm block mb-1">Address</span>
                                        <span className="font-medium text-gray-800 block text-sm">{faculty.address || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="border-b border-gray-100 pb-2 mb-4">
                                    <h3 className="text-lg font-bold text-gray-800 flex items-center">
                                        <div className="icon-briefcase w-5 h-5 mr-2 text-gray-400"></div>
                                        Professional Info
                                    </h3>
                                </div>
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="flex justify-between border-b border-gray-50 pb-2">
                                        <span className="text-gray-500 text-sm">Register No / ID</span>
                                        <span className="font-medium text-gray-800">{faculty.registerNo || faculty.id}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-50 pb-2">
                                        <span className="text-gray-500 text-sm">Shift</span>
                                        <span className="font-medium text-gray-800">{faculty.shift || '-'}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-50 pb-2">
                                        <span className="text-gray-500 text-sm">Joined Date</span>
                                        <span className="font-medium text-gray-800">{faculty.joinedDate || '-'}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-50 pb-2">
                                        <span className="text-gray-500 text-sm">Experience</span>
                                        <span className="font-medium text-gray-800">{faculty.experience ? `${faculty.experience} Years` : '-'}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-50 pb-2">
                                        <span className="text-gray-500 text-sm">Email</span>
                                        <span className="font-medium text-gray-800">{faculty.email}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-gray-100">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h4 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wide">Specialization</h4>
                                    <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg border border-gray-100">
                                        {faculty.specialization || "No specialization details added."}
                                    </p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wide">Awards & Publications</h4>
                                    <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg border border-gray-100">
                                        {faculty.awards || faculty.publications || "No records found."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons (Not visible in PDF) */}
                <div className="mt-6 flex justify-end">
                    <button
                        onClick={handleDownloadPDF}
                        className="btn btn-primary"
                    >
                        <div className="icon-download"></div>
                        Download PDF
                    </button>
                </div>
            </div>
        </Layout>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<FacultyDetail />);
