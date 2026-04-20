import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Layout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const isActive = (path) => location.pathname === path ? 'active' : ''

  return (
    <div className="app-layout">
      <header className="header">
        <div className="header-inner">
          <Link to="/" className="logo" style={{textDecoration:'none'}}>
            EduGuide <span>India</span>
          </Link>
          <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? '\u2715' : '\u2630'}
          </button>
          <nav className={`nav ${menuOpen ? 'open' : ''}`}>
            <Link to="/" className={isActive('/')} onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to="/school-exams" className={isActive('/school-exams')} onClick={() => setMenuOpen(false)}>School Exams</Link>
            <Link to="/entrance-exams" className={isActive('/entrance-exams')} onClick={() => setMenuOpen(false)}>Entrance Exams</Link>
            <Link to="/colleges" className={isActive('/colleges')} onClick={() => setMenuOpen(false)}>Colleges</Link>
            <Link to="/states" className={isActive('/states')} onClick={() => setMenuOpen(false)}>States</Link>
            <Link to="/career-paths" className={isActive('/career-paths')} onClick={() => setMenuOpen(false)}>Career Paths</Link>
            <Link to="/timeline" className={isActive('/timeline')} onClick={() => setMenuOpen(false)}>Prep Timeline</Link>
            <Link to="/scholarships" className={isActive('/scholarships')} onClick={() => setMenuOpen(false)}>Scholarships</Link>
            <Link to="/cutoffs" className={isActive('/cutoffs')} onClick={() => setMenuOpen(false)}>Cutoffs</Link>
            <Link to="/govt-jobs" className={isActive('/govt-jobs')} onClick={() => setMenuOpen(false)}>Govt Jobs</Link>
            <Link to="/internships" className={isActive('/internships')} onClick={() => setMenuOpen(false)}>Internships</Link>
            <Link to="/search" className={isActive('/search')} onClick={() => setMenuOpen(false)}>Search</Link>
          </nav>
        </div>
      </header>
      <main className="main-content">{children}</main>
      <footer className="footer">
        <p>EduGuide India - Comprehensive Student Guidance Portal | Data compiled from official sources (NIRF, UGC, NTA, UPSC, State Education Departments)</p>
        <p style={{marginTop: 4, fontSize:'0.8rem'}}>Disclaimer: Please verify all information from official websites before making decisions. Rankings and data may change annually.</p>
      </footer>
    </div>
  )
}
