// Gets a cookie from the browser, used for authentication and display name purposes
export function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

// Checks if the user is currently authenticated
export function isAuthenticated() {
    return getCookie('auth') === 'true';
}

// Redirects to the login page if the user is not authenticated
export function requireAuth() {
    if (!isAuthenticated()) {
        window.location.href = '/login';
        return false;
    }
    return true;
}

// Retrieves the user's email from cookies
export function getUserEmail() {
    return getCookie('email') || '';
}

// Retrieves the user's display name from cookies
export function getUserDisplayName() {
    return getCookie('displayName') || '';
}