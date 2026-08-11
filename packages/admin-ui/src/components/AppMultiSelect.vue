<script setup lang="ts">
import { computed, onBeforeUnmount, ref, useId, watch } from 'vue';
import type { ControlSize, SelectOption } from '../types';

interface Props {
    modelValue?: (string | number)[];
    options: SelectOption[];
    label?: string;
    placeholder?: string;
    size?: ControlSize;
    error?: string;
    hint?: string;
    required?: boolean;
    disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: () => [],
    label: '',
    placeholder: 'Select options',
    size: 'md',
    error: '',
    hint: '',
    required: false,
    disabled: false,
});

const emit = defineEmits<{
    'update:modelValue': [value: (string | number)[]];
}>();

const selectId = useId();
const isOpen = ref(false);
const highlightedIndex = ref(-1);
const listboxRef = ref<HTMLUListElement | null>(null);
const triggerRef = ref<HTMLButtonElement | null>(null);
const wrapperRef = ref<HTMLDivElement | null>(null);
const dropdownPos = ref<Record<string, string>>({});

const updateDropdownPosition = (): void => {
    if (!triggerRef.value) return;
    const rect = triggerRef.value.getBoundingClientRect();
    dropdownPos.value = {
        position: 'fixed',
        top: `${rect.bottom + 4}px`,
        left: `${rect.left}px`,
        minWidth: `${rect.width}px`,
    };
};

const isSelected = (option: SelectOption): boolean =>
    props.modelValue.includes(option.value);

const displayValue = computed(() => {
    if (props.modelValue.length === 0) return '';
    if (props.modelValue.length === 1) {
        const selected = props.options.find(
            (opt) => opt.value === props.modelValue[0],
        );
        return selected?.label ?? '1 selected';
    }
    return `${props.modelValue.length} selected`;
});

const hasError = computed(() => Boolean(props.error));

const toggleDropdown = (): void => {
    if (props.disabled) return;
    isOpen.value = !isOpen.value;

    if (isOpen.value) {
        highlightedIndex.value = -1;
        updateDropdownPosition();
    }
};

const closeDropdown = (): void => {
    isOpen.value = false;
    highlightedIndex.value = -1;
};

// Selection does not close the dropdown: picking several options in a row
// is the whole point of a multi select.
const toggleOption = (option: SelectOption): void => {
    if (option.disabled) return;
    emit(
        'update:modelValue',
        isSelected(option)
            ? props.modelValue.filter((value) => value !== option.value)
            : [...props.modelValue, option.value],
    );
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
                if (option) {
                    toggleOption(option);
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
    }
};

const moveHighlight = (delta: number): void => {
    const len = props.options.length;
    if (len === 0) return;

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

const handleAncestorScroll = (event: Event): void => {
    if (isOpen.value) {
        if (
            event.target instanceof Node &&
            listboxRef.value?.contains(event.target)
        ) {
            return;
        }
        closeDropdown();
    }
};

const handleClickOutside = (event: MouseEvent): void => {
    const target = event.target as Node;
    const isInsideWrapper = wrapperRef.value?.contains(target);
    const isInsideListbox = listboxRef.value?.contains(target);
    if (!isInsideWrapper && !isInsideListbox) {
        closeDropdown();
    }
};

watch(isOpen, (open) => {
    if (open) {
        window.addEventListener('scroll', handleAncestorScroll, true);
        window.addEventListener('resize', closeDropdown);
        document.addEventListener('click', handleClickOutside);
    } else {
        window.removeEventListener('scroll', handleAncestorScroll, true);
        window.removeEventListener('resize', closeDropdown);
        document.removeEventListener('click', handleClickOutside);
    }
});

onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleAncestorScroll, true);
    window.removeEventListener('resize', closeDropdown);
    document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
    <div ref="wrapperRef" class="relative w-full">
        <!-- Label -->
        <label
            v-if="label"
            :id="`${selectId}-label`"
            class="mb-1.5 text-sm font-medium block text-text"
        >
            {{ label }}
            <span v-if="required" class="ml-0.5 text-danger">*</span>
        </label>

        <!-- Trigger button -->
        <button
            ref="triggerRef"
            :id="selectId"
            type="button"
            :disabled="disabled"
            :aria-expanded="isOpen"
            :aria-haspopup="'listbox'"
            :aria-labelledby="label ? `${selectId}-label` : undefined"
            :aria-describedby="error || hint ? `${selectId}-helper` : undefined"
            :class="[
                'flex w-full items-center justify-between',
                {
                    sm: 'px-3 py-1.5 text-sm min-h-[36px]',
                    md: 'px-3 py-2.5 min-h-[44px]',
                    lg: 'px-3 py-3 min-h-[52px]',
                }[size],
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

        <!-- Dropdown list (teleported to body to escape overflow/transform contexts) -->
        <Teleport to="body">
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
                    aria-multiselectable="true"
                    :aria-labelledby="label ? `${selectId}-label` : undefined"
                    :style="dropdownPos"
                    class="max-h-60 py-1 z-[var(--z-dropdown,9999)] overflow-auto rounded-md border border-border bg-surface shadow-lg"
                >
                    <li
                        v-for="(option, index) in options"
                        :key="option.value"
                        role="option"
                        :aria-selected="isSelected(option)"
                        :aria-disabled="option.disabled"
                        :class="[
                            'px-3 py-2 text-sm relative cursor-pointer',
                            'gap-2.5 flex items-center select-none',

                            // Disabled state
                            option.disabled &&
                                'cursor-not-allowed text-muted opacity-50',

                            // Highlighted state (keyboard navigation)
                            !option.disabled &&
                                index === highlightedIndex &&
                                'bg-surface-hover text-text',

                            // Default state
                            !option.disabled &&
                                index !== highlightedIndex &&
                                'text-text hover:bg-surface-hover',
                        ]"
                        @click="toggleOption(option)"
                        @mouseenter="
                            !option.disabled && (highlightedIndex = index)
                        "
                    >
                        <!-- Visual checkbox -->
                        <div
                            :class="[
                                'h-5 w-5 flex shrink-0 items-center justify-center',
                                'rounded border',
                                'transition-colors duration-[var(--transition-fast)]',
                                isSelected(option)
                                    ? 'border-primary-600 bg-primary-600'
                                    : 'border-input-border bg-input-bg',
                            ]"
                            aria-hidden="true"
                        >
                            <svg
                                v-if="isSelected(option)"
                                class="h-3.5 w-3.5 text-white"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fill-rule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clip-rule="evenodd"
                                />
                            </svg>
                        </div>

                        <span class="block truncate">{{ option.label }}</span>
                    </li>
                </ul>
            </Transition>
        </Teleport>

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
