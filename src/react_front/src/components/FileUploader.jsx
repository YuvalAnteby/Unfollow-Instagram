import React from 'react';
import JSZip from 'jszip';
import { parseFollowers, parseFollowing } from '../utils/jsonParser';
import { extractJsonFiles } from '../utils/zipUtils';
import { getWhitelist } from '../utils/whitelist';

/**
 * FileUploader: handles file input (ZIP or JSONs), parsing, and computes unfollowers.
 * Props:
 * - onResults: (Array<String>) => void  // callback with list of unfollowers
 */
export default function FileUploader({ onResults }) {
    async function handleFiles(files) {
        let followersData, followingData;

        // Single ZIP file
        if (files.length === 1 && files[0].name.endsWith('.zip')) {
            const zip = await JSZip.loadAsync(files[0]);
            const { followersFile, followingFile } = await extractJsonFiles(zip);
            followersData = JSON.parse(await followersFile.async('string'));
            followingData = JSON.parse(await followingFile.async('string'));
        }
        // Two JSONs
        else if (files.length === 2) {
            for (const f of files) {
                const text = await f.text();
                if (f.name.includes('followers_1')) followersData = JSON.parse(text);
                else if (f.name.includes('following')) followingData = JSON.parse(text);
            }
        } else {
            alert('Select either 1 ZIP or exactly 2 JSON files.');
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

    return (
        <div>
            <input
                type="file"
                multiple
                accept=".zip,.json"
                onChange={e => handleFiles([...e.target.files])}
            />
        </div>
    );
}