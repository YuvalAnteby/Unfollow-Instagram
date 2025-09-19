import React from 'react';

/**
 * ResultViewer: displays the list of unfollowers or a message if none.
 */
export default function ResultViewer({unfollowers}) {

    const usernameClick = (username) => {
        console.log('click ' + username);
        window.open(`https://www.instagram.com/${username}`, "_blank");
    };

    return (
        <div style={{marginTop: 20}}>
            <h2>Unfollowers</h2>
            {unfollowers.length === 0 ? (
                <p>No unfollowers!</p>
            ) : (
                <ul>
                    {unfollowers.map(u =>
                        <li key={u} onClick={() => usernameClick(u)}
                        >
                            {u}
                        </li>
                    )}
                </ul>
            )}
        </div>
    );
}