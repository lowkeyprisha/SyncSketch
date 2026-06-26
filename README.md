## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/lowkeyprisha/syncsketch.git
cd syncsketch

# Install backend deps
cd backend && npm install

# Install frontend deps
cd ../frontend && npm install
```

### Running locally

**Terminal 1 — start the backend:**
```bash
cd backend
npm run dev
# → http://localhost:3001
```

**Terminal 2 — start the frontend:**
```bash
cd frontend
npm run dev
# → http://localhost:5173
```

### Try it out
1. Open `http://localhost:5173`
2. Enter your name and a Room ID (e.g. `team-standup`)
3. Open the same URL in a second tab/browser using the **same Room ID**
4. Start drawing — changes appear on both screens instantly

## ⌨️ Keyboard Shortcuts

| Key | Action |
|---|---|
| `V` | Select tool |
| `P` | Pen |
| `R` | Rectangle |
| `C` | Circle |
| `L` | Line |
| `T` | Text |
| `E` | Eraser |
| `Ctrl` / `Cmd` + `Z` | Undo |
| `Ctrl` / `Cmd` + `Y` | Redo |
| `Delete` / `Backspace` | Delete selected shape |
| Scroll | Zoom in / out |

## 🧠 Design Notes

**Discriminated unions for shapes** — every shape (`Rectangle`, `Circle`, `Line`, `Text`, `Pen`, `Eraser`) is a distinct type tagged by a `type` field, so TypeScript narrows automatically in switch statements and rendering logic, catching mismatched properties at compile time.

**One types file, two runtimes** — `shared/types.ts` defines the `ServerToClientEvents` / `ClientToServerEvents` contracts. If you rename a socket event on the backend without updating the frontend, the project won't compile — by design.

**Cursor performance** — mouse movement is one of the highest-frequency events in the app. Cursor positions are *not* persisted to the room's shape history; they're relayed directly peer-to-peer through the server without being stored in memory.

## 🗺️ Roadmap / Ideas for Extension

- [ ] Persist rooms to a database (MongoDB/Postgres) instead of in-memory storage
- [ ] CRDT-based sync (Yjs/Automerge) for true offline-first conflict resolution
- [ ] Export canvas as PNG/SVG
- [ ] Shape resizing handles
- [ ] Sticky notes / image embeds

## 📄 License

MIT — free to use, modify, and learn from.

---

<div align="center">
Built by <a href="https://github.com/lowkeyprisha">@lowkeyprisha</a>
</div>
