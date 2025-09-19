import React, {useState, useEffect, useRef, useCallback} from 'react';
import {createRoot} from 'react-dom/client';
import {getWhitelist, saveWhitelist} from '../utils/whitelist';
import './WhitelistEditor.css';

/**
 * WhitelistEditor: modal-style editor to view and update whitelist stored in localStorage.
 * Exposes a static open() method that renders the editor via React 18's createRoot.
 */
export default function WhitelistEditor({onClose, previouslyFocused}) {
    const [input, setInput] = useState('');
    const textareaRef = useRef(null);

    useEffect(() => {
        const list = Array.from(getWhitelist()).join('\n');
        setInput(list);
    }, []);

    useEffect(() => {
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = prevOverflow;
        };
    }, []);

    const handleClose = useCallback(() => {
        onClose?.();
        previouslyFocused?.focus?.();
    }, [onClose, previouslyFocused]);

    const onOverlayClick = (e) => {
        if (e.target === e.currentTarget) handleClose();
    };

    const handleSave = useCallback(() => {
        const entries = input
            .split(/\r?\n|,/)
            .map((s) => s.trim())
            .filter(Boolean);

        saveWhitelist(entries);
        handleClose();
        alert(`Saved ${entries.length} username${entries.length === 1 ? '' : 's'} to whitelist.`);
    }, [input, handleClose]);

    // Keybindings: rebind when handleSave changes so we don't capture stale input
    useEffect(() => {
        const onKey = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
                e.preventDefault();
                handleSave(); // always latest input now
            } else if (e.key === 'Escape') {
                e.stopPropagation();
                handleClose();
            }
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [handleSave, handleClose]);

    return (
        <div className="wl-modal-overlay" onClick={onOverlayClick}>
            <div className="wl-modal" role="dialog" aria-modal="true" aria-labelledby="wl-title">
                <header className="wl-modal-header">
                    <div>
                        <h2 id="wl-title" className="wl-modal-title">Edit Whitelist</h2>
                        <p className="wl-modal-subtitle muted">
                            One username per line (commas also supported). Stored locally in your browser.
                        </p>
                    </div>
                    <button
                        className="header-btn"
                        onClick={handleClose}
                        aria-label="Close"
                        title="Close"
                    >
                        ✕
                    </button>
                </header>

                <div className="wl-modal-body">
          <textarea
              ref={textareaRef}
              className="wl-textarea"
              rows={12}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`example_user\nanother_user\nthird_user`}
          />
                </div>

                <footer className="wl-modal-actions">
                    <button className="btn" onClick={handleSave}>Save</button>
                    <button className="btn btn-outline" onClick={handleClose}>Cancel</button>
                    <span className="wl-kbd-hint muted">Ctrl/⌘+S to save • Esc to close</span>
                </footer>
            </div>
        </div>
    );
}

/* ---------- Static opener ---------- */
let editorRoot = null;
WhitelistEditor.open = () => {
    if (editorRoot) return;
    const host = document.createElement('div');
    editorRoot = host;
    document.body.appendChild(host);
    const root = createRoot(host);

    const previouslyFocused = document.activeElement;

    function close() {
        root.unmount();
        document.body.removeChild(host);
        editorRoot = null;
        previouslyFocused?.focus?.();
    }

    root.render(<WhitelistEditor onClose={close} previouslyFocused={previouslyFocused}/>);
};