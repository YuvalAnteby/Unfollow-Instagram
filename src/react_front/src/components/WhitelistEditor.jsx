import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { getWhitelist, saveWhitelist } from '../utils/whitelist';

/**
 * WhitelistEditor: modal-style editor to view and update whitelist stored in localStorage.
 * Exposes a static open() method that renders the editor via React 18's createRoot.
 */
export default function WhitelistEditor({ onClose }) {
    const [input, setInput] = useState('');

    useEffect(() => {
        const list = Array.from(getWhitelist()).join('\n');
        setInput(list);
    }, []);

    function handleSave() {
        const entries = input.split(/\r?\n|,/)
            .map(s => s.trim())
            .filter(Boolean);
        saveWhitelist(entries);
        onClose();
        alert(`Saved ${entries.length} usernames to whitelist.`);
    }

    return (
        <div style={{ position: 'fixed', top: 50, left: '50%', transform: 'translateX(-50%)', background: '#fff', padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
            <h2>Edit Whitelist</h2>
            <textarea
                rows={10}
                cols={40}
                value={input}
                onChange={e => setInput(e.target.value)}
            />
            <div>
                <button onClick={handleSave}>Save</button>
                <button onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
}

// Static opener for simplicity using React 18 API
let editorRoot = null;
WhitelistEditor.open = () => {
    if (editorRoot) return;
    editorRoot = document.createElement('div');
    document.body.append(editorRoot);
    const root = createRoot(editorRoot);
    function close() {
        root.unmount();
        document.body.removeChild(editorRoot);
        editorRoot = null;
    }
    root.render(<WhitelistEditor onClose={close} />);
};