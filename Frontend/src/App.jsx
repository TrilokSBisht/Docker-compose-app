import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [dbTime, setDbTime] = useState('')
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  // Fetch database time on component mount
  useEffect(() => {
    fetchDbTime()
  }, [])

  const fetchDbTime = async () => {
    try {
      const response = await fetch('http://localhost:5001/db')
      const data = await response.json()
      setDbTime(new Date(data.time).toLocaleString())
    } catch (error) {
      console.error('Error fetching DB time:', error)
      setDbTime('Unable to connect to database')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) return

    setLoading(true)
    try {
      const response = await fetch('http://localhost:5001/db', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: name.trim() }),
      })
      
      const data = await response.json()
      setMessage(data.message || data.error)
      setName('')
      fetchDbTime() // Refresh time after successful insert
    } catch (error) {
      setMessage('Error connecting to server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="header">
        <h1>🐳 Docker Compose App</h1>
        <p>Modern Full-Stack Application</p>
      </div>

      <div className="cards-grid">
        <div className="card">
          <h2>🕒 Database Status</h2>
          <div className="status-info">
            <p><strong>Current Time:</strong></p>
            <p className="time-display">{dbTime}</p>
            <button onClick={fetchDbTime} className="btn-secondary">
              Refresh Time
            </button>
          </div>
        </div>

        <div className="card">
          <h2>📝 Add Data</h2>
          <form onSubmit={handleSubmit} className="form">
            <input
              type="text"
              placeholder="Enter your name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
              disabled={loading}
            />
            <button 
              type="submit" 
              className="btn-primary"
              disabled={loading || !name.trim()}
            >
              {loading ? '⏳ Adding...' : '✨ Add to Database'}
            </button>
          </form>
          {message && (
            <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
              {message}
            </div>
          )}
        </div>
      </div>

      <div className="tech-stack">
        <h3>🚀 Tech Stack</h3>
        <div className="tech-badges">
          <span className="badge">React</span>
          <span className="badge">Node.js</span>
          <span className="badge">PostgreSQL</span>
          <span className="badge">Docker</span>
          <span className="badge">Express</span>
        </div>
      </div>
    </div>
  )
}

export default App
