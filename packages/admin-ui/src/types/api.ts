export interface UseApiOptions {
    baseUrl?: string;
    headers?: Record<string, string>;
    responseHandler?: <T>(response: Response) => Promise<T>;
    onError?: (error: Error) => void;
}

export interface RequestOptions {
    headers?: Record<string, string>;
    params?: Record<string, unknown>;
    signal?: AbortSignal;
}
