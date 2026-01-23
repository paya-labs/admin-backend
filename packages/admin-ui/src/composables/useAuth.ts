import { computed, type ComputedRef, ref, type Ref, shallowRef } from 'vue';

export interface UseAuthOptions {
    baseUrl?: string;
    loginEndpoint?: string;
    logoutEndpoint?: string;
    userEndpoint?: string;
    csrfEndpoint?: string;
    onLogin?: () => void;
    onLogout?: () => void;
    onError?: (error: Error) => void;
}

export interface UseAuthReturn<TUser> {
    user: Ref<TUser | null>;
    isAuthenticated: ComputedRef<boolean>;
    loading: Ref<boolean>;
    initializing: Ref<boolean>;
    error: Ref<Error | null>;
    login: (credentials: Record<string, unknown>) => Promise<TUser>;
    logout: () => Promise<void>;
    fetchUser: () => Promise<TUser | null>;
    initialize: () => Promise<void>;
    hasRole: (role: string) => boolean;
    hasPermission: (permission: string) => boolean;
    clearError: () => void;
}

interface AuthError extends Error {
    status?: number;
    data?: unknown;
}

interface UserWithRoles {
    role?: string;
    roles?: Array<
        | string
        | {
              name?: string;
              slug?: string;
              permissions?: Array<string | { name?: string; slug?: string }>;
          }
    >;
    permissions?: Array<string | { name?: string; slug?: string }>;
}

export function useAuth<TUser = Record<string, unknown>>(
    options: UseAuthOptions = {},
): UseAuthReturn<TUser> {
    const {
        baseUrl = '',
        loginEndpoint = '/auth/login',
        logoutEndpoint = '/auth/logout',
        userEndpoint = '/auth/user',
        csrfEndpoint,
        onLogin,
        onLogout,
        onError,
    } = options;

    const user = shallowRef<TUser | null>(null);
    const loading = ref(false);
    const initializing = ref(false);
    const error = shallowRef<Error | null>(null);

    const isAuthenticated = computed(() => user.value !== null);

    const buildUrl = (endpoint: string): string => {
        return baseUrl ? `${baseUrl}${endpoint}` : endpoint;
    };

    const authFetch = async (
        url: string,
        options: RequestInit = {},
    ): Promise<Response> => {
        return await fetch(url, {
            ...options,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                ...options.headers,
            },
        });
    };

    const handleResponse = async (response: Response): Promise<unknown> => {
        const contentType = response.headers.get('content-type');
        const isJson = contentType?.includes('application/json');
        const data = isJson ? await response.json() : await response.text();

        if (!response.ok) {
            const message =
                (isJson &&
                    ((data as Record<string, string>).message ||
                        (data as Record<string, string>).error)) ||
                `HTTP ${response.status}`;
            const err: AuthError = new Error(message);
            err.status = response.status;
            err.data = data;
            throw err;
        }

        return data;
    };

    const fetchCsrfCookie = async (): Promise<void> => {
        if (!csrfEndpoint) return;

        await fetch(buildUrl(csrfEndpoint), {
            credentials: 'include',
        });
    };

    const login = async (
        credentials: Record<string, unknown>,
    ): Promise<TUser> => {
        loading.value = true;
        error.value = null;

        try {
            await fetchCsrfCookie();

            const response = await authFetch(buildUrl(loginEndpoint), {
                method: 'POST',
                body: JSON.stringify(credentials),
            });

            const data = (await handleResponse(response)) as Record<
                string,
                unknown
            >;

            if (data.user) {
                user.value = data.user as TUser;
            } else if (data.id || data.email) {
                user.value = data as TUser;
            } else {
                await fetchUser();
            }

            if (onLogin) {
                onLogin();
            }

            return user.value as TUser;
        } catch (err) {
            const e = err instanceof Error ? err : new Error(String(err));
            error.value = e;
            if (onError) {
                onError(e);
            }
            throw e;
        } finally {
            loading.value = false;
        }
    };

    const logout = async (): Promise<void> => {
        loading.value = true;
        error.value = null;

        try {
            await authFetch(buildUrl(logoutEndpoint), {
                method: 'POST',
            });
        } catch {
            // Ignore logout errors - clear state anyway
        } finally {
            user.value = null;
            loading.value = false;

            if (onLogout) {
                onLogout();
            }
        }
    };

    const fetchUser = async (): Promise<TUser | null> => {
        loading.value = true;
        error.value = null;

        try {
            const response = await authFetch(buildUrl(userEndpoint), {
                method: 'GET',
            });

            if (response.status === 401) {
                user.value = null;
                return null;
            }

            const data = (await handleResponse(response)) as Record<
                string,
                unknown
            >;
            user.value = (data.user || data) as TUser;
            return user.value;
        } catch {
            user.value = null;
            return null;
        } finally {
            loading.value = false;
        }
    };

    const initialize = async (): Promise<void> => {
        initializing.value = true;

        try {
            await fetchUser();
        } finally {
            initializing.value = false;
        }
    };

    const hasRole = (role: string): boolean => {
        if (!user.value) return false;

        const userData = user.value as unknown as UserWithRoles;

        if (userData.role === role) return true;
        if (Array.isArray(userData.roles)) {
            if (userData.roles.includes(role)) return true;
            if (
                userData.roles.some(
                    (r) =>
                        typeof r === 'object' &&
                        (r.name === role || r.slug === role),
                )
            ) {
                return true;
            }
        }

        return false;
    };

    const hasPermission = (permission: string): boolean => {
        if (!user.value) return false;

        const userData = user.value as unknown as UserWithRoles;

        if (Array.isArray(userData.permissions)) {
            if (userData.permissions.includes(permission)) return true;
            if (
                userData.permissions.some(
                    (p) =>
                        typeof p === 'object' &&
                        (p.name === permission || p.slug === permission),
                )
            ) {
                return true;
            }
        }

        if (Array.isArray(userData.roles)) {
            for (const role of userData.roles) {
                if (
                    typeof role === 'object' &&
                    Array.isArray(role.permissions)
                ) {
                    if (role.permissions.includes(permission)) return true;
                    if (
                        role.permissions.some(
                            (p) =>
                                typeof p === 'object' &&
                                (p.name === permission ||
                                    p.slug === permission),
                        )
                    ) {
                        return true;
                    }
                }
            }
        }

        return false;
    };

    const clearError = (): void => {
        error.value = null;
    };

    return {
        user,
        isAuthenticated,
        loading,
        initializing,
        error,
        login,
        logout,
        fetchUser,
        initialize,
        hasRole,
        hasPermission,
        clearError,
    };
}
