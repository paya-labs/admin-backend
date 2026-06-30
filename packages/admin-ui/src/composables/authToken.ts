// Session id transported in the Authorization header instead of a cookie, so
// auth survives where the cross-site session cookie is blocked (mobile Safari).
const STORAGE_KEY = 'admin_session_token';

export function getAuthToken(): string | null {
    try {
        return localStorage.getItem(STORAGE_KEY);
    } catch {
        return null;
    }
}

export function setAuthToken(token: string | null): void {
    try {
        if (token) {
            localStorage.setItem(STORAGE_KEY, token);
        } else {
            localStorage.removeItem(STORAGE_KEY);
        }
    } catch {
        // Storage unavailable (private mode): header auth just won't persist across reloads.
    }
}

export function authHeader(): Record<string, string> {
    const token = getAuthToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
}
