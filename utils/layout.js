
// Shared Layout Function for Vanilla JS
// Replaces the React Layout component

function initLayout(activePage) {
    const user = Auth.getCurrentUser();
    if (!user) {
        window.location.href = 'index.html';
        return;
    }

    // Create App Root if not exists
    let appRoot = document.getElementById('app-root');
    if (!appRoot) {
        appRoot = document.createElement('div');
        appRoot.id = 'app-root';
        // Insert at start of body to avoid messing with scripts at end
        document.body.insertBefore(appRoot, document.body.firstChild);
    }

    // --- Sidebar HTML ---
    const sidebarHTML = `
    <aside class="fixed inset-y-0 left-0 w-[var(--sidebar-width)] bg-white border-r border-gray-200 z-30 flex flex-col shadow-sm transition-all duration-300">
        <!-- Header -->
        <div class="h-24 flex flex-col justify-center px-6 border-b border-gray-100 bg-blue-50/30">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-[var(--primary-color)] flex items-center justify-center text-white font-bold shrink-0 shadow-sm border-2 border-white overflow-hidden">
                    ${user.profileImage
            ? `<img src="${user.profileImage}" alt="${user.name}" class="w-full h-full object-cover" />`
            : user.name.charAt(0)
        }
                </div>
                <span class="font-bold text-sm text-[var(--primary-color)] leading-tight">
                    PSGR Krishnammal college for women
                </span>
            </div>
            <div class="mt-1 pl-[3.25rem]">
                <span class="text-xs text-gray-500 font-medium capitalize block truncate">
                    ${user.name} (${user.role})
                </span>
            </div>
        </div>

        <!-- Navigation -->
        <div class="flex-1 py-6 overflow-y-auto custom-scrollbar">
            <nav class="px-4 space-y-1">
                ${generateMenuItem('Dashboard', 'layout-dashboard', 'dashboard.html', activePage)}
                ${user.role === 'admin' ? generateMenuItem('Add New Faculty', 'user-plus', 'add-faculty.html', activePage) : ''}
                ${generateMenuItem('Faculty Details', 'users', 'faculty-list.html', activePage)}
                ${user.role === 'admin' ? generateMenuItem('Login Credentials', 'key', 'credentials.html', activePage) : ''}
                ${generateMenuItem('Departments', 'building-2', 'departments.html', activePage)}
                ${generateMenuItem('HOD Details', 'user-check', 'hod-details.html', activePage)}
                ${generateMenuItem('Profile', 'user', 'profile.html', activePage)}
            </nav>
        </div>

        <!-- Footer -->
        <div class="p-4 border-t border-gray-100 bg-gray-50">
            <button onclick="Auth.logout()" class="flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors border border-transparent hover:border-red-100">
                <i data-lucide="log-out" class="mr-3 w-5 h-5"></i>
                Logout
            </button>
        </div>
    </aside>

    <!-- Main Content Wrapper -->
    <main class="flex-1 ml-[var(--sidebar-width)] flex flex-col min-h-screen bg-[var(--bg-color)] transition-all duration-300">
        <!-- Header Banner -->
        <header class="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
            <img src="assets/banner.png" class="w-full h-24 object-cover" alt="College Banner" />
        </header>

        <div class="p-8" id="main-content-container">
            <!-- Page Content Injected Here by the specific page script -->
        </div>
    </main>
    `;

    appRoot.innerHTML = `
        <div class="flex min-h-screen">
            ${sidebarHTML}
        </div>
    `;

    // Re-initialize icons
    if (window.lucide) {
        window.lucide.createIcons();
    }

    return document.getElementById('main-content-container');
}

function generateMenuItem(name, icon, link, activePage) {
    const isActive = activePage === name || (name === 'Add New Faculty' && activePage === 'Add Faculty'); // Handle alias
    const activeClass = isActive
        ? 'bg-blue-50 text-[var(--primary-color)]'
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900';

    return `
        <a href="${link}" class="flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeClass}">
            <i data-lucide="${icon}" class="mr-3 w-5 h-5"></i>
            ${name}
        </a>
    `;
}

// Expose
window.initLayout = initLayout;
