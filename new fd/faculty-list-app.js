function FacultyList() {
    const user = Auth.getCurrentUser();
    const [allFaculty, setAllFaculty] = React.useState([]);
    const [filteredFaculty, setFilteredFaculty] = React.useState([]);
    const [filters, setFilters] = React.useState({ search: '', type: 'All' });
    const [urlDepartment, setUrlDepartment] = React.useState(null);

    React.useEffect(() => {
        async function loadFaculty() {
            const data = await Storage.getFaculty();
            setAllFaculty(data);

            const urlParams = new URLSearchParams(window.location.search);
            const deptParam = urlParams.get('department');

            if (deptParam) {
                setUrlDepartment(deptParam);
                setFilteredFaculty(data.filter(f => f.department === deptParam));
            } else {
                setFilteredFaculty(data);
            }
        }

        loadFaculty();
    }, []);

    if (!user) return null;

    React.useEffect(() => {
        let result = allFaculty;

        if (urlDepartment) {
            result = result.filter(f => f.department === urlDepartment);
        }

        if (filters.search) {
            const q = filters.search.toLowerCase();
            result = result.filter(f =>
                f.firstName.toLowerCase().includes(q) ||
                f.lastName.toLowerCase().includes(q) ||
                f.department.toLowerCase().includes(q)
            );
        }

        if (filters.type !== 'All') {
            result = result.filter(f => f.type === filters.type);
        }

        setFilteredFaculty(result);
    }, [filters, allFaculty, urlDepartment]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleViewFaculty = (faculty) => {
        window.location.href = `faculty-detail.html?id=${faculty.id}`;
    };

    const handleClearDepartment = () => {
        window.location.href = 'faculty-list.html';
    };

    return (
        <Layout activePage="Faculty Details">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFaculty.map(f => (
                    <div key={f.id} className="card text-center">
                        <h3>{f.firstName} {f.lastName}</h3>
                        <p>{f.department}</p>
                        <button onClick={() => handleViewFaculty(f)}>View</button>
                    </div>
                ))}
            </div>

            {filteredFaculty.length === 0 && (
                <p className="text-center text-gray-500 mt-10">No faculty found.</p>
            )}
        </Layout>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<FacultyList />);
