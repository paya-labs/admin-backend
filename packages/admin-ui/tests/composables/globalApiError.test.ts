import { afterEach, describe, expect, it, vi } from 'vitest';
import {
    getGlobalApiErrorHandler,
    setGlobalApiErrorHandler,
} from '../../src/composables/globalApiError';
import type { ApiError } from '../../src/composables/useApi';
import { useApi } from '../../src/composables/useApi';
import { useCrud } from '../../src/composables/useCrud';

const json = (status: number, body: unknown): Response =>
    new Response(JSON.stringify(body), {
        status,
        headers: { 'content-type': 'application/json' },
    });

afterEach(() => {
    setGlobalApiErrorHandler(null);
    vi.unstubAllGlobals();
});

describe('globalApiError', () => {
    it('registers and clears the handler', () => {
        const fn = vi.fn();
        setGlobalApiErrorHandler(fn);
        expect(getGlobalApiErrorHandler()).toBe(fn);
        setGlobalApiErrorHandler(null);
        expect(getGlobalApiErrorHandler()).toBeNull();
    });

    it('useApi invokes the global handler with the ApiError on failure', async () => {
        const body = {
            message: 'nope',
            code: 'subscription_required',
            billingUrl: '/billing',
        };
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue(json(403, body)));
        const handler = vi.fn();
        setGlobalApiErrorHandler(handler);

        const api = useApi({ baseUrl: '' });
        await expect(api.get('/x')).rejects.toThrow();

        expect(handler).toHaveBeenCalledTimes(1);
        const err = handler.mock.calls[0][0] as ApiError;
        expect(err.status).toBe(403);
        expect((err.data as Record<string, unknown>).code).toBe(
            'subscription_required',
        );
    });

    it('useCrud failures also reach the global handler', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue(json(403, { billingUrl: '/billing' })),
        );
        const handler = vi.fn();
        setGlobalApiErrorHandler(handler);

        const crud = useCrud<{ id: string }>({
            baseUrl: '',
            resource: 'contacts',
        });
        await expect(crud.create({})).rejects.toThrow();

        expect(handler).toHaveBeenCalledTimes(1);
        expect((handler.mock.calls[0][0] as ApiError).status).toBe(403);
    });

    it('does not throw when no handler is registered', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue(json(500, {})));
        const api = useApi({ baseUrl: '' });
        await expect(api.get('/x')).rejects.toThrow();
    });

    it('a throwing global handler does not mask the original API error', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue(json(403, { billingUrl: '/billing' })),
        );
        setGlobalApiErrorHandler(() => {
            throw new Error('handler boom');
        });
        const api = useApi({ baseUrl: '' });
        await expect(api.get('/x')).rejects.toMatchObject({ status: 403 });
    });
});
