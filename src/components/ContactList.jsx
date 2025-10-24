import React from 'react'

function ContactCard({ contact, onDelete }) {
  return (
    <div className="card">
      <div className="card-left">
        <div className="avatar">{contact.name.split(' ').map(n => n[0]).slice(0,2).join('')}</div>
      </div>
      <div className="card-body">
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <div className="name">{contact.name}</div>
          <div className="contact-actions">
            <button className="btn btn-muted" onClick={() => onDelete && onDelete(contact.id)} aria-label={`Delete ${contact.name}`}>Delete</button>
          </div>
        </div>
        <div className="meta">{contact.phone} · {contact.email}</div>
      </div>
    </div>
  )
}

export default function ContactList({ contacts, onDelete }) {
  if (!contacts || contacts.length === 0) return <div className="empty">No contacts found.</div>

  return (
    <div className="list">
      {contacts.map(c => (
        <ContactCard key={c.id} contact={c} onDelete={onDelete} />
      ))}
    </div>
  )
}
