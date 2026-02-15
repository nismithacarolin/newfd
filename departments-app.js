function Departments() {
    const user = Auth.getCurrentUser();
    const [departments, setDepartments] = React.useState([]);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
    const [newDept, setNewDept] = React.useState({ name: '', code: '', hod: '' });

    const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
    const [editingDept, setEditingDept] = React.useState(null);

    React.useEffect(() => {
        DataService.getDepartments().then(data => setDepartments(data));
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
        if (newDept.name && newDept.code) {
            DataService.addDepartment(newDept)
                .then(() => DataService.getDepartments())
                .then(data => {
                    setDepartments(data);
                    setIsAddModalOpen(false);
                    setNewDept({ name: '', code: '', hod: '' });
                });
        }
    };

    const handleEditClick = (e, dept) => {
        e.stopPropagation(); // Prevent card click
        setEditingDept({ ...dept });
        setIsEditModalOpen(true);
    };

    const handleUpdateDept = (e) => {
        e.preventDefault();
        console.log("Update Clicked", editingDept);
        if (editingDept.name && editingDept.code) {
            DataService.updateDepartment(editingDept.id, editingDept)
                .then(() => DataService.getDepartments())
                .then(data => {
                    setDepartments(data);
                    setIsEditModalOpen(false);
                    setEditingDept(null);
                    alert("Department updated successfully!");
                })
                .catch(err => alert("Failed to update: " + err.message));
        } else {
            alert("Name and Code are required!");
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
                        className="card cursor-pointer transition-all hover:shadow-md hover:border-[var(--primary-color)] hover:-translate-y-1 group relative"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-[var(--primary-color)] font-bold text-xl group-hover:bg-[var(--primary-color)] group-hover:text-white transition-colors">
                                {dept.code}
                            </div>
                            <div className="flex items-center gap-2">
                                {user.role === 'admin' && (
                                    <button
                                        onClick={(e) => handleEditClick(e, dept)}
                                        className="px-3 py-1 text-xs font-semibold bg-gray-100 text-gray-600 hover:bg-[var(--primary-color)] hover:text-white rounded-full transition-all flex items-center gap-1"
                                        title="Edit Department"
                                    >
                                        <div className="icon-edit w-3 h-3"></div> Edit
                                    </button>
                                )}
                                <div className="icon-chevron-right text-gray-400 group-hover:text-[var(--primary-color)]"></div>
                            </div>
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
                                <input type="text" className="w-full border p-2 rounded" value={newDept.name} onChange={(e) => setNewDept({ ...newDept, name: e.target.value })} required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Department Code</label>
                                <input type="text" className="w-full border p-2 rounded" value={newDept.code} onChange={(e) => setNewDept({ ...newDept, code: e.target.value })} required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">HOD Name</label>
                                <input type="text" className="w-full border p-2 rounded" value={newDept.hod} onChange={(e) => setNewDept({ ...newDept, hod: e.target.value })} />
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={() => setIsAddModalOpen(false)} className="btn btn-secondary">Cancel</button>
                                <button type="submit" className="btn bg-[var(--primary-color)] text-white">Add</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Department Modal */}
            {isEditModalOpen && editingDept && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4">Edit Department</h3>
                        <form onSubmit={handleUpdateDept} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Department Name</label>
                                <input type="text" className="w-full border p-2 rounded" value={editingDept.name} onChange={(e) => setEditingDept({ ...editingDept, name: e.target.value })} required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Department Code</label>
                                <input type="text" className="w-full border p-2 rounded" value={editingDept.code} onChange={(e) => setEditingDept({ ...editingDept, code: e.target.value })} required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">HOD Name</label>
                                <input type="text" className="w-full border p-2 rounded" value={editingDept.hod} onChange={(e) => setEditingDept({ ...editingDept, hod: e.target.value })} />
                            </div>
                            <div className="flex justify-between pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (window.confirm(`Are you sure you want to delete ${editingDept.name}? This cannot be undone.`)) {
                                            DataService.deleteDepartment(editingDept.id)
                                                .then(() => DataService.getDepartments())
                                                .then(data => {
                                                    setDepartments(data);
                                                    setIsEditModalOpen(false);
                                                    setEditingDept(null);
                                                });
                                        }
                                    }}
                                    className="btn bg-red-50 text-red-600 border border-red-100 hover:bg-red-100"
                                >
                                    <div className="icon-trash-2 mr-2"></div> Delete
                                </button>
                                <div className="flex gap-3">
                                    <button type="button" onClick={() => setIsEditModalOpen(false)} className="btn btn-secondary">Cancel</button>
                                    <button type="submit" className="btn bg-[var(--primary-color)] text-white">Update</button>
                                </div>
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
