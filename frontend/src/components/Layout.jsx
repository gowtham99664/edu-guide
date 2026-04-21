import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Layout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const isActive = (path) => location.pathname === path ? 'active' : ''

  const handleLogout = () => {
    logout()
    navigate('/')
    setMenuOpen(false)
  }

  return (
    <div className="app-layout">
      {/* Top header */}
      <header className="header">
        <div className="header-inner">
          <Link to="/" className="logo" style={{textDecoration:'none'}}>
            EduGuide <span>India</span>
          </Link>
          <p className="header-tagline">Your Complete Education Guidance Portal</p>

          {/* Auth buttons in header */}
          <div className="header-auth">
            {user ? (
              <div className="user-menu">
                <span className="user-name">👤 {user.first_name || user.email}</span>
                <div className="user-dropdown">
                  <Link to="/build-profile" onClick={() => setMenuOpen(false)}>Build Profile</Link>
                  <Link to="/my-path" onClick={() => setMenuOpen(false)}>My Path</Link>
                  <button onClick={handleLogout}>Sign Out</button>
                </div>
              </div>
            ) : (
              <div className="auth-btns">
                <Link to="/login" className="btn-header-login">Sign In</Link>
                <Link to="/register" className="btn-header-register">Register</Link>
              </div>
            )}
          </div>

          <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </header>

      {/* Sub-nav */}
      <nav className={`sub-nav ${menuOpen ? 'open' : ''}`}>
        <div className="sub-nav-inner">
          <Link to="/" className={isActive('/')} onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/school-exams" className={isActive('/school-exams')} onClick={() => setMenuOpen(false)}>School Exams</Link>
          <Link to="/entrance-exams" className={isActive('/entrance-exams')} onClick={() => setMenuOpen(false)}>Entrance Exams</Link>
          <Link to="/colleges" className={isActive('/colleges')} onClick={() => setMenuOpen(false)}>Colleges</Link>
          <Link to="/states" className={isActive('/states')} onClick={() => setMenuOpen(false)}>States</Link>
          <Link to="/career-paths" className={isActive('/career-paths')} onClick={() => setMenuOpen(false)}>Career Paths</Link>
          <Link to="/timeline" className={isActive('/timeline')} onClick={() => setMenuOpen(false)}>Prep Timeline</Link>
          <Link to="/scholarships" className={isActive('/scholarships')} onClick={() => setMenuOpen(false)}>Scholarships</Link>
          <Link to="/govt-jobs" className={isActive('/govt-jobs')} onClick={() => setMenuOpen(false)}>Govt Jobs</Link>
          <Link to="/internships" className={isActive('/internships')} onClick={() => setMenuOpen(false)}>Internships</Link>
          <Link to="/search" className={isActive('/search')} onClick={() => setMenuOpen(false)}>Search</Link>
          {user && (
            <>
              <Link to="/build-profile" className={`nav-highlight ${isActive('/build-profile')}`} onClick={() => setMenuOpen(false)}>
                ✨ Build Profile
              </Link>
              <Link to="/my-path" className={`nav-highlight ${isActive('/my-path')}`} onClick={() => setMenuOpen(false)}>
                🤖 My Path
              </Link>
            </>
          )}
        </div>
      </nav>

      <main className="main-content">{children}</main>

      <footer className="footer">
        <p>EduGuide India — Comprehensive Student Guidance Portal | Data compiled from official sources (NIRF, UGC, NTA, UPSC, State Education Departments)</p>
        <p style={{marginTop: 4, fontSize:'0.8rem'}}>Disclaimer: Please verify all information from official websites before making decisions.</p>
      </footer>
    </div>
  )
}
