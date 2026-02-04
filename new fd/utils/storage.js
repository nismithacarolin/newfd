const API_BASE = 'http://127.0.0.1:5000/api';

const DataService = {
    // Helper for fetch
    fetchJSON: async (url, options = {}) => {
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.error || errData.message || 'Network response was not ok');
            }
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    // Legacy method support if needed, or just return empty
    getData: async () => ({}),

    getFaculty: async () => {
        return await DataService.fetchJSON(`${API_BASE}/faculty`);
    },

    addFaculty: async (faculty) => {
        return await DataService.fetchJSON(`${API_BASE}/faculty`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(faculty)
        });
    },

    getDepartments: async () => {
        return await DataService.fetchJSON(`${API_BASE}/departments`);
    },

    addDepartment: async (dept) => {
        return await DataService.fetchJSON(`${API_BASE}/departments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dept)
        });
    },

    getAnnouncements: async () => {
        return await DataService.fetchJSON(`${API_BASE}/announcements`);
    },

    addAnnouncement: async (text) => {
        return await DataService.fetchJSON(`${API_BASE}/announcements`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });
    },

    getRequests: async () => {
        // Mock implementation for requests as DB schema didn't prioritize it yet, returning empty or could implement
        return [];
    },

    addRequest: async (req) => {
        console.log("Request added (mock)", req);
    },

    updateRequestStatus: async (id, status) => {
        console.log("Request updated (mock)", id, status);
    },

    getCredentials: async () => {
        return await DataService.fetchJSON(`${API_BASE}/credentials`);
    },

    addCredential: async (credential) => {
        return await DataService.fetchJSON(`${API_BASE}/credentials`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credential)
        });
    },

    deleteCredential: async (id) => {
        return await DataService.fetchJSON(`${API_BASE}/credentials/${id}`, {
            method: 'DELETE'
        });
    }
};

// Expose to global window object
window.DataService = DataService;

const Auth = {
    login: async (username, password, role) => {
        try {
            const response = await fetch(`${API_BASE}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, role })
            });

            const data = await response.json();
            if (data.success) {
                localStorage.setItem('currentUser', JSON.stringify(data.user));
            }
            return data;
        } catch (e) {
            console.error(e);
            return false;
        }
    },
    logout: () => {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html?v=logout';
    },
    getCurrentUser: () => {
        const user = localStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    },
    requireAuth: () => {
        if (!localStorage.getItem('currentUser')) {
            window.location.href = 'index.html';
        }
    }
};

window.Auth = Auth;