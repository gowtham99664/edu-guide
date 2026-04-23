import { useState, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import engineeringExams from '../data/engineeringExams'
import { medicalExams, lawExams, managementExams } from '../data/otherExams'
import { designExams, architectureExams, agricultureExams, teachingExams, professionalExams, researchExams, culinaryExams, horticultureExams } from '../data/moreExams'

const allExams = [
  ...engineeringExams, ...medicalExams, ...lawExams, ...managementExams,
  ...designExams, ...architectureExams,
  ...agricultureExams, ...teachingExams, ...professionalExams,
  ...researchExams, ...culinaryExams, ...horticultureExams
]

const categories = [...new Set(allExams.map(e => e.category))].sort()
const levels = [...new Set(allExams.map(e => e.level).filter(Boolean))].sort()

export default function EntranceExams() {
  const [searchParams] = useSearchParams()
  const initialCat = searchParams.get('category') || ''
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState(initialCat)
  const [level, setLevel] = useState('')
  const [examId, setExamId] = useState('')
  const [page, setPage] = useState(1)
  const perPage = 12

  const filtered = useMemo(() => {
    return allExams.filter(e => {
      if (category && e.category !== category) return false
      if (level && e.level !== level) return false
      if (examId && e.id !== examId) return false
      if (search) {
        const s = search.toLowerCase()
        return (e.name?.toLowerCase().includes(s) || e.category?.toLowerCase().includes(s) ||
                e.conductedBy?.toLowerCase().includes(s) || e.subcategory?.toLowerCase().includes(s) ||
                e.id?.toLowerCase().includes(s))
      }
      return true
    })
  }, [search, category, level, examId])

  const totalPages = Math.ceil(filtered.length / perPage)
  const paged = filtered.slice((page - 1) * perPage, page * perPage)

  const clearFilters = () => { setSearch(''); setCategory(''); setLevel(''); setExamId(''); setPage(1); }

  return (
    <div>
      <div className="section-header">
        <h1>Entrance Exams</h1>
        <p>Comprehensive database of {allExams.length}+ entrance exams across all categories - Engineering, Medical, Law, Management, Design, Architecture, Agriculture, Teaching, and more.</p>
      </div>

      <div className="filters-bar">
        <div className="search-box">
          <input type="text" placeholder="Search exams by name, category, conducting body..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <div className="filter-group">
          <label>Category</label>
          <select className="filter-select" value={category} onChange={e => { setCategory(e.target.value); setPage(1); }}>
            <option value="">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <label>Level</label>
          <select className="filter-select" value={level} onChange={e => { setLevel(e.target.value); setPage(1); }}>
            <option value="">All Levels</option>
            {levels.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <label>Exam</label>
          <select className="filter-select" value={examId} onChange={e => { setExamId(e.target.value); setPage(1); }}>
            <option value="">All Exams</option>
            {allExams.map(ex => <option key={ex.id} value={ex.id}>{ex.name}</option>)}
          </select>
        </div>
        <button className="filter-btn clear" onClick={clearFilters}>Clear</button>
      </div>

      <div className="results-count">Showing <strong>{paged.length}</strong> of <strong>{filtered.length}</strong> exams</div>

      <div className="card-grid">
        {paged.map(exam => (
          <div key={exam.id} className="card exam-card">
            <div className="exam-name">{exam.name}</div>
            <div className="exam-body">{exam.conductedBy}</div>
            <div className="exam-meta">
              <span className="badge badge-primary">{exam.category}</span>
              {exam.subcategory && <span className="badge badge-info">{exam.subcategory}</span>}
              {exam.level && <span className="badge badge-purple">{exam.level}</span>}
              {exam.frequency && <span className="badge badge-success">{exam.frequency}</span>}
            </div>
            {exam.eligibility && <p style={{fontSize:'0.85rem', marginTop:10, color:'var(--text-light)'}}><strong>Eligibility:</strong> {typeof exam.eligibility === 'string' ? exam.eligibility.substring(0, 120) + (exam.eligibility.length > 120 ? '...' : '') : ''}</p>}
            {exam.examMonth && <p style={{fontSize:'0.85rem', marginTop:4}}><strong>Exam Month:</strong> {exam.examMonth}</p>}
            <div className="exam-link">
              <Link to={`/entrance-exams/${exam.id}`}>View Full Details &rarr;</Link>
              {exam.website && <> | <a href={exam.website} target="_blank" rel="noopener noreferrer">Official Website</a></>}
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>&laquo; Prev</button>
          <select className="filter-select" style={{ minWidth: 110 }} value={page} onChange={e => setPage(Number(e.target.value))}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <option key={p} value={p}>Page {p}</option>
            ))}
          </select>
          <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next &raquo;</button>
        </div>
      )}
    </div>
  )
}
