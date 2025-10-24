import React, { useEffect, useState, useRef } from 'react'
import ContactList from './components/ContactList'
import SearchBar from './components/SearchBar'
import AddContact from './components/AddContact'

const MOCK_CONTACTS = [
  { id: 1, name: 'Alice Johnson', phone: '+1 (555) 123-4567', email: 'alice@example.com' },
  { id: 2, name: 'Bob Smith', phone: '+1 (555) 234-5678', email: 'bob@example.com' },
  { id: 3, name: 'Carlos Rivera', phone: '+1 (555) 345-6789', email: 'carlos@example.com' }
]

export default function App() {
  const [contacts, setContacts] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [persistMethod, setPersistMethod] = useState(null)
  const [hideStorageWarning, setHideStorageWarning] = useState(false)

  useEffect(() => {
    try {
      const ls = localStorage.getItem('contacts')
      if (ls !== null) {
        const parsed = JSON.parse(ls)
        if (Array.isArray(parsed)) {
          setContacts(parsed)
          setPersistMethod('localStorage')
          setLoading(false)
          return
        }
      }
    } catch (e) {
      console.warn('Failed to parse localStorage.contacts', e)
    }
    try {
      const ss = sessionStorage.getItem('contacts')
      if (ss !== null) {
        const parsed = JSON.parse(ss)
        if (Array.isArray(parsed)) {
          setContacts(parsed)
          setPersistMethod('sessionStorage')
          setLoading(false)
          return
        }
      }
    } catch (e) {
      console.warn('Failed to parse sessionStorage.contacts', e)
    }

    try {
      const h = sessionStorage.getItem('hideStorageWarning')
      if (h === '1') setHideStorageWarning(true)
    } catch (e) {
    }

    fetch('/contacts.json')
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok')
        return res.json()
      })
      .then(data => setContacts(data))
      .catch(err => {
        console.warn('Fetching contacts failed, falling back to mock', err)
        setError(err.message)
        setContacts(MOCK_CONTACTS)
      })
      .finally(() => setLoading(false))
  }, [])

  const didMountRef = useRef(false)
  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true
      return
    }
    const payload = JSON.stringify(contacts)
    try {
      localStorage.setItem('contacts', payload)
      setPersistMethod('localStorage')
    } catch (e) {
      console.warn('localStorage write failed in effect, trying sessionStorage', e)
      try {
        sessionStorage.setItem('contacts', payload)
        setPersistMethod('sessionStorage')
      } catch (e2) {
        console.warn('sessionStorage write also failed in effect', e2)
      }
    }
  }, [contacts])

  const q = query.trim().toLowerCase()

  const filtered = contacts.filter(c => {
    try {
      return c.name.toLowerCase().includes(q)
    } catch (e) {
      return false
    }
  })

  function handleAdd(contact) {
    const id = Date.now()
    const newContacts = [{ ...contact, id }, ...contacts]
    setContacts(newContacts)
    const payload = JSON.stringify(newContacts)
    try {
      localStorage.setItem('contacts', payload)
      setPersistMethod('localStorage')
    } catch (e) {
      console.warn('localStorage immediate write failed, trying sessionStorage', e)
      try {
        sessionStorage.setItem('contacts', payload)
        setPersistMethod('sessionStorage')
      } catch (e2) {
        console.warn('sessionStorage also failed immediately', e2)
      }
    }
  }

  function handleDelete(id) {
    const newContacts = contacts.filter(c => c.id !== id)
    setContacts(newContacts)
    const payload = JSON.stringify(newContacts)
    try {
      localStorage.setItem('contacts', payload)
      setPersistMethod('localStorage')
    } catch (e) {
      try {
        sessionStorage.setItem('contacts', payload)
        setPersistMethod('sessionStorage')
      } catch (e2) {
        console.warn('Failed to persist deletion to any storage', e2)
      }
    }
  }

  return (
    <div className="app">
      <header>
        <h1>Contact List</h1>
      </header>
      <main>
        <div className="controls">
          <SearchBar value={query} onChange={setQuery} />
          <AddContact onAdd={handleAdd} />
        </div>

        <div style={{marginBottom:12, color:'#374151'}}>
          {q === '' ? (
            <span>Type to search — {contacts.length} total</span>
          ) : (
            <span>Results for "{query}": {filtered.length}</span>
          )}
        </div>

        {persistMethod && !hideStorageWarning && (
          <div style={{marginBottom:12, padding:8, borderRadius:8, background:'#f8fafc', color:'#334155', border:'1px solid #e2e8f0', display:'flex', gap:8, alignItems:'center'}}>
            <div style={{flex:1}}>
              Persisting using: <strong>{persistMethod}</strong>
            </div>
            {persistMethod === 'sessionStorage' && (
              <button className="btn btn-muted" onClick={() => {
                try {
                  const ss = sessionStorage.getItem('contacts')
                  if (ss) {
                    localStorage.setItem('contacts', ss)
                    sessionStorage.removeItem('contacts')
                    setPersistMethod('localStorage')
                    return
                  }
                } catch (e) {
                  console.warn('Promote to localStorage failed', e)
                }
              }}>Promote to localStorage</button>
            )}
            <button className="btn" onClick={() => {
              try { sessionStorage.setItem('hideStorageWarning','1') } catch(e){}
              setHideStorageWarning(true)
            }}>Dismiss</button>
            <button style={{marginLeft:8, padding:'6px 8px', borderRadius:8, border:0, cursor:'pointer'}} onClick={() => {
              localStorage.removeItem('contacts'); sessionStorage.removeItem('contacts'); location.reload()
            }}>Clear saved contacts</button>
          </div>
        )}

        {loading ? (
          <div className="empty">Loading contacts…</div>
        ) : error ? (
          <div className="empty">Error loading contacts: {error}</div>
        ) : (
          <ContactList contacts={filtered} onDelete={handleDelete} />
        )}
      </main>
      <footer />
    </div>
  )
}
