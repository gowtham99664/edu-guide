import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { api } from "../utils/api"

const EXAMS = ["JEE Advanced", "JEE Main", "NEET UG", "BITSAT", "MHT CET", "KCET", "WBJEE", "AP EAMCET", "TS EAMCET"]
const CATEGORIES_LIST = ["General", "OBC-NCL", "SC", "ST", "EWS"]

const EXAM_INPUT = {
  "JEE Advanced": { field: "rank", label: "Your All India Rank", placeholder: "e.g. 5000", step: "1" },
  "JEE Main": { field: "percentile", label: "Your Percentile", placeholder: "e.g. 95.5", step: "0.01" },
  "NEET UG": { field: "score", label: "Your Score", placeholder: "e.g. 620", step: "1" },
  "BITSAT": { field: "score", label: "Your Score", placeholder: "e.g. 320", step: "1" },
  "MHT CET": { field: "percentile", label: "Your Percentile", placeholder: "e.g. 92.0", step: "0.01" },
  "KCET": { field: "rank", label: "Your Rank", placeholder: "e.g. 8000", step: "1" },
  "WBJEE": { field: "rank", label: "Your Rank", placeholder: "e.g. 5000", step: "1" },
  "AP EAMCET": { field: "rank", label: "Your Rank", placeholder: "e.g. 10000", step: "1" },
  "TS EAMCET": { field: "rank", label: "Your Rank", placeholder: "e.g. 10000", step: "1" },
}

export default function CollegePredictor() {
  const { token } = useAuth()
  const [exam, setExam] = useState("JEE Main")
  const [value, setValue] = useState("")
  const [category, setCategory] = useState("General")
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [sortAsc, setSortAsc] = useState(true)

  const inputConfig = EXAM_INPUT[exam] || { field: "rank", label: "Your Rank", placeholder: "e.g. 5000", step: "1" }

  const handleExamChange = (newExam) => {
    setExam(newExam)
    setValue("")
    setResults(null)
    setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!value) { setError("Please enter your " + inputConfig.field + "."); return }
    setError("")
    setLoading(true)
    setResults(null)
    const payload = { exam, category, [inputConfig.field]: Number(value) }
    const res = await api.post("/api/predict-college", payload, token)
    setLoading(false)
    if (res.error) { setError(res.error); return }
    if (Array.isArray(res)) setResults(res)
    else if (Array.isArray(res.predictions)) setResults(res.predictions)
    else if (Array.isArray(res.results)) setResults(res.results)
    else if (Array.isArray(res.matches)) setResults(res.matches)
    else setResults([])
  }

  const sorted = results ? [...results].sort((a, b) => {
    if (inputConfig.field === "percentile") {
      const aVal = a.cutoffPercentile || 0
      const bVal = b.cutoffPercentile || 0
      return sortAsc ? bVal - aVal : aVal - bVal
    }
    if (inputConfig.field === "score") {
      const aVal = a.cutoffScore || 0
      const bVal = b.cutoffScore || 0
      return sortAsc ? bVal - aVal : aVal - bVal
    }
    const aVal = a.closeRank || a.closing_rank || a.cutoff || 0
    const bVal = b.closeRank || b.closing_rank || b.cutoff || 0
    return sortAsc ? aVal - bVal : bVal - aVal
  }) : null

  const renderCutoffHeader = () => {
    if (inputConfig.field === "percentile") return <><th>Cutoff Percentile</th><th>Quota</th><th>Chance</th></>
    if (inputConfig.field === "score") return <><th>Cutoff Score</th><th>Chance</th></>
    return <><th>Opening Rank</th><th>Closing Rank</th><th>Chance</th></>
  }

  const renderCutoffCells = (r) => {
    if (inputConfig.field === "percentile") return <><td>{r.cutoffPercentile != null ? r.cutoffPercentile : "-"}</td><td>{r.quota || "-"}</td><td><span className={"badge " + (r.chance === "High" ? "badge-success" : "badge-warning")}>{r.chance || "-"}</span></td></>
    if (inputConfig.field === "score") return <><td>{r.cutoffScore != null ? r.cutoffScore : "-"}</td><td><span className={"badge " + (r.chance === "High" ? "badge-success" : "badge-warning")}>{r.chance || "-"}</span></td></>
    return <><td>{r.openRank != null ? r.openRank : r.opening_rank != null ? r.opening_rank : "-"}</td><td>{r.closeRank != null ? r.closeRank : r.closing_rank != null ? r.closing_rank : "-"}</td><td><span className={"badge " + (r.chance === "High" ? "badge-success" : "badge-warning")}>{r.chance || "-"}</span></td></>
  }

  return (
    <div>
      <div className="section-header">
        <h1>College Predictor</h1>
        <p>Enter your exam, rank/percentile/score, and category to find colleges you may be eligible for based on previous year cutoffs.</p>
      </div>

      <div className="card cp-form-card">
        <form onSubmit={handleSubmit} className="cp-form">
          <div className="cp-form-grid">
            <div className="field">
              <label>Select Exam</label>
              <select className="filter-select" value={exam} onChange={e => handleExamChange(e.target.value)}>
                {EXAMS.map(ex => <option key={ex} value={ex}>{ex}</option>)}
              </select>
            </div>
            <div className="field">
              <label>{inputConfig.label}</label>
              <input type="number" value={value} onChange={e => setValue(e.target.value)} placeholder={inputConfig.placeholder} step={inputConfig.step} min="0" required />
            </div>
            <div className="field">
              <label>Category</label>
              <select className="filter-select" value={category} onChange={e => setCategory(e.target.value)}>
                {CATEGORIES_LIST.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          {error && <div className="settings-msg-err">{error}</div>}
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: 12 }}>
            {loading ? "Predicting..." : "Predict Colleges"}
          </button>
        </form>
      </div>

      {sorted && (
        <div className="card" style={{ marginTop: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h2 style={{ fontSize: "1.1rem", margin: 0 }}>Results ({sorted.length})</h2>
            {sorted.length > 0 && (
              <button className="filter-btn" onClick={() => setSortAsc(s => !s)} style={{ fontSize: "0.82rem" }}>
                Sort {sortAsc ? "Desc" : "Asc"}
              </button>
            )}
          </div>
          {sorted.length === 0 ? (
            <p style={{ color: "var(--text-secondary)" }}>No colleges found for given criteria. Try adjusting your input or category.</p>
          ) : (
            <div className="aec-table-wrap">
              <table className="aec-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>College</th>
                    <th>Branch / Program</th>
                    {renderCutoffHeader()}
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((r, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td><strong>{r.college || r.college_name || "-"}</strong></td>
                      <td>{r.branch || r.program || "-"}</td>
                      {renderCutoffCells(r)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <div className="card" style={{ background: "#fff8e1", borderLeft: "4px solid #f9a825", marginTop: "1.5rem" }}>
        <p style={{ margin: 0, fontSize: "0.9rem", lineHeight: 1.6 }}>
          <strong>Disclaimer:</strong> Predictions are based on previous year cutoffs and are indicative only. Actual cutoffs vary each year. Always verify from official counselling portals.
        </p>
      </div>
    </div>
  )
}
