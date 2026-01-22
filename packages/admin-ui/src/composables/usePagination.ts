import { computed, ref, watch, type ComputedRef, type Ref } from 'vue';

export interface UsePaginationOptions {
    initialPage?: number;
    initialPageSize?: number;
    pageSizeOptions?: number[];
    siblingCount?: number;
}

export interface UsePaginationReturn {
    page: Ref<number>;
    pageSize: Ref<number>;
    total: Ref<number>;
    totalPages: ComputedRef<number>;
    hasNextPage: ComputedRef<boolean>;
    hasPrevPage: ComputedRef<boolean>;
    offset: ComputedRef<number>;
    pageRange: ComputedRef<(number | '...')[]>;
    pageSizeOptions: number[];
    nextPage: () => void;
    prevPage: () => void;
    goToPage: (page: number) => void;
    setPageSize: (size: number) => void;
    setTotal: (total: number) => void;
    reset: () => void;
}

export function usePagination(options: UsePaginationOptions = {}): UsePaginationReturn {
    const {
        initialPage = 1,
        initialPageSize = 10,
        pageSizeOptions = [10, 25, 50, 100],
        siblingCount = 1,
    } = options;

    const page = ref(initialPage);
    const pageSize = ref(initialPageSize);
    const total = ref(0);

    const totalPages = computed(() => {
        if (total.value === 0) return 1;
        return Math.ceil(total.value / pageSize.value);
    });

    const hasNextPage = computed(() => page.value < totalPages.value);
    const hasPrevPage = computed(() => page.value > 1);
    const offset = computed(() => (page.value - 1) * pageSize.value);

    const pageRange = computed<(number | '...')[]>(() => {
        const totalPagesValue = totalPages.value;
        const currentPage = page.value;

        const totalSlots = siblingCount * 2 + 5;
        if (totalPagesValue <= totalSlots) {
            return Array.from({ length: totalPagesValue }, (_, i) => i + 1);
        }

        const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
        const rightSiblingIndex = Math.min(
            currentPage + siblingCount,
            totalPagesValue,
        );

        const showLeftEllipsis = leftSiblingIndex > 2;
        const showRightEllipsis = rightSiblingIndex < totalPagesValue - 1;

        const range: (number | '...')[] = [];

        range.push(1);

        if (showLeftEllipsis) {
            range.push('...');
        } else if (leftSiblingIndex === 2) {
            range.push(2);
        }

        for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
            if (i !== 1 && i !== totalPagesValue) {
                range.push(i);
            }
        }

        if (showRightEllipsis) {
            range.push('...');
        } else if (rightSiblingIndex === totalPagesValue - 1) {
            range.push(totalPagesValue - 1);
        }

        if (totalPagesValue > 1) {
            range.push(totalPagesValue);
        }

        return range;
    });

    const nextPage = (): void => {
        if (hasNextPage.value) {
            page.value++;
        }
    };

    const prevPage = (): void => {
        if (hasPrevPage.value) {
            page.value--;
        }
    };

    const goToPage = (newPage: number): void => {
        const clamped = Math.max(1, Math.min(newPage, totalPages.value));
        page.value = clamped;
    };

    const setPageSize = (size: number): void => {
        pageSize.value = size;
        page.value = 1;
    };

    const setTotal = (newTotal: number): void => {
        total.value = newTotal;
    };

    const reset = (): void => {
        page.value = 1;
    };

    watch(totalPages, (newTotalPages) => {
        if (page.value > newTotalPages) {
            page.value = Math.max(1, newTotalPages);
        }
    });

    return {
        page,
        pageSize,
        total,
        totalPages,
        hasNextPage,
        hasPrevPage,
        offset,
        pageRange,
        pageSizeOptions,
        nextPage,
        prevPage,
        goToPage,
        setPageSize,
        setTotal,
        reset,
    };
}
