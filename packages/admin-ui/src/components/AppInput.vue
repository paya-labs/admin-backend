<script setup lang="ts">
import { computed, useAttrs, useId, useTemplateRef } from 'vue';
import type { ControlSize } from '../types';

defineOptions({ inheritAttrs: false });

interface Props {
    modelValue?: string | number;
    label?: string;
    type?: string;
    size?: ControlSize;
    placeholder?: string;
    error?: string;
    hint?: string;
    required?: boolean;
    disabled?: boolean;
    autocomplete?: string;
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: '',
    label: '',
    type: 'text',
    size: 'md',
    placeholder: '',
    error: '',
    hint: '',
    required: false,
    disabled: false,
    autocomplete: 'off',
});

const emit = defineEmits<{
    'update:modelValue': [value: string | number];
}>();

const inputId = useId();

const inputValue = computed({
    get: () => props.modelValue,
    set: (value: string | number) => emit('update:modelValue', value),
});

const hasError = computed(() => Boolean(props.error));

const inputRef = useTemplateRef<HTMLInputElement>('inputEl');
defineExpose({
    focus: () => inputRef.value?.focus(),
    blur: () => inputRef.value?.blur(),
    select: () => inputRef.value?.select(),
});

// class/style stay on the wrapper; everything else (min, max, step,
// aria-*, ...) belongs on the native input
const attrs = useAttrs();
const rootAttrs = computed(() => ({
    class: attrs.class,
    style: attrs.style,
}));
const inputAttrs = computed(() => {
    const { class: _class, style: _style, ...rest } = attrs;
    return rest;
});
</script>

<template>
    <div class="w-full" v-bind="rootAttrs">
        <!-- Label -->
        <label
            v-if="label"
            :for="inputId"
            class="mb-1.5 text-sm font-medium block text-text"
        >
            {{ label }}
            <span v-if="required" class="ml-0.5 text-danger">*</span>
        </label>

        <!-- Input wrapper -->
        <div class="relative">
            <!-- Prefix slot -->
            <div
                v-if="$slots.prefix"
                class="inset-y-0 left-0 pl-3 pointer-events-none absolute flex items-center text-muted"
            >
                <slot name="prefix" />
            </div>

            <input
                :id="inputId"
                ref="inputEl"
                v-model="inputValue"
                v-bind="inputAttrs"
                :type="type"
                :placeholder="placeholder"
                :disabled="disabled"
                :required="required"
                :autocomplete="autocomplete"
                :class="[
                    'w-full',
                    {
                        sm: 'py-1.5 text-sm min-h-[36px]',
                        md: 'py-2.5 min-h-[44px]',
                        lg: 'py-3 min-h-[52px]',
                    }[size],
                    'bg-input-bg text-text',
                    'rounded-md border',
                    'placeholder:text-muted',
                    'transition-colors duration-[var(--transition-fast)]',
                    'focus:border-transparent focus:ring-2 focus:ring-focus-ring focus:outline-none',
                    'disabled:cursor-not-allowed disabled:bg-surface-hover disabled:opacity-50',
                    '[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',

                    // Padding based on slots
                    $slots.prefix ? 'pl-10' : 'pl-3',
                    $slots.suffix ? 'pr-10' : 'pr-3',

                    // Border color based on state
                    hasError
                        ? 'border-danger focus:ring-danger'
                        : 'border-input-border',
                ]"
            />

            <!-- Suffix slot -->
            <div
                v-if="$slots.suffix"
                class="inset-y-0 right-0 pr-3 absolute flex items-center text-muted"
            >
                <slot name="suffix" />
            </div>
        </div>

        <!-- Helper text -->
        <p
            v-if="error || hint"
            :class="['mt-1.5 text-sm', hasError ? 'text-danger' : 'text-muted']"
        >
            {{ error || hint }}
        </p>
    </div>
</template>
