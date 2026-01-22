import { describe, expect, it } from 'vitest';
import { usePagination } from '../../src/composables/usePagination.js';

describe('usePagination', () => {
    describe('initial state', () => {
        it('has correct default values', () => {
            const { page, pageSize, total, totalPages } = usePagination();

            expect(page.value).toBe(1);
            expect(pageSize.value).toBe(10);
            expect(total.value).toBe(0);
            expect(totalPages.value).toBe(1);
        });

        it('accepts custom initial values', () => {
            const { page, pageSize } = usePagination({
                initialPage: 3,
                initialPageSize: 25,
            });

            expect(page.value).toBe(3);
            expect(pageSize.value).toBe(25);
        });

        it('provides pageSizeOptions', () => {
            const { pageSizeOptions } = usePagination();
            expect(pageSizeOptions).toEqual([10, 25, 50, 100]);
        });

        it('accepts custom pageSizeOptions', () => {
            const { pageSizeOptions } = usePagination({
                pageSizeOptions: [5, 10, 20],
            });
            expect(pageSizeOptions).toEqual([5, 10, 20]);
        });
    });

    describe('computed values', () => {
        it('calculates totalPages correctly', () => {
            const { totalPages, setTotal } = usePagination({
                initialPageSize: 10,
            });

            setTotal(0);
            expect(totalPages.value).toBe(1);

            setTotal(10);
            expect(totalPages.value).toBe(1);

            setTotal(11);
            expect(totalPages.value).toBe(2);

            setTotal(100);
            expect(totalPages.value).toBe(10);
        });

        it('calculates offset correctly', () => {
            const { offset, goToPage, setTotal } = usePagination({
                initialPageSize: 10,
            });

            setTotal(100);

            expect(offset.value).toBe(0); // page 1

            goToPage(2);
            expect(offset.value).toBe(10);

            goToPage(5);
            expect(offset.value).toBe(40);
        });

        it('calculates hasNextPage and hasPrevPage', () => {
            const { hasNextPage, hasPrevPage, goToPage, setTotal } =
                usePagination({ initialPageSize: 10 });

            setTotal(30); // 3 pages

            expect(hasPrevPage.value).toBe(false);
            expect(hasNextPage.value).toBe(true);

            goToPage(2);
            expect(hasPrevPage.value).toBe(true);
            expect(hasNextPage.value).toBe(true);

            goToPage(3);
            expect(hasPrevPage.value).toBe(true);
            expect(hasNextPage.value).toBe(false);
        });
    });

    describe('navigation', () => {
        it('nextPage increments page', () => {
            const { page, nextPage, setTotal } = usePagination();
            setTotal(100);

            expect(page.value).toBe(1);
            nextPage();
            expect(page.value).toBe(2);
            nextPage();
            expect(page.value).toBe(3);
        });

        it('nextPage does nothing on last page', () => {
            const { page, nextPage, setTotal } = usePagination({
                initialPageSize: 10,
            });
            setTotal(20); // 2 pages

            page.value = 2;
            nextPage();
            expect(page.value).toBe(2);
        });

        it('prevPage decrements page', () => {
            const { page, prevPage, setTotal } = usePagination();
            setTotal(100);
            page.value = 5;

            prevPage();
            expect(page.value).toBe(4);
            prevPage();
            expect(page.value).toBe(3);
        });

        it('prevPage does nothing on first page', () => {
            const { page, prevPage } = usePagination();

            expect(page.value).toBe(1);
            prevPage();
            expect(page.value).toBe(1);
        });

        it('goToPage navigates to specific page', () => {
            const { page, goToPage, setTotal } = usePagination();
            setTotal(100);

            goToPage(5);
            expect(page.value).toBe(5);

            goToPage(1);
            expect(page.value).toBe(1);
        });

        it('goToPage clamps to valid range', () => {
            const { page, goToPage, setTotal } = usePagination({
                initialPageSize: 10,
            });
            setTotal(50); // 5 pages

            goToPage(0);
            expect(page.value).toBe(1);

            goToPage(-5);
            expect(page.value).toBe(1);

            goToPage(100);
            expect(page.value).toBe(5);
        });
    });

    describe('setPageSize', () => {
        it('changes page size', () => {
            const { pageSize, setPageSize } = usePagination();

            setPageSize(25);
            expect(pageSize.value).toBe(25);

            setPageSize(50);
            expect(pageSize.value).toBe(50);
        });

        it('resets to page 1 when page size changes', () => {
            const { page, setPageSize, setTotal, goToPage } = usePagination();
            setTotal(100);
            goToPage(5);

            expect(page.value).toBe(5);
            setPageSize(25);
            expect(page.value).toBe(1);
        });
    });

    describe('reset', () => {
        it('resets page to 1', () => {
            const { page, reset, setTotal, goToPage } = usePagination();
            setTotal(100);
            goToPage(7);

            expect(page.value).toBe(7);
            reset();
            expect(page.value).toBe(1);
        });
    });

    describe('pageRange', () => {
        it('shows all pages when total is small', () => {
            const { pageRange, setTotal } = usePagination({
                initialPageSize: 10,
                siblingCount: 1,
            });
            setTotal(50); // 5 pages

            expect(pageRange.value).toEqual([1, 2, 3, 4, 5]);
        });

        it('shows ellipsis for large page counts', () => {
            const { pageRange, setTotal, goToPage } = usePagination({
                initialPageSize: 10,
                siblingCount: 1,
            });
            setTotal(200); // 20 pages

            // Page 1: should show [1, 2, ..., 20]
            expect(pageRange.value[0]).toBe(1);
            expect(pageRange.value).toContain('...');
            expect(pageRange.value[pageRange.value.length - 1]).toBe(20);

            // Page 10 (middle): should show [1, ..., 9, 10, 11, ..., 20]
            goToPage(10);
            expect(pageRange.value[0]).toBe(1);
            expect(pageRange.value).toContain(9);
            expect(pageRange.value).toContain(10);
            expect(pageRange.value).toContain(11);
            expect(pageRange.value[pageRange.value.length - 1]).toBe(20);

            // Page 20: should show [1, ..., 19, 20]
            goToPage(20);
            expect(pageRange.value[0]).toBe(1);
            expect(pageRange.value[pageRange.value.length - 1]).toBe(20);
        });

        it('handles single page', () => {
            const { pageRange, setTotal } = usePagination({
                initialPageSize: 10,
            });
            setTotal(5); // 1 page

            expect(pageRange.value).toEqual([1]);
        });
    });

    describe('edge cases', () => {
        it('handles zero total', () => {
            const { totalPages, hasNextPage, hasPrevPage, pageRange } =
                usePagination();

            expect(totalPages.value).toBe(1);
            expect(hasNextPage.value).toBe(false);
            expect(hasPrevPage.value).toBe(false);
            expect(pageRange.value).toEqual([1]);
        });

        it('clamps page when total decreases', async () => {
            const { page, setTotal, goToPage } = usePagination({
                initialPageSize: 10,
            });
            setTotal(100); // 10 pages
            goToPage(8);

            expect(page.value).toBe(8);

            // Reduce total so page 8 is invalid
            setTotal(30); // 3 pages

            // Page should be clamped (via watcher)
            // Note: In real Vue app, watcher runs automatically
            // In tests we may need to wait for next tick
            await new Promise((r) => setTimeout(r, 0));
            expect(page.value).toBeLessThanOrEqual(3);
        });
    });
});
