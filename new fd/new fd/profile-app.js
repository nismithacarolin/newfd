function Profile() {
    const [user, setUser] = React.useState(Auth.getCurrentUser());
    const [isEditMode, setIsEditMode] = React.useState(false);
    const [requestModalOpen, setRequestModalOpen] = React.useState(false);
    const [requestText, setRequestText] = React.useState("");

    const handleSendRequest = (e) => {
        e.preventDefault();
        if (!requestText.trim()) return;

        Storage.addRequest({
            userId: user.id,
            userName: `${user.firstName || user.name} ${user.lastName || ''}`,
            text: requestText,
            date: new Date().toISOString()
        });
        
        setRequestModalOpen(false);
        setRequestText("");
        alert("Request sent to Admin successfully!");
    };

    if (!user) return null;

    return (
        <Layout activePage="Profile">
            <div className="max-w-4xl mx-auto">
                <div className="card overflow-hidden">
                    <div className="h-32 bg-gradient-to-r from-[var(--primary-color)] to-blue-400 relative">
                        <div className="absolute -bottom-12 left-8">
                            <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-500">
                                {user.firstName ? user.firstName[0] : user.name[0]}
                            </div>
                        </div>
                    </div>
                    
                    <div className="pt-16 pb-8 px-8">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">{user.firstName} {user.lastName}</h2>
                                <p className="text-gray-500">{user.role === 'admin' ? 'Administrator' : 'Faculty Member'}</p>
                            </div>
                            
                            {user.role === 'faculty' && (
                                <button 
                                    onClick={() => setRequestModalOpen(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                                >
                                    <div className="icon-message-square-plus"></div>
                                    Request Changes
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                            <div className="space-y-6">
                                <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Personal Information</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase">Full Name</label>
                                        <p className="font-medium text-gray-700">{user.firstName} {user.lastName || user.name}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase">Email Address</label>
                                        <p className="font-medium text-gray-700">{user.email || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase">Phone</label>
                                        <p className="font-medium text-gray-700">{user.phone || '+1 234 567 890'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Academic Details</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase">Department</label>
                                        <p className="font-medium text-gray-700">{user.department || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase">Designation</label>
                                        <p className="font-medium text-gray-700">{user.designation || 'Assistant Professor'}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase">Joined Date</label>
                                        <p className="font-medium text-gray-700">{user.joinedDate || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Request Modal */}
                {requestModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative animate-[fadeIn_0.2s_ease-out]">
                            <button 
                                onClick={() => setRequestModalOpen(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                            >
                                <div className="icon-x text-xl"></div>
                            </button>
                            
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Request Details Change</h3>
                            <p className="text-sm text-gray-500 mb-4">
                                Send a message to the admin describing the changes you need for your profile details.
                            </p>
                            
                            <form onSubmit={handleSendRequest}>
                                <textarea
                                    className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent outline-none resize-none text-sm mb-4"
                                    placeholder="e.g., Please update my phone number to +1 987..."
                                    value={requestText}
                                    onChange={(e) => setRequestText(e.target.value)}
                                    required
                                ></textarea>
                                
                                <div className="flex justify-end gap-3">
                                    <button 
                                        type="button"
                                        onClick={() => setRequestModalOpen(false)}
                                        className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit"
                                        className="px-4 py-2 text-white bg-[var(--primary-color)] hover:opacity-90 rounded-lg text-sm font-medium transition-colors"
                                    >
                                        Send Request
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Profile />);