import React, { useState } from 'react';
import FileUploader from './components/FileUploader';
import WhitelistEditor from './components/WhitelistEditor';
import ResultViewer from './components/ResultViewer';

/**
 * App component: orchestrates file uploading, whitelist editing, and result display.
 */
export default function App() {
    const [unfollowers, setUnfollowers] = useState([]);

    return (
        <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
            <h1>Instagram Unfollowers Checker</h1>
            <FileUploader onResults={setUnfollowers} />
            <button onClick={() => WhitelistEditor.open()}>Edit Whitelist</button>
            <ResultViewer unfollowers={unfollowers} />
        </div>
    );
}