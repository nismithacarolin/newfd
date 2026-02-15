function Departments() {
    const user = Auth.getCurrentUser();
    const [departments, setDepartments] = React.useState([]);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
    const [newDept, setNewDept] = React.useState({ name: '', code: '', hod: '' });

    React.useEffect(() => {
        setDepartments(Storage.getDepartments());
    }, []);

    // Safety check: if no user, render nothing (Layout will handle redirect)
    if (!user) return null;

    const filteredDepartments = departments.filter(d => 
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        d.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDepartmentClick = (dept) => {
        // Navigate to faculty list page filtered by this department
        window.location.href = `faculty-list.html?department=${encodeURIComponent(dept.name)}`;
    };

    const handleAddDept = (e) => {
        e.preventDefault();
        if(newDept.name && newDept.code) {
            Storage.addDepartment(newDept);
            setDepartments(Storage.getDepartments());
            setIsAddModalOpen(false);
            setNewDept({ name: '', code: '', hod: '' });
        }
    };

    return (
        <Layout activePage="Departments">
            <div className="flex justify-between items-center mb-6">
                <div className="relative w-full max-w-md">
                     <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <div className="icon-search text-lg"></div>
                    </div>
                    <input 
                        type="text" 
                        placeholder="Search departments..." 
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                {user.role === 'admin' && (
                    <button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="btn bg-[var(--primary-color)] text-white"
                    >
                        <div className="icon-plus text-lg"></div>
                        Add Department
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDepartments.map(dept => (
                    <div 
                        key={dept.id} 
                        onClick={() => handleDepartmentClick(dept)}
                        className="card cursor-pointer transition-all hover:shadow-md hover:border-[var(--primary-color)] hover:-translate-y-1 group"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-[var(--primary-color)] font-bold text-xl group-hover:bg-[var(--primary-color)] group-hover:text-white transition-colors">
                                {dept.code}
                            </div>
                            <div className="icon-chevron-right text-gray-400 group-hover:text-[var(--primary-color)]"></div>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{dept.name}</h3>
                        <p className="text-sm text-gray-500">HOD: <span className="font-medium text-gray-700">{dept.hod || 'Not Assigned'}</span></p>
                        <p className="text-xs text-[var(--primary-color)] mt-3 font-medium">Click to view faculty &rarr;</p>
                    </div>
                ))}
            </div>

            {/* Add Department Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4">Add New Department</h3>
                        <form onSubmit={handleAddDept} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Department Name</label>
                                <input type="text" className="w-full border p-2 rounded" value={newDept.name} onChange={(e) => setNewDept({...newDept, name: e.target.value})} required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Department Code</label>
                                <input type="text" className="w-full border p-2 rounded" value={newDept.code} onChange={(e) => setNewDept({...newDept, code: e.target.value})} required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">HOD Name</label>
                                <input type="text" className="w-full border p-2 rounded" value={newDept.hod} onChange={(e) => setNewDept({...newDept, hod: e.target.value})} />
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={() => setIsAddModalOpen(false)} className="btn btn-secondary">Cancel</button>
                                <button type="submit" className="btn bg-[var(--primary-color)] text-white">Add</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </Layout>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Departments />);