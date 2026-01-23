export interface AuthEndpoints {
    login?: string;
    logout?: string;
    user?: string;
    csrf?: string;
}

export interface UseAuthOptions {
    baseUrl?: string;
    endpoints?: AuthEndpoints;
    csrf?: boolean;
    onLogin?: () => void;
    onLogout?: () => void;
}
