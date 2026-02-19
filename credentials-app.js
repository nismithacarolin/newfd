
// Vanilla JS Credentials Logic

document.addEventListener('DOMContentLoaded', async () => {
    const container = initLayout('Login Credentials');

    // Fetch Credentials
    const creds = await DataService.getCredentials();

    container.innerHTML = `
        <div class="max-w-6xl mx-auto space-y-6">
            <h1 class="text-3xl font-bold text-gray-900">Login Credentials</h1>
            
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <table class="w-full text-left">
                     <thead class="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
                        <tr>
                            <th class="p-4">Username</th>
                            <th class="p-4">Password</th>
                            <th class="p-4">Role</th>
                            <th class="p-4 text-center">Status</th>
                        </tr>
                     </thead>
                     <tbody class="divide-y divide-gray-100 text-sm">
                        ${creds.map(c => `
                            <tr class="hover:bg-gray-50">
                                <td class="p-4 font-medium text-gray-900">${c.username}</td>
                                <td class="p-4 font-mono text-gray-700 font-medium bg-gray-50/50 rounded-lg select-all">${c.password}</td>
                                <td class="p-4">
                                     <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${c.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}">
                                        ${c.role}
                                     </span>
                                </td>
                                <td class="p-4 text-center">
                                    <span class="text-green-600 text-xs font-bold">Active</span>
                                </td>
                            </tr>
                        `).join('')}
                     </tbody>
                </table>
            </div>
        </div>
    `;

    window.lucide.createIcons();
});
