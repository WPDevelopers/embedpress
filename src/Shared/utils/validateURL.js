/**
 * URL Validation Utility
 * 
 * Validates if a string is a valid URL.
 */

const validateURL = (url) => {
    if (!url || typeof url !== 'string') {
        return false;
    }

    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

export default validateURL;
