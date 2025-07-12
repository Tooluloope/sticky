# Sticky Notes App

## Table of Contents

- [Sticky Notes App](#sticky-notes-app)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Architecture Overview](#architecture-overview)
  - [Installation and Setup](#installation-and-setup)
  - [Running in Development](#running-in-development)
  - [Building for Production](#building-for-production)
  - [Testing](#testing)
  - [Live Demo](#live-demo)
  - [Core Features](#core-features)
  - [Potential Improvements](#potential-improvements)

---

## Introduction

A lightweight, drag-and-drop sticky notes application built with React, TypeScript, and Zustand. Persisted in `localStorage`, it supports freeform note placement, resizing, color/font customization, and quick deletion via a trash zone.

## Architecture Overview

- **Component Structure**  
  - `<Header>`: Toolbars and global actions (theme toggle, new note).  
  - `<Main>`: Canvas wrapper for notes.  
  - `<Note>`: Container for a single note, composed of:  
    - `<NoteHeader>`: Title editing and layering controls.  
    - `<NoteContent>`: Resizable textarea with dynamic font and color.  
    - `<NoteMenu>`: Drag handle, color/font menus, resize handle, delete button.  
- **State Management**  
  - Zustand store (`useNotesStore`): Manages notes array, z-index ordering, drag/resize flags.  
  - Persistence: Zustand’s `persist` middleware synchronizes state with `localStorage`.
- **Interactions**  
  - **Drag & Resize**: Pointer events + `requestAnimationFrame` for smooth updates.  
  - **Delete**: Collision detection with a designated trash zone.  
  - **Layering**: `bringToFront` adjusts z-index on pointer down.  
- **Theming**  
  - `ThemeContext` + `useLocalStorage` hook toggles and persists light/dark modes.

## Installation and Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Tooluloope/sticky.git
   cd sticky
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```

## Running in Development

```bash
pnpm dev
```

Open <http://localhost:5173> in your browser.

## Building for Production

```bash
pnpm build
pnpm preview
```

## Testing

```bash
pnpm test
```

## Live Demo

Explore the deployed version: [https://sticky-alpha.vercel.app/](https://sticky-alpha.vercel.app/)

## Core Features

- Create and delete notes via toolbar or drag-to-trash.
- Freeform note placement on an infinite canvas.
- Resizable notes with a corner drag handle.
- Customizable background color (preset palette + HSL slider).
- Adjustable font family and size for note content.
- State persistence in `localStorage` for seamless sessions.
- Light and dark themes toggled in the header.

## Potential Improvements

- **Subtle Animations & Visual Feedback**: Animate dragging, resizing, and trash interactions for a more responsive feel.
- **Right-Click Context Menu**: Quick-access menu on notes for color, font, layer, and delete actions.
- **Stacking & Layer Controls**: UI controls for reordering or grouping overlapping notes beyond "bring to front."
- **Rich Text Formatting**: Support bold, italics, underline, bullet lists, and text alignment in the editor.
- **Customizable Defaults**: Allow users to set and persist default note styles (color, font, size).
- **Enhanced Trash-Zone UX**: Highlight or animate the trash zone when notes are dragged over it.
- **Confirmation Modals**: Use styled modal dialogs for delete or bulk-action confirmations instead of simple alerts.
- **Keyboard Shortcuts**: Hotkeys for creating, selecting, deleting, and navigating notes.
- **Empty-State Design**: Engaging placeholder UI that guides new users when no notes are present.
- **Settings Panel**: Centralized panel for theme selection, default preferences, and other configurations.

