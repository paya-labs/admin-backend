<script setup lang="ts" generic="T extends object">
import { computed, nextTick, useTemplateRef, watch } from 'vue';
import { useAsyncSearch } from '../composables/useAsyncSearch';
import { vClickOutside } from '../directives/clickOutside';
import type { ControlSize } from '../types';
import type { AppComboboxProps } from './AppCombobox.types';
import AppIcon from './AppIcon.vue';

const props = withDefaults(defineProps<AppComboboxProps<T>>(), {
    modelValue: null,
    multiple: false,
    getKey: (item: T) => {
        const record = item as Record<string, unknown>;
        return (record.id as string | number) ?? JSON.stringify(item);
    },
    getLabel: (item: T) => {
        const record = item as Record<string, unknown>;
        return (
            (record.label as string) ??
            (record.name as string) ??
            String(record.id ?? '')
        );
    },
    placeholder: 'Search...',
    minChars: 2,
    debounceMs: 300,
    maxResults: 10,
    clearOnSelect: false,
    error: '',
    disabled: false,
    minLengthHint: '',
    size: 'md',
});

const sizeClasses = computed(() => {
    const map: Record<
        ControlSize,
        { input: string; icon: 'sm' | 'md'; trailingPad: string }
    > = {
        sm: {
            input: 'min-h-9 py-1.5 pl-8 pr-9 text-sm',
            icon: 'sm',
            trailingPad: 'pr-2',
        },
        md: {
            input: 'min-h-11 py-2.5 pl-9 pr-10 text-sm',
            icon: 'sm',
            trailingPad: 'pr-3',
        },
        lg: {
            input: 'min-h-12 py-3 pl-10 pr-11 text-base',
            icon: 'md',
            trailingPad: 'pr-3',
        },
    };
    return map[props.size];
});

const leadingIconLeftClass = computed(() => {
    const map: Record<ControlSize, string> = {
        sm: 'left-2.5',
        md: 'left-3',
        lg: 'left-3',
    };
    return map[props.size];
});

const emit = defineEmits<{
    'update:modelValue': [value: T | T[] | null];
    select: [item: T];
}>();

defineSlots<{
    item(_props: { item: T; active: boolean; index: number }): unknown;
    chip(_props: { item: T; remove: () => void; index: number }): unknown;
    empty(_props: { query: string }): unknown;
    loading(): unknown;
    placeholder(_props: { minChars: number }): unknown;
    'leading-icon'(): unknown;
    trailing(_props: { query: string; clear: () => void }): unknown;
}>();

const inputRef = useTemplateRef<HTMLInputElement>('inputEl');

const search = useAsyncSearch<T>((q) => props.fetcher(q), {
    minChars: props.minChars,
    debounceMs: props.debounceMs,
    maxResults: props.maxResults,
});

const selectedKeys = computed<Set<string | number>>(() => {
    if (!props.modelValue) return new Set();
    const arr = Array.isArray(props.modelValue)
        ? props.modelValue
        : [props.modelValue];
    return new Set(arr.map((item) => props.getKey(item)));
});

const visibleResults = computed<T[]>(() => {
    if (!props.multiple) return search.results.value;
    return search.results.value.filter(
        (item) => !selectedKeys.value.has(props.getKey(item)),
    );
});

const selectedArray = computed<T[]>(() => {
    if (!props.modelValue) return [];
    return Array.isArray(props.modelValue)
        ? props.modelValue
        : [props.modelValue];
});

const showDropdown = computed(
    () => search.isOpen.value && search.query.value.length >= props.minChars,
);

const showEmptyState = computed(
    () =>
        showDropdown.value &&
        !search.loading.value &&
        search.hasSearched.value &&
        visibleResults.value.length === 0,
);

const handleInput = (): void => {
    if (search.query.value.length >= props.minChars) {
        search.open();
    } else {
        search.close();
    }
};

const handleFocus = (): void => {
    if (search.query.value.length >= props.minChars) {
        search.open();
    }
};

const closeDropdown = (): void => {
    search.close();
};

const clear = (): void => {
    search.clear();
    inputRef.value?.focus();
};

const commitSelection = (item: T): void => {
    emit('select', item);
    if (props.multiple) {
        const next = [...selectedArray.value, item];
        emit('update:modelValue', next);
    } else if (!props.clearOnSelect) {
        emit('update:modelValue', item);
    }
    if (props.clearOnSelect || props.multiple) {
        search.clear();
        nextTick(() => inputRef.value?.focus());
    } else {
        search.close();
    }
};

const removeItem = (item: T): void => {
    if (!props.multiple) {
        emit('update:modelValue', null);
        return;
    }
    const key = props.getKey(item);
    const next = selectedArray.value.filter((i) => props.getKey(i) !== key);
    emit('update:modelValue', next);
};

const handleKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
        if (search.isOpen.value) {
            event.preventDefault();
            event.stopPropagation();
            search.close();
            return;
        }
        if (search.query.value.length > 0) {
            event.preventDefault();
            event.stopPropagation();
            search.clear();
            return;
        }
        return;
    }
    if (event.key === 'ArrowDown') {
        event.preventDefault();
        event.stopPropagation();
        if (!search.isOpen.value && visibleResults.value.length > 0) {
            search.open();
        }
        if (visibleResults.value.length === 0) return;
        const len = visibleResults.value.length;
        search.activeIndex.value =
            search.activeIndex.value === -1
                ? 0
                : (search.activeIndex.value + 1) % len;
        return;
    }
    if (event.key === 'ArrowUp') {
        event.preventDefault();
        event.stopPropagation();
        if (visibleResults.value.length === 0) return;
        const len = visibleResults.value.length;
        search.activeIndex.value =
            search.activeIndex.value <= 0
                ? len - 1
                : search.activeIndex.value - 1;
        return;
    }
    if (event.key === 'Enter') {
        if (!search.isOpen.value || visibleResults.value.length === 0) return;
        event.preventDefault();
        event.stopPropagation();
        const idx =
            search.activeIndex.value >= 0 ? search.activeIndex.value : 0;
        const item = visibleResults.value[idx];
        if (item) commitSelection(item);
    }
};

watch(
    () => props.modelValue,
    () => {
        // When the active index points beyond the new visible list, reset it
        if (
            search.activeIndex.value >= 0 &&
            search.activeIndex.value >= visibleResults.value.length
        ) {
            search.activeIndex.value = visibleResults.value.length > 0 ? 0 : -1;
        }
    },
);

defineExpose({
    focus: () => inputRef.value?.focus(),
    blur: () => inputRef.value?.blur(),
    select: () => inputRef.value?.select(),
    clear,
});
</script>

<template>
    <div v-click-outside="closeDropdown" class="relative w-full">
        <div class="relative">
            <slot name="leading-icon">
                <AppIcon
                    name="search"
                    :size="sizeClasses.icon"
                    :class="[
                        'pointer-events-none absolute top-1/2 -translate-y-1/2 text-muted',
                        leadingIconLeftClass,
                    ]"
                />
            </slot>
            <input
                ref="inputEl"
                v-model="search.query.value"
                type="search"
                :placeholder="placeholder"
                :disabled="disabled"
                autocomplete="off"
                :class="[
                    'w-full',
                    'rounded-md border bg-input-bg text-text',
                    'placeholder:text-muted',
                    'transition-colors duration-[var(--transition-fast)]',
                    'focus:border-transparent focus:ring-2 focus:ring-focus-ring focus:outline-none',
                    'disabled:cursor-not-allowed disabled:opacity-60',
                    sizeClasses.input,
                    error
                        ? 'border-danger focus:ring-danger'
                        : 'border-input-border',
                ]"
                @input="handleInput"
                @focus="handleFocus"
                @keydown="handleKeydown"
            />
            <div
                :class="[
                    'inset-y-0 right-0 absolute flex items-center',
                    sizeClasses.trailingPad,
                ]"
            >
                <slot
                    name="trailing"
                    :query="search.query.value"
                    :clear="clear"
                >
                    <svg
                        v-if="search.loading.value"
                        class="h-5 w-5 animate-spin text-muted"
                        fill="none"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <circle
                            class="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            stroke-width="4"
                        />
                        <path
                            class="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                    </svg>
                    <button
                        v-else-if="search.query.value.length > 0"
                        type="button"
                        class="h-5 w-5 rounded flex items-center justify-center text-muted transition-colors hover:text-text"
                        aria-label="Clear search"
                        @mousedown.prevent
                        @click="clear"
                    >
                        <AppIcon name="x-mark" size="sm" />
                    </button>
                </slot>
            </div>
        </div>

        <!-- Dropdown: results / loading / empty -->
        <Transition
            enter-active-class="transition duration-100 ease-out"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition duration-75 ease-in"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
        >
            <div
                v-if="
                    showDropdown &&
                    (visibleResults.length > 0 ||
                        search.loading.value ||
                        showEmptyState)
                "
                class="mt-1 py-1 max-h-60 absolute z-50 w-full overflow-auto rounded-md border border-border bg-surface shadow-lg"
            >
                <div
                    v-if="search.loading.value && visibleResults.length === 0"
                    class="px-3 py-2.5 text-sm text-muted"
                >
                    <slot name="loading">Searching...</slot>
                </div>
                <ul v-else-if="visibleResults.length > 0">
                    <li
                        v-for="(item, index) in visibleResults"
                        :key="getKey(item)"
                        :class="[
                            'px-3 py-2.5 text-sm cursor-pointer',
                            index === search.activeIndex.value
                                ? 'bg-surface-hover text-text'
                                : 'text-text hover:bg-surface-hover',
                        ]"
                        @mousedown.prevent="commitSelection(item)"
                        @mouseenter="search.activeIndex.value = index"
                    >
                        <slot
                            name="item"
                            :item="item"
                            :active="index === search.activeIndex.value"
                            :index="index"
                        >
                            {{ getLabel(item) }}
                        </slot>
                    </li>
                </ul>
                <div
                    v-else-if="showEmptyState"
                    class="px-3 py-2.5 text-sm text-muted"
                >
                    <slot name="empty" :query="search.query.value">
                        No results found
                    </slot>
                </div>
            </div>
        </Transition>

        <!-- Min-length hint when query too short -->
        <div
            v-if="
                search.isOpen.value &&
                search.query.value.length > 0 &&
                search.query.value.length < minChars &&
                minLengthHint
            "
            class="mt-1 py-1 absolute z-50 w-full rounded-md border border-border bg-surface shadow-lg"
        >
            <div class="px-3 py-2.5 text-sm text-muted">
                {{ minLengthHint }}
            </div>
        </div>

        <!-- Selected chips (multi mode) -->
        <div
            v-if="multiple && selectedArray.length > 0"
            class="mt-2 gap-1.5 flex flex-wrap"
        >
            <slot
                v-for="(item, index) in selectedArray"
                name="chip"
                :item="item"
                :remove="() => removeItem(item)"
                :index="index"
            >
                <span
                    :key="getKey(item)"
                    class="gap-1 px-2.5 py-1 text-sm font-medium flex items-center rounded-full bg-primary-faint text-on-primary-soft"
                >
                    {{ getLabel(item) }}
                    <button
                        type="button"
                        class="flex items-center text-on-primary-soft hover:text-on-primary-soft-strong"
                        aria-label="Remove"
                        @click="removeItem(item)"
                    >
                        <AppIcon name="x-mark" size="sm" />
                    </button>
                </span>
            </slot>
        </div>

        <p v-if="error" class="mt-1.5 text-sm text-danger">{{ error }}</p>
    </div>
</template>
