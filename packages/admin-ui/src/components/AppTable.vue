<script setup lang="ts">
import { computed } from 'vue';
import type { TableAction, TableColumn } from '../types';
import AppButton from './AppButton.vue';

interface Props {
    columns: TableColumn[];
    rows?: Record<string, unknown>[];
    actions?: TableAction[];
    loading?: boolean;
    emptyMessage?: string;
    rowKey?: string;
    striped?: boolean;
    hoverable?: boolean;
    responsive?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    rows: () => [],
    actions: () => [],
    loading: false,
    emptyMessage: 'No data available',
    rowKey: 'id',
    striped: false,
    hoverable: true,
    responsive: true,
});

const emit = defineEmits<{
    'row-click': [row: Record<string, unknown>];
}>();

const hasActions = computed(() => props.actions.length > 0);

const getCellValue = (
    row: Record<string, unknown>,
    column: TableColumn,
): unknown => {
    const value = row[column.key];
    if (column.format) {
        return column.format(value, row);
    }
    return value;
};

const handleRowClick = (row: Record<string, unknown>): void => {
    emit('row-click', row);
};
</script>

<template>
    <div class="border-border bg-surface overflow-hidden rounded-lg border">
        <!-- Table wrapper for horizontal scroll on mobile -->
        <div :class="['overflow-x-auto', responsive && 'hidden md:block']">
            <table class="w-full min-w-[600px]">
                <!-- Header -->
                <thead class="border-border bg-surface-hover border-b">
                    <tr>
                        <th
                            v-for="column in columns"
                            :key="column.key"
                            :class="[
                                'text-muted px-4 py-3 text-left text-xs font-semibold tracking-wider uppercase',
                                column.align === 'center' && 'text-center',
                                column.align === 'right' && 'text-right',
                            ]"
                            :style="
                                column.width
                                    ? { width: column.width }
                                    : undefined
                            "
                        >
                            {{ column.label }}
                        </th>
                        <th
                            v-if="hasActions"
                            class="text-muted px-4 py-3 text-right text-xs font-semibold tracking-wider uppercase"
                        >
                            Actions
                        </th>
                    </tr>
                </thead>

                <!-- Body -->
                <tbody>
                    <!-- Loading state -->
                    <template v-if="loading">
                        <tr v-for="n in 5" :key="n">
                            <td
                                v-for="column in columns"
                                :key="column.key"
                                class="px-4 py-4"
                            >
                                <div
                                    class="bg-skeleton h-4 animate-pulse rounded"
                                    :style="{
                                        width: `${60 + Math.random() * 40}%`,
                                    }"
                                />
                            </td>
                            <td v-if="hasActions" class="px-4 py-4">
                                <div
                                    class="bg-skeleton ml-auto h-8 w-20 animate-pulse rounded"
                                />
                            </td>
                        </tr>
                    </template>

                    <!-- Empty state -->
                    <template v-else-if="rows.length === 0">
                        <tr>
                            <td
                                :colspan="
                                    hasActions
                                        ? columns.length + 1
                                        : columns.length
                                "
                                class="text-muted px-4 py-12 text-center"
                            >
                                <slot name="empty">
                                    {{ emptyMessage }}
                                </slot>
                            </td>
                        </tr>
                    </template>

                    <!-- Data rows -->
                    <template v-else>
                        <tr
                            v-for="(row, index) in rows"
                            :key="(row[rowKey] as string | number) ?? index"
                            :class="[
                                'border-border border-b last:border-b-0',
                                striped &&
                                    index % 2 === 1 &&
                                    'bg-surface-hover/50',
                                hoverable &&
                                    'hover:bg-surface-hover cursor-pointer transition-colors',
                            ]"
                            @click="handleRowClick(row)"
                        >
                            <td
                                v-for="column in columns"
                                :key="column.key"
                                :class="[
                                    'text-text px-4 py-4 text-sm',
                                    column.align === 'center' && 'text-center',
                                    column.align === 'right' && 'text-right',
                                ]"
                            >
                                <slot
                                    :name="`cell-${column.key}`"
                                    :row="row"
                                    :value="getCellValue(row, column)"
                                >
                                    {{ getCellValue(row, column) }}
                                </slot>
                            </td>
                            <td
                                v-if="hasActions"
                                class="px-4 py-4 text-right"
                                @click.stop
                            >
                                <div
                                    class="flex items-center justify-end gap-2"
                                >
                                    <AppButton
                                        v-for="action in actions"
                                        :key="action.label"
                                        :variant="action.variant || 'ghost'"
                                        size="sm"
                                        @click="action.handler(row)"
                                    >
                                        <span
                                            v-if="action.icon"
                                            class="h-4 w-4 [&>svg]:h-full [&>svg]:w-full"
                                            v-html="action.icon"
                                        />
                                        <span
                                            v-if="action.label && !action.icon"
                                            >{{ action.label }}</span
                                        >
                                    </AppButton>
                                </div>
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>

        <!-- Mobile stacked layout -->
        <div
            v-if="responsive"
            data-testid="mobile-layout"
            class="block md:hidden"
        >
            <!-- Mobile loading state -->
            <template v-if="loading">
                <div
                    v-for="n in 5"
                    :key="n"
                    class="border-border border-b p-4 last:border-b-0"
                >
                    <div
                        v-for="column in columns"
                        :key="column.key"
                        class="mb-3 last:mb-0"
                    >
                        <div
                            class="bg-skeleton mb-1 h-3 w-16 animate-pulse rounded"
                        />
                        <div
                            class="bg-skeleton h-4 animate-pulse rounded"
                            :style="{ width: `${60 + Math.random() * 40}%` }"
                        />
                    </div>
                </div>
            </template>

            <!-- Mobile empty state -->
            <template v-else-if="rows.length === 0">
                <div class="text-muted px-4 py-12 text-center">
                    <slot name="empty">
                        {{ emptyMessage }}
                    </slot>
                </div>
            </template>

            <!-- Mobile data rows -->
            <template v-else>
                <div
                    v-for="(row, index) in rows"
                    :key="(row[rowKey] as string | number) ?? index"
                    data-testid="mobile-row"
                    :class="[
                        'border-border border-b p-4 last:border-b-0',
                        striped && index % 2 === 1 && 'bg-surface-hover/50',
                        hoverable &&
                            'hover:bg-surface-hover cursor-pointer transition-colors',
                    ]"
                    @click="handleRowClick(row)"
                >
                    <slot name="mobile-row" :row="row" :columns="columns">
                        <div
                            v-for="column in columns"
                            :key="column.key"
                            class="mb-3 last:mb-0"
                        >
                            <div
                                class="text-muted mb-0.5 text-xs font-semibold tracking-wider uppercase"
                            >
                                {{ column.label }}
                            </div>
                            <div class="text-text text-sm">
                                <slot
                                    :name="`cell-${column.key}`"
                                    :row="row"
                                    :value="getCellValue(row, column)"
                                >
                                    {{ getCellValue(row, column) }}
                                </slot>
                            </div>
                        </div>

                        <!-- Mobile actions -->
                        <div
                            v-if="hasActions"
                            class="border-border mt-3 flex items-center justify-end gap-2 border-t pt-3"
                            @click.stop
                        >
                            <AppButton
                                v-for="action in actions"
                                :key="action.label"
                                :variant="action.variant || 'ghost'"
                                size="sm"
                                @click="action.handler(row)"
                            >
                                <span
                                    v-if="action.icon"
                                    class="h-4 w-4 [&>svg]:h-full [&>svg]:w-full"
                                    v-html="action.icon"
                                />
                                <span v-if="action.label && !action.icon">{{
                                    action.label
                                }}</span>
                            </AppButton>
                        </div>
                    </slot>
                </div>
            </template>
        </div>

        <!-- Footer slot for pagination -->
        <div v-if="$slots.footer" class="border-border border-t px-4 py-3">
            <slot name="footer" />
        </div>
    </div>
</template>
