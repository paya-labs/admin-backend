import type { ApiError } from './useApi';

export type GlobalApiErrorHandler = (error: ApiError) => void;

let handler: GlobalApiErrorHandler | null = null;

export function setGlobalApiErrorHandler(
    fn: GlobalApiErrorHandler | null,
): void {
    handler = fn;
}

export function getGlobalApiErrorHandler(): GlobalApiErrorHandler | null {
    return handler;
}
