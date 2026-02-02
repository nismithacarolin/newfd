const API_BASE = '/api';

const Storage = {
    // Helper for fetch
    fetchJSON: async (url, options = {}) => {
        try {
            const response = await fetch(url, options);
            if (!response.ok) throw new Error('Network response was not ok');
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    // Legacy method support if needed, or just return empty
    getData: async () => ({}),

    getFaculty: async () => {
        return await Storage.fetchJSON(`${API_BASE}/faculty`);
    },

    addFaculty: async (faculty) => {
        return await Storage.fetchJSON(`${API_BASE}/faculty`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(faculty)
        });
    },

    getDepartments: async () => {
        return await Storage.fetchJSON(`${API_BASE}/departments`);
    },

    addDepartment: async (dept) => {
        return await Storage.fetchJSON(`${API_BASE}/departments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dept)
        });
    },

    getAnnouncements: async () => {
        return await Storage.fetchJSON(`${API_BASE}/announcements`);
    },

    addAnnouncement: async (text) => {
        return await Storage.fetchJSON(`${API_BASE}/announcements`, {
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
    }
};

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
                return true;
            }
            return false;
        } catch (e) {
            console.error(e);
            return false;
        }
    },
    logout: () => {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
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