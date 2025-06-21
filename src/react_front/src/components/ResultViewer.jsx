import React from 'react';

/**
 * ResultViewer: displays the list of unfollowers or a message if none.
 */
export default function ResultViewer({ unfollowers }) {
    return (
        <div style={{ marginTop: 20 }}>
            <h2>Unfollowers</h2>
            {unfollowers.length === 0 ? (
                <p>No unfollowers!</p>
            ) : (
                <ul>
                    {unfollowers.map(u => <li key={u}>{u}</li>)}
                </ul>
            )}
        </div>
    );
}