import { ref, shallowRef, type Ref } from 'vue';
import type { RequestOptions, UseApiOptions } from '../types';
import { authHeader } from './authToken';
import { getGlobalApiErrorHandler } from './globalApiError';

export interface ApiError extends Error {
    status?: number;
    data?: unknown;
}

export interface UseApiReturn<T> {
    data: Ref<T | null>;
    error: Ref<Error | null>;
    loading: Ref<boolean>;
    status: Ref<number | null>;
    get: (url: string, options?: RequestOptions) => Promise<T>;
    post: (url: string, body?: unknown, options?: RequestOptions) => Promise<T>;
    put: (url: string, body?: unknown, options?: RequestOptions) => Promise<T>;
    patch: (
        url: string,
        body?: unknown,
        options?: RequestOptions,
    ) => Promise<T>;
    del: (url: string, options?: RequestOptions) => Promise<T>;
    reset: () => void;
}

interface ExecuteOptions extends RequestInit {
    params?: Record<string, unknown>;
    headers?: Record<string, string>;
}

export function useApi<T = unknown>(
    options: UseApiOptions = {},
): UseApiReturn<T> {
    const {
        baseUrl = '',
        headers: defaultHeaders = {},
        responseHandler,
        onError,
    } = options;

    const data = shallowRef<T | null>(null);
    const error = shallowRef<Error | null>(null);
    const loading = ref(false);
    const status = ref<number | null>(null);

    const buildUrl = (
        url: string,
        params?: Record<string, unknown>,
    ): string => {
        const fullUrl = baseUrl ? `${baseUrl}${url}` : url;
        if (!params || Object.keys(params).length === 0) {
            return fullUrl;
        }
        const searchParams = new URLSearchParams();
        for (const [key, value] of Object.entries(params)) {
            searchParams.append(key, String(value));
        }
        return `${fullUrl}?${searchParams.toString()}`;
    };

    const defaultResponseHandler = async (
        response: Response,
    ): Promise<unknown> => {
        const contentType = response.headers.get('content-type');
        if (contentType?.includes('application/json')) {
            return response.json();
        }
        return response.text();
    };

    const execute = async (
        url: string,
        fetchOptions: ExecuteOptions = {},
    ): Promise<T> => {
        const { params, headers: requestHeaders, ...rest } = fetchOptions;

        loading.value = true;
        error.value = null;
        status.value = null;

        try {
            const fullUrl = buildUrl(url, params);
            const response = await fetch(fullUrl, {
                credentials: 'include',
                ...rest,
                headers: {
                    'Content-Type': 'application/json',
                    ...authHeader(),
                    ...defaultHeaders,
                    ...requestHeaders,
                },
            });

            status.value = response.status;

            if (!response.ok) {
                const errorData = (await defaultResponseHandler(
                    response,
                )) as Record<string, unknown>;
                const err: ApiError = new Error(
                    (errorData?.message as string) ||
                        (errorData?.error as string) ||
                        `HTTP ${response.status}`,
                );
                err.status = response.status;
                err.data = errorData;
                throw err;
            }

            const handler = responseHandler || defaultResponseHandler;
            const result = (await handler(response)) as T;
            data.value = result;
            return result;
        } catch (err) {
            const e = err instanceof Error ? err : new Error(String(err));
            error.value = e;
            if (onError) {
                onError(e);
            }
            const globalHandler = getGlobalApiErrorHandler();
            if (globalHandler) {
                try {
                    globalHandler(e as ApiError);
                } catch {
                    // A faulty global handler must not mask the original API error.
                }
            }
            throw e;
        } finally {
            loading.value = false;
        }
    };

    const get = (url: string, options: RequestOptions = {}): Promise<T> => {
        return execute(url, { method: 'GET', ...options });
    };

    const post = (
        url: string,
        body?: unknown,
        options: RequestOptions = {},
    ): Promise<T> => {
        return execute(url, {
            method: 'POST',
            body: body ? JSON.stringify(body) : undefined,
            ...options,
        });
    };

    const put = (
        url: string,
        body?: unknown,
        options: RequestOptions = {},
    ): Promise<T> => {
        return execute(url, {
            method: 'PUT',
            body: body ? JSON.stringify(body) : undefined,
            ...options,
        });
    };

    const patch = (
        url: string,
        body?: unknown,
        options: RequestOptions = {},
    ): Promise<T> => {
        return execute(url, {
            method: 'PATCH',
            body: body ? JSON.stringify(body) : undefined,
            ...options,
        });
    };

    const del = (url: string, options: RequestOptions = {}): Promise<T> => {
        return execute(url, { method: 'DELETE', ...options });
    };

    const reset = (): void => {
        data.value = null;
        error.value = null;
        loading.value = false;
        status.value = null;
    };

    return {
        data,
        error,
        loading,
        status,
        get,
        post,
        put,
        patch,
        del,
        reset,
    };
}
