import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useAuth } from '../../src/composables/useAuth.js';

describe('useAuth', () => {
    beforeEach(() => {
        vi.stubGlobal('fetch', vi.fn());
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    const mockResponse = (data, options = {}) => {
        const { status = 200, ok = true } = options;
        return {
            ok,
            status,
            headers: {
                get: () => 'application/json',
            },
            json: () => Promise.resolve(data),
            text: () => Promise.resolve(JSON.stringify(data)),
        };
    };

    describe('initial state', () => {
        it('has correct default values', () => {
            const auth = useAuth();

            expect(auth.user.value).toBe(null);
            expect(auth.isAuthenticated.value).toBe(false);
            expect(auth.loading.value).toBe(false);
            expect(auth.initializing.value).toBe(false);
            expect(auth.error.value).toBe(null);
        });
    });

    describe('login', () => {
        it('logs in and sets user', async () => {
            const user = { id: 1, name: 'John', email: 'john@example.com' };
            fetch.mockResolvedValueOnce(mockResponse({ user }));

            const auth = useAuth({ baseUrl: 'https://api.example.com' });
            const result = await auth.login({
                email: 'john@example.com',
                password: 'secret',
            });

            expect(fetch).toHaveBeenCalledWith(
                'https://api.example.com/auth/login',
                expect.objectContaining({
                    method: 'POST',
                    credentials: 'include',
                }),
            );
            expect(result).toEqual(user);
            expect(auth.user.value).toEqual(user);
            expect(auth.isAuthenticated.value).toBe(true);
        });

        it('handles user object directly in response', async () => {
            const user = { id: 1, email: 'john@example.com' };
            fetch.mockResolvedValueOnce(mockResponse(user));

            const auth = useAuth();
            await auth.login({ email: 'john@example.com', password: 'secret' });

            expect(auth.user.value).toEqual(user);
        });

        it('fetches CSRF cookie if endpoint configured', async () => {
            const user = { id: 1 };
            fetch
                .mockResolvedValueOnce(mockResponse({})) // CSRF
                .mockResolvedValueOnce(mockResponse({ user })); // Login

            const auth = useAuth({ csrfEndpoint: '/csrf-cookie' });
            await auth.login({ email: 'test@test.com', password: 'pass' });

            expect(fetch).toHaveBeenCalledTimes(2);
            expect(fetch).toHaveBeenNthCalledWith(
                1,
                '/csrf-cookie',
                expect.objectContaining({ credentials: 'include' }),
            );
        });

        it('calls onLogin callback', async () => {
            const onLogin = vi.fn();
            fetch.mockResolvedValueOnce(mockResponse({ user: { id: 1 } }));

            const auth = useAuth({ onLogin });
            await auth.login({ email: 'test@test.com', password: 'pass' });

            expect(onLogin).toHaveBeenCalled();
        });

        it('sets error on failure', async () => {
            fetch.mockResolvedValueOnce(
                mockResponse(
                    { message: 'Invalid credentials' },
                    { status: 401, ok: false },
                ),
            );

            const auth = useAuth();

            await expect(
                auth.login({ email: 'bad', password: 'bad' }),
            ).rejects.toThrow('Invalid credentials');
            expect(auth.error.value).toBeInstanceOf(Error);
            expect(auth.user.value).toBe(null);
        });

        it('calls onError callback on failure', async () => {
            const onError = vi.fn();
            fetch.mockResolvedValueOnce(
                mockResponse({ message: 'Error' }, { status: 401, ok: false }),
            );

            const auth = useAuth({ onError });
            await auth.login({ email: 'bad', password: 'bad' }).catch(() => {});

            expect(onError).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe('logout', () => {
        it('clears user and calls endpoint', async () => {
            // Setup: logged in user
            fetch.mockResolvedValueOnce(mockResponse({ user: { id: 1 } }));
            const auth = useAuth();
            await auth.login({ email: 'test', password: 'test' });

            expect(auth.isAuthenticated.value).toBe(true);

            // Logout
            fetch.mockResolvedValueOnce(mockResponse({}));
            await auth.logout();

            expect(fetch).toHaveBeenLastCalledWith(
                '/auth/logout',
                expect.objectContaining({
                    method: 'POST',
                    credentials: 'include',
                }),
            );
            expect(auth.user.value).toBe(null);
            expect(auth.isAuthenticated.value).toBe(false);
        });

        it('calls onLogout callback', async () => {
            const onLogout = vi.fn();
            fetch.mockResolvedValueOnce(mockResponse({}));

            const auth = useAuth({ onLogout });
            await auth.logout();

            expect(onLogout).toHaveBeenCalled();
        });

        it('clears user even if logout request fails', async () => {
            fetch
                .mockResolvedValueOnce(mockResponse({ user: { id: 1 } }))
                .mockRejectedValueOnce(new Error('Network error'));

            const auth = useAuth();
            await auth.login({ email: 'test', password: 'test' });
            await auth.logout();

            expect(auth.user.value).toBe(null);
        });
    });

    describe('fetchUser', () => {
        it('fetches and sets user', async () => {
            const user = { id: 1, name: 'John' };
            fetch.mockResolvedValueOnce(mockResponse(user));

            const auth = useAuth();
            const result = await auth.fetchUser();

            expect(fetch).toHaveBeenCalledWith(
                '/auth/user',
                expect.objectContaining({
                    method: 'GET',
                    credentials: 'include',
                }),
            );
            expect(result).toEqual(user);
            expect(auth.user.value).toEqual(user);
        });

        it('returns null and clears user on 401', async () => {
            fetch.mockResolvedValueOnce(
                mockResponse({}, { status: 401, ok: false }),
            );

            const auth = useAuth();
            const result = await auth.fetchUser();

            expect(result).toBe(null);
            expect(auth.user.value).toBe(null);
        });
    });

    describe('initialize', () => {
        it('fetches user and sets initializing state', async () => {
            const user = { id: 1 };
            fetch.mockResolvedValueOnce(mockResponse(user));

            const auth = useAuth();
            await auth.initialize();

            expect(auth.user.value).toEqual(user);
            expect(auth.initializing.value).toBe(false);
        });

        it('handles no session gracefully', async () => {
            fetch.mockResolvedValueOnce(
                mockResponse({}, { status: 401, ok: false }),
            );

            const auth = useAuth();
            await auth.initialize();

            expect(auth.user.value).toBe(null);
            expect(auth.initializing.value).toBe(false);
        });
    });

    describe('hasRole', () => {
        it('returns false when not authenticated', () => {
            const auth = useAuth();
            expect(auth.hasRole('admin')).toBe(false);
        });

        it('checks single role property', async () => {
            fetch.mockResolvedValueOnce(
                mockResponse({ user: { id: 1, role: 'admin' } }),
            );

            const auth = useAuth();
            await auth.login({ email: 'test', password: 'test' });

            expect(auth.hasRole('admin')).toBe(true);
            expect(auth.hasRole('user')).toBe(false);
        });

        it('checks roles array', async () => {
            fetch.mockResolvedValueOnce(
                mockResponse({ user: { id: 1, roles: ['admin', 'editor'] } }),
            );

            const auth = useAuth();
            await auth.login({ email: 'test', password: 'test' });

            expect(auth.hasRole('admin')).toBe(true);
            expect(auth.hasRole('editor')).toBe(true);
            expect(auth.hasRole('viewer')).toBe(false);
        });

        it('checks roles array with objects', async () => {
            fetch.mockResolvedValueOnce(
                mockResponse({
                    user: {
                        id: 1,
                        roles: [{ name: 'admin' }, { slug: 'editor' }],
                    },
                }),
            );

            const auth = useAuth();
            await auth.login({ email: 'test', password: 'test' });

            expect(auth.hasRole('admin')).toBe(true);
            expect(auth.hasRole('editor')).toBe(true);
        });
    });

    describe('hasPermission', () => {
        it('returns false when not authenticated', () => {
            const auth = useAuth();
            expect(auth.hasPermission('users.create')).toBe(false);
        });

        it('checks permissions array', async () => {
            fetch.mockResolvedValueOnce(
                mockResponse({
                    user: {
                        id: 1,
                        permissions: ['users.read', 'users.create'],
                    },
                }),
            );

            const auth = useAuth();
            await auth.login({ email: 'test', password: 'test' });

            expect(auth.hasPermission('users.read')).toBe(true);
            expect(auth.hasPermission('users.delete')).toBe(false);
        });

        it('checks permissions in roles', async () => {
            fetch.mockResolvedValueOnce(
                mockResponse({
                    user: {
                        id: 1,
                        roles: [
                            {
                                name: 'admin',
                                permissions: ['users.create', 'users.delete'],
                            },
                        ],
                    },
                }),
            );

            const auth = useAuth();
            await auth.login({ email: 'test', password: 'test' });

            expect(auth.hasPermission('users.create')).toBe(true);
            expect(auth.hasPermission('users.delete')).toBe(true);
            expect(auth.hasPermission('posts.create')).toBe(false);
        });
    });

    describe('clearError', () => {
        it('clears error state', async () => {
            fetch.mockResolvedValueOnce(
                mockResponse({ message: 'Error' }, { status: 401, ok: false }),
            );

            const auth = useAuth();
            await auth.login({ email: 'bad', password: 'bad' }).catch(() => {});

            expect(auth.error.value).not.toBe(null);

            auth.clearError();

            expect(auth.error.value).toBe(null);
        });
    });
});
