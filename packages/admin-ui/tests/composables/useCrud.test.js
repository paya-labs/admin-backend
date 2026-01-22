import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useCrud } from '../../src/composables/useCrud.js';

describe('useCrud', () => {
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

    const createCrud = (options = {}) => {
        return useCrud({
            baseUrl: 'https://api.example.com',
            resource: 'users',
            ...options,
        });
    };

    describe('initial state', () => {
        it('has correct default values', () => {
            const crud = createCrud();

            expect(crud.items.value).toEqual([]);
            expect(crud.current.value).toBe(null);
            expect(crud.loading.value).toBe(false);
            expect(crud.listLoading.value).toBe(false);
            expect(crud.itemLoading.value).toBe(false);
            expect(crud.saving.value).toBe(false);
            expect(crud.deleting.value).toBe(false);
            expect(crud.error.value).toBe(null);
        });

        it('includes pagination', () => {
            const crud = createCrud({ pageSize: 25 });

            expect(crud.pagination).toBeDefined();
            expect(crud.pagination.pageSize.value).toBe(25);
        });
    });

    describe('fetchList', () => {
        it('fetches list with pagination params', async () => {
            const users = [
                { id: 1, name: 'John' },
                { id: 2, name: 'Jane' },
            ];
            fetch.mockResolvedValueOnce(mockResponse(users));

            const crud = createCrud();
            const result = await crud.fetchList();

            expect(fetch).toHaveBeenCalledWith(
                'https://api.example.com/users?_page=1&_limit=10',
                expect.anything(),
            );
            expect(result).toEqual(users);
            expect(crud.items.value).toEqual(users);
            expect(crud.listLoading.value).toBe(false);
        });

        it('passes additional params', async () => {
            fetch.mockResolvedValueOnce(mockResponse([]));

            const crud = createCrud();
            await crud.fetchList({ status: 'active', role: 'admin' });

            expect(fetch).toHaveBeenCalledWith(
                expect.stringContaining('status=active'),
                expect.anything(),
            );
            expect(fetch).toHaveBeenCalledWith(
                expect.stringContaining('role=admin'),
                expect.anything(),
            );
        });

        it('handles { data, total } response format', async () => {
            const response = {
                data: [{ id: 1 }, { id: 2 }],
                total: 50,
            };
            fetch.mockResolvedValueOnce(mockResponse(response));

            const crud = createCrud();
            await crud.fetchList();

            expect(crud.items.value).toEqual(response.data);
            expect(crud.pagination.total.value).toBe(50);
        });

        it('sets error on failure', async () => {
            fetch.mockRejectedValueOnce(new Error('Network error'));

            const crud = createCrud();

            await expect(crud.fetchList()).rejects.toThrow('Network error');
            expect(crud.error.value).toBeInstanceOf(Error);
            expect(crud.listLoading.value).toBe(false);
        });
    });

    describe('refresh', () => {
        it('refetches with last params', async () => {
            fetch.mockResolvedValue(mockResponse([]));

            const crud = createCrud();
            await crud.fetchList({ status: 'active' });
            await crud.refresh();

            // Both calls should have status=active
            expect(fetch).toHaveBeenLastCalledWith(
                expect.stringContaining('status=active'),
                expect.anything(),
            );
        });
    });

    describe('fetchOne', () => {
        it('fetches single item by ID', async () => {
            const user = { id: 1, name: 'John', email: 'john@example.com' };
            fetch.mockResolvedValueOnce(mockResponse(user));

            const crud = createCrud();
            const result = await crud.fetchOne(1);

            expect(fetch).toHaveBeenCalledWith(
                'https://api.example.com/users/1',
                expect.anything(),
            );
            expect(result).toEqual(user);
            expect(crud.current.value).toEqual(user);
            expect(crud.itemLoading.value).toBe(false);
        });

        it('sets error on failure', async () => {
            fetch.mockResolvedValueOnce(
                mockResponse(
                    { message: 'Not found' },
                    { status: 404, ok: false },
                ),
            );

            const crud = createCrud();

            await expect(crud.fetchOne(999)).rejects.toThrow();
            expect(crud.error.value).toBeInstanceOf(Error);
        });
    });

    describe('create', () => {
        it('creates new item', async () => {
            const newUser = { name: 'New User', email: 'new@example.com' };
            const createdUser = { id: 5, ...newUser };
            fetch
                .mockResolvedValueOnce(
                    mockResponse(createdUser, { status: 201 }),
                )
                .mockResolvedValueOnce(mockResponse([])); // refresh

            const crud = createCrud();
            const result = await crud.create(newUser);

            expect(fetch).toHaveBeenCalledWith(
                'https://api.example.com/users',
                expect.objectContaining({
                    method: 'POST',
                    body: JSON.stringify(newUser),
                }),
            );
            expect(result).toEqual(createdUser);
            expect(crud.current.value).toEqual(createdUser);
            expect(crud.saving.value).toBe(false);
        });

        it('auto-refreshes list after create', async () => {
            fetch
                .mockResolvedValueOnce(mockResponse({ id: 1 }))
                .mockResolvedValueOnce(mockResponse([]));

            const crud = createCrud({ autoRefresh: true });
            await crud.create({ name: 'Test' });

            // Should have called fetch twice (create + refresh)
            expect(fetch).toHaveBeenCalledTimes(2);
        });

        it('skips refresh when autoRefresh is false', async () => {
            fetch.mockResolvedValueOnce(mockResponse({ id: 1 }));

            const crud = createCrud({ autoRefresh: false });
            await crud.create({ name: 'Test' });

            expect(fetch).toHaveBeenCalledTimes(1);
        });
    });

    describe('update', () => {
        it('updates existing item', async () => {
            const updateData = { name: 'Updated Name' };
            const updatedUser = { id: 1, ...updateData };
            fetch
                .mockResolvedValueOnce(mockResponse(updatedUser))
                .mockResolvedValueOnce(mockResponse([]));

            const crud = createCrud();
            const result = await crud.update(1, updateData);

            expect(fetch).toHaveBeenCalledWith(
                'https://api.example.com/users/1',
                expect.objectContaining({
                    method: 'PUT',
                    body: JSON.stringify(updateData),
                }),
            );
            expect(result).toEqual(updatedUser);
            expect(crud.current.value).toEqual(updatedUser);
        });
    });

    describe('remove', () => {
        it('deletes item', async () => {
            fetch
                .mockResolvedValueOnce(mockResponse(null, { status: 204 }))
                .mockResolvedValueOnce(mockResponse([]));

            const crud = createCrud();
            await crud.remove(1);

            expect(fetch).toHaveBeenCalledWith(
                'https://api.example.com/users/1',
                expect.objectContaining({
                    method: 'DELETE',
                }),
            );
            expect(crud.deleting.value).toBe(false);
        });

        it('clears current if deleted item was selected', async () => {
            fetch
                .mockResolvedValueOnce(mockResponse({ id: 1, name: 'John' }))
                .mockResolvedValueOnce(mockResponse(null))
                .mockResolvedValueOnce(mockResponse([]));

            const crud = createCrud();
            await crud.fetchOne(1);
            expect(crud.current.value).not.toBe(null);

            await crud.remove(1);
            expect(crud.current.value).toBe(null);
        });
    });

    describe('loading states', () => {
        it('loading is true when any operation is loading', async () => {
            let resolvePromise;
            const pendingPromise = new Promise((resolve) => {
                resolvePromise = resolve;
            });
            fetch.mockReturnValueOnce(pendingPromise);

            const crud = createCrud();

            expect(crud.loading.value).toBe(false);

            const promise = crud.fetchList();
            await new Promise((r) => setTimeout(r, 0));

            expect(crud.loading.value).toBe(true);
            expect(crud.listLoading.value).toBe(true);

            resolvePromise(mockResponse([]));
            await promise;

            expect(crud.loading.value).toBe(false);
        });
    });

    describe('reset', () => {
        it('resets all state', async () => {
            fetch.mockResolvedValue(mockResponse([{ id: 1 }]));

            const crud = createCrud();
            await crud.fetchList();

            expect(crud.items.value.length).toBeGreaterThan(0);

            crud.reset();

            expect(crud.items.value).toEqual([]);
            expect(crud.current.value).toBe(null);
            expect(crud.error.value).toBe(null);
            expect(crud.pagination.page.value).toBe(1);
        });
    });

    describe('clearError', () => {
        it('clears error state', async () => {
            fetch.mockRejectedValueOnce(new Error('Failed'));

            const crud = createCrud();
            await crud.fetchList().catch(() => {});

            expect(crud.error.value).not.toBe(null);

            crud.clearError();

            expect(crud.error.value).toBe(null);
        });
    });
});
