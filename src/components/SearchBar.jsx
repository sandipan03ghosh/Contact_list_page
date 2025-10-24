import React from 'react'

export default function SearchBar({ value, onChange }) {
  return (
    <input
      className="search"
      placeholder="Search contacts by name..."
      value={value}
      onChange={e => onChange(e.target.value)}
      aria-label="Search contacts"
    />
  )
}
