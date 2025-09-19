import React, {useRef, useState} from 'react';
import JSZip from 'jszip';
import {parseFollowers, parseFollowing} from '../utils/jsonParser';
import {extractJsonFiles, isValidJsonFile, isValidZipFile} from '../utils/zipUtils';
import {getWhitelist} from '../utils/whitelist';
import './FileUploader.css';
import {toast} from "react-hot-toast";

/**
 * FileUploader: handles file input (ZIP or JSONs), parsing, and computes unfollowers.
 * Props:
 * - onResults: (Array<String>) => void  // callback with list of unfollowers
 */
export default function FileUploader({onResults}) {
    const inputRef = useRef(null);
    const [dragging, setDragging] = useState(false);


    /**
     * Handles the logic when files have been selected.
     * Checks the files' type, if they include the needed .json files and acts accordingly
     * @param files list of files given by user
     * @returns {Promise<void>}
     */
    async function handleFiles(files) {
        let followersData, followingData;
        if (files.length === 1 && isValidZipFile(files[0])) { // Single ZIP file
            const zip = await JSZip.loadAsync(files[0]);
            const {followersFile, followingFile} = await extractJsonFiles(zip);
            followersData = JSON.parse(await followersFile.async('string'));
            followingData = JSON.parse(await followingFile.async('string'));
        } else if (files.length === 2 && isValidJsonFile(files[0]) && isValidJsonFile(files[1])) { // 2 JSON files
            for (const f of files) {
                const text = await f.text();
                if (f.name.includes('followers_1')) followersData = JSON.parse(text);
                else if (f.name.includes('following')) followingData = JSON.parse(text);
            }
        } else { // Any other invalid case
            toast.error(`Select either 1 ZIP or exactly 2 JSON files.`);
            return;
        }

        const followers = parseFollowers(followersData);
        const following = parseFollowing(followingData);
        const whitelist = getWhitelist();

        // Compute unfollowers: those you follow who don't follow back, minus whitelist
        const unfollowers = [...new Set(following.filter(u => !followers.includes(u)))]
            .filter(u => !whitelist.has(u));

        onResults(unfollowers);
    }

    function onDrop(e) {
        e.preventDefault();
        setDragging(false);
        handleFiles([...e.dataTransfer.files]);
    }

    function onSelect(e) {
        handleFiles([...e.target.files]);
    }

    return (
        <div
            className={`uploader${dragging ? ' dragging' : ''}`}
            role="button"
            tabIndex={0}
            aria-label="Upload Instagram export"
            aria-describedby="uploader-hint"
            onClick={() => inputRef.current?.click()}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    inputRef.current?.click();
                }
            }}
            onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
        >
            {/* Simple inline icon (no deps) */}
            <svg
                className="uploader-icon" viewBox="0 0 24 24" aria-hidden="true"
            >
                <path d="M19 15v4a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-4"
                      fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M12 3v12m0 0l-3.5-3.5M12 15l3.5-3.5"
                      fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>

            <div className="uploader-title">Click to upload</div>
            <div className="uploader-subtitle">…or drag & drop files</div>

            <input
                ref={inputRef}
                type="file"
                multiple
                accept=".zip,.json"
                className="uploader-input"
                onChange={onSelect}
            />
        </div>
    );
}
