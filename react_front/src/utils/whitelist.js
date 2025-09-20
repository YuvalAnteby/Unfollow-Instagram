const KEY = 'ig_unfollowers_whitelist';

/**
 * getWhitelist
 * @returns {Set<String>} usernames stored in localStorage
 */
export function getWhitelist() {
    const raw = localStorage.getItem(KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
}

/**
 * saveWhitelist
 * @param {Array<String>} usernames
 */
export function saveWhitelist(usernames) {
    localStorage.setItem(KEY, JSON.stringify(usernames));
}