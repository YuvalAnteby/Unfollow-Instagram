/**
 * parseFollowers: replicate load_followers() logic from Python version.
 * @param {Array} data JSON array from followers_1.json
 * @returns {Array<String>} list of follower usernames
 */
export function parseFollowers(data) {
    const result = [];
    data.forEach(entry => {
        if (entry.string_list_data) {
            entry.string_list_data.forEach(s => result.push(s.value));
        }
    });
    return result;
}

/**
 * parseFollowing: replicate load_following() logic from Python version.
 * @param {Object} data JSON object from following.json
 * @returns {Array<String>} list of following usernames
 */
export function parseFollowing(data) {
    const entries = data.relationships_following || [];
    const result = [];
    entries.forEach(entry => {
        if (entry.string_list_data) {
            entry.string_list_data.forEach(s => result.push(s.value));
        }
    });
    return result;
}