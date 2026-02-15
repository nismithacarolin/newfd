function HodDetails() {
    const user = Auth.getCurrentUser();
    const [departments, setDepartments] = React.useState([]);
    const [allFaculty, setAllFaculty] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [searchQuery, setSearchQuery] = React.useState("");

    React.useEffect(() => {
        // Fetch both Departments and Faculty
        Promise.all([
            DataService.getDepartments(),
            DataService.getFaculty()
        ]).then(([depts, faculty]) => {
            setDepartments(depts);
            setAllFaculty(faculty);
            setLoading(false);
        });
    }, []);

    // Filter Logic
    const filteredDepartments = departments.filter(dept => {
        const query = searchQuery.toLowerCase();
        return (
            dept.name.toLowerCase().includes(query) ||
            dept.code.toLowerCase().includes(query) ||
            (dept.hod && dept.hod.toLowerCase().includes(query))
        );
    });

    // Helper to find faculty ID by HOD Name (Robust Fuzzy Match)
    const getHodProfileId = (hodName) => {
        if (!hodName) return null;

        // Normalizer: remove prefixes, dots, spaces, special chars
        const normalize = (str) => {
            return str.toLowerCase()
                .replace(/\b(dr|prof|mr|mrs|ms)\b\.?/g, '') // remove titles
                .replace(/[^a-z0-9]/g, ''); // remove non-alphanumeric
        };

        const target = normalize(hodName);

        // 1. Exact Match on ID if HOD was stored as ID (future proofing)
        // 2. Fuzzy Match on Name
        const found = allFaculty.find(f => {
            const fFirst = normalize(f.firstName);
            const fLast = normalize(f.lastName);
            const fFull = fFirst + fLast;
            const fFullRev = fLast + fFirst;

            // Check exact containment in either direction
            // e.g. target="skarpagavallis", fFull="karpagavallis" -> true
            // e.g. target="alanturing", fFull="alanturing" -> true

            return target.includes(fFull) ||
                target.includes(fFullRev) ||
                fFull.includes(target) ||
                (fFirst.length > 3 && target.includes(fFirst)) || // strict first name match if unique-ish
                (fLast.length > 3 && target.includes(fLast));
        });

        return found ? found.id : null;
    };

    // Safety check
    if (!user) return null;

    if (loading) {
        return (
            <Layout activePage="HOD Details">
                <div className="flex items-center justify-center h-64">
                    <div className="text-gray-500">Loading HOD details...</div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout activePage="HOD Details">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                    <div className="icon-user-check mr-3 text-[var(--primary-color)]"></div>
                    Head of Departments
                </h1>

                {/* Search Bar */}
                <div className="relative w-full md:flex-1 md:max-w-2xl">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <div className="icon-search text-lg"></div>
                    </div>
                    <input
                        type="text"
                        placeholder="Search HOD or Department..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Department Name
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Code
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                HOD Name
                            </th>
                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredDepartments.length > 0 ? (
                            filteredDepartments.map((dept, index) => {
                                const hodProfileId = getHodProfileId(dept.hod);
                                return (
                                    <tr key={dept.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{dept.name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                                {dept.code}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {dept.hod ? (
                                                <div className="flex items-center">
                                                    <div className="h-8 w-8 rounded-full bg-[var(--primary-color)] text-white flex items-center justify-center mr-3 font-bold text-xs">
                                                        {dept.hod.charAt(0)}
                                                    </div>
                                                    <div className="text-sm text-gray-900 font-medium">{dept.hod}</div>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-gray-400 italic">Not Assigned</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                            {hodProfileId ? (
                                                <a href={`faculty-detail.html?id=${hodProfileId}`} className="text-[var(--primary-color)] hover:text-blue-900 flex justify-center items-center gap-1 transition-colors">
                                                    View Profile <div className="icon-arrow-right w-3 h-3"></div>
                                                </a>
                                            ) : (
                                                <span className="text-gray-400 cursor-not-allowed flex justify-center items-center gap-1" title="Profile not found or HOD name mismatch">
                                                    No Profile <div className="icon-slash w-3 h-3"></div>
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                                    No departments found matching your search.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg flex items-start gap-3">
                <div className="icon-info text-blue-500 mt-1"></div>
                <div className="text-sm text-blue-800">
                    <p className="font-semibold mb-1">Information</p>
                    <p>This table lists the current Heads of Departments (HOD). Clicking "View Profile" will take you to their detailed faculty profile page. If "No Profile" is shown, ensure the HOD's name in the Department settings exactly matches their Faculty record.</p>
                </div>
            </div>
        </Layout>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<HodDetails />);
