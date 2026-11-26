<script setup lang="ts">
import { computed, ref, useAttrs, useId, useTemplateRef } from 'vue';
import type { ControlSize } from '../types';
import AppIcon from './AppIcon.vue';

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
    revealable?: boolean;
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
    revealable: false,
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

// A revealable password field owns the suffix: the eye button replaces any
// #suffix slot content.
const canReveal = computed(() => props.revealable && props.type === 'password');
const revealed = ref(false);
const inputType = computed(() =>
    canReveal.value && revealed.value ? 'text' : props.type,
);

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
            class="text-text mb-1.5 block text-sm font-medium"
        >
            {{ label }}
            <span v-if="required" class="text-danger ml-0.5">*</span>
        </label>

        <!-- Input wrapper -->
        <div class="relative">
            <!-- Prefix slot -->
            <div
                v-if="$slots.prefix"
                class="text-muted pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
            >
                <slot name="prefix" />
            </div>

            <input
                :id="inputId"
                ref="inputEl"
                v-model="inputValue"
                v-bind="inputAttrs"
                :type="inputType"
                :placeholder="placeholder"
                :disabled="disabled"
                :required="required"
                :autocomplete="autocomplete"
                :class="[
                    'w-full',
                    {
                        sm: 'min-h-[36px] py-1.5 text-sm',
                        md: 'min-h-[44px] py-2.5',
                        lg: 'min-h-[52px] py-3',
                    }[size],
                    'bg-input-bg text-text',
                    'rounded-md border',
                    'placeholder:text-muted',
                    'transition-colors duration-[var(--transition-fast)]',
                    'focus:ring-focus-ring focus:border-transparent focus:ring-2 focus:outline-none',
                    'disabled:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-50',
                    '[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',

                    // Padding based on slots
                    $slots.prefix ? 'pl-10' : 'pl-3',
                    canReveal || $slots.suffix ? 'pr-10' : 'pr-3',

                    // Border color based on state
                    hasError
                        ? 'border-danger focus:ring-danger'
                        : 'border-input-border',
                ]"
            />

            <!-- Show/hide toggle for password fields -->
            <div
                v-if="canReveal"
                class="text-muted absolute inset-y-0 right-0 flex items-center pr-3"
            >
                <button
                    type="button"
                    class="hover:text-text flex h-7 w-7 items-center justify-center rounded transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                    :disabled="disabled"
                    :aria-label="revealed ? 'Hide password' : 'Show password'"
                    :aria-pressed="revealed"
                    @click="revealed = !revealed"
                >
                    <AppIcon :name="revealed ? 'eye-off' : 'eye'" size="sm" />
                </button>
            </div>

            <!-- Suffix slot -->
            <div
                v-else-if="$slots.suffix"
                class="text-muted absolute inset-y-0 right-0 flex items-center pr-3"
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
