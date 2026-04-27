import { useState, useRef, useEffect } from "react"
import { useAuth } from "../context/AuthContext"

const BASE_URL = import.meta.env.VITE_API_URL || `${window.location.protocol}//${window.location.hostname}:1207`

export default function AiChat() {
  const { token } = useAuth()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [streaming, setStreaming] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, streaming])

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || streaming) return
    setInput("")
    const userMsg = { role: "user", content: text }
    setMessages(prev => [...prev, userMsg])
    setStreaming(true)
    const assistantMsg = { role: "assistant", content: "" }
    setMessages(prev => [...prev, assistantMsg])
    try {
      const res = await fetch(`${BASE_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ message: text, history: messages }),
      })
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        setMessages(prev => { const c = [...prev]; c[c.length - 1] = { role: "assistant", content: errData.detail || "Something went wrong." }; return c })
        setStreaming(false); return
      }
      const reader = res.body?.getReader()
      if (!reader) {
        const data = await res.json()
        setMessages(prev => { const c = [...prev]; c[c.length - 1] = { role: "assistant", content: data.response || data.message || JSON.stringify(data) }; return c })
        setStreaming(false); return
      }
      const decoder = new TextDecoder()
      let accumulated = ""
      let buffer = ""
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split("\n")
        buffer = lines.pop() || ""
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const payload = JSON.parse(line.slice(6))
              if (payload.token) accumulated += payload.token
              if (payload.done) break
            } catch {}
          }
        }
        setMessages(prev => { const c = [...prev]; c[c.length - 1] = { role: "assistant", content: accumulated }; return c })
      }
      if (!accumulated) setMessages(prev => { const c = [...prev]; c[c.length - 1] = { role: "assistant", content: "No response received." }; return c })
    } catch (err) {
      setMessages(prev => { const c = [...prev]; c[c.length - 1] = { role: "assistant", content: "Connection error. Please try again." }; return c })
    }
    setStreaming(false)
    inputRef.current?.focus()
  }

  const handleKeyDown = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage() } }

  return (
    <div className="chat-page">
      <div className="section-header">
        <h1>AI Education Assistant</h1>
        <p>Ask anything about exams, colleges, career paths, or education planning.</p>
      </div>
      <div className="chat-container">
        <div className="chat-messages">
          {messages.length === 0 && (<div className="chat-empty"><p>Start a conversation by typing your question below.</p></div>)}
          {messages.map((msg, i) => (
            <div key={i} className={`chat-bubble ${msg.role}`}>
              <div className="chat-bubble-label">{msg.role === "user" ? "You" : "AI Assistant"}</div>
              <div className="chat-bubble-content">{msg.content || (streaming && i === messages.length - 1 ? "" : "...")}</div>
              {streaming && i === messages.length - 1 && msg.role === "assistant" && (
                <span className="chat-typing-indicator"><span></span><span></span><span></span></span>
              )}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        <div className="chat-input-bar">
          <textarea ref={inputRef} className="chat-input" value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder="Type your question..." rows={1} disabled={streaming} />
          <button className="chat-send-btn" onClick={sendMessage} disabled={streaming || !input.trim()}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
          </button>
        </div>
      </div>
    </div>
  )
}
