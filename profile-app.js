function Profile() {
    const [user] = React.useState(Auth.getCurrentUser());
    const [facultyData, setFacultyData] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    // Fetch Data
    React.useEffect(() => {
        if (!user) return;

        if (user.role === 'admin') {
            setLoading(false);
            return;
        }

        // For Faculty: Fetch their specific data
        DataService.getFaculty().then((allFaculty) => {
            let found = null;
            if (user.facultyId) {
                // If backend provided a specific faculty ID linked to this credential
                found = allFaculty.find(f => f.id === user.facultyId);
            } else {
                // Fallback to name matching if IDs don't align
                found = allFaculty.find(f => f.firstName === user.name || f.id === user.id);
            }

            if (found) {
                setFacultyData(found);
            }
            setLoading(false);
        });
    }, [user]);

    // Trigger Icon Creation
    React.useEffect(() => {
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }, [user, facultyData]);

    if (!user) return null;
    if (loading) return <Layout activePage="Profile"><div className="flex justify-center h-64 items-center">Loading...</div></Layout>;

    return (
        <Layout activePage="Profile">
            <div className="max-w-6xl mx-auto mb-12">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">
                    {user.role === 'admin' ? 'Admin Dashboard' : 'My Profile'}
                </h1>

                {user.role === 'admin' ? (
                    <AdminView user={user} />
                ) : (
                    <FacultyView user={user} facultyData={facultyData} />
                )}
            </div>
        </Layout>
    );
}

// --- ADMIN VIEW COMPONENT ---
function AdminView({ user }) {
    const [requests, setRequests] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    const fetchRequests = () => {
        DataService.getRequests().then(data => {
            setRequests(data);
            setLoading(false);
        });
    };

    React.useEffect(() => {
        fetchRequests();
    }, []);

    // Trigger icons on requests load
    React.useEffect(() => {
        if (window.lucide) window.lucide.createIcons();
    }, [requests]);


    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await DataService.updateRequestStatus(id, newStatus);
            fetchRequests(); // Refresh list
        } catch (err) {
            alert("Failed to update status");
        }
    };

    return (
        <div className="space-y-6">
            {/* Admin Info Card */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold">
                    A
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-800">System Administrator</h2>
                    <p className="text-gray-500">Manage faculty requests and system settings.</p>
                </div>
            </div>

            {/* Requests List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-800">Change Requests</h3>
                    <button onClick={fetchRequests} className="text-sm text-blue-600 hover:underline">Refresh</button>
                </div>

                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading requests...</div>
                ) : requests.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">No pending requests found.</div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {requests.map(req => (
                            <div key={req.id} className="p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <span className="font-bold text-gray-900">{req.facultyName}</span>
                                        <span className="text-gray-500 text-sm ml-2">ID: {req.facultyId}</span>
                                    </div>
                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${req.status === 'Resolved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {req.status}
                                    </span>
                                </div>
                                <p className="text-gray-700 bg-gray-50 p-3 rounded border border-gray-100 mb-3 text-sm">
                                    {req.requestText}
                                </p>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-400">{req.createdAt}</span>
                                    {req.status !== 'Resolved' && (
                                        <button
                                            onClick={() => handleStatusUpdate(req.id, 'Resolved')}
                                            className="text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
                                        >
                                            <i data-lucide="check-circle" className="w-4 h-4"></i> Mark as Resolved
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// --- FACULTY VIEW COMPONENT ---
function FacultyView({ user, facultyData }) {
    const [requestText, setRequestText] = React.useState("");
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    // Trigger icons on view load
    React.useEffect(() => {
        if (window.lucide) window.lucide.createIcons();
    }, [facultyData]);

    const handleRequestSubmit = async (e) => {
        e.preventDefault();
        if (!requestText.trim()) return;

        setIsSubmitting(true);
        try {
            await DataService.addRequest({
                facultyId: user.id || facultyData.id,
                facultyName: facultyData ? `${facultyData.firstName} ${facultyData.lastName}` : user.name,
                requestText: requestText
            });
            alert("Request sent successfully!");
            setRequestText("");
        } catch (err) {
            alert("Failed to send request: " + err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!facultyData) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">Profile data not found. Please contact admin.</p>
            </div>
        );
    }

    const DetailRow = ({ label, value }) => (
        <tr className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
            <td className="py-2 px-4 w-1/3 font-semibold text-gray-600 text-sm">{label}</td>
            <td className="py-2 px-4 text-gray-900 font-medium text-sm">
                {value || '-'}
            </td>
        </tr>
    );

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Profile Card */}
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
                    <div className="bg-gradient-to-r from-blue-900 to-blue-700 p-6 text-white flex items-center gap-5">
                        <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-3xl font-bold shadow-inner">
                            {facultyData.firstName?.[0]}{facultyData.lastName?.[0]}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">{facultyData.firstName} {facultyData.lastName}</h2>
                            <p className="text-blue-100 opacity-90">{facultyData.designation}</p>
                            <div className="flex gap-2 text-xs mt-2 opacity-75">
                                <span className="bg-white/20 px-2 py-0.5 rounded">{facultyData.department}</span>
                                <span className="bg-white/20 px-2 py-0.5 rounded">{facultyData.type}</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        <h3 className="font-bold text-gray-800 mb-3 border-b pb-2">Personal Details</h3>
                        <table className="w-full mb-6">
                            <tbody>
                                <DetailRow label="Mobile" value={facultyData.mobile} />
                                <DetailRow label="Email" value={facultyData.email} />
                                <DetailRow label="Education" value={facultyData.education} />
                                <DetailRow label="Specialization" value={facultyData.specialization} />
                            </tbody>
                        </table>

                        <h3 className="font-bold text-gray-800 mb-3 border-b pb-2">Experience</h3>
                        <table className="w-full mb-6">
                            <tbody>
                                <DetailRow label="Teaching" value={facultyData.expTeaching + " Years"} />
                                <DetailRow label="Research" value={facultyData.expResearch + " Years"} />
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Right Column: Request Box */}
            <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 sticky top-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
                        <i data-lucide="message-square" className="w-5 h-5 text-[var(--secondary-color)]"></i>
                        Request Changes
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                        Found an error in your profile? Request an update below. The admin will review and apply changes.
                    </p>

                    <form onSubmit={handleRequestSubmit}>
                        <textarea
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[120px] text-sm mb-4"
                            placeholder="Describe the changes you need (e.g., Update mobile number to ...)"
                            value={requestText}
                            onChange={(e) => setRequestText(e.target.value)}
                            required
                        ></textarea>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-blue-900 text-white py-2.5 rounded-lg font-medium hover:bg-blue-800 transition-colors flex justify-center items-center gap-2 disabled:opacity-70"
                        >
                            {isSubmitting ? 'Sending...' : (
                                <>
                                    <i data-lucide="send" className="w-4 h-4"></i> Send Request
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Profile />);
