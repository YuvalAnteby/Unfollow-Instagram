import {toast} from "react-hot-toast";

/**
 * extractJsonFiles: given a JSZip instance, find and return the two JSON files under the Instagram folder.
 * @param zip
 * @returns {Promise<{followersFile: JSZipObject, followingFile: JSZipObject}>}
 */
export async function extractJsonFiles(zip) {
    const prefix = 'connections/followers_and_following/';
    let followersFile, followingFile;

    zip.forEach((relativePath, file) => {
        if (!file.dir && relativePath.startsWith(prefix)) {
            if (relativePath.includes('followers_1.json')) followersFile = file;
            else if (relativePath.includes('following.json')) followingFile = file;
        }
    });

    if (!followersFile || !followingFile) {
        throw new Error('Missing required JSON files in ZIP');
    }
    return { followersFile, followingFile };
}

/**
 *
 * @param file
 * @returns {boolean}
 */
export function isValidZipFile(file) {
    const MAX_ZIP_MB = 50;
    const isZip = (f) => f.type === 'application/zip' || /\.zip$/i.test(f.name);

    if (file && isZip(file) && file.size > MAX_ZIP_MB * 1024 * 1024) {
        toast.error(`ZIP too large (>${MAX_ZIP_MB}MB).`);
        return false;
    }
    return true;
}

export function isValidJsonFile(file) {
    const MAX_JSON_MB = 10;
    const isJson = (f) => f.type === 'application/json' || /\.json$/i.test(f.name);
    if (file && isJson(file) && file.size > MAX_JSON_MB * 1024 * 1024) {
        toast.error(`JSON too large (>${MAX_JSON_MB}MB).`);
        return false;
    }
    return true;
}