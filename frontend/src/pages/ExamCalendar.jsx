import { useState, useEffect, useMemo } from "react"
import { useAuth } from "../context/AuthContext"
import { api } from "../utils/api"

const CATEGORIES = ["Engineering", "Medical", "Law", "Management", "School"]
const TYPE_COLORS = { application: "#2e7d32", exam: "#c62828", result: "#1565c0", counselling: "#e65100" }
const TYPE_LABELS = { application: "Application", exam: "Exam", result: "Result", counselling: "Counselling" }
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"]
const DAYS = [{d:"Su",we:true},{d:"Mo",we:false},{d:"Tu",we:false},{d:"We",we:false},{d:"Th",we:false},{d:"Fr",we:false},{d:"Sa",we:true}]

function formatDate(d) {
  const dt = new Date(d)
  return dt.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
}

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

export default function ExamCalendar() {
  const { token } = useAuth()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [catFilter, setCatFilter] = useState("")
  const [viewMonth, setViewMonth] = useState(() => new Date().getMonth())
  const [viewYear, setViewYear] = useState(() => new Date().getFullYear())
  const [subscribed, setSubscribed] = useState(new Set())
  const [selectedDay, setSelectedDay] = useState(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const res = await api.get("/api/exam-calendar", token)
      if (!res.error && Array.isArray(res)) setEvents(res)
      else if (!res.error && Array.isArray(res.events)) setEvents(res.events)
      setLoading(false)
    }
    load()
  }, [token])

  const filtered = useMemo(() => {
    return events.filter(e => !catFilter || e.category === catFilter)
  }, [events, catFilter])

  const upcoming = useMemo(() => {
    const now = new Date()
    const limit = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
    return filtered
      .filter(e => { const d = new Date(e.date); return d >= now && d <= limit })
      .sort((a, b) => new Date(a.date) - new Date(b.date))
  }, [filtered])

  const eventsInMonth = useMemo(() => {
    return filtered.filter(e => {
      const d = new Date(e.date)
      return d.getMonth() === viewMonth && d.getFullYear() === viewYear
    })
  }, [filtered, viewMonth, viewYear])

  const calendarDays = useMemo(() => {
    const first = new Date(viewYear, viewMonth, 1)
    const lastDay = new Date(viewYear, viewMonth + 1, 0).getDate()
    const startDay = first.getDay()
    const days = []
    for (let i = 0; i < startDay; i++) days.push(null)
    for (let d = 1; d <= lastDay; d++) days.push(d)
    return days
  }, [viewMonth, viewYear])

  const eventsOnDay = (day) => {
    if (!day) return []
    const target = new Date(viewYear, viewMonth, day)
    return eventsInMonth.filter(e => isSameDay(new Date(e.date), target))
  }

  const toggleSubscribe = (examName) => {
    setSubscribed(prev => {
      const next = new Set(prev)
      if (next.has(examName)) next.delete(examName)
      else next.add(examName)
      return next
    })
  }

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) } else setViewMonth(m => m - 1)
    setSelectedDay(null)
  }
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) } else setViewMonth(m => m + 1)
    setSelectedDay(null)
  }

  if (loading) return <div className="page-loading">Loading exam calendar...</div>

  const selectedDayEvents = selectedDay ? eventsOnDay(selectedDay) : []

  const bellIcon = (active) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={active ? "#f9a825" : "none"} stroke={active ? "#f9a825" : "#64748b"} strokeWidth="2">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  )

  return (
    <div className="ec-page">
      {/* Compact header bar */}
      <div className="ec-page-header">
        <div className="ec-page-header-left">
          <h2>Exam Calendar</h2>
          <div className="ec-legend-inline">
            {Object.entries(TYPE_COLORS).map(([key, color]) => (
              <span key={key} className="ec-legend-item-sm">
                <span className="ec-legend-dot-sm" style={{ background: color }}></span>
                {TYPE_LABELS[key]}
              </span>
            ))}
          </div>
        </div>
        <div className="ec-page-header-right">
          <select className="filter-select" value={catFilter} onChange={e => setCatFilter(e.target.value)} style={{ minWidth: 140 }}>
            <option value="">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* 40/60 Split */}
      <div className="ec-split-layout">
        {/* Left: Calendar */}
        <div className="ec-split-left">
          <div className="ec-cal-nav">
            <button className="ec-nav-btn-sm" onClick={prevMonth}>&lsaquo;</button>
            <span className="ec-cal-month">{MONTHS[viewMonth]} {viewYear}</span>
            <button className="ec-nav-btn-sm" onClick={nextMonth}>&rsaquo;</button>
          </div>
          <div className="ec-cal-grid">
            {DAYS.map(d => <div key={d.d} className={"ec-cal-dlabel" + (d.we ? " weekend" : "")}>{d.d}</div>)}
            {calendarDays.map((day, i) => {
              const dayEvents = eventsOnDay(day)
              const isToday = day && isSameDay(new Date(viewYear, viewMonth, day), new Date())
              const isSelected = day === selectedDay
              return (
                <div
                  key={i}
                  className={"ec-cal-cell" + (!day ? " empty" : "") + (isToday ? " today" : "") + (isSelected ? " selected" : "") + (dayEvents.length ? " has-events" : "")}
                  onClick={() => day && setSelectedDay(day === selectedDay ? null : day)}
                  data-events={dayEvents.length || undefined}
                  data-tip={dayEvents.length ? dayEvents[0].exam_name + (dayEvents.length > 1 ? " +" + (dayEvents.length - 1) + " more" : "") : undefined}
                >
                  {day && <span className="ec-cal-num">{day}</span>}
                  {dayEvents.length > 0 && (
                    <div className="ec-cal-indicators">
                      {dayEvents.slice(0, 3).map((ev, j) => <span key={j} className="ec-cal-bar" style={{ background: TYPE_COLORS[ev.event_type] || "#999" }}></span>)}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          <div className="ec-cal-summary">
            {eventsInMonth.length === 0 ? (
              <span>No events in {MONTHS[viewMonth]}</span>
            ) : (
              <div className="ec-cal-summary-row">
                {Object.entries(TYPE_COLORS).map(([type, color]) => {
                  const count = eventsInMonth.filter(e => e.event_type === type).length
                  if (!count) return null
                  return <span key={type} className="ec-cal-summary-tag"><span className="ec-cal-summary-dot" style={{background: color}}></span>{count} {TYPE_LABELS[type]}</span>
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right: Events Panel */}
        <div className="ec-split-right">
          {selectedDay ? (
            <>
              <div className="ec-panel-header">
                <h3>{selectedDay} {MONTHS[viewMonth]} {viewYear}</h3>
                <button className="ec-panel-close" onClick={() => setSelectedDay(null)}>Back to Upcoming</button>
              </div>
              {selectedDayEvents.length === 0 ? (
                <div className="ec-panel-empty">No events scheduled on this day.</div>
              ) : (
                <div className="ec-panel-list">
                  {selectedDayEvents.map((ev, i) => (
                    <div key={i} className="ec-panel-card" style={{ borderLeftColor: TYPE_COLORS[ev.event_type] || "#999" }}>
                      <div className="ec-panel-card-body">
                        <div className="ec-panel-card-top">
                          <strong>{ev.exam_name}</strong>
                          <span className="ec-type-badge" style={{ background: TYPE_COLORS[ev.event_type] || "#999" }}>{TYPE_LABELS[ev.event_type] || ev.event_type}</span>
                          {ev.category && <span className="badge badge-primary">{ev.category}</span>}
                        </div>
                        {ev.description && <p className="ec-panel-desc">{ev.description}</p>}
                      </div>
                      <button
                        className={"ec-sub-btn" + (subscribed.has(ev.exam_name) ? " active" : "")}
                        onClick={() => toggleSubscribe(ev.exam_name)}
                        title={subscribed.has(ev.exam_name) ? "Unsubscribe" : "Subscribe"}
                      >{bellIcon(subscribed.has(ev.exam_name))}</button>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              <div className="ec-panel-header">
                <h3>Upcoming Events</h3>
                <span className="ec-panel-sub">Next 30 days</span>
              </div>
              {upcoming.length === 0 ? (
                <div className="ec-panel-empty">No upcoming events in the next 30 days.{events.length === 0 ? " Check back later or contact admin." : " Try changing category filter."}</div>
              ) : (
                <div className="ec-panel-list">
                  {upcoming.map((ev, i) => (
                    <div key={i} className="ec-panel-card" style={{ borderLeftColor: TYPE_COLORS[ev.event_type] || "#999" }}>
                      <div className="ec-panel-card-body">
                        <div className="ec-panel-card-top">
                          <strong>{ev.exam_name}</strong>
                          <span className="ec-type-badge" style={{ background: TYPE_COLORS[ev.event_type] || "#999" }}>{TYPE_LABELS[ev.event_type] || ev.event_type}</span>
                          {ev.category && <span className="badge badge-primary">{ev.category}</span>}
                        </div>
                        <span className="ec-panel-date">{formatDate(ev.date)}</span>
                        {ev.description && <p className="ec-panel-desc">{ev.description}</p>}
                      </div>
                      <button
                        className={"ec-sub-btn" + (subscribed.has(ev.exam_name) ? " active" : "")}
                        onClick={() => toggleSubscribe(ev.exam_name)}
                        title={subscribed.has(ev.exam_name) ? "Unsubscribe" : "Subscribe"}
                      >{bellIcon(subscribed.has(ev.exam_name))}</button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
