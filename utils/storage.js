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
        const isFormData = faculty instanceof FormData;
        return await DataService.fetchJSON(`${API_BASE}/faculty`, {
            method: 'POST',
            headers: isFormData ? {} : { 'Content-Type': 'application/json' },
            body: isFormData ? faculty : JSON.stringify(faculty)
        });
    },

    updateFaculty: async (id, faculty) => {
        const isFormData = faculty instanceof FormData;
        return await DataService.fetchJSON(`${API_BASE}/faculty/${id}`, {
            method: 'PUT',
            headers: isFormData ? {} : { 'Content-Type': 'application/json' },
            body: isFormData ? faculty : JSON.stringify(faculty)
        });
    },

    deleteFaculty: async (id) => {
        return await DataService.fetchJSON(`${API_BASE}/faculty/${id}`, {
            method: 'DELETE'
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

    updateDepartment: async (id, dept) => {
        return await DataService.fetchJSON(`${API_BASE}/departments/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dept)
        });
    },

    deleteDepartment: async (id) => {
        return await DataService.fetchJSON(`${API_BASE}/departments/${id}`, {
            method: 'DELETE'
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
        return await DataService.fetchJSON(`${API_BASE}/requests`);
    },

    addRequest: async (req) => {
        return await DataService.fetchJSON(`${API_BASE}/requests`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req)
        });
    },

    updateRequestStatus: async (id, status) => {
        return await DataService.fetchJSON(`${API_BASE}/requests/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
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