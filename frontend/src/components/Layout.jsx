import { useState, useEffect, useRef, useMemo } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { api } from '../utils/api'
import engineeringExams from '../data/engineeringExams'
import { medicalExams, lawExams, managementExams } from '../data/otherExams'
import { designExams, architectureExams, agricultureExams, teachingExams, professionalExams, researchExams } from '../data/moreExams'
import colleges from '../data/colleges'
import statesData from '../data/statesData'
import schoolEntranceExams from '../data/schoolEntranceExams'
import { careerPaths } from '../data/careerPaths'

const allExams = [...engineeringExams, ...medicalExams, ...lawExams, ...managementExams, ...designExams, ...architectureExams, ...agricultureExams, ...teachingExams, ...professionalExams, ...researchExams]

export default function Layout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' })
  const [pwMsg, setPwMsg] = useState({ ok: '', err: '' })
  const [pwLoading, setPwLoading] = useState(false)

  const location = useLocation()
  const navigate = useNavigate()
  const { user, token, logout } = useAuth()
  const isActive = (path) => location.pathname === path ? 'active' : ''
  const dropdownRef = useRef(null)
  const searchRef = useRef(null)

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false)
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchFocused(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Close dropdown on route change
  useEffect(() => { setDropdownOpen(false); setSearchFocused(false); setSearchQuery('') }, [location.pathname])

  // Header search results (must be before early returns to keep hooks order stable)
  const searchResults = useMemo(() => {
    if (!searchQuery || searchQuery.length < 2) return []
    const q = searchQuery.toLowerCase()
    const results = []

    allExams.filter(e => e.name?.toLowerCase().includes(q) || e.category?.toLowerCase().includes(q) || e.conductedBy?.toLowerCase().includes(q))
      .slice(0, 5).forEach(e => results.push({ type: 'Exam', label: e.name, link: `/entrance-exams/${e.id}` }))

    colleges.filter(c => c.name?.toLowerCase().includes(q) || c.shortName?.toLowerCase().includes(q) || c.city?.toLowerCase().includes(q))
      .slice(0, 5).forEach(c => results.push({ type: 'College', label: c.shortName || c.name, link: `/colleges/${c.id}` }))

    statesData.filter(s => s.name?.toLowerCase().includes(q))
      .slice(0, 3).forEach(s => results.push({ type: 'State', label: s.name, link: `/states/${s.id}` }))

    schoolEntranceExams.filter(e => e.name?.toLowerCase().includes(q))
      .slice(0, 3).forEach(e => results.push({ type: 'School', label: e.name, link: '/school-exams' }))

    careerPaths.filter(c => c.name?.toLowerCase().includes(q))
      .slice(0, 3).forEach(c => results.push({ type: 'Career', label: c.name, link: '/career-paths' }))

    return results
  }, [searchQuery])

  // Login & Register pages render their own full-page layout
  const isAuthPage = ['/login', '/register'].includes(location.pathname)
  if (isAuthPage) return <>{children}</>
  if (!user) return <>{children}</>

  const handleLogout = () => {
    logout()
    navigate('/login')
    setMenuOpen(false)
    setDropdownOpen(false)
  }

  const handleSearchSelect = (link) => {
    setSearchQuery('')
    setSearchFocused(false)
    navigate(link)
  }

  // Password change
  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setPwMsg({ ok: '', err: '' })
    if (pwForm.newPw.length < 8) { setPwMsg({ ok: '', err: 'New password must be at least 8 characters' }); return }
    if (pwForm.newPw !== pwForm.confirm) { setPwMsg({ ok: '', err: 'New passwords do not match' }); return }
    setPwLoading(true)
    const res = await api.post('/api/change-password', { current_password: pwForm.current, new_password: pwForm.newPw }, token)
    setPwLoading(false)
    if (res.error) setPwMsg({ ok: '', err: res.error })
    else {
      setPwMsg({ ok: 'Password changed successfully!', err: '' })
      setPwForm({ current: '', newPw: '', confirm: '' })
      setTimeout(() => setSettingsOpen(false), 1500)
    }
  }

  const userInitial = (user.first_name || user.email || '?')[0].toUpperCase()

  return (
    <div className="app-layout">
      {/* Main Header */}
      <header className="header">
        <div className="header-inner">
          <Link to="/" className="logo" style={{textDecoration:'none', display:'flex', alignItems:'center', gap: 10}}>
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:36, height:36}}>
              <circle cx="20" cy="20" r="18" fill="#f9a825" opacity="0.2"/>
              <path d="M20 6L8 14v12l12 8 12-8V14L20 6z" fill="#f9a825" opacity="0.3"/>
              <path d="M20 10l-8 5.5v9L20 30l8-5.5v-9L20 10z" fill="white"/>
              <path d="M16 18h8M16 21h6M16 24h4" stroke="#f9a825" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Vidya <span>Maarg</span>
          </Link>

          {/* Header Search */}
          <div className="header-search" ref={searchRef}>
            <span className="header-search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search exams, colleges, states..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
            />
            {searchFocused && searchQuery.length >= 2 && (
              <div className="header-search-results">
                {searchResults.length > 0 ? searchResults.map((r, i) => (
                  <a key={i} href="#" onClick={(e) => { e.preventDefault(); handleSearchSelect(r.link) }}>
                    <span className="hsr-type">{r.type}</span>
                    <span>{r.label}</span>
                  </a>
                )) : (
                  <div className="hsr-empty">No results for "{searchQuery}"</div>
                )}
                {searchResults.length > 0 && (
                  <a href="#" onClick={(e) => { e.preventDefault(); handleSearchSelect('/search') }} style={{justifyContent:'center', fontWeight:600, color:'var(--primary)', fontSize:'0.84rem'}}>
                    View all results →
                  </a>
                )}
              </div>
            )}
          </div>

          {/* User Dropdown */}
          <div className={`user-dropdown-wrap${dropdownOpen ? ' user-dropdown-open' : ''}`} ref={dropdownRef}>
            <div className="user-dropdown-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
              <span className="user-dropdown-name">{user.first_name || user.email}</span>
              <span className="user-dropdown-arrow">▼</span>
            </div>

            {dropdownOpen && (
              <div className="user-dropdown-menu">
                <div className="user-dropdown-menu-header">
                  <strong>{user.first_name} {user.last_name}</strong>
                  <p>{user.email}</p>
                </div>
                <button onClick={() => { setSettingsOpen(true); setDropdownOpen(false); setPwMsg({ ok: '', err: '' }); setPwForm({ current: '', newPw: '', confirm: '' }) }}>
                  <span className="dropdown-icon">🔒</span> Change Password
                </button>
                <button className="dropdown-logout" onClick={handleLogout}>
                  <span className="dropdown-icon">🚪</span> Sign Out
                </button>
              </div>
            )}
          </div>

          <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? '\u2715' : '\u2630'}
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
          <Link to="/build-profile" className={`nav-highlight ${isActive('/build-profile')}`} onClick={() => setMenuOpen(false)}>
            Build Profile
          </Link>
          <Link to="/my-path" className={`nav-highlight ${isActive('/my-path')}`} onClick={() => setMenuOpen(false)}>
            My Path
          </Link>
        </div>
      </nav>

      <main className="main-content">{children}</main>

      <footer className="footer">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-logo">
              <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:32, height:32}}>
                <circle cx="20" cy="20" r="18" fill="#f9a825" opacity="0.3"/>
                <path d="M20 6L8 14v12l12 8 12-8V14L20 6z" fill="#f9a825" opacity="0.4"/>
                <path d="M20 10l-8 5.5v9L20 30l8-5.5v-9L20 10z" fill="#1a237e"/>
                <path d="M16 18h8M16 21h6M16 24h4" stroke="#f9a825" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span className="footer-brand-name">Vidya Maarg</span>
            </div>
            <p className="footer-tagline">Illuminating every student's path forward</p>
          </div>

          <div className="footer-section">
            <h4>About Us</h4>
            <p>We are a bunch of <strong>innocently foolish optimists</strong> who believe every student in India deserves clear, honest guidance — from nursery to PhD. Vidya Maarg was built with love to simplify the maze of entrance exams, colleges, and career options.</p>
          </div>

          <div className="footer-section">
            <h4>Contact Us</h4>
            <p>Have questions, feedback, or just want to say hello?</p>
            <p className="footer-contact-item">Email: <a href="mailto:vidyamaarg.help@gmail.com">vidyamaarg.help@gmail.com</a></p>
            <p className="footer-contact-item">Built with care from India</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-credits">&copy; {new Date().getFullYear()} Vidya Maarg. All rights reserved.</p>
        </div>
      </footer>

      {/* Settings Modal */}
      {settingsOpen && (
        <div className="settings-overlay" onClick={(e) => { if (e.target === e.currentTarget) setSettingsOpen(false) }}>
          <div className="settings-modal">
            <div className="settings-modal-header">
              <h2>Settings</h2>
              <button className="settings-modal-close" onClick={() => setSettingsOpen(false)}>&times;</button>
            </div>
            <div className="settings-modal-body">
              <h3 style={{marginBottom: 16, fontSize: '1rem', color: 'var(--text-primary)'}}>Change Password</h3>
              {pwMsg.ok && <div className="settings-msg-ok">{pwMsg.ok}</div>}
              {pwMsg.err && <div className="settings-msg-err">{pwMsg.err}</div>}
              <form onSubmit={handlePasswordChange}>
                <div className="field">
                  <label>Current Password</label>
                  <input type="password" value={pwForm.current} onChange={e => setPwForm(p => ({...p, current: e.target.value}))} placeholder="Enter current password" required />
                </div>
                <div className="field">
                  <label>New Password</label>
                  <input type="password" value={pwForm.newPw} onChange={e => setPwForm(p => ({...p, newPw: e.target.value}))} placeholder="Min 8 characters" required />
                </div>
                <div className="field">
                  <label>Confirm New Password</label>
                  <input type="password" value={pwForm.confirm} onChange={e => setPwForm(p => ({...p, confirm: e.target.value}))} placeholder="Re-enter new password" required />
                </div>
                <button type="submit" className="btn-save" disabled={pwLoading}>
                  {pwLoading ? 'Saving...' : 'Change Password'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
