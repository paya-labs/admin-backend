<script setup>
import {
    AppBadge,
    AppButton,
    AppPagination,
    AppTable,
    usePagination,
} from '@flangofas/admin-ui';
import { computed } from 'vue';

// Basic pagination demo
const basicPagination = usePagination({
    initialPageSize: 10,
});
basicPagination.setTotal(150);

// Pagination with custom options
const customPagination = usePagination({
    initialPage: 1,
    initialPageSize: 5,
    pageSizeOptions: [5, 10, 20, 50],
    siblingCount: 2,
});
customPagination.setTotal(200);

// Sample data for table demo
const allItems = Array.from({ length: 87 }, (_, i) => ({
    id: i + 1,
    name: `Item ${i + 1}`,
    status: ['Active', 'Pending', 'Inactive'][i % 3],
}));

const tablePagination = usePagination({
    initialPageSize: 10,
});
tablePagination.setTotal(allItems.length);

const paginatedItems = computed(() => {
    const start = tablePagination.offset.value;
    const end = start + tablePagination.pageSize.value;
    return allItems.slice(start, end);
});

// Table columns
const tableColumns = [
    { key: 'id', label: 'ID', width: '80px' },
    { key: 'name', label: 'Name' },
    { key: 'status', label: 'Status' },
];

// Status badge variant mapping
const getStatusVariant = (status) => {
    const variants = {
        Active: 'success',
        Pending: 'warning',
        Inactive: 'secondary',
    };
    return variants[status] || 'default';
};

// Pagination handlers
const handlePageChange = (page) => {
    tablePagination.goToPage(page);
};

const handlePageSizeChange = (size) => {
    tablePagination.setPageSize(size);
};
</script>

<template>
    <div class="space-y-8">
        <div>
            <h1 class="text-text text-2xl font-bold">Pagination</h1>
            <p class="text-muted mt-1">
                The
                <code class="bg-surface-hover rounded px-1">usePagination</code>
                composable for managing pagination state.
            </p>
        </div>

        <!-- Basic Usage -->
        <section class="space-y-4">
            <h2 class="text-text text-lg font-semibold">Basic Usage</h2>
            <div class="border-border bg-surface rounded-lg border p-6">
                <div class="space-y-4">
                    <!-- Pagination info -->
                    <div class="text-muted text-sm">
                        Page {{ basicPagination.page.value }} of
                        {{ basicPagination.totalPages.value }} ({{
                            basicPagination.total.value
                        }}
                        items)
                    </div>

                    <!-- Pagination controls -->
                    <div class="flex flex-wrap items-center gap-2">
                        <AppButton
                            variant="outline"
                            size="sm"
                            :disabled="!basicPagination.hasPrevPage.value"
                            @click="basicPagination.prevPage()"
                        >
                            Previous
                        </AppButton>

                        <template
                            v-for="pageNum in basicPagination.pageRange.value"
                            :key="pageNum"
                        >
                            <span
                                v-if="pageNum === '...'"
                                class="text-muted px-2"
                            >
                                ...
                            </span>
                            <AppButton
                                v-else
                                :variant="
                                    pageNum === basicPagination.page.value
                                        ? 'primary'
                                        : 'outline'
                                "
                                size="sm"
                                @click="basicPagination.goToPage(pageNum)"
                            >
                                {{ pageNum }}
                            </AppButton>
                        </template>

                        <AppButton
                            variant="outline"
                            size="sm"
                            :disabled="!basicPagination.hasNextPage.value"
                            @click="basicPagination.nextPage()"
                        >
                            Next
                        </AppButton>
                    </div>

                    <!-- Code example -->
                    <div class="mt-4">
                        <pre
                            class="bg-surface-hover text-muted overflow-x-auto rounded-md p-4 text-xs"
                        ><code>const { page, totalPages, pageRange, nextPage, prevPage, goToPage } = usePagination();
pagination.setTotal(150);</code></pre>
                    </div>
                </div>
            </div>
        </section>

        <!-- With Table -->
        <section class="space-y-4">
            <h2 class="text-text text-lg font-semibold">With Table Data</h2>
            <div class="border-border bg-surface rounded-lg border p-6">
                <div class="space-y-4">
                    <!-- Table -->
                    <AppTable
                        :columns="tableColumns"
                        :rows="paginatedItems"
                        :hoverable="false"
                    >
                        <template #cell-status="{ value }">
                            <AppBadge :variant="getStatusVariant(value)">
                                {{ value }}
                            </AppBadge>
                        </template>
                    </AppTable>

                    <!-- Pagination footer -->
                    <AppPagination
                        :page="tablePagination.page.value"
                        :page-size="tablePagination.pageSize.value"
                        :total="tablePagination.total.value"
                        @update:page="handlePageChange"
                        @update:page-size="handlePageSizeChange"
                    />
                </div>
            </div>
        </section>

        <!-- Custom Options -->
        <section class="space-y-4">
            <h2 class="text-text text-lg font-semibold">Custom Options</h2>
            <div class="border-border bg-surface rounded-lg border p-6">
                <div class="space-y-4">
                    <div class="text-muted text-sm">
                        <code class="bg-surface-hover rounded px-1"
                            >siblingCount: 2</code
                        >
                        - Shows 2 pages on each side of current
                    </div>

                    <div class="flex flex-wrap items-center gap-2">
                        <AppButton
                            variant="outline"
                            size="sm"
                            :disabled="!customPagination.hasPrevPage.value"
                            @click="customPagination.prevPage()"
                        >
                            Previous
                        </AppButton>

                        <template
                            v-for="pageNum in customPagination.pageRange.value"
                            :key="pageNum"
                        >
                            <span
                                v-if="pageNum === '...'"
                                class="text-muted px-2"
                            >
                                ...
                            </span>
                            <AppButton
                                v-else
                                :variant="
                                    pageNum === customPagination.page.value
                                        ? 'primary'
                                        : 'outline'
                                "
                                size="sm"
                                @click="customPagination.goToPage(pageNum)"
                            >
                                {{ pageNum }}
                            </AppButton>
                        </template>

                        <AppButton
                            variant="outline"
                            size="sm"
                            :disabled="!customPagination.hasNextPage.value"
                            @click="customPagination.nextPage()"
                        >
                            Next
                        </AppButton>
                    </div>

                    <pre
                        class="bg-surface-hover text-muted overflow-x-auto rounded-md p-4 text-xs"
                    ><code>usePagination({
    initialPageSize: 5,
    pageSizeOptions: [5, 10, 20, 50],
    siblingCount: 2,
})</code></pre>
                </div>
            </div>
        </section>

        <!-- API Reference -->
        <section class="space-y-4">
            <h2 class="text-text text-lg font-semibold">API Reference</h2>
            <div class="border-border bg-surface rounded-lg border p-6">
                <div class="space-y-6">
                    <div>
                        <h3 class="text-text mb-2 font-medium">State</h3>
                        <div class="text-muted space-y-1 text-sm">
                            <p>
                                <code class="bg-surface-hover rounded px-1"
                                    >page</code
                                >
                                - Current page (1-indexed)
                            </p>
                            <p>
                                <code class="bg-surface-hover rounded px-1"
                                    >pageSize</code
                                >
                                - Items per page
                            </p>
                            <p>
                                <code class="bg-surface-hover rounded px-1"
                                    >total</code
                                >
                                - Total item count
                            </p>
                        </div>
                    </div>

                    <div>
                        <h3 class="text-text mb-2 font-medium">Computed</h3>
                        <div class="text-muted space-y-1 text-sm">
                            <p>
                                <code class="bg-surface-hover rounded px-1"
                                    >totalPages</code
                                >
                                - Total number of pages
                            </p>
                            <p>
                                <code class="bg-surface-hover rounded px-1"
                                    >hasNextPage</code
                                >
                                /
                                <code class="bg-surface-hover rounded px-1"
                                    >hasPrevPage</code
                                >
                                - Navigation availability
                            </p>
                            <p>
                                <code class="bg-surface-hover rounded px-1"
                                    >offset</code
                                >
                                - Offset for API calls (skip)
                            </p>
                            <p>
                                <code class="bg-surface-hover rounded px-1"
                                    >pageRange</code
                                >
                                - Array of page numbers and '...' for UI
                            </p>
                        </div>
                    </div>

                    <div>
                        <h3 class="text-text mb-2 font-medium">Methods</h3>
                        <div class="text-muted space-y-1 text-sm">
                            <p>
                                <code class="bg-surface-hover rounded px-1"
                                    >nextPage()</code
                                >
                                /
                                <code class="bg-surface-hover rounded px-1"
                                    >prevPage()</code
                                >
                                - Navigate pages
                            </p>
                            <p>
                                <code class="bg-surface-hover rounded px-1"
                                    >goToPage(n)</code
                                >
                                - Jump to specific page
                            </p>
                            <p>
                                <code class="bg-surface-hover rounded px-1"
                                    >setPageSize(n)</code
                                >
                                - Change items per page (resets to page 1)
                            </p>
                            <p>
                                <code class="bg-surface-hover rounded px-1"
                                    >setTotal(n)</code
                                >
                                - Update total item count
                            </p>
                            <p>
                                <code class="bg-surface-hover rounded px-1"
                                    >reset()</code
                                >
                                - Reset to page 1
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>
