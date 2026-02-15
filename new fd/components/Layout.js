function Layout({ children, activePage }) {
    const user = Auth.getCurrentUser();
    const bannerUrl = "https://app.trickle.so/storage/public/images/usr_194ce5fa68000001/4e80086f-5f9b-4558-8e95-322f9c88fb08.jpeg?w=1280&h=174";
    
    // Safety check
    React.useEffect(() => {
        if (!user) {
            window.location.href = 'index.html';
        }
    }, [user]);

    if (!user) return null;

    const menuItems = [
        { name: 'Dashboard', icon: 'layout-dashboard', link: 'dashboard.html' },
        { name: 'Faculty Details', icon: 'users', link: 'faculty-list.html' },
        { name: 'Departments', icon: 'building-2', link: 'departments.html' },
        { name: 'Profile', icon: 'user', link: 'profile.html' },
    ];

    // Add "Add New Faculty" only for admin
    if (user.role === 'admin') {
        menuItems.splice(1, 0, { name: 'Add New Faculty', icon: 'user-plus', link: 'add-faculty.html' });
    }

    return (
        <div className="flex min-h-screen bg-[var(--bg-color)]">
            {/* Sidebar */}
            <aside className="fixed inset-y-0 left-0 w-[var(--sidebar-width)] bg-white border-r border-gray-200 z-20 flex flex-col shadow-sm">
                {/* Updated Header with College Name and User Avatar */}
                <div className="h-24 flex flex-col justify-center px-6 border-b border-gray-100 bg-blue-50/30">
                    <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-[var(--primary-color)] flex items-center justify-center text-white font-bold shrink-0 shadow-sm border-2 border-white">
                            {user.name.charAt(0)}
                        </div>
                        <span className="font-bold text-sm text-[var(--primary-color)] leading-tight">
                            PSGR Krishnammal college for women
                        </span>
                    </div>
                    <div className="mt-1 pl-[3.25rem]">
                        <span className="text-xs text-gray-500 font-medium capitalize block truncate">
                            {user.name} ({user.role})
                        </span>
                    </div>
                </div>

                <div className="flex-1 py-6 overflow-y-auto">
                    <nav className="px-4 space-y-1">
                        {menuItems.map((item) => (
                            <a
                                key={item.name}
                                href={item.link}
                                className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                                    activePage === item.name
                                        ? 'bg-blue-50 text-[var(--primary-color)]'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                            >
                                <div className={`icon-${item.icon} text-lg mr-3`}></div>
                                {item.name}
                            </a>
                        ))}
                    </nav>
                </div>

                {/* Footer with just Logout now */}
                <div className="p-4 border-t border-gray-100 bg-gray-50">
                    <button
                        onClick={Auth.logout}
                        className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors border border-transparent hover:border-red-100"
                    >
                        <div className="icon-log-out text-lg mr-3"></div>
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-[var(--sidebar-width)] flex flex-col min-h-screen">
                {/* Header with Banner ONLY */}
                <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm h-24">
                    <div className="w-full h-full overflow-hidden relative">
                        <img src={bannerUrl} className="w-full h-full object-cover object-left md:object-center" alt="College Header" />
                    </div>
                </header>

                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}