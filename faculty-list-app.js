function FacultyList() {
    const user = Auth.getCurrentUser();
    const [allFaculty, setAllFaculty] = React.useState([]);
    const [filteredFaculty, setFilteredFaculty] = React.useState([]);
    const [filters, setFilters] = React.useState({
        search: '',
        type: 'All', // All, Aided, Self Finance
        sortBy: 'name', // name, degree
        degreeFilter: 'All' // All, Ph.D, M.Phil, etc.
    });
    const [urlDepartment, setUrlDepartment] = React.useState(null);

    React.useEffect(() => {
        DataService.getFaculty().then(data => {
            setAllFaculty(data);

            // Check for department query param
            const urlParams = new URLSearchParams(window.location.search);
            const deptParam = urlParams.get('department');

            if (deptParam) {
                setUrlDepartment(deptParam);
                // Pre-filter data based on department
                const deptFiltered = data.filter(f => f.department === deptParam);
                setFilteredFaculty(deptFiltered);
            } else {
                setFilteredFaculty(data);
            }
        });
    }, []);

    // Safety check
    if (!user) return null;

    // Filter Logic
    React.useEffect(() => {
        let result = [...allFaculty]; // Clone to avoid mutating state directly in some cases, though 'allFaculty' shouldn't change here

        // Apply URL Department filter first if exists
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

        if (filters.degreeFilter !== 'All') {
            const filterDeg = filters.degreeFilter.toLowerCase();
            result = result.filter(f => {
                if (!f.education) return false;
                const edu = f.education.toLowerCase();
                // Handle specific cases or generic includes
                if (filterDeg === 'm.sc') return edu.includes('m.sc') || edu.includes('mca') || edu.includes('m.a');

                // Remove dots for cleaner comparison if needed, or just standard includes
                // User wants "BSc", "MSc" etc. The data might be "B.Sc", "M.Sc".
                // Best to normalize search.
                const normalizedEdu = edu.replace(/\./g, '');
                const normalizedFilter = filterDeg.replace(/\./g, '');

                return normalizedEdu.includes(normalizedFilter);
            });
        }

        // Helper to get degree rank
        const getDegreeRank = (education) => {
            if (!education) return 0;
            const edu = education.toLowerCase();
            if (edu.includes('ph.d') || edu.includes('phd')) return 4;
            if (edu.includes('m.phil') || edu.includes('mphil')) return 3;
            if (edu.includes('m.sc') || edu.includes('m.a') || edu.includes('mca') || edu.includes('m.com') || edu.includes('mba') || edu.includes('master')) return 2;
            if (edu.includes('b.sc') || edu.includes('b.a') || edu.includes('bca') || edu.includes('b.com') || edu.includes('bcom') || edu.includes('bba') || edu.includes('bachel')) return 1;
            return 0;
        };

        // Sort Result
        if (filters.sortBy === 'degree') {
            result.sort((a, b) => {
                const rankA = getDegreeRank(a.education);
                const rankB = getDegreeRank(b.education);
                return rankB - rankA; // Descending rank
            });
        } else {
            // Default sort by name
            result.sort((a, b) => a.firstName.localeCompare(b.firstName));
        }

        setFilteredFaculty(result);
    }, [filters, allFaculty, urlDepartment]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleViewFaculty = (faculty) => {
        // Navigate to dedicated details page
        window.location.href = `faculty-detail.html?id=${faculty.id}`;
    };

    const handleClearDepartment = () => {
        window.location.href = 'faculty-list.html';
    }

    return (
        <Layout activePage="Faculty Details">
            {/* Header for Department View if active */}
            {urlDepartment && (
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Department: <span className="text-[var(--primary-color)]">{urlDepartment}</span>
                    </h2>
                    <button onClick={handleClearDepartment} className="text-sm text-gray-500 hover:text-gray-800 flex items-center bg-white px-3 py-1 rounded border border-gray-200">
                        <div className="icon-x mr-1"></div> Clear Filter
                    </button>
                </div>
            )}

            {/* Filters Bar */}
            <div className="card mb-8">
                <div className="flex flex-col md:flex-row gap-4 justify-between">
                    <div className="relative flex-1">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <div className="icon-search text-lg"></div>
                        </div>
                        <input
                            type="text"
                            placeholder="Search by name or department..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                            value={filters.search}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                        />
                    </div>
                    <div className="flex gap-4 min-w-[200px]">
                        <select
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white focus:outline-none"
                            value={filters.type}
                            onChange={(e) => handleFilterChange('type', e.target.value)}
                        >
                            <option value="All">All Categories</option>
                            <option value="Aided">Aided</option>
                            <option value="Self Finance">Self Finance</option>
                        </select>
                        {/* Removed Shift Dropdown */}
                        <select
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white focus:outline-none"
                            value={filters.degreeFilter}
                            onChange={(e) => handleFilterChange('degreeFilter', e.target.value)}
                        >
                            <option value="All">All Degrees</option>
                            <option value="Ph.D">Ph.D</option>
                            <option value="M.Phil">M.Phil</option>
                            <option value="M.Sc">M.Sc / M.A / MCA</option>
                            <option value="MBA">MBA</option>
                            <option value="B.Sc">B.Sc</option>
                            <option value="B.Com">B.Com</option>
                            <option value="BBA">BBA</option>
                        </select>
                        <select
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white focus:outline-none"
                            value={filters.sortBy}
                            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                        >
                            <option value="name">Sort by Name</option>
                            <option value="degree">Sort by Rank (Highest First)</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredFaculty.map(f => (
                    <div key={f.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden flex flex-col relative group">
                        {user.role === 'admin' && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (window.confirm(`Are you sure you want to delete ${f.firstName} ${f.lastName}?`)) {
                                        DataService.deleteFaculty(f.id).then(() => {
                                            // Refresh list locally
                                            setAllFaculty(prev => prev.filter(item => item.id !== f.id));
                                        });
                                    }
                                }}
                                className="absolute top-2 right-2 p-2 bg-white text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100 shadow-sm border border-transparent hover:border-red-100 z-10"
                                title="Delete Faculty"
                            >
                                <div className="icon-trash-2 w-4 h-4"></div>
                            </button>
                        )}
                        <div className="p-6 flex flex-col items-center text-center border-b border-gray-100 flex-1">
                            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-xl font-bold text-gray-600 mb-4 cursor-pointer hover:ring-2 ring-[var(--primary-color)] ring-offset-2 transition-all" onClick={() => handleViewFaculty(f)}>
                                {f.firstName[0]}{f.lastName[0]}
                            </div>
                            <h3 className="font-bold text-gray-900">{f.firstName} {f.lastName}</h3>
                            <p className="text-xs font-semibold text-[var(--primary-color)] mb-1">{f.education}</p>
                            <p className="text-sm text-gray-500 mb-2">{f.specialization}</p>
                            <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-md font-medium">
                                {f.department}
                            </span>
                        </div>
                        <div className="p-3 bg-gray-50 flex justify-center">
                            <button
                                onClick={() => handleViewFaculty(f)}
                                className="text-sm font-medium text-[var(--primary-color)] hover:text-[var(--primary-hover)] flex items-center"
                            >
                                View Details <div className="icon-arrow-right w-4 h-4 ml-1"></div>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {filteredFaculty.length === 0 && (
                <div className="text-center py-12">
                    <div className="icon-search-x text-4xl text-gray-300 mx-auto mb-3"></div>
                    <p className="text-gray-500">No faculty members found matching your filters.</p>
                </div>
            )}
        </Layout>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<FacultyList />);
