
// Vanilla JS Dashboard Logic

document.addEventListener('DOMContentLoaded', async () => {
    const container = initLayout('Dashboard');
    const user = Auth.getCurrentUser();

    // Fetch Data
    const [faculty, depts, announcements] = await Promise.all([
        DataService.getFaculty(),
        DataService.getDepartments(),
        DataService.getAnnouncements()
    ]);

    // Stats
    const totalFaculty = faculty.length;
    const totalDepts = depts.length;
    const recentAnns = announcements.slice(0, 5);

    // Render Dashboard
    container.innerHTML = `
        <div class="max-w-6xl mx-auto space-y-8">
            <h1 class="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
            
            <!-- Stats Grid -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <!-- Faculty Count -->
                <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200 border-l-4 border-l-blue-900">
                    <div class="flex justify-between items-start">
                        <div>
                            <p class="text-sm font-medium text-gray-500">Total Faculty</p>
                            <h3 class="text-3xl font-bold text-gray-900 mt-2">${totalFaculty}</h3>
                        </div>
                        <div class="p-3 bg-blue-50 rounded-lg">
                            <i data-lucide="users" class="w-6 h-6 text-blue-900"></i>
                        </div>
                    </div>
                </div>

                <!-- Dept Count -->
                <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200 border-l-4 border-l-amber-500">
                    <div class="flex justify-between items-start">
                        <div>
                            <p class="text-sm font-medium text-gray-500">Departments</p>
                            <h3 class="text-3xl font-bold text-gray-900 mt-2">${totalDepts}</h3>
                        </div>
                        <div class="p-3 bg-amber-50 rounded-lg">
                            <i data-lucide="building-2" class="w-6 h-6 text-amber-500"></i>
                        </div>
                    </div>
                </div>

                <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200 border-l-4 border-l-green-600">
                     <div class="flex justify-between items-start">
                        <div>
                            <p class="text-sm font-medium text-gray-500">System Status</p>
                            <h3 class="text-xl font-bold text-green-600 mt-2">Active</h3>
                        </div>
                        <div class="p-3 bg-green-50 rounded-lg">
                            <i data-lucide="activity" class="w-6 h-6 text-green-600"></i>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Announcements & Chart -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <!-- Announcements -->
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <i data-lucide="bell" class="w-5 h-5 text-amber-500"></i> Announcements
                    </h3>
                    <div class="space-y-4">
                        ${recentAnns.map(ann => `
                            <div class="p-4 bg-gray-50 rounded-lg border border-gray-100">
                                <p class="text-gray-800 text-sm font-medium">${ann.text}</p>
                                <p class="text-xs text-gray-400 mt-2">${ann.date || 'Today'}</p>
                            </div>
                        `).join('')}
                        ${recentAnns.length === 0 ? '<p class="text-gray-400 text-sm">No announcements.</p>' : ''}
                    </div>
                    ${user.role === 'admin' ? `
                        <form onsubmit="postAnnouncement(event)" class="mt-4 flex gap-2">
                             <input type="text" id="ann-input" class="flex-1 px-3 py-2 border rounded-md text-sm" placeholder="New announcement..." required>
                             <button type="submit" class="bg-blue-900 text-white px-4 py-2 rounded-md text-sm">Post</button>
                        </form>
                    ` : ''}
                </div>

                <!-- Chart Placeholder -->
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col items-center">
                    <h3 class="text-lg font-bold text-gray-900 mb-4 w-full">Faculty Distribution</h3>
                    <div class="relative h-64 w-full max-w-xs">
                        <canvas id="deptChart"></canvas>
                    </div>
                </div>
            </div>
        </div>
    `;

    window.lucide.createIcons();
    initChart(faculty);
});

// Chart initialization
function initChart(faculty) {
    const ctx = document.getElementById('deptChart');
    if (!ctx) return;

    // Count faculty per dept
    const deptCounts = {};
    faculty.forEach(f => {
        deptCounts[f.department] = (deptCounts[f.department] || 0) + 1;
    });

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(deptCounts),
            datasets: [{
                data: Object.values(deptCounts),
                backgroundColor: ['#1e3a8a', '#f59e0b', '#10b981', '#6366f1', '#ec4899']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
}

window.postAnnouncement = async (e) => {
    e.preventDefault();
    const input = document.getElementById('ann-input');
    const text = input.value;
    await DataService.addAnnouncement(text);
    window.location.reload();
}
