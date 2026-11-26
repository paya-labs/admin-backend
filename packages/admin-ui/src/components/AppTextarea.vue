<script setup lang="ts">
import { computed, useId } from 'vue';
import type { ControlSize } from '../types';

type ResizeOption = 'none' | 'vertical' | 'horizontal' | 'both';

interface Props {
    modelValue?: string;
    label?: string;
    placeholder?: string;
    error?: string;
    hint?: string;
    required?: boolean;
    disabled?: boolean;
    rows?: number;
    maxlength?: number;
    resize?: ResizeOption;
    size?: ControlSize;
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: '',
    label: '',
    placeholder: '',
    error: '',
    hint: '',
    required: false,
    disabled: false,
    rows: 3,
    maxlength: undefined,
    resize: 'vertical',
    size: 'md',
});

const emit = defineEmits<{
    'update:modelValue': [value: string];
}>();

const textareaId = useId();

const textareaValue = computed({
    get: () => props.modelValue,
    set: (value: string) => emit('update:modelValue', value),
});

const hasError = computed(() => Boolean(props.error));

const characterCount = computed(() => props.modelValue?.length ?? 0);

const resizeClass = computed(() => {
    const classes: Record<ResizeOption, string> = {
        none: 'resize-none',
        vertical: 'resize-y',
        horizontal: 'resize-x',
        both: 'resize',
    };
    return classes[props.resize] || 'resize-y';
});
</script>

<template>
    <div class="w-full">
        <!-- Label -->
        <label
            v-if="label"
            :for="textareaId"
            class="text-text mb-1.5 block text-sm font-medium"
        >
            {{ label }}
            <span v-if="required" class="text-danger ml-0.5">*</span>
        </label>

        <!-- Textarea -->
        <textarea
            :id="textareaId"
            v-model="textareaValue"
            :placeholder="placeholder"
            :disabled="disabled"
            :required="required"
            :rows="rows"
            :maxlength="maxlength"
            :class="[
                'w-full',
                {
                    sm: 'px-3 py-1.5 text-sm',
                    md: 'px-3 py-2.5',
                    lg: 'px-3 py-3',
                }[size],
                'bg-input-bg text-text',
                'rounded-md border',
                'placeholder:text-muted',
                'transition-colors duration-[var(--transition-fast)]',
                'focus:ring-focus-ring focus:border-transparent focus:ring-2 focus:outline-none',
                'disabled:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-50',
                resizeClass,

                // Border color based on state
                hasError
                    ? 'border-danger focus:ring-danger'
                    : 'border-input-border',
            ]"
        />

        <!-- Footer: helper text and/or character count -->
        <div
            v-if="error || hint || maxlength"
            class="mt-1.5 flex items-start justify-between gap-4"
        >
            <p
                v-if="error || hint"
                :class="['text-sm', hasError ? 'text-danger' : 'text-muted']"
            >
                {{ error || hint }}
            </p>
            <span v-else />
            <span v-if="maxlength" class="text-muted shrink-0 text-xs">
                {{ characterCount }}/{{ maxlength }}
            </span>
        </div>
    </div>
</template>
