import React, {useEffect, useState} from 'react';
import FileUploader from './components/FileUploader';
import WhitelistEditor from './components/WhitelistEditor';
import ResultViewer from './components/ResultViewer';
import './App.css';
import {Toaster} from "react-hot-toast";

const THEME_KEY = 'theme';
const THEMES = ['dark', 'light'];

function getInitialTheme() {
    try {
        const saved = localStorage.getItem(THEME_KEY);
        if (saved && THEMES.includes(saved)) return saved;
    } catch (_) {}
    return 'dark'; // default
}

export default function App() {
    const [unfollowers, setUnfollowers] = useState([]);
    const [theme, setTheme] = useState(getInitialTheme);

    // Persist + apply to <html> on change
    useEffect(() => {
        try { localStorage.setItem(THEME_KEY, theme); } catch (_) {}
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        const currentIndex = THEMES.indexOf(theme);
        setTheme(THEMES[(currentIndex + 1) % THEMES.length]);
    };

    return (
        <div className="page">
            <header className="header">
                <div className="header-content">
                    <div className="header-main">
                        <h1 className="title">Instagram Unfollowers Checker</h1>
                        <p className="subtitle">{"Drop your export and see who doesn't follow back."}</p>
                    </div>
                    <div className="header-actions">
                        <button
                            className="header-btn"
                            onClick={toggleTheme}
                            title={`Theme: ${theme}`}
                        >
                            {theme === 'dark' ? '☀️' : '🌙'}
                        </button>
                        <a
                            className="header-btn"
                            href="https://help.instagram.com/181231772500920"
                            target="_blank"
                            rel="noopener noreferrer"
                            title="How to export Instagram data"
                        >
                            ❓
                        </a>
                    </div>
                </div>
            </header>

            <main className="container">
                {/* Upload */}
                <section className="card">
                    <h2 className="card-title">Upload</h2>
                    <p className="muted">Upload a single ZIP or two JSON files (followers_1 + following).</p>
                    <FileUploader onResults={setUnfollowers} />
                </section>
                {/* Results */}
                <section className="card">
                    <button className="btn whitelist" onClick={() => WhitelistEditor.open()}>
                        Edit Whitelist
                    </button>
                    <ResultViewer unfollowers={unfollowers} />
                </section>
            </main>

            <footer className="footer">
                <span className="muted">Built locally. Your data stays in your browser.</span>
            </footer>

            <Toaster position="bottom-center" />
        </div>
    );
}