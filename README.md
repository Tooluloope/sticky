# Sticky Notes App

## Architecture Overview

The app uses React and TypeScript with separate components for each UI element: `<Header>` handles toolbar actions; `<Main>` holds the notes; `<Note>` manages a single note and its subcomponents `<NoteHeader>`, `<NoteContent>`, and `<NoteMenu>` for title editing, text input, and controls. State is stored in a Zustand store (`useNotesStore`) that tracks note details, layering (z-index), and drag/resize status. Notes are saved and restored from localStorage using Zustand’s `persist` middleware.

Pointer events manage dragging and resizing, and `requestAnimationFrame` updates note positions smoothly. A simple collision check with the trash zone handles deletion, and bringing a note to the front happens on pointer down. The `useLocalStorage` hook saves theme settings, and `ThemeContext` toggles between light and dark modes.

## Install, Build, and Run Instructions, Build, and Run Instructions

1. **Clone the repository**

   ```bash
   git clone https://github.com/Tooluloope/sticky.git
   cd sticky
   ```

2. **Install dependencies**

   ```bash
   pnpm i
   ```

3. **Start the development server**

   ```bash
   pnpm dev
   ```

   The app will be available at `http://localhost:5173/`.

4. **Build for production**

   ```bash
   pnpm build
   ```

5. **Preview the production build**

   ```bash
   pnpm preview
   ```

6. **Run Test suite**
    ```bash
    pnpm test
    ```

