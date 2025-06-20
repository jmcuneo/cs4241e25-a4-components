export function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

export function isAuthenticated() {
    return getCookie('auth') === 'true';
}

export function requireAuth() {
    if (!isAuthenticated()) {
        window.location.href = '/login';
        return false;
    }
    return true;
}

export function getUserEmail() {
    return getCookie('email') || '';
}

export function getUserDisplayName() {
    return getCookie('displayName') || '';
}