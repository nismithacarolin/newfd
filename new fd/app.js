// Error Boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-4">We're sorry, but something unexpected happened.</p>
            <button onClick={() => window.location.reload()} className="btn btn-primary">Reload Page</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function LoginApp() {
    const [role, setRole] = React.useState(null); // 'admin' or 'faculty'
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');

    const bannerUrl = "https://app.trickle.so/storage/public/images/usr_194ce5fa68000001/4e80086f-5f9b-4558-8e95-322f9c88fb08.jpeg?w=1280&h=174";

    const handleLogin = (e) => {
        e.preventDefault();
        setError('');
        
        if (Auth.login(username, password, role)) {
            window.location.href = 'dashboard.html';
        } else {
            setError('Invalid credentials. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Full Header Banner */}
            <div className="w-full h-32 bg-white shadow-sm border-b border-gray-200">
                 <img src={bannerUrl} alt="College Header" className="w-full h-full object-cover object-center" />
            </div>

            <div className="flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-gray-200 p-8">
                    {!role ? (
                        /* Role Selection */
                        <div className="space-y-8 text-center">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900">Select Login Type</h2>
                                <p className="text-gray-500 mt-2">Please choose your role to continue</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <button 
                                    onClick={() => setRole('admin')}
                                    className="flex flex-col items-center justify-center p-6 bg-gray-50 border-2 border-transparent hover:border-[var(--primary-color)] rounded-xl shadow-sm hover:shadow-md transition-all group"
                                >
                                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <div className="icon-shield-check text-2xl text-[var(--primary-color)]"></div>
                                    </div>
                                    <span className="font-semibold text-gray-900">Admin</span>
                                </button>

                                <button 
                                    onClick={() => setRole('faculty')}
                                    className="flex flex-col items-center justify-center p-6 bg-gray-50 border-2 border-transparent hover:border-[var(--secondary-color)] rounded-xl shadow-sm hover:shadow-md transition-all group"
                                >
                                    <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <div className="icon-user text-2xl text-[var(--secondary-color)]"></div>
                                    </div>
                                    <span className="font-semibold text-gray-900">Faculty</span>
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* Login Form */
                        <div>
                            <button 
                                onClick={() => setRole(null)}
                                className="flex items-center text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
                            >
                                <div className="icon-arrow-left text-lg mr-1"></div>
                                Back to Role Selection
                            </button>

                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold text-gray-900">{role === 'admin' ? 'Admin' : 'Faculty'} Login</h2>
                                <p className="text-gray-500 mt-2">Enter your credentials to access</p>
                            </div>

                            {error && (
                                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 flex items-center">
                                    <div className="icon-circle-alert mr-2"></div>
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleLogin} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Username / Email</label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                            <div className="icon-user text-lg"></div>
                                        </div>
                                        <input
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            className="input-field pl-10"
                                            placeholder={role === 'admin' ? "admin" : "faculty username"}
                                            required
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                            <div className="icon-lock text-lg"></div>
                                        </div>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="input-field pl-10"
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>
                                </div>

                                <button type="submit" className="w-full btn btn-primary py-3 text-base shadow-lg shadow-blue-900/20">
                                    Sign In
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Footer */}
            <div className="text-center py-6 text-gray-400 text-sm">
                &copy; 2026 CollegeCMS. All rights reserved.
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <LoginApp />
  </ErrorBoundary>
);