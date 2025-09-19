import React from 'react';
import './ResultViewer.css'

/**
 * ResultViewer: displays the list of unfollowers or a message if none.
 */
export default function ResultViewer({unfollowers}) {

    const usernameClick = (e) => {
        // If user is selecting text, don't navigate
        const sel = window.getSelection()?.toString();
        if (sel && sel.length > 0) {
            e.preventDefault();
        }
    };

    return (
        <div className={`result-container`}>
            <h2 className={`unfollowersHeading`}>Unfollowers</h2>
            {unfollowers.length === 0 ? (
                <p className={`no-unfollowers`}>No unfollowers!</p>
            ) : (
                <ul className="unfollower-list">
                    {unfollowers.map((u) => (
                        <li key={u} className="unfollower-item">
                            <a
                                href={`https://www.instagram.com/${u}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                draggable={false}
                                onDragStart={(e) => e.preventDefault()}
                                onClick={usernameClick}
                                title={`Open @${u} on Instagram`}
                                aria-label={`Open ${u} on Instagram in a new tab`}
                            >
                                {u}
                            </a>
                        </li>
                    ))}
                </ul>

            )}
        </div>
    );
}