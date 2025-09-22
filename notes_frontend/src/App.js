import React, { useEffect, useMemo, useState } from 'react';
import './App.css';

// Lightweight ID generator
const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

// Storage keys
const STORAGE_NOTES_KEY = 'notes_app__notes';
const STORAGE_THEME_KEY = 'notes_app__theme';

// Types
/**
 * @typedef {Object} Note
 * @property {string} id
 * @property {string} title
 * @property {string} content
 * @property {number} updatedAt
 */

// PUBLIC_INTERFACE
function App() {
  /**
   * Ocean Professional theme state and persistence
   */
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem(STORAGE_THEME_KEY);
    return saved || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_THEME_KEY, theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  /**
   * Notes state and persistence
   */
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem(STORAGE_NOTES_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    // Seed with a welcome note to illustrate the UI
    const initial = [
      {
        id: uid(),
        title: 'Welcome to Simple Notes',
        content:
          'This is a lightweight notes app.\n\n- Create a new note with the + New Note button\n- Click a note in the sidebar to view/edit\n- Title updates as you type\n- Your notes are saved automatically in your browser (localStorage)\n\nEnjoy the Ocean Professional theme 🌊',
        updatedAt: Date.now(),
      },
    ];
    return initial;
  });

  const [activeId, setActiveId] = useState(() => {
    const saved = localStorage.getItem(STORAGE_NOTES_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed[0]) return parsed[0].id;
      } catch {
        // ignore
      }
    }
    return null;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_NOTES_KEY, JSON.stringify(notes));
  }, [notes]);

  const activeNote = useMemo(
    () => notes.find(n => n.id === activeId) || null,
    [notes, activeId]
  );

  // PUBLIC_INTERFACE
  const createNote = () => {
    const newNote = {
      id: uid(),
      title: 'Untitled',
      content: '',
      updatedAt: Date.now(),
    };
    setNotes(prev => [newNote, ...prev]);
    setActiveId(newNote.id);
  };

  // PUBLIC_INTERFACE
  const deleteNote = (id) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    if (activeId === id) {
      // set next active: try next item, else previous, else null
      const idx = notes.findIndex(n => n.id === id);
      const next = notes[idx + 1] || notes[idx - 1] || null;
      setActiveId(next ? next.id : null);
    }
  };

  // PUBLIC_INTERFACE
  const updateNote = (partial) => {
    if (!activeId) return;
    setNotes(prev =>
      prev.map(n =>
        n.id === activeId
          ? { ...n, ...partial, updatedAt: Date.now() }
          : n
      )
    );
  };

  // Sorting notes by updatedAt desc for sidebar
  const sortedNotes = useMemo(
    () => [...notes].sort((a, b) => b.updatedAt - a.updatedAt),
    [notes]
  );

  return (
    <div className="ocean-app">
      <TopBar theme={theme} onToggleTheme={toggleTheme} onCreate={createNote} />

      <div className="layout">
        <Sidebar
          notes={sortedNotes}
          activeId={activeId}
          onSelect={setActiveId}
          onDelete={deleteNote}
        />

        <MainArea
          note={activeNote}
          onTitleChange={(v) => updateNote({ title: v })}
          onContentChange={(v) => updateNote({ content: v })}
        />
      </div>
    </div>
  );
}

function TopBar({ theme, onToggleTheme, onCreate }) {
  return (
    <header className="topbar">
      <div className="brand">
        <span className="logo">🗒️</span>
        <div className="brand-text">
          <h1 className="title">Simple Notes</h1>
          <p className="subtitle">Ocean Professional</p>
        </div>
      </div>

      <div className="actions">
        <button className="btn btn-amber" onClick={onCreate} aria-label="Create new note">
          + New Note
        </button>
        <button
          className="btn btn-outline"
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          title="Toggle theme"
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
      </div>
    </header>
  );
}

function Sidebar({ notes, activeId, onSelect, onDelete }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span className="sidebar-title">Notes</span>
        <span className="sidebar-count">{notes.length}</span>
      </div>

      <div className="notes-list" role="list">
        {notes.length === 0 && (
          <div className="empty">No notes yet. Create your first note.</div>
        )}
        {notes.map((n) => (
          <button
            key={n.id}
            className={`note-item ${activeId === n.id ? 'active' : ''}`}
            onClick={() => onSelect(n.id)}
            role="listitem"
          >
            <div className="note-meta">
              <div className="note-title" title={n.title || 'Untitled'}>
                {n.title || 'Untitled'}
              </div>
              <div className="note-time">
                {new Date(n.updatedAt).toLocaleString()}
              </div>
            </div>
            <div className="note-actions">
              <button
                className="icon-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(n.id);
                }}
                aria-label="Delete note"
                title="Delete note"
              >
                🗑️
              </button>
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
}

function MainArea({ note, onTitleChange, onContentChange }) {
  if (!note) {
    return (
      <main className="main">
        <div className="placeholder-card">
          <h2>No note selected</h2>
          <p>Select a note from the sidebar or create a new one.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="main">
      <div className="editor">
        <input
          className="title-input"
          value={note.title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Note title"
          aria-label="Note title"
        />
        <textarea
          className="content-input"
          value={note.content}
          onChange={(e) => onContentChange(e.target.value)}
          placeholder="Start writing your note..."
          aria-label="Note content"
        />
      </div>
      <div className="meta-footer">
        <span className="muted">Last updated</span>
        <span className="chip">
          {new Date(note.updatedAt).toLocaleString()}
        </span>
      </div>
    </main>
  );
}

export default App;
