import React, { useState } from 'react'

export default function AddContact({ onAdd }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')

  function reset() {
    setName('')
    setPhone('')
    setEmail('')
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) return
    onAdd({ name: name.trim(), phone: phone.trim(), email: email.trim() })
    reset()
    setOpen(false)
  }

  return (
    <div className="add-contact">
      {open ? (
        <form onSubmit={handleSubmit} className="add-form">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Full name" required />
          <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone" />
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
          <div className="form-actions">
            <button type="button" onClick={() => { reset(); setOpen(false) }} className="btn btn-muted">Cancel</button>
            <button type="submit" className="btn btn-primary">Add</button>
          </div>
        </form>
      ) : (
        <button className="btn btn-primary" onClick={() => setOpen(true)}>+ Add Contact</button>
      )}
    </div>
  )
}
