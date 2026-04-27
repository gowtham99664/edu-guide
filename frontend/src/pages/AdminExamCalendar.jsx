import { useState, useEffect, useMemo } from "react"
import { useAuth } from "../context/AuthContext"
import { api } from "../utils/api"

const CATEGORIES = ["Engineering", "Medical", "Law", "Management", "School"]
const EVENT_TYPES = ["application", "exam", "result", "counselling"]
const TYPE_LABELS = { application: "Application", exam: "Exam", result: "Result", counselling: "Counselling" }
const TYPE_COLORS = { application: "#2e7d32", exam: "#c62828", result: "#1565c0", counselling: "#e65100" }
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"]
const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]

const emptyForm = { exam_name: "", date: "", event_type: "exam", category: "Engineering", description: "" }

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

export default function AdminExamCalendar() {
  const { token } = useAuth()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ ...emptyForm })
  const [editing, setEditing] = useState(null)
  const [msg, setMsg] = useState({ ok: "", err: "" })
  const [bulkJson, setBulkJson] = useState("")
  const [bulkMsg, setBulkMsg] = useState({ ok: "", err: "" })
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [viewMonth, setViewMonth] = useState(() => new Date().getMonth())
  const [viewYear, setViewYear] = useState(() => new Date().getFullYear())
  const [selectedDay, setSelectedDay] = useState(null)
  const [rightPanel, setRightPanel] = useState("details")

  const load = async () => {
    setLoading(true)
    const res = await api.get("/api/exam-calendar", token)
    if (!res.error && Array.isArray(res)) setEvents(res)
    else if (!res.error && Array.isArray(res.events)) setEvents(res.events)
    setLoading(false)
  }

  useEffect(() => { load() }, [token])

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMsg({ ok: "", err: "" })
    if (!form.exam_name || !form.date) { setMsg({ ok: "", err: "Exam name and date are required." }); return }
    if (editing) {
      const res = await api.post(`/api/exam-calendar/${editing}`, form, token)
      if (res.error) { setMsg({ ok: "", err: res.error }); return }
      setMsg({ ok: "Event updated successfully.", err: "" })
      setEditing(null)
    } else {
      const res = await api.post("/api/exam-calendar", form, token)
      if (res.error) { setMsg({ ok: "", err: res.error }); return }
      setMsg({ ok: "Event added successfully.", err: "" })
    }
    setForm({ ...emptyForm })
    load()
  }

  const startEdit = (ev) => {
    setEditing(ev.id || ev._id)
    setForm({
      exam_name: ev.exam_name || "",
      date: ev.date ? ev.date.slice(0, 10) : "",
      event_type: ev.event_type || "exam",
      category: ev.category || "Engineering",
      description: ev.description || "",
    })
    setMsg({ ok: "", err: "" })
    setRightPanel("add")
  }

  const cancelEdit = () => { setEditing(null); setForm({ ...emptyForm }); setMsg({ ok: "", err: "" }) }

  const handleDelete = async (id) => {
    const res = await api.post(`/api/exam-calendar/${id}/delete`, {}, token)
    if (res.error) { setMsg({ ok: "", err: res.error }); return }
    setConfirmDelete(null)
    load()
  }

  const handleBulk = async () => {
    setBulkMsg({ ok: "", err: "" })
    let parsed
    try { parsed = JSON.parse(bulkJson) } catch { setBulkMsg({ ok: "", err: "Invalid JSON." }); return }
    if (!Array.isArray(parsed) || parsed.length === 0) { setBulkMsg({ ok: "", err: "JSON must be a non-empty array." }); return }
    const res = await api.post("/api/exam-calendar/bulk", { events: parsed }, token)
    if (res.error) { setBulkMsg({ ok: "", err: res.error }); return }
    setBulkMsg({ ok: `Added ${parsed.length} events.`, err: "" })
    setBulkJson("")
    load()
  }

  const calendarDays = useMemo(() => {
    const first = new Date(viewYear, viewMonth, 1)
    const lastDay = new Date(viewYear, viewMonth + 1, 0).getDate()
    const startDay = first.getDay()
    const days = []
    for (let i = 0; i < startDay; i++) days.push(null)
    for (let d = 1; d <= lastDay; d++) days.push(d)
    return days
  }, [viewMonth, viewYear])

  const eventsInMonth = useMemo(() => {
    return events.filter(e => {
      const d = new Date(e.date)
      return d.getMonth() === viewMonth && d.getFullYear() === viewYear
    })
  }, [events, viewMonth, viewYear])

  const eventsOnDay = (day) => {
    if (!day) return []
    const target = new Date(viewYear, viewMonth, day)
    return eventsInMonth.filter(e => isSameDay(new Date(e.date), target))
  }

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) } else setViewMonth(m => m - 1)
    setSelectedDay(null)
  }
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) } else setViewMonth(m => m + 1)
    setSelectedDay(null)
  }

  const handleDayClick = (day) => {
    if (!day) return
    setSelectedDay(day === selectedDay ? null : day)
    setRightPanel("details")
  }

  const selectedDayEvents = selectedDay ? eventsOnDay(selectedDay) : []

  const handleAddForDay = () => {
    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(selectedDay).padStart(2, "0")}`
    setForm({ ...emptyForm, date: dateStr })
    setEditing(null)
    setRightPanel("add")
  }

  return (
    <div>
      <div className="section-header">
        <h1>Admin: Exam Calendar</h1>
        <p>Click a date to view/manage events. Use the right panel to add, edit, or bulk import.</p>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <button className={`btn ${rightPanel === "add" && !editing ? "btn-primary" : "btn-outline"}`} onClick={() => { setRightPanel("add"); setEditing(null); setForm({ ...emptyForm }); setMsg({ ok: "", err: "" }) }}>Add Event</button>
        <button className={`btn ${rightPanel === "bulk" ? "btn-primary" : "btn-outline"}`} onClick={() => setRightPanel("bulk")}>Bulk Add</button>
      </div>

      <div className="aec-split-layout">
        <div className="aec-split-left">
          <div className="ec-calendar-header">
            <button className="ec-nav-btn" onClick={prevMonth}>&lt;</button>
            <h2>{MONTHS[viewMonth]} {viewYear}</h2>
            <button className="ec-nav-btn" onClick={nextMonth}>&gt;</button>
          </div>
          <div className="ec-calendar-grid">
            {DAYS.map(d => <div key={d} className="ec-day-label">{d}</div>)}
            {calendarDays.map((day, i) => {
              const dayEvents = eventsOnDay(day)
              const isToday = day && isSameDay(new Date(viewYear, viewMonth, day), new Date())
              const isSelected = day === selectedDay
              return (
                <div key={i} className={`ec-day-cell${!day ? " empty" : ""}${isToday ? " today" : ""}${isSelected ? " selected" : ""}${dayEvents.length ? " has-events" : ""}`} onClick={() => handleDayClick(day)}>
                  {day && <span className="ec-day-num">{day}</span>}
                  {dayEvents.length > 0 && (
                    <div className="ec-day-dots">
                      {dayEvents.slice(0, 3).map((ev, j) => <span key={j} className="ec-dot" style={{ background: TYPE_COLORS[ev.event_type] || "#999" }}></span>)}
                      {dayEvents.length > 3 && <span className="ec-dot-more">+{dayEvents.length - 3}</span>}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          <div style={{ marginTop: 12, fontSize: "0.85rem", color: "var(--text-secondary)" }}>
            {eventsInMonth.length} event{eventsInMonth.length !== 1 ? "s" : ""} in {MONTHS[viewMonth]}
          </div>
        </div>

        <div className="aec-split-right">
          {rightPanel === "details" && (
            <>
              {selectedDay ? (
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <h3 style={{ margin: 0 }}>{selectedDay} {MONTHS[viewMonth]} {viewYear}</h3>
                    <button className="btn btn-primary" style={{ fontSize: "0.82rem", padding: "6px 14px" }} onClick={handleAddForDay}>+ Add Event</button>
                  </div>
                  {selectedDayEvents.length === 0 ? (
                    <p style={{ color: "var(--text-secondary)" }}>No events on this day.</p>
                  ) : (
                    <div className="aec-day-events">
                      {selectedDayEvents.map((ev, i) => {
                        const id = ev.id || ev._id
                        return (
                          <div key={i} className="ec-event-row" style={{ borderLeftColor: TYPE_COLORS[ev.event_type] || "#999" }}>
                            <div className="ec-event-info">
                              <strong>{ev.exam_name}</strong>
                              <span className="ec-type-badge" style={{ background: TYPE_COLORS[ev.event_type] || "#999" }}>{TYPE_LABELS[ev.event_type] || ev.event_type}</span>
                              {ev.category && <span className="badge badge-primary">{ev.category}</span>}
                              {ev.description && <p style={{ margin: "4px 0 0", fontSize: "0.85rem", color: "var(--text-secondary)" }}>{ev.description}</p>}
                            </div>
                            <div className="aec-actions">
                              <button className="aec-btn-edit" onClick={() => startEdit(ev)}>Edit</button>
                              {confirmDelete === id ? (
                                <>
                                  <button className="aec-btn-delete confirm" onClick={() => handleDelete(id)}>Confirm</button>
                                  <button className="aec-btn-cancel" onClick={() => setConfirmDelete(null)}>No</button>
                                </>
                              ) : (
                                <button className="aec-btn-delete" onClick={() => setConfirmDelete(id)}>Delete</button>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--text-secondary)" }}>
                  <p style={{ fontSize: "1.1rem" }}>Select a date on the calendar to view events</p>
                  <p style={{ fontSize: "0.85rem" }}>Or use the buttons above to add/bulk import events</p>
                </div>
              )}
            </>
          )}

          {rightPanel === "add" && (
            <div>
              <h3 style={{ marginTop: 0 }}>{editing ? "Edit Event" : "Add Event"}</h3>
              {msg.ok && <div className="settings-msg-ok">{msg.ok}</div>}
              {msg.err && <div className="settings-msg-err">{msg.err}</div>}
              <form onSubmit={handleSubmit} className="aec-form">
                <div className="aec-form-grid">
                  <div className="field"><label>Exam Name *</label><input type="text" name="exam_name" value={form.exam_name} onChange={handleChange} placeholder="e.g. JEE Main 2026" required /></div>
                  <div className="field"><label>Date *</label><input type="date" name="date" value={form.date} onChange={handleChange} required /></div>
                  <div className="field"><label>Event Type</label><select name="event_type" value={form.event_type} onChange={handleChange} className="filter-select">{EVENT_TYPES.map(t => <option key={t} value={t}>{TYPE_LABELS[t]}</option>)}</select></div>
                  <div className="field"><label>Category</label><select name="category" value={form.category} onChange={handleChange} className="filter-select">{CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                  <div className="field" style={{ gridColumn: "1 / -1" }}><label>Description</label><input type="text" name="description" value={form.description} onChange={handleChange} placeholder="Optional description" /></div>
                </div>
                <div className="aec-form-actions">
                  <button type="submit" className="btn btn-primary">{editing ? "Update Event" : "Add Event"}</button>
                  {editing && <button type="button" className="btn btn-outline" onClick={cancelEdit}>Cancel</button>}
                </div>
              </form>
            </div>
          )}

          {rightPanel === "bulk" && (
            <div>
              <h3 style={{ marginTop: 0 }}>Bulk Add Events</h3>
              <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", marginBottom: 12 }}>Paste a JSON array. Each object needs: exam_name, date, event_type, category.</p>
              {bulkMsg.ok && <div className="settings-msg-ok">{bulkMsg.ok}</div>}
              {bulkMsg.err && <div className="settings-msg-err">{bulkMsg.err}</div>}
              <textarea className="aec-bulk-textarea" rows={8} value={bulkJson} onChange={e => setBulkJson(e.target.value)} placeholder='[{"exam_name":"JEE Main","date":"2026-04-15","event_type":"exam","category":"Engineering"}]' />
              <button className="btn btn-primary" onClick={handleBulk} style={{ marginTop: 10 }}>Submit Bulk</button>
            </div>
          )}
        </div>
      </div>

      <details className="card" style={{ marginTop: 24 }}>
        <summary style={{ cursor: "pointer", fontWeight: 600, fontSize: "1rem", padding: "12px 0" }}>All Events ({events.length}) - Click to expand</summary>
        {loading ? <p>Loading...</p> : events.length === 0 ? <p style={{ color: "var(--text-secondary)" }}>No events yet.</p> : (
          <div className="aec-table-wrap" style={{ marginTop: 12 }}>
            <table className="aec-table">
              <thead><tr><th>Exam Name</th><th>Date</th><th>Type</th><th>Category</th><th>Actions</th></tr></thead>
              <tbody>
                {events.map(ev => {
                  const id = ev.id || ev._id
                  return (
                    <tr key={id}>
                      <td><strong>{ev.exam_name}</strong></td>
                      <td>{ev.date ? ev.date.slice(0, 10) : ""}</td>
                      <td><span className="ec-type-badge" style={{ background: TYPE_COLORS[ev.event_type] || "#999" }}>{TYPE_LABELS[ev.event_type] || ev.event_type}</span></td>
                      <td>{ev.category}</td>
                      <td>
                        <div className="aec-actions">
                          <button className="aec-btn-edit" onClick={() => startEdit(ev)}>Edit</button>
                          {confirmDelete === id ? (
                            <><button className="aec-btn-delete confirm" onClick={() => handleDelete(id)}>Confirm</button><button className="aec-btn-cancel" onClick={() => setConfirmDelete(null)}>No</button></>
                          ) : (<button className="aec-btn-delete" onClick={() => setConfirmDelete(id)}>Delete</button>)}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </details>
    </div>
  )
}
