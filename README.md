<div align="center">

# ✏️ SyncSketch

**A real-time collaborative whiteboard — draw, sketch, and brainstorm together, live.**

[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4-010101?style=flat-square&logo=socket.io&logoColor=white)](https://socket.io/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)

</div>

---

## Overview

SyncSketch is a multiplayer whiteboard app where multiple users join a room and draw together in real time — shapes, freehand strokes, and text sync instantly across everyone's screen, with live cursor tracking so you can see exactly where your collaborators are working.

Built as a full-stack TypeScript project to explore **discriminated unions** for type-safe canvas tools, **shared types** between client and server, and **performance-conscious** handling of high-frequency events like cursor movement.

## ✨ Features

| | |
|---|---|
| 🖊️ **7 drawing tools** | Pen, Rectangle, Circle, Line, Text, Eraser, and Select |
| 🔄 **Real-time sync** | Every shape broadcasts instantly to all room members via WebSockets |
| 👀 **Live cursors** | See exactly where every collaborator's cursor is, in real time |
| ⏪ **Undo / Redo** | Full per-shape history stack — `Ctrl+Z` / `Ctrl+Y` |
| 🖱️ **Select & drag** | Click any shape to select and reposition it |
| 🔍 **Infinite canvas** | Scroll to zoom, drag to pan — math-correct at any zoom level |
| 🗂️ **Layers panel** | Live list of shapes on the canvas |
| 🏠 **Rooms** | Join any room by ID — fully isolated sessions |
| 🌗 **Dark mode** | Follows system `prefers-color-scheme` automatically |
| 🧩 **Shared types** | One `types.ts` powers both frontend and backend — change an event, and both sides must agree before it compiles |

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite + TypeScript |
| Real-time | Socket.io (WebSockets) |
| Backend | Node.js + Express |
| Styling | Plain CSS with CSS variables (light/dark theming) |

## 📂 Project Structure
