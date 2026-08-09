# CampusGig

A high-trust, peer-to-peer marketplace for campus students to find and book student talent for projects. CampusGig lets students list gigs, browse offerings, place orders, and communicate — a freelance marketplace tailored to campus life.

**Status note:** this repository currently contains the frontend (`client/`) as a work-in-progress prototype. Backend server code is not part of this repo yet (server-side dependencies — Express, PostgreSQL, Socket.IO — are already declared in the client's `package.json` in anticipation).

## Features

- Landing page with animated 3D background (Three.js / react-three-fiber) and framer-motion hero sections
- Gig marketplace: browse gigs, gig detail pages, gig listings with cards and reviews
- Create a gig (AddGig), manage "My Gigs"
- Orders page and messaging UI (Socket.IO client included)
- Wallet and profile pages
- Login / registration flow
- Responsive dark UI built with Tailwind CSS and lucide icons

## Tech Stack

- React 19, React Router 7
- Vite 7
- Tailwind CSS
- Three.js, @react-three/fiber, @react-three/drei (3D visuals)
- Framer Motion (animations)
- axios, socket.io-client
- Declared server deps: express, cors, pg, dotenv, socket.io (server code not yet present)

## Getting Started

```bash
cd client
npm install
npm run dev
```

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Build for production |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview the production build |

## Project Structure

```
CampusGig/
└── client/
    ├── src/
    │   ├── Components/      # Navbar, Footer, GigCard, Reviews, 3D background, etc.
    │   ├── pages/           # Home, Gigs, Gig, Orders, Messages, AddGig, Profile, Wallet, auth
    │   ├── App.jsx          # routes
    │   └── main.jsx
    ├── public/
    ├── index.html
    └── package.json
```

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
