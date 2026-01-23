<script setup>
import { AppBadge, AppButton, AppTable } from '@paya-labs/admin-ui';
import { ref } from 'vue';

// Basic table
const basicColumns = [
    { key: 'id', label: 'ID', width: '80px' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
];

const basicRows = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Editor' },
    { id: 3, name: 'Bob Wilson', email: 'bob@example.com', role: 'Viewer' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'Editor' },
];

// Table with actions
const actionsColumns = [
    { key: 'id', label: 'ID', width: '60px' },
    { key: 'product', label: 'Product' },
    { key: 'price', label: 'Price', align: 'right' },
    { key: 'stock', label: 'Stock', align: 'right' },
];

const actionsRows = [
    { id: 1, product: 'Laptop Pro', price: '$1,299', stock: 45 },
    { id: 2, product: 'Wireless Mouse', price: '$49', stock: 230 },
    { id: 3, product: 'USB-C Hub', price: '$79', stock: 89 },
];

const handleEdit = (row) => {
    alert(`Edit: ${row.product}`);
};

const handleDelete = (row) => {
    alert(`Delete: ${row.product}`);
};

const tableActions = [
    { label: 'Edit', variant: 'ghost', handler: handleEdit },
    { label: 'Delete', variant: 'danger', handler: handleDelete },
];

// Table with custom cells (status badges)
const statusColumns = [
    { key: 'id', label: 'Order ID', width: '100px' },
    { key: 'customer', label: 'Customer' },
    { key: 'total', label: 'Total', align: 'right' },
    { key: 'status', label: 'Status', align: 'right' },
];

const statusRows = [
    {
        id: 'ORD-001',
        customer: 'John Doe',
        total: '$156.00',
        status: 'completed',
    },
    {
        id: 'ORD-002',
        customer: 'Jane Smith',
        total: '$89.50',
        status: 'pending',
    },
    {
        id: 'ORD-003',
        customer: 'Bob Wilson',
        total: '$234.00',
        status: 'processing',
    },
    {
        id: 'ORD-004',
        customer: 'Alice Brown',
        total: '$45.00',
        status: 'cancelled',
    },
];

const getStatusVariant = (status) => {
    const variants = {
        completed: 'success',
        pending: 'warning',
        processing: 'primary',
        cancelled: 'danger',
    };
    return variants[status] || 'default';
};

// Loading state
const isLoading = ref(true);
setTimeout(() => {
    isLoading.value = false;
}, 3000);

// Empty state
const emptyColumns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
];

// Striped table
const stripedRows = [
    { id: 1, name: 'Row 1', email: 'row1@example.com', role: 'Admin' },
    { id: 2, name: 'Row 2', email: 'row2@example.com', role: 'Editor' },
    { id: 3, name: 'Row 3', email: 'row3@example.com', role: 'Viewer' },
    { id: 4, name: 'Row 4', email: 'row4@example.com', role: 'Admin' },
    { id: 5, name: 'Row 5', email: 'row5@example.com', role: 'Editor' },
];
</script>

<template>
    <div class="space-y-8">
        <h1 class="text-text text-2xl font-bold">Table Patterns</h1>

        <!-- Basic Table -->
        <section class="space-y-4">
            <h2 class="text-text text-lg font-semibold">Basic Table</h2>
            <AppTable :columns="basicColumns" :rows="basicRows" />
        </section>

        <!-- Table with Actions -->
        <section class="space-y-4">
            <h2 class="text-text text-lg font-semibold">
                Table with Row Actions
            </h2>
            <AppTable
                :columns="actionsColumns"
                :rows="actionsRows"
                :actions="tableActions"
            />
        </section>

        <!-- Table with Custom Cells -->
        <section class="space-y-4">
            <h2 class="text-text text-lg font-semibold">
                Table with Custom Cell Slots
            </h2>
            <AppTable :columns="statusColumns" :rows="statusRows">
                <template #cell-status="{ value }">
                    <AppBadge :variant="getStatusVariant(value)">
                        {{ value }}
                    </AppBadge>
                </template>
            </AppTable>
        </section>

        <!-- Loading State -->
        <section class="space-y-4">
            <h2 class="text-text text-lg font-semibold">Loading State</h2>
            <div class="flex items-center gap-4">
                <AppButton
                    variant="outline"
                    size="sm"
                    @click="isLoading = !isLoading"
                >
                    Toggle Loading
                </AppButton>
                <span class="text-muted text-sm">
                    {{ isLoading ? 'Loading...' : 'Loaded' }}
                </span>
            </div>
            <AppTable
                :columns="basicColumns"
                :rows="basicRows"
                :loading="isLoading"
            />
        </section>

        <!-- Empty State -->
        <section class="space-y-4">
            <h2 class="text-text text-lg font-semibold">Empty State</h2>
            <AppTable
                :columns="emptyColumns"
                :rows="[]"
                empty-message="No records found. Try adjusting your filters."
            />
        </section>

        <!-- Custom Empty Slot -->
        <section class="space-y-4">
            <h2 class="text-text text-lg font-semibold">Custom Empty Slot</h2>
            <AppTable :columns="emptyColumns" :rows="[]">
                <template #empty>
                    <div class="py-4 text-center">
                        <p class="text-muted">No users found</p>
                        <AppButton variant="primary" size="sm" class="mt-3">
                            Add First User
                        </AppButton>
                    </div>
                </template>
            </AppTable>
        </section>

        <!-- Striped Table -->
        <section class="space-y-4">
            <h2 class="text-text text-lg font-semibold">Striped Table</h2>
            <AppTable :columns="basicColumns" :rows="stripedRows" striped />
        </section>
    </div>
</template>
