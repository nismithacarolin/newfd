function FacultyDetail() {
    const user = Auth.getCurrentUser();
    const [faculty, setFaculty] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');

        if (id) {
            DataService.getFaculty().then(allFaculty => {
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
        html2pdf().set(opt).from(element).save();
    };

    const handleDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete ${faculty.firstName} ${faculty.lastName}? This cannot be undone.`)) {
            return;
        }
        try {
            await DataService.deleteFaculty(faculty.id);
            alert('Faculty deleted successfully.');
            window.location.href = 'faculty-list.html';
        } catch (err) {
            console.error('Delete error', err);
            alert('Failed to delete faculty: ' + err.message);
        }
    };

    if (!user) return null;

    if (loading) {
        return (
            <Layout activePage="Faculty Details">
                <div className="flex justify-center h-64 items-center text-gray-500">
                    <div className="animate-pulse">Loading details...</div>
                </div>
            </Layout>
        );
    }

    if (!faculty) {
        return (
            <Layout activePage="Faculty Details">
                <div className="flex flex-col items-center justify-center h-64 text-center">
                    <div className="text-4xl text-gray-300 mb-2">?</div>
                    <div className="text-gray-500 mb-4">Faculty member not found.</div>
                    <a href="faculty-list.html" className="btn btn-primary">Back to Directory</a>
                </div>
            </Layout>
        );
    }

    return (
        <Layout activePage="Faculty Details">
            <div className="max-w-4xl mx-auto mb-8">
                <div className="flex justify-between items-center mb-6 print:hidden">
                    <button onClick={() => window.location.href = 'faculty-list.html'} className="text-gray-500 hover:text-[var(--primary-color)] flex items-center transition-colors">
                        <div className="icon-arrow-left mr-1"></div> Back to Directory
                    </button>
                    <div className="flex gap-2">
                        {user.role === 'admin' && (
                            <>
                                <button onClick={() => window.location.href = `edit-faculty.html?id=${faculty.id}`} className="btn bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100">
                                    <div className="icon-edit mr-2"></div> Edit
                                </button>
                                <button onClick={handleDelete} className="btn bg-red-50 text-red-600 border border-red-100 hover:bg-red-100">
                                    <div className="icon-trash-2 mr-2"></div> Delete
                                </button>
                            </>
                        )}
                        <button onClick={handleDownloadPDF} className="btn btn-primary">
                            <div className="icon-download mr-2"></div> Download PDF
                        </button>
                    </div>
                </div>

                <div id="faculty-profile-content" className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
                    {/* Header Banner */}
                    <div className="bg-gradient-to-r from-blue-900 to-blue-800 p-8 text-white relative overflow-hidden">
                        <div className="relative z-10 flex items-center gap-6">
                            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-4xl font-bold text-blue-900 shadow-md border-4 border-blue-100">
                                {faculty.firstName[0]}{faculty.lastName[0]}
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold mb-1">{faculty.firstName} {faculty.lastName}</h1>
                                <p className="text-blue-100 text-lg flex items-center gap-2">
                                    <span className="opacity-75">{faculty.designation || 'Faculty Member'}</span>
                                    <span className="w-1.5 h-1.5 bg-blue-300 rounded-full"></span>
                                    <span className="opacity-75">{faculty.department}</span>
                                </p>
                            </div>
                        </div>
                        {/* Decorative background element */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
                    </div>

                    <div className="p-8">
                        <table className="w-full text-sm border-collapse">
                            <tbody>
                                {/* Personal Info */}
                                <tr className="border-b border-gray-100"><td className="py-3 px-4 w-1/3 font-semibold text-gray-700">Name</td><td className="py-3 px-4 text-gray-900 font-medium">: {faculty.firstName} {faculty.lastName}</td></tr>
                                <tr className="border-b border-gray-100"><td className="py-3 px-4 w-1/3 font-semibold text-gray-700">Area of Specialisation</td><td className="py-3 px-4 text-gray-900">: {faculty.specialization || '-'}</td></tr>
                                <tr className="border-b border-gray-100"><td className="py-3 px-4 w-1/3 font-semibold text-gray-700">Education</td><td className="py-3 px-4 text-gray-900">: {faculty.education || '-'}</td></tr>
                                <tr className="border-b border-gray-100"><td className="py-3 px-4 w-1/3 font-semibold text-gray-700">Other Qualifications</td><td className="py-3 px-4 text-gray-900">: {faculty.otherQualifications || '-'}</td></tr>

                                {/* Experience Header */}
                                <tr><td colSpan="2" className="py-2 px-4 bg-gray-100 font-bold text-gray-800 mt-4 border-t-4 border-white">Professional Experience (in years)</td></tr>
                                <tr className="border-b border-gray-100"><td className="py-2 px-4 pl-8 font-medium text-gray-600">Teaching</td><td className="py-2 px-4 text-gray-900">: {faculty.expTeaching || '-'}</td></tr>
                                <tr className="border-b border-gray-100"><td className="py-2 px-4 pl-8 font-medium text-gray-600">Research</td><td className="py-2 px-4 text-gray-900">: {faculty.expResearch || '-'}</td></tr>
                                <tr className="border-b border-gray-100"><td className="py-2 px-4 pl-8 font-medium text-gray-600">Industry</td><td className="py-2 px-4 text-gray-900">: {faculty.expIndustry || '-'}</td></tr>

                                {/* Contact Header */}
                                <tr><td colSpan="2" className="py-2 px-4 bg-gray-100 font-bold text-gray-800 border-t-4 border-white">Contact Details</td></tr>
                                <tr className="border-b border-gray-100"><td className="py-2 px-4 pl-8 font-medium text-gray-600">Mobile</td><td className="py-2 px-4 text-gray-900">: {faculty.mobile || '-'}</td></tr>
                                <tr className="border-b border-gray-100"><td className="py-2 px-4 pl-8 font-medium text-gray-600">E-mail</td><td className="py-2 px-4 text-gray-900">: {faculty.email || '-'}</td></tr>
                                <tr className="border-b border-gray-100"><td className="py-2 px-4 pl-8 font-medium text-gray-600">IRINS Link</td><td className="py-2 px-4 text-blue-600">: {faculty.irinsLink ? <a href={faculty.irinsLink} target="_blank" rel="noopener noreferrer" className="hover:underline">View Profile</a> : '-'}</td></tr>
                                <tr className="border-b border-gray-100"><td className="py-2 px-4 pl-8 font-medium text-gray-600">LinkedIn Link</td><td className="py-2 px-4 text-blue-600">: {faculty.linkedinLink ? <a href={faculty.linkedinLink} target="_blank" rel="noopener noreferrer" className="hover:underline">View Profile</a> : '-'}</td></tr>

                                {/* Research Supervision Header */}
                                <tr><td colSpan="2" className="py-2 px-4 bg-gray-100 font-bold text-gray-800 border-t-4 border-white">Research Supervision/Guideship</td></tr>
                                <tr className="border-b border-gray-100"><td className="py-2 px-4 pl-8 font-medium text-gray-600">M.Phil.</td><td className="py-2 px-4 text-gray-900">: {faculty.resMphil || '-'}</td></tr>
                                <tr className="border-b border-gray-100"><td className="py-2 px-4 pl-8 font-medium text-gray-600">Ph.D. (completed)</td><td className="py-2 px-4 text-gray-900">: {faculty.resPhdCompleted || '-'}</td></tr>
                                <tr className="border-b border-gray-100"><td className="py-2 px-4 pl-8 font-medium text-gray-600">Ph.D. (in progress)</td><td className="py-2 px-4 text-gray-900">: {faculty.resPhdProgress || '-'}</td></tr>

                                {/* Professional Highlights - Dark Header */}
                                <tr><td colSpan="2" className="py-3 px-4 bg-blue-900 text-white font-bold uppercase tracking-wide border-t-4 border-white mt-6">Professional Highlights</td></tr>

                                {/* Publications Articles Header */}
                                <tr><td colSpan="2" className="py-2 px-4 bg-gray-100 font-bold text-gray-800 border-b border-gray-200">Publications – Articles</td></tr>
                                <tr className="border-b border-gray-100"><td className="py-2 px-4 pl-8 font-medium text-gray-600">UGC</td><td className="py-2 px-4 text-gray-900">: {faculty.pubUgc || '-'}</td></tr>
                                <tr className="border-b border-gray-100"><td className="py-2 px-4 pl-8 font-medium text-gray-600">SCOPUS-indexed</td><td className="py-2 px-4 text-gray-900">: {faculty.pubScopus || '-'}</td></tr>
                                <tr className="border-b border-gray-100"><td className="py-2 px-4 pl-8 font-medium text-gray-600">Peer Reviewed</td><td className="py-2 px-4 text-gray-900">: {faculty.pubPeerReviewed || '-'}</td></tr>
                                <tr className="border-b border-gray-100"><td className="py-2 px-4 pl-8 font-medium text-gray-600">Seminar Proceedings</td><td className="py-2 px-4 text-gray-900">: {faculty.pubProceedings || '-'}</td></tr>

                                {/* Publications Books Header */}
                                <tr><td colSpan="2" className="py-2 px-4 bg-gray-100 font-bold text-gray-800 border-t-4 border-white">Publications – Books & Chapters</td></tr>
                                <tr className="border-b border-gray-100"><td className="py-2 px-4 pl-8 font-medium text-gray-600">Books Published as Author</td><td className="py-2 px-4 text-gray-900">: {faculty.bookAuthor || '-'}</td></tr>
                                <tr className="border-b border-gray-100"><td className="py-2 px-4 pl-8 font-medium text-gray-600">Books Published as Co-Author</td><td className="py-2 px-4 text-gray-900">: {faculty.bookCoAuthor || '-'}</td></tr>
                                <tr className="border-b border-gray-100"><td className="py-2 px-4 pl-8 font-medium text-gray-600">Chapters Published</td><td className="py-2 px-4 text-gray-900">: {faculty.bookChapters || '-'}</td></tr>

                                {/* Journal Header */}
                                <tr><td colSpan="2" className="py-2 px-4 bg-gray-100 font-bold text-gray-800 border-t-4 border-white">Journal</td></tr>
                                <tr className="border-b border-gray-100"><td className="py-2 px-4 pl-8 font-medium text-gray-600">Editor</td><td className="py-2 px-4 text-gray-900">: {faculty.journalEditor || '-'}</td></tr>
                                <tr className="border-b border-gray-100"><td className="py-2 px-4 pl-8 font-medium text-gray-600">Reviewer/Member</td><td className="py-2 px-4 text-gray-900">: {faculty.journalReviewer || '-'}</td></tr>

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<FacultyDetail />);
