function Dashboard() {
    const user = Auth.getCurrentUser();
    const [stats, setStats] = React.useState({
        facultyCount: 0,
        deptCount: 0,
        hodCount: 0,
        newFacultyCount: 0,
        newFaculty: []
    });
    const [announcements, setAnnouncements] = React.useState([]);
    const [newAnnouncement, setNewAnnouncement] = React.useState('');
    const [requests, setRequests] = React.useState([]);
    const [showNotification, setShowNotification] = React.useState(null);

    React.useEffect(() => {
        Promise.all([
            DataService.getFaculty(),
            DataService.getDepartments(),
            DataService.getAnnouncements(),
            DataService.getRequests()
        ]).then(([faculty, depts, announce, reqs]) => {

            // Calculate stats
            const currentYear = new Date().getFullYear();
            const newJoiners = faculty.filter(f => {
                if (!f.joinedDate) return false;
                const joinYear = new Date(f.joinedDate).getFullYear();
                return joinYear >= currentYear - 1;
            });

            setStats({
                facultyCount: faculty.length,
                deptCount: depts.length,
                hodCount: depts.filter(d => d.hod).length,
                newFacultyCount: newJoiners.length,
                newFaculty: newJoiners.slice(0, 5) // Top 5 recent
            });
            setAnnouncements(announce);
            setRequests(reqs.filter(r => r.status === 'Pending'));

            // Check for new announcement (today)
            if (announce.length > 0) {
                const latest = announce[0];
                const today = new Date().toISOString().split('T')[0];
                if (latest.date === today && user.role === 'faculty') {
                    // Simple simulated "Push" notification
                    if (!localDataService.getItem(`seen_announcement_${latest.id}`)) {
                        setShowNotification(latest);
                    }
                }
            }
        });
    }, [user]);

    const handleDismissNotification = () => {
        if (showNotification) {
            localDataService.setItem(`seen_announcement_${showNotification.id}`, 'true');
            setShowNotification(null);
        }
    };

    const handlePostAnnouncement = (e) => {
        e.preventDefault();
        if (!newAnnouncement.trim()) return;

        DataService.addAnnouncement(newAnnouncement)
            .then(() => DataService.getAnnouncements())
            .then(data => {
                setAnnouncements(data);
                setNewAnnouncement('');
            });
    };

    const handleActionRequest = (id, status) => {
        DataService.updateRequestStatus(id, status).then(() => {
            // Refresh requests
            DataService.getRequests().then(reqs => {
                setRequests(reqs.filter(r => r.status === 'Pending'));
            });
        });
    };

    // Faculty View
    if (user && user.role === 'faculty') {
        return (
            <Layout activePage="Dashboard">
                <div className="space-y-6">
                    {/* Announcement Marquee */}
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-center overflow-hidden">
                        <div className="bg-blue-100 text-blue-700 p-2 rounded-md mr-4 font-bold shrink-0 z-10">
                            ANNOUNCEMENTS
                        </div>
                        <div className="flex-1 overflow-hidden relative h-6">
                            {announcements.length > 0 ? (
                                <div className="animate-marquee whitespace-nowrap absolute w-full">
                                    {announcements.map((a, i) => (
                                        <span key={a.id} className="mr-12 text-gray-700 font-medium inline-block">
                                            📢 {a.text} <span className="text-gray-400 text-xs ml-2">({a.date})</span>
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 italic">No new announcements</p>
                            )}
                        </div>
                    </div>

                    {/* Faculty Welcome Area */}
                    <div className="card">
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Welcome, {user.name}!</h3>
                        <p className="text-gray-600">Have a great day at work. Check your schedule and profile for updates.</p>
                    </div>

                    {/* Basic Stats for Faculty */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="card bg-gradient-to-br from-purple-500 to-indigo-600 text-white border-none">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-purple-100 text-sm font-medium mb-1">Your Department</p>
                                    <h3 className="text-2xl font-bold">{user.department || "N/A"}</h3>
                                </div>
                                <div className="icon-building-2 text-3xl opacity-80"></div>
                            </div>
                        </div>
                        <div className="card bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-none">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-emerald-100 text-sm font-medium mb-1">Status</p>
                                    <h3 className="text-2xl font-bold">Active</h3>
                                </div>
                                <div className="icon-user-check text-3xl opacity-80"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    // Admin View
    return (
        <Layout activePage="Dashboard">
            <div className="space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { label: 'Total Faculty', value: stats.facultyCount, icon: 'users', color: 'bg-blue-500' },
                        { label: 'Departments', value: stats.deptCount, icon: 'building-2', color: 'bg-amber-500' },
                        { label: 'Total HODs', value: stats.hodCount, icon: 'crown', color: 'bg-emerald-500' },
                        { label: 'Newly Joined', value: stats.newFacultyCount, icon: 'user-plus', color: 'bg-rose-500' },
                    ].map((stat) => (
                        <div key={stat.label} className="card flex items-center p-6 hover:shadow-md transition-shadow">
                            <div className={`w-14 h-14 rounded-full ${stat.color} bg-opacity-10 flex items-center justify-center mr-4`}>
                                <div className={`icon-${stat.icon} text-2xl ${stat.color.replace('bg-', 'text-')}`}></div>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
                                <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Newly Joined List */}
                    <div className="lg:col-span-2 card">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-gray-800">Newly Joined Faculty</h3>
                            <a href="faculty-list.html" className="text-sm text-[var(--primary-color)] hover:underline">View All</a>
                        </div>
                        <div className="space-y-4">
                            {stats.newFaculty.length > 0 ? (
                                stats.newFaculty.map((f) => (
                                    <div key={f.id} className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100">
                                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold mr-4">
                                            {f.firstName[0]}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900">{f.firstName} {f.lastName}</h4>
                                            <p className="text-xs text-gray-500">{f.department} • {f.specialization}</p>
                                        </div>
                                        <div className="text-xs text-gray-400">{f.joinedDate}</div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center py-4">No recent joiners found.</p>
                            )}
                        </div>
                    </div>

                    {/* Announcements & Mail Box */}
                    <div className="space-y-8">
                        {/* Announcement Creator */}
                        <div className="card bg-blue-50 border-blue-100">
                            <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center">
                                <div className="icon-megaphone mr-2"></div>
                                Post Announcement
                            </h3>
                            <form onSubmit={handlePostAnnouncement}>
                                <textarea
                                    value={newAnnouncement}
                                    onChange={(e) => setNewAnnouncement(e.target.value)}
                                    className="w-full p-3 rounded-md border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm mb-3"
                                    rows="3"
                                    placeholder="Type announcement here..."
                                ></textarea>
                                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium text-sm transition-colors">
                                    Broadcast
                                </button>
                            </form>

                            {/* Recent Announcements List */}
                            <div className="mt-6">
                                <h4 className="text-xs font-bold text-blue-800 uppercase tracking-wide mb-3">Recent Broadcasts</h4>
                                <div className="space-y-2 max-h-40 overflow-y-auto">
                                    {announcements.slice(0, 3).map(a => (
                                        <div key={a.id} className="bg-white p-2 rounded border border-blue-100 text-sm">
                                            <p className="text-gray-700">{a.text}</p>
                                            <span className="text-xs text-gray-400 block mt-1">{a.date}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Mail Box / Requests */}
                        <div className="card h-fit">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-gray-800 flex items-center">
                                    <div className="icon-mail mr-2"></div>
                                    Mail Box
                                </h3>
                                {requests.length > 0 && (
                                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{requests.length}</span>
                                )}
                            </div>

                            {requests.length > 0 ? (
                                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                                    {requests.map(req => (
                                        <div key={req.id} className="bg-amber-50 border border-amber-100 p-3 rounded-lg text-sm">
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="font-bold text-gray-800">{req.userName}</span>
                                                <span className="text-xs text-gray-400">{req.date.split('T')[0]}</span>
                                            </div>
                                            <p className="text-gray-600 mb-3 italic">"{req.text}"</p>
                                            <div className="flex gap-2 justify-end">
                                                <button
                                                    onClick={() => handleActionRequest(req.id, 'Dismissed')}
                                                    className="px-3 py-1 bg-white border border-gray-200 text-gray-600 rounded hover:bg-gray-50 text-xs transition-colors"
                                                >
                                                    Dismiss
                                                </button>
                                                <button
                                                    onClick={() => handleActionRequest(req.id, 'Done')}
                                                    className="px-3 py-1 bg-[var(--primary-color)] text-white rounded hover:opacity-90 text-xs transition-colors"
                                                >
                                                    Mark Done
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                    <div className="icon-inbox text-4xl text-gray-300 mx-auto mb-2"></div>
                                    <p className="text-gray-500 text-sm">No new requests.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {/* Notification Toast */}
            {showNotification && (
                <div className="fixed bottom-4 right-4 bg-white border-l-4 border-blue-500 shadow-2xl rounded-lg p-4 max-w-sm animate-slide-in z-50">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <div className="icon-bell text-blue-500 text-xl"></div>
                        </div>
                        <div className="ml-3 w-0 flex-1 pt-0.5">
                            <p className="text-sm font-medium text-gray-900">New Announcement</p>
                            <p className="mt-1 text-sm text-gray-500">{showNotification.text}</p>
                        </div>
                        <div className="ml-4 flex-shrink-0 flex">
                            <button
                                className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
                                onClick={handleDismissNotification}
                            >
                                <span className="sr-only">Close</span>
                                <div className="icon-x text-lg"></div>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Dashboard />);
