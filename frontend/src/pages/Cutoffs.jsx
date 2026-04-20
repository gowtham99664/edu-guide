import { useState, useMemo } from 'react'
import cutoffs from '../data/cutoffs'

const examOptions = cutoffs.map(e => ({ id: e.id, name: e.examName }))
const categoryOptions = ['General', 'OBC-NCL', 'SC', 'ST', 'EWS']

export default function Cutoffs() {
  const [selectedExam, setSelectedExam] = useState(cutoffs[0]?.id || '')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [search, setSearch] = useState('')
  const [sortField, setSortField] = useState('')
  const [sortDir, setSortDir] = useState('asc')

  const currentExam = cutoffs.find(e => e.id === selectedExam)

  const filtered = useMemo(() => {
    if (!currentExam) return []
    let rows = currentExam.data
    if (categoryFilter) {
      rows = rows.filter(r => r.category === categoryFilter)
    }
    if (search) {
      const s = search.toLowerCase()
      rows = rows.filter(r =>
        r.college?.toLowerCase().includes(s) ||
        r.branch?.toLowerCase().includes(s) ||
        r.notes?.toLowerCase().includes(s)
      )
    }
    if (sortField) {
      rows = [...rows].sort((a, b) => {
        const av = a[sortField]
        const bv = b[sortField]
        if (av == null && bv == null) return 0
        if (av == null) return 1
        if (bv == null) return -1
        if (typeof av === 'number' && typeof bv === 'number') {
          return sortDir === 'asc' ? av - bv : bv - av
        }
        const cmp = String(av).localeCompare(String(bv))
        return sortDir === 'asc' ? cmp : -cmp
      })
    }
    return rows
  }, [currentExam, categoryFilter, search, sortField, sortDir])

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDir('asc')
    }
  }

  const sortIcon = (field) => {
    if (sortField !== field) return ' ↕'
    return sortDir === 'asc' ? ' ↑' : ' ↓'
  }

  // Determine which value columns this exam uses
  const hasRank = currentExam?.data.some(r => r.openRank != null)
  const hasPercentile = currentExam?.data.some(r => r.cutoffPercentile != null)
  const hasScore = currentExam?.data.some(r => r.cutoffScore != null)
  const hasQuota = currentExam?.data.some(r => r.quota != null)

  return (
    <div>
      <div className="section-header">
        <h1>Exam Cutoffs</h1>
        <p>Latest cutoff data for all major Indian entrance exams — JEE, NEET, CLAT, CAT, GATE, CUET, CA and more. Filter by exam, category, or search by college name.</p>
      </div>

      {/* Disclaimer */}
      <div className="card" style={{ background: '#fff8e1', borderLeft: '4px solid #f9a825', marginBottom: '1.5rem' }}>
        <p style={{ margin: 0, fontSize: '0.92rem', lineHeight: 1.6 }}>
          <strong>⚠️ Disclaimer:</strong> Cutoff data is sourced from official counselling/admission portals. Actual cutoffs may vary by round and year. Data shown is from the latest available year (2024). <strong>Please verify from official sources before making decisions.</strong>
        </p>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="filter-group">
          <label>Select Exam</label>
          <select className="filter-select" value={selectedExam} onChange={e => { setSelectedExam(e.target.value); setSearch(''); setCategoryFilter(''); setSortField(''); }}>
            {examOptions.map(ex => (
              <option key={ex.id} value={ex.id}>{ex.name}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>Category</label>
          <select className="filter-select" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
            <option value="">All Categories</option>
            {categoryOptions.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="search-box">
          <input type="text" placeholder="Search by college or branch name..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {/* Exam Info Card */}
      {currentExam && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ margin: '0 0 0.3rem 0' }}>{currentExam.examName}</h2>
              <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>{currentExam.notes}</p>
            </div>
            <div style={{ textAlign: 'right', fontSize: '0.85rem', color: '#555' }}>
              <div><strong>Source:</strong> {currentExam.source}</div>
              <div><strong>Last Updated:</strong> {currentExam.lastUpdated}</div>
              <div><strong>Showing:</strong> {filtered.length} entries</div>
            </div>
          </div>
        </div>
      )}

      {/* Results count */}
      {filtered.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>
          <p>No cutoff data found matching your filters. Try adjusting the category or search.</p>
        </div>
      )}

      {/* Table */}
      {filtered.length > 0 && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.92rem' }}>
            <thead>
              <tr style={{ background: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
                <th style={thStyle} onClick={() => handleSort('college')}>
                  College / Institute{sortIcon('college')}
                </th>
                <th style={thStyle} onClick={() => handleSort('branch')}>
                  Branch / Program{sortIcon('branch')}
                </th>
                <th style={thStyle} onClick={() => handleSort('category')}>
                  Category{sortIcon('category')}
                </th>
                {hasQuota && (
                  <th style={thStyle} onClick={() => handleSort('quota')}>
                    Quota{sortIcon('quota')}
                  </th>
                )}
                {hasRank && (
                  <>
                    <th style={{ ...thStyle, textAlign: 'right' }} onClick={() => handleSort('openRank')}>
                      Opening Rank{sortIcon('openRank')}
                    </th>
                    <th style={{ ...thStyle, textAlign: 'right' }} onClick={() => handleSort('closeRank')}>
                      Closing Rank{sortIcon('closeRank')}
                    </th>
                  </>
                )}
                {hasPercentile && (
                  <th style={{ ...thStyle, textAlign: 'right' }} onClick={() => handleSort('cutoffPercentile')}>
                    Cutoff Percentile{sortIcon('cutoffPercentile')}
                  </th>
                )}
                {hasScore && (
                  <th style={{ ...thStyle, textAlign: 'right' }} onClick={() => handleSort('cutoffScore')}>
                    Cutoff Score{sortIcon('cutoffScore')}
                  </th>
                )}
                <th style={thStyle}>Notes</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #eee', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                  <td style={tdStyle}><strong>{row.college}</strong></td>
                  <td style={tdStyle}>{row.branch}</td>
                  <td style={tdStyle}>
                    <span style={{ ...categoryBadge(row.category) }}>{row.category}</span>
                  </td>
                  {hasQuota && (
                    <td style={tdStyle}>
                      {row.quota && <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem', background: row.quota === 'HS' ? '#e3f2fd' : '#fff3e0', color: row.quota === 'HS' ? '#1565c0' : '#e65100' }}>{row.quota}</span>}
                    </td>
                  )}
                  {hasRank && (
                    <>
                      <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 600 }}>{row.openRank != null ? row.openRank.toLocaleString() : '—'}</td>
                      <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 600 }}>{row.closeRank != null ? row.closeRank.toLocaleString() : '—'}</td>
                    </>
                  )}
                  {hasPercentile && (
                    <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 600 }}>{row.cutoffPercentile != null ? row.cutoffPercentile.toFixed(2) : '—'}</td>
                  )}
                  {hasScore && (
                    <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 600 }}>{row.cutoffScore != null ? row.cutoffScore : '—'}</td>
                  )}
                  <td style={{ ...tdStyle, fontSize: '0.82rem', color: '#777', maxWidth: '200px' }}>{row.notes || ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer info */}
      <div className="card" style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: '#888' }}>
        <p style={{ margin: '0 0 0.5rem 0' }}><strong>How to use:</strong> Select an exam from the dropdown, filter by reservation category, and search for specific colleges. Click column headers to sort.</p>
        <p style={{ margin: 0 }}>
          <strong>Abbreviations:</strong> HS = Home State quota, OS = Other State quota, OBC-NCL = Other Backward Classes (Non-Creamy Layer), SC = Scheduled Caste, ST = Scheduled Tribe, EWS = Economically Weaker Section.
        </p>
      </div>
    </div>
  )
}

const thStyle = {
  padding: '10px 12px',
  textAlign: 'left',
  fontWeight: 600,
  cursor: 'pointer',
  userSelect: 'none',
  whiteSpace: 'nowrap',
  fontSize: '0.85rem',
  color: '#444',
}

const tdStyle = {
  padding: '8px 12px',
  verticalAlign: 'top',
}

function categoryBadge(cat) {
  const colors = {
    'General': { background: '#e8f5e9', color: '#2e7d32' },
    'OBC-NCL': { background: '#fff3e0', color: '#e65100' },
    'SC': { background: '#e3f2fd', color: '#1565c0' },
    'ST': { background: '#f3e5f5', color: '#7b1fa2' },
    'EWS': { background: '#fce4ec', color: '#c62828' },
  }
  const c = colors[cat] || { background: '#f5f5f5', color: '#666' }
  return { padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 500, ...c }
}
