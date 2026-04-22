import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login, user } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)

  useEffect(() => { if (user) navigate('/') }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) { setError('Please fill in all fields'); return }
    setLoading(true)
    setError('')
    const result = await login(form.email, form.password)
    setLoading(false)
    if (result.error) setError(result.error)
    else navigate('/')
  }

  return (
    <div className="login-page">
      {/* Header Bar */}
      <header className="login-header">
        <div className="login-header-inner">
          <div className="login-logo">
            <div className="logo-icon">
              <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="18" fill="#f9a825" opacity="0.2"/>
                <path d="M20 6L8 14v12l12 8 12-8V14L20 6z" fill="#f9a825" opacity="0.3"/>
                <path d="M20 10l-8 5.5v9L20 30l8-5.5v-9L20 10z" fill="#1a237e"/>
                <path d="M16 18h8M16 21h6M16 24h4" stroke="#f9a825" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="logo-text">
               <h1>Vidya <span>Maarg</span></h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content: Illustration (75%) + Login Form (25%) */}
      <main className="login-main">
        {/* Left: Illustration Area */}
        <div className="login-illustration">
          <div className="illustration-content">
            <svg viewBox="0 0 600 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="hero-svg">
              <circle cx="300" cy="250" r="200" fill="#1a237e" opacity="0.05"/>
              <circle cx="300" cy="250" r="150" fill="#534bae" opacity="0.05"/>
              <rect x="120" y="280" width="140" height="20" rx="3" fill="#1a237e" opacity="0.8"/>
              <rect x="125" y="260" width="130" height="20" rx="3" fill="#534bae" opacity="0.8"/>
              <rect x="130" y="240" width="120" height="20" rx="3" fill="#f9a825" opacity="0.8"/>
              <rect x="135" y="220" width="110" height="20" rx="3" fill="#1a237e" opacity="0.6"/>
              <polygon points="300,100 240,140 300,160 360,140" fill="#1a237e"/>
              <rect x="295" y="100" width="10" height="8" fill="#1a237e"/>
              <circle cx="300" cy="96" r="6" fill="#f9a825"/>
              <line x1="360" y1="140" x2="360" y2="175" stroke="#f9a825" strokeWidth="2"/>
              <circle cx="360" cy="178" r="4" fill="#f9a825"/>
              <rect x="270" y="155" width="60" height="10" rx="2" fill="#1a237e" opacity="0.7"/>
              <path d="M150 380 Q250 340 300 360 Q350 380 400 340 Q450 300 500 320" stroke="#f9a825" strokeWidth="3" strokeDasharray="8 4" fill="none" opacity="0.5"/>
              <circle cx="150" cy="380" r="6" fill="#1a237e" opacity="0.5"/>
              <circle cx="300" cy="360" r="6" fill="#534bae" opacity="0.5"/>
              <circle cx="500" cy="320" r="8" fill="#f9a825" opacity="0.7"/>
              <polygon points="480,120 484,132 496,132 486,140 490,152 480,144 470,152 474,140 464,132 476,132" fill="#f9a825" opacity="0.4"/>
            </svg>

            <div className="illustration-text">
              <h2>Navigate Your Education Journey</h2>
              <p>AI-powered guidance for entrance exams, college selection, career planning, and more. Build your personalized roadmap to success.</p>
              <div className="feature-pills">
                <span className="pill">AI Roadmap</span>
                <span className="pill">Entrance Exams</span>
                <span className="pill">College Finder</span>
                <span className="pill">Milestone Tracker</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Login Form */}
        <div className="login-form-section">
          <div className="login-card">
            <div className="login-card-header">
              <h2>Sign In</h2>
              <p>Access your personalized education dashboard</p>
            </div>

            {error && <div className="alert-error">{error}</div>}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="field">
                <label>Email Address</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>

              <div className="field">
                <label>Password</label>
                <div className="pw-field">
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={form.password}
                    onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                    placeholder="Your password"
                    autoComplete="current-password"
                  />
                  <button type="button" className="pw-eye" onClick={() => setShowPw(!showPw)}>
                    {showPw ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn-login" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <p className="switch-auth">
              New to Vidya Maarg? <Link to="/register">Create an account</Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="login-footer">
        <p className="gita-slogan">
          "No matter how hard or impossible it is, never lose sight of your goal"
        </p>
        <p className="gita-source">- Monkey D. Luffy</p>
      </footer>
    </div>
  )
}
