<script setup lang="ts">
import { computed } from 'vue';
import AppButton from './AppButton.vue';
import AppSelect from './AppSelect.vue';
import type { SelectOption } from '../types';

interface Props {
    page: number;
    pageSize: number;
    total: number;
    pageSizeOptions?: number[];
    showInfo?: boolean;
    showPageSize?: boolean;
    showPageNumbers?: boolean;
    disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    pageSizeOptions: () => [10, 25, 50, 100],
    showInfo: true,
    showPageSize: true,
    showPageNumbers: true,
    disabled: false,
});

const emit = defineEmits<{
    'update:page': [value: number];
    'update:pageSize': [value: number];
}>();

const totalPages = computed(() => {
    if (props.total === 0) return 1;
    return Math.ceil(props.total / props.pageSize);
});

const offset = computed(() => (props.page - 1) * props.pageSize);

const hasNextPage = computed(() => props.page < totalPages.value);
const hasPrevPage = computed(() => props.page > 1);

const pageRange = computed<(number | '...')[]>(() => {
    const total = totalPages.value;
    const current = props.page;
    const siblingCount = 1;
    const totalSlots = siblingCount * 2 + 5;

    if (total <= totalSlots) {
        return Array.from({ length: total }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(current - siblingCount, 1);
    const rightSiblingIndex = Math.min(current + siblingCount, total);

    const showLeftEllipsis = leftSiblingIndex > 2;
    const showRightEllipsis = rightSiblingIndex < total - 1;

    const range: (number | '...')[] = [1];

    if (showLeftEllipsis) {
        range.push('...');
    } else if (leftSiblingIndex === 2) {
        range.push(2);
    }

    for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
        if (i !== 1 && i !== total) {
            range.push(i);
        }
    }

    if (showRightEllipsis) {
        range.push('...');
    } else if (rightSiblingIndex === total - 1) {
        range.push(total - 1);
    }

    if (total > 1) {
        range.push(total);
    }

    return range;
});

const pageSizeSelectOptions = computed<SelectOption[]>(() =>
    props.pageSizeOptions.map((size) => ({
        value: size,
        label: `${size} per page`,
    })),
);

const showingFrom = computed(() => {
    if (props.total === 0) return 0;
    return offset.value + 1;
});

const showingTo = computed(() => {
    return Math.min(offset.value + props.pageSize, props.total);
});

const prevPage = (): void => {
    if (hasPrevPage.value && !props.disabled) {
        emit('update:page', props.page - 1);
    }
};

const nextPage = (): void => {
    if (hasNextPage.value && !props.disabled) {
        emit('update:page', props.page + 1);
    }
};

const goToPage = (page: number): void => {
    if (!props.disabled && page >= 1 && page <= totalPages.value) {
        emit('update:page', page);
    }
};

const setPageSize = (size: number): void => {
    if (!props.disabled) {
        emit('update:pageSize', size);
        emit('update:page', 1);
    }
};
</script>

<template>
    <div class="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <!-- Info text -->
        <div v-if="showInfo" class="text-muted text-sm">
            <template v-if="total > 0">
                Showing {{ showingFrom }} to {{ showingTo }} of {{ total }} results
            </template>
            <template v-else>No results</template>
        </div>
        <div v-else />

        <div class="flex items-center gap-4">
            <!-- Page size selector -->
            <AppSelect
                v-if="showPageSize"
                :model-value="pageSize"
                :options="pageSizeSelectOptions"
                :disabled="disabled"
                class="w-36"
                @update:model-value="setPageSize($event as number)"
            />

            <!-- Page controls -->
            <div class="flex items-center gap-1">
                <!-- Previous button -->
                <AppButton
                    variant="outline"
                    size="sm"
                    :disabled="!hasPrevPage || disabled"
                    aria-label="Previous page"
                    @click="prevPage"
                >
                    <svg
                        class="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                </AppButton>

                <!-- Page numbers -->
                <template v-if="showPageNumbers">
                    <template v-for="(p, index) in pageRange" :key="index">
                        <span
                            v-if="p === '...'"
                            class="px-2 text-muted select-none"
                        >
                            ...
                        </span>
                        <AppButton
                            v-else
                            :variant="p === page ? 'outline' : 'ghost'"
                            size="sm"
                            :disabled="disabled"
                            :aria-label="`Page ${p}`"
                            :aria-current="p === page ? 'page' : undefined"
                            @click="goToPage(p)"
                        >
                            {{ p }}
                        </AppButton>
                    </template>
                </template>

                <!-- Next button -->
                <AppButton
                    variant="outline"
                    size="sm"
                    :disabled="!hasNextPage || disabled"
                    aria-label="Next page"
                    @click="nextPage"
                >
                    <svg
                        class="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M9 5l7 7-7 7"
                        />
                    </svg>
                </AppButton>
            </div>
        </div>
    </div>
</template>