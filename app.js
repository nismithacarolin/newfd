
// Vanilla JS Logic for Login Page

let currentRole = null;

// Initialize Lucide Icons
if (window.lucide) {
    window.lucide.createIcons();
}

function selectRole(role) {
    currentRole = role;
    document.getElementById('role-selection').classList.add('hidden');
    document.getElementById('login-form-view').classList.remove('hidden');

    // Update Title
    document.getElementById('role-title').innerText = (role === 'admin' ? 'Admin' : 'Faculty') + ' Login';
    document.getElementById('username').placeholder = role === 'admin' ? 'admin' : 'First Name';
}

function backToRoles() {
    currentRole = null;
    document.getElementById('login-form-view').classList.add('hidden');
    document.getElementById('role-selection').classList.remove('hidden');
    document.getElementById('error-message').classList.add('hidden');
    document.getElementById('login-form').reset();
}

function togglePassword() {
    const pwdInput = document.getElementById('password');
    const eyeIcon = document.getElementById('eye-icon');

    if (pwdInput.type === 'password') {
        pwdInput.type = 'text';
        eyeIcon.setAttribute('data-lucide', 'eye-off');
    } else {
        pwdInput.type = 'password';
        eyeIcon.setAttribute('data-lucide', 'eye');
    }
    window.lucide.createIcons();
}

// Form Submission
document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorBox = document.getElementById('error-message');
    const errorText = document.getElementById('error-text');

    errorBox.classList.add('hidden');

    Auth.login(username, password, currentRole)
        .then(data => {
            if (data.success) {
                window.location.href = 'dashboard.html';
            } else {
                errorText.innerText = data.message || 'Invalid credentials.';
                errorBox.classList.remove('hidden');
            }
        })
        .catch(err => {
            errorText.innerText = 'Login failed. Server error.';
            errorBox.classList.remove('hidden');
        });
});

// System Status Check
fetch('http://127.0.0.1:5000/api/status')
    .then(res => res.json())
    .then(data => {
        const statusDot = document.getElementById('status-dot');
        const statusText = document.getElementById('status-text');
        const statusContainer = document.getElementById('system-status');

        if (data.status === 'online') {
            statusText.innerText = 'System Online';
            statusDot.className = 'w-2 h-2 rounded-full mr-2 bg-green-500';
            statusContainer.className = 'mt-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800';
        } else {
            statusText.innerText = 'Offline: ' + data.message;
            statusDot.className = 'w-2 h-2 rounded-full mr-2 bg-red-500';
            statusContainer.className = 'mt-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800';
        }
    })
    .catch(err => {
        const statusText = document.getElementById('status-text');
        statusText.innerText = 'Connection Error: ' + err.message;
    });