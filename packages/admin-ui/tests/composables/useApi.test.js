import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useApi } from '../../src/composables/useApi.js';

describe('useApi', () => {
    beforeEach(() => {
        vi.stubGlobal('fetch', vi.fn());
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    /**
     * Create a mock response
     * @param {any} data
     * @param {object} [options]
     * @returns {Response}
     */
    const mockResponse = (data, options = {}) => {
        const {
            status = 200,
            ok = true,
            contentType = 'application/json',
        } = options;
        return {
            ok,
            status,
            headers: {
                get: (name) => (name === 'content-type' ? contentType : null),
            },
            json: () => Promise.resolve(data),
            text: () =>
                Promise.resolve(
                    typeof data === 'string' ? data : JSON.stringify(data),
                ),
        };
    };

    describe('initial state', () => {
        it('has correct default values', () => {
            const { data, error, loading, status } = useApi();

            expect(data.value).toBe(null);
            expect(error.value).toBe(null);
            expect(loading.value).toBe(false);
            expect(status.value).toBe(null);
        });
    });

    describe('GET requests', () => {
        it('makes GET request and returns data', async () => {
            const responseData = { id: 1, name: 'Test' };
            fetch.mockResolvedValueOnce(mockResponse(responseData));

            const { get, data, loading, status } = useApi();

            const result = await get('/users/1');

            expect(fetch).toHaveBeenCalledWith(
                '/users/1',
                expect.objectContaining({
                    method: 'GET',
                }),
            );
            expect(result).toEqual(responseData);
            expect(data.value).toEqual(responseData);
            expect(loading.value).toBe(false);
            expect(status.value).toBe(200);
        });

        it('appends query parameters', async () => {
            fetch.mockResolvedValueOnce(mockResponse([]));

            const { get } = useApi();
            await get('/users', { params: { page: 1, limit: 10 } });

            expect(fetch).toHaveBeenCalledWith(
                '/users?page=1&limit=10',
                expect.anything(),
            );
        });

        it('uses baseUrl', async () => {
            fetch.mockResolvedValueOnce(mockResponse({}));

            const { get } = useApi({ baseUrl: 'https://api.example.com' });
            await get('/users');

            expect(fetch).toHaveBeenCalledWith(
                'https://api.example.com/users',
                expect.anything(),
            );
        });
    });

    describe('POST requests', () => {
        it('makes POST request with body', async () => {
            const requestBody = { name: 'New User', email: 'test@example.com' };
            const responseData = { id: 1, ...requestBody };
            fetch.mockResolvedValueOnce(
                mockResponse(responseData, { status: 201 }),
            );

            const { post, data, status } = useApi();
            const result = await post('/users', requestBody);

            expect(fetch).toHaveBeenCalledWith(
                '/users',
                expect.objectContaining({
                    method: 'POST',
                    body: JSON.stringify(requestBody),
                }),
            );
            expect(result).toEqual(responseData);
            expect(data.value).toEqual(responseData);
            expect(status.value).toBe(201);
        });
    });

    describe('PUT requests', () => {
        it('makes PUT request with body', async () => {
            const requestBody = { name: 'Updated User' };
            fetch.mockResolvedValueOnce(mockResponse(requestBody));

            const { put } = useApi();
            await put('/users/1', requestBody);

            expect(fetch).toHaveBeenCalledWith(
                '/users/1',
                expect.objectContaining({
                    method: 'PUT',
                    body: JSON.stringify(requestBody),
                }),
            );
        });
    });

    describe('PATCH requests', () => {
        it('makes PATCH request with body', async () => {
            const requestBody = { name: 'Patched' };
            fetch.mockResolvedValueOnce(mockResponse(requestBody));

            const { patch } = useApi();
            await patch('/users/1', requestBody);

            expect(fetch).toHaveBeenCalledWith(
                '/users/1',
                expect.objectContaining({
                    method: 'PATCH',
                    body: JSON.stringify(requestBody),
                }),
            );
        });
    });

    describe('DELETE requests', () => {
        it('makes DELETE request', async () => {
            fetch.mockResolvedValueOnce(mockResponse(null, { status: 204 }));

            const { del, status } = useApi();
            await del('/users/1');

            expect(fetch).toHaveBeenCalledWith(
                '/users/1',
                expect.objectContaining({
                    method: 'DELETE',
                }),
            );
            expect(status.value).toBe(204);
        });
    });

    describe('headers', () => {
        it('includes default headers', async () => {
            fetch.mockResolvedValueOnce(mockResponse({}));

            const { get } = useApi({
                headers: { Authorization: 'Bearer token123' },
            });
            await get('/users');

            expect(fetch).toHaveBeenCalledWith(
                '/users',
                expect.objectContaining({
                    headers: expect.objectContaining({
                        Authorization: 'Bearer token123',
                        'Content-Type': 'application/json',
                    }),
                }),
            );
        });

        it('allows request-specific headers', async () => {
            fetch.mockResolvedValueOnce(mockResponse({}));

            const { get } = useApi();
            await get('/users', { headers: { 'X-Custom': 'value' } });

            expect(fetch).toHaveBeenCalledWith(
                '/users',
                expect.objectContaining({
                    headers: expect.objectContaining({
                        'X-Custom': 'value',
                    }),
                }),
            );
        });
    });

    describe('error handling', () => {
        it('sets error on HTTP error response', async () => {
            fetch.mockResolvedValueOnce(
                mockResponse(
                    { message: 'Not found' },
                    { status: 404, ok: false },
                ),
            );

            const { get, error, status } = useApi();

            await expect(get('/users/999')).rejects.toThrow('Not found');
            expect(error.value).toBeInstanceOf(Error);
            expect(error.value.message).toBe('Not found');
            expect(status.value).toBe(404);
        });

        it('sets error on network failure', async () => {
            fetch.mockRejectedValueOnce(new Error('Network error'));

            const { get, error, loading } = useApi();

            await expect(get('/users')).rejects.toThrow('Network error');
            expect(error.value).toBeInstanceOf(Error);
            expect(error.value.message).toBe('Network error');
            expect(loading.value).toBe(false);
        });

        it('calls onError callback', async () => {
            const onError = vi.fn();
            fetch.mockRejectedValueOnce(new Error('Failed'));

            const { get } = useApi({ onError });

            await expect(get('/users')).rejects.toThrow();
            expect(onError).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe('loading state', () => {
        it('sets loading to true during request', async () => {
            let resolvePromise;
            const pendingPromise = new Promise((resolve) => {
                resolvePromise = resolve;
            });
            fetch.mockReturnValueOnce(pendingPromise);

            const { get, loading } = useApi();

            expect(loading.value).toBe(false);

            const promise = get('/users');
            // Give the async function time to start
            await new Promise((r) => setTimeout(r, 0));

            expect(loading.value).toBe(true);

            resolvePromise(mockResponse([]));
            await promise;

            expect(loading.value).toBe(false);
        });
    });

    describe('reset', () => {
        it('resets all state', async () => {
            fetch.mockResolvedValueOnce(mockResponse({ id: 1 }));

            const { get, data, status, reset } = useApi();
            await get('/users/1');

            expect(data.value).not.toBe(null);
            expect(status.value).toBe(200);

            reset();

            expect(data.value).toBe(null);
            expect(status.value).toBe(null);
        });
    });

    describe('response handling', () => {
        it('handles text responses', async () => {
            fetch.mockResolvedValueOnce(
                mockResponse('Hello World', {
                    contentType: 'text/plain',
                }),
            );

            const { get, data } = useApi();
            await get('/text');

            expect(data.value).toBe('Hello World');
        });

        it('uses custom response handler', async () => {
            fetch.mockResolvedValueOnce(
                mockResponse({ wrapped: { data: 'value' } }),
            );

            const { get, data } = useApi({
                responseHandler: async (response) => {
                    const json = await response.json();
                    return json.wrapped;
                },
            });

            await get('/wrapped');

            expect(data.value).toEqual({ data: 'value' });
        });
    });
});
