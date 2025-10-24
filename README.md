This is a small React + Vite single-page application implementing a contact list with search and add features.

Features
- View list of contacts
- Search contacts by name (case-insensitive)
- Add new contact (stored in localStorage)

Run locally
1. Install dependencies:

   npm install

2. Start dev server:

   npm run dev

Build

   npm run build

Notes & assumptions
- Persistence: Added contacts persist in the browser using `localStorage`.
   - Behavior: On first load the app fetches `public/contacts.json` as seed data. When contacts are added they are stored in `localStorage` and will remain after page refresh in the same browser/profile.
   - Limitations: This is client-only persistence (no server). Contacts won't be shared across devices or browsers. Clearing site storage or using a different browser will reset to the seed data.
- Mock seed data is provided in `public/contacts.json`.
- Deployed link: https://contact-list-pagecreation.vercel.app

Libraries
- React 18
- Vite (development)

Resetting stored contacts
- To reset contacts to the original seed data run the following in the browser console and refresh:

```js
localStorage.removeItem('contacts')
location.reload()
```
How I tested

Manually verified listing, search, add, and localStorage persistence in dev and with a local production preview.
Confirmed npm run build produces a working dist served by npm run preview.

Design
- Simple, responsive layout. Small, accessible form and search input.

