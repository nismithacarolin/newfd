function CredentialsPage() {
    const [credentials, setCredentials] = React.useState([]);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [showAddModal, setShowAddModal] = React.useState(false);
    const [newCredential, setNewCredential] = React.useState({ username: '', password: '', role: 'faculty' });
    const user = Auth.getCurrentUser();

    React.useEffect(() => {
        if (user && user.role !== 'admin') {
            window.location.href = 'dashboard.html';
        }
        if (user) loadCredentials();
    }, [user]);

    const loadCredentials = () => {
        DataService.getCredentials().then(data => {
            setCredentials(data);
        });
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    const filteredCredentials = credentials.filter(cred =>
        cred.username.toLowerCase().includes(searchTerm) ||
        cred.role.toLowerCase().includes(searchTerm)
    );

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this credential?')) {
            DataService.deleteCredential(id).then(() => {
                loadCredentials();
            });
        }
    };

    const handleAdd = (e) => {
        e.preventDefault();
        DataService.addCredential(newCredential).then(() => {
            setShowAddModal(false);
            setNewCredential({ username: '', password: '', role: 'faculty' });
            loadCredentials();
        });
    };

    return (
        <Layout activePage="Login Credentials">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Login Credentials</h2>
                <button onClick={() => setShowAddModal(true)} className="btn bg-[var(--primary-color)] text-white hover:bg-[var(--primary-hover)]">
                    <i data-lucide="plus" className="w-5 h-5"></i>
                    Add Credential
                </button>
            </div>

            <div className="card mb-6">
                <div className="relative">
                    <i data-lucide="search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"></i>
                    <input
                        type="text"
                        placeholder="Search by username or role..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div>
            </div>

            <div className="card overflow-hidden p-0">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Password</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredCredentials.map((cred) => (
                            <tr key={cred.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{cred.username}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">{cred.password}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${cred.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                                        {cred.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => handleDelete(cred.id)} className="text-red-600 hover:text-red-900 ml-4">
                                        <i data-lucide="trash-2" className="w-5 h-5"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredCredentials.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        No credentials found matching your search.
                    </div>
                )}
            </div>

            {/* Add Credential Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 max-w-md w-full">
                        <h3 className="text-xl font-bold mb-4">Add New Credential</h3>
                        <form onSubmit={handleAdd} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Username</label>
                                <input
                                    type="text"
                                    required
                                    className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                                    value={newCredential.username}
                                    onChange={e => setNewCredential({ ...newCredential, username: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Password</label>
                                <input
                                    type="text"
                                    required
                                    className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                                    value={newCredential.password}
                                    onChange={e => setNewCredential({ ...newCredential, password: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Role</label>
                                <select
                                    className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                                    value={newCredential.role}
                                    onChange={e => setNewCredential({ ...newCredential, role: e.target.value })}
                                >
                                    <option value="faculty">Faculty</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-[var(--primary-color)] text-white rounded-md hover:bg-[var(--primary-hover)]"
                                >
                                    Add Credential
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </Layout>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<CredentialsPage />);
