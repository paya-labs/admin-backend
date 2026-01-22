<script setup lang="ts">
import { computed, ref, useId, watch } from 'vue';
import { vClickOutside } from '../directives/clickOutside';
import type { SelectOption } from '../types';

interface Props {
    modelValue?: string | number;
    options: SelectOption[];
    label?: string;
    placeholder?: string;
    error?: string;
    hint?: string;
    required?: boolean;
    disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: '',
    label: '',
    placeholder: 'Select an option',
    error: '',
    hint: '',
    required: false,
    disabled: false,
});

const emit = defineEmits<{
    'update:modelValue': [value: string | number];
}>();

const selectId = useId();
const isOpen = ref(false);
const highlightedIndex = ref(-1);
const listboxRef = ref<HTMLUListElement | null>(null);

const selectedOption = computed(() => {
    return props.options.find((opt) => opt.value === props.modelValue) || null;
});

const displayValue = computed(() => {
    return selectedOption.value?.label || '';
});

const hasError = computed(() => Boolean(props.error));

const enabledOptions = computed(() => {
    return props.options.filter((opt) => !opt.disabled);
});

const toggleDropdown = (): void => {
    if (props.disabled) return;
    isOpen.value = !isOpen.value;

    if (isOpen.value) {
        const selectedIndex = props.options.findIndex(
            (opt) => opt.value === props.modelValue,
        );
        highlightedIndex.value = selectedIndex >= 0 ? selectedIndex : 0;
    }
};

const closeDropdown = (): void => {
    isOpen.value = false;
    highlightedIndex.value = -1;
};

const selectOption = (option: SelectOption): void => {
    if (option.disabled) return;
    emit('update:modelValue', option.value);
    closeDropdown();
};

const handleKeydown = (event: KeyboardEvent): void => {
    if (props.disabled) return;

    switch (event.key) {
        case 'Enter':
        case ' ':
            event.preventDefault();
            if (!isOpen.value) {
                toggleDropdown();
            } else if (highlightedIndex.value >= 0) {
                const option = props.options[highlightedIndex.value];
                if (option && !option.disabled) {
                    selectOption(option);
                }
            }
            break;

        case 'Escape':
            event.preventDefault();
            closeDropdown();
            break;

        case 'ArrowDown':
            event.preventDefault();
            if (!isOpen.value) {
                toggleDropdown();
            } else {
                moveHighlight(1);
            }
            break;

        case 'ArrowUp':
            event.preventDefault();
            if (!isOpen.value) {
                toggleDropdown();
            } else {
                moveHighlight(-1);
            }
            break;

        case 'Home':
            event.preventDefault();
            if (isOpen.value) {
                highlightedIndex.value = findNextEnabledIndex(0, 1);
            }
            break;

        case 'End':
            event.preventDefault();
            if (isOpen.value) {
                highlightedIndex.value = findNextEnabledIndex(
                    props.options.length - 1,
                    -1,
                );
            }
            break;
    }
};

const findNextEnabledIndex = (startIndex: number, direction: number): number => {
    let index = startIndex;
    const len = props.options.length;

    while (index >= 0 && index < len) {
        if (!props.options[index].disabled) {
            return index;
        }
        index += direction;
    }

    return highlightedIndex.value;
};

const moveHighlight = (delta: number): void => {
    const len = props.options.length;
    if (len === 0 || enabledOptions.value.length === 0) return;

    let newIndex = highlightedIndex.value + delta;

    if (newIndex < 0) newIndex = len - 1;
    if (newIndex >= len) newIndex = 0;

    const startIndex = newIndex;
    while (props.options[newIndex]?.disabled) {
        newIndex += delta;
        if (newIndex < 0) newIndex = len - 1;
        if (newIndex >= len) newIndex = 0;
        if (newIndex === startIndex) break;
    }

    highlightedIndex.value = newIndex;
};

watch(highlightedIndex, (index) => {
    if (index >= 0 && listboxRef.value) {
        const items = listboxRef.value.querySelectorAll('[role="option"]');
        const item = items[index];
        if (item && typeof item.scrollIntoView === 'function') {
            item.scrollIntoView({ block: 'nearest' });
        }
    }
});
</script>

<template>
    <div v-click-outside="closeDropdown" class="relative w-full">
        <!-- Label -->
        <label
            v-if="label"
            :id="`${selectId}-label`"
            class="mb-1.5 text-sm font-medium block text-text"
        >
            {{ label }}
            <span v-if="required" class="ml-0.5 text-danger">*</span>
        </label>

        <!-- Select button -->
        <button
            :id="selectId"
            type="button"
            :disabled="disabled"
            :aria-expanded="isOpen"
            :aria-haspopup="'listbox'"
            :aria-labelledby="label ? `${selectId}-label` : undefined"
            :aria-describedby="error || hint ? `${selectId}-helper` : undefined"
            :class="[
                'flex w-full items-center justify-between',
                'px-3 py-2.5 min-h-[44px]',
                'bg-input-bg text-left',
                'rounded-md border',
                'transition-colors duration-[var(--transition-fast)]',
                'focus:border-transparent focus:ring-2 focus:ring-focus-ring focus:outline-none',
                'disabled:cursor-not-allowed disabled:bg-surface-hover disabled:opacity-50',
                'cursor-pointer',

                // Border color based on state
                hasError
                    ? 'border-danger focus:ring-danger'
                    : isOpen
                      ? 'border-transparent ring-2 ring-focus-ring'
                      : 'border-input-border',
            ]"
            @click="toggleDropdown"
            @keydown="handleKeydown"
        >
            <span :class="[displayValue ? 'text-text' : 'text-muted']">
                {{ displayValue || placeholder }}
            </span>

            <!-- Chevron icon -->
            <svg
                :class="[
                    'ml-2 h-5 w-5 shrink-0 text-muted transition-transform duration-200',
                    isOpen && 'rotate-180',
                ]"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
            >
                <path
                    fill-rule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                />
            </svg>
        </button>

        <!-- Dropdown list -->
        <Transition
            enter-active-class="transition duration-100 ease-out"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition duration-75 ease-in"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
        >
            <ul
                v-show="isOpen"
                ref="listboxRef"
                role="listbox"
                :aria-labelledby="label ? `${selectId}-label` : undefined"
                class="mt-1 max-h-60 py-1 absolute z-50 w-full overflow-auto rounded-md border border-border bg-surface shadow-lg"
            >
                <li
                    v-for="(option, index) in options"
                    :key="option.value"
                    role="option"
                    :aria-selected="option.value === modelValue"
                    :aria-disabled="option.disabled"
                    :class="[
                        'px-3 py-2.5 text-sm relative cursor-pointer',
                        'select-none',

                        // Disabled state
                        option.disabled &&
                            'cursor-not-allowed text-muted opacity-50',

                        // Selected state
                        !option.disabled &&
                            option.value === modelValue &&
                            'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300',

                        // Highlighted state (keyboard navigation)
                        !option.disabled &&
                            index === highlightedIndex &&
                            option.value !== modelValue &&
                            'bg-surface-hover text-text',

                        // Default state
                        !option.disabled &&
                            option.value !== modelValue &&
                            index !== highlightedIndex &&
                            'text-text hover:bg-surface-hover',
                    ]"
                    @click="selectOption(option)"
                    @mouseenter="!option.disabled && (highlightedIndex = index)"
                >
                    <span class="block truncate">{{ option.label }}</span>

                    <!-- Checkmark for selected option -->
                    <span
                        v-if="option.value === modelValue"
                        class="inset-y-0 right-0 pr-3 absolute flex items-center text-primary-600 dark:text-primary-400"
                    >
                        <svg
                            class="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clip-rule="evenodd"
                            />
                        </svg>
                    </span>
                </li>
            </ul>
        </Transition>

        <!-- Helper text -->
        <p
            v-if="error || hint"
            :id="`${selectId}-helper`"
            :class="['mt-1.5 text-sm', hasError ? 'text-danger' : 'text-muted']"
        >
            {{ error || hint }}
        </p>
    </div>
</template>
