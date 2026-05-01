import { computed, onUnmounted, ref, watch, type Ref } from 'vue';

export interface UseAsyncSearchOptions {
    minChars?: number;
    debounceMs?: number;
    maxResults?: number;
}

export interface UseAsyncSearchReturn<T> {
    query: Ref<string>;
    results: Ref<T[]>;
    loading: Ref<boolean>;
    error: Ref<unknown>;
    activeIndex: Ref<number>;
    isOpen: Ref<boolean>;
    hasSearched: Ref<boolean>;
    setQuery: (value: string) => void;
    open: () => void;
    close: () => void;
    clear: () => void;
    moveActive: (delta: number) => void;
    selectActive: () => T | null;
    cancelPending: () => void;
    flushPending: () => void;
}

export function useAsyncSearch<T>(
    fetcher: (query: string) => Promise<T[]>,
    options: UseAsyncSearchOptions = {},
): UseAsyncSearchReturn<T> {
    const minChars = options.minChars ?? 2;
    const debounceMs = options.debounceMs ?? 300;
    const maxResults = options.maxResults ?? 10;

    const query = ref('');
    const results = ref<T[]>([]) as Ref<T[]>;
    const loading = ref(false);
    const error = ref<unknown>(null);
    const activeIndex = ref(-1);
    const isOpen = ref(false);
    const hasSearched = ref(false);

    let debounceTimer: ReturnType<typeof setTimeout> | null = null;
    let pendingValue: string | null = null;
    let lastIssued = '';

    const cancelPending = (): void => {
        if (debounceTimer !== null) {
            clearTimeout(debounceTimer);
            debounceTimer = null;
            pendingValue = null;
        }
    };

    const fetch = async (q: string): Promise<void> => {
        lastIssued = q;
        if (q.length < minChars) {
            results.value = [];
            hasSearched.value = false;
            activeIndex.value = -1;
            loading.value = false;
            return;
        }
        loading.value = true;
        error.value = null;
        try {
            const data = await fetcher(q);
            if (q !== lastIssued) return;
            results.value = data.slice(0, maxResults);
            hasSearched.value = true;
            activeIndex.value = -1;
        } catch (err) {
            if (q !== lastIssued) return;
            error.value = err;
            results.value = [];
            hasSearched.value = true;
            activeIndex.value = -1;
        } finally {
            if (q === lastIssued) {
                loading.value = false;
            }
        }
    };

    const flushPending = (): void => {
        if (debounceTimer !== null && pendingValue !== null) {
            const value = pendingValue;
            cancelPending();
            void fetch(value);
        }
    };

    watch(query, (newValue) => {
        cancelPending();
        if (newValue.length < minChars) {
            results.value = [];
            hasSearched.value = false;
            activeIndex.value = -1;
            loading.value = false;
            return;
        }
        pendingValue = newValue;
        debounceTimer = setTimeout(() => {
            debounceTimer = null;
            pendingValue = null;
            void fetch(newValue);
        }, debounceMs);
    });

    onUnmounted(() => {
        cancelPending();
    });

    const setQuery = (value: string): void => {
        query.value = value;
    };

    const open = (): void => {
        isOpen.value = true;
    };

    const close = (): void => {
        isOpen.value = false;
        activeIndex.value = -1;
    };

    const clear = (): void => {
        query.value = '';
        results.value = [];
        hasSearched.value = false;
        activeIndex.value = -1;
        isOpen.value = false;
        cancelPending();
    };

    const visibleCount = computed(() => results.value.length);

    const moveActive = (delta: number): void => {
        const len = visibleCount.value;
        if (len === 0) {
            activeIndex.value = -1;
            return;
        }
        if (activeIndex.value === -1) {
            activeIndex.value = delta > 0 ? 0 : len - 1;
            return;
        }
        const next = (activeIndex.value + delta + len) % len;
        activeIndex.value = next;
    };

    const selectActive = (): T | null => {
        if (results.value.length === 0) return null;
        const index = activeIndex.value >= 0 ? activeIndex.value : 0;
        return results.value[index] ?? null;
    };

    return {
        query,
        results,
        loading,
        error,
        activeIndex,
        isOpen,
        hasSearched,
        setQuery,
        open,
        close,
        clear,
        moveActive,
        selectActive,
        cancelPending,
        flushPending,
    };
}
