# Simple Notes App — Ocean Professional Theme

A modern, clean notes application built with React and vanilla CSS. It features a sidebar notes list and a main editor with create, view, edit, and delete capabilities. Notes are saved locally in your browser (localStorage).

## Features

- Sidebar list of notes with active state
- Create (+ New Note), select, edit title and content, and delete notes
- Auto-save to localStorage
- Ocean Professional theme:
  - Blue (#2563EB) and amber (#F59E0B) accents
  - Clean surfaces, subtle gradients, rounded corners, and smooth transitions
  - Light/Dark toggle with refined contrast

## Getting Started

In the project directory, run:

### `npm start`
Starts the app in development mode at http://localhost:3000.

### `npm test`
Runs the test suite.

### `npm run build`
Builds the app for production to the `build` folder.

## Project Structure

- `src/App.js`: Main application, state, and UI composition
- `src/App.css`: Theme tokens and component styles
- `src/index.js`: React entry point
- `src/App.test.js`: Basic render test

## Customization

- Theme tokens are defined in `src/App.css` under `:root` and `[data-theme="dark"]`.
- Update colors, radii, and shadows to tweak the Ocean Professional look.

## Notes on Data
- The app stores notes in `localStorage` under the key `notes_app__notes`.
- No backend is required for this version.

Enjoy building!
