/**
 * extractJsonFiles: given a JSZip instance, find and return the two JSON files under the Instagram folder.
 * @param {JSZip} zip
 * @returns {Promise<{followersFile: JSZip.JSZipObject, followingFile: JSZip.JSZipObject}>}
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