import { computed, ref, shallowRef, type ComputedRef, type Ref } from 'vue';
import type { UseCrudOptions } from '../types';
import { useApi } from './useApi';
import { usePagination, type UsePaginationReturn } from './usePagination';

export interface UseCrudReturn<T> {
    items: Ref<T[]>;
    current: Ref<T | null | Record<string, unknown>>;
    loading: ComputedRef<boolean>;
    listLoading: Ref<boolean>;
    itemLoading: Ref<boolean>;
    saving: Ref<boolean>;
    deleting: Ref<boolean>;
    error: Ref<Error | null>;
    pagination: UsePaginationReturn;
    fetchList: (params?: Record<string, unknown>) => Promise<T[]>;
    refresh: () => Promise<T[]>;
    fetchOne: (id: string | number) => Promise<T>;
    create: (data: Partial<T>) => Promise<T>;
    update: (id: string | number, data: Partial<T>) => Promise<T>;
    remove: (id: string | number) => Promise<void>;
    reset: () => void;
    clearError: () => void;
}

interface ListResponse<T> {
    data?: T[];
    items?: T[];
    total?: number;
}

export function useCrud<T extends Record<string, unknown>>(
    options: UseCrudOptions,
): UseCrudReturn<T> {
    const {
        baseUrl,
        resource,
        pageSize = 10,
        pageSizeOptions,
        headers = {},
        autoRefresh = true,
    } = options;

    const api = useApi<T>({ baseUrl, headers });

    const pagination = usePagination({
        initialPageSize: pageSize,
        pageSizeOptions,
    });

    const items = shallowRef<T[]>([]);
    const current = shallowRef<T | null>(null);
    const listLoading = ref(false);
    const itemLoading = ref(false);
    const saving = ref(false);
    const deleting = ref(false);
    const error = shallowRef<Error | null>(null);
    const lastParams = ref<Record<string, unknown>>({});

    const loading = computed(
        () =>
            listLoading.value ||
            itemLoading.value ||
            saving.value ||
            deleting.value,
    );

    const buildUrl = (id?: string | number): string => {
        const base = `/${resource}`;
        return id !== undefined ? `${base}/${id}` : base;
    };

    const fetchList = async (
        params: Record<string, unknown> = {},
    ): Promise<T[]> => {
        listLoading.value = true;
        error.value = null;
        lastParams.value = params;

        try {
            const queryParams = {
                _page: pagination.page.value,
                _limit: pagination.pageSize.value,
                ...params,
            };

            const result = await api.get(buildUrl(), { params: queryParams });

            if (Array.isArray(result)) {
                items.value = result;
                if (result.length < pagination.pageSize.value) {
                    pagination.setTotal(
                        pagination.offset.value + result.length,
                    );
                } else if (pagination.page.value === 1) {
                    pagination.setTotal(result.length * 10);
                }
            } else if (result && typeof result === 'object') {
                const response = result as unknown as ListResponse<T>;
                items.value = response.data || response.items || [];
                if (response.total !== undefined) {
                    pagination.setTotal(response.total);
                }
            }

            return items.value;
        } catch (err) {
            error.value = err instanceof Error ? err : new Error(String(err));
            throw err;
        } finally {
            listLoading.value = false;
        }
    };

    const refresh = (): Promise<T[]> => {
        return fetchList(lastParams.value);
    };

    const fetchOne = async (id: string | number): Promise<T> => {
        itemLoading.value = true;
        error.value = null;

        try {
            const result = await api.get(buildUrl(id));
            current.value = result;
            return result;
        } catch (err) {
            error.value = err instanceof Error ? err : new Error(String(err));
            throw err;
        } finally {
            itemLoading.value = false;
        }
    };

    const create = async (data: Partial<T>): Promise<T> => {
        saving.value = true;
        error.value = null;

        try {
            const result = await api.post(buildUrl(), data);
            current.value = result;

            if (autoRefresh) {
                await refresh();
            }

            return result;
        } catch (err) {
            error.value = err instanceof Error ? err : new Error(String(err));
            throw err;
        } finally {
            saving.value = false;
        }
    };

    const update = async (
        id: string | number,
        data: Partial<T>,
    ): Promise<T> => {
        saving.value = true;
        error.value = null;

        try {
            const result = await api.put(buildUrl(id), data);
            current.value = result;

            if (autoRefresh) {
                await refresh();
            }

            return result;
        } catch (err) {
            error.value = err instanceof Error ? err : new Error(String(err));
            throw err;
        } finally {
            saving.value = false;
        }
    };

    const remove = async (id: string | number): Promise<void> => {
        deleting.value = true;
        error.value = null;

        try {
            await api.del(buildUrl(id));

            if (
                current.value &&
                (current.value as Record<string, unknown>).id === id
            ) {
                current.value = null;
            }

            if (autoRefresh) {
                await refresh();
            }
        } catch (err) {
            error.value = err instanceof Error ? err : new Error(String(err));
            throw err;
        } finally {
            deleting.value = false;
        }
    };

    const reset = (): void => {
        items.value = [];
        current.value = null;
        error.value = null;
        listLoading.value = false;
        itemLoading.value = false;
        saving.value = false;
        deleting.value = false;
        lastParams.value = {};
        pagination.reset();
    };

    const clearError = (): void => {
        error.value = null;
    };

    return {
        items,
        current,
        loading,
        listLoading,
        itemLoading,
        saving,
        deleting,
        error,
        pagination,
        fetchList,
        refresh,
        fetchOne,
        create,
        update,
        remove,
        reset,
        clearError,
    };
}
