<script setup lang="ts">
import { computed, useId } from 'vue';

interface Props {
    modelValue?: boolean;
    label?: string;
    description?: string;
    error?: string;
    hint?: string;
    required?: boolean;
    disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: false,
    label: '',
    description: '',
    error: '',
    hint: '',
    required: false,
    disabled: false,
});

const emit = defineEmits<{
    'update:modelValue': [value: boolean];
}>();

const checkboxId = useId();
const hasError = computed(() => Boolean(props.error));

const helperIds = computed(() => {
    const ids: string[] = [];
    if (props.description) ids.push(`${checkboxId}-description`);
    if (props.error || props.hint) ids.push(`${checkboxId}-helper`);
    return ids.length ? ids.join(' ') : undefined;
});

const toggle = (): void => {
    if (props.disabled) return;
    emit('update:modelValue', !props.modelValue);
};
</script>

<template>
    <div :class="['relative', disabled && 'opacity-50 cursor-not-allowed']">
        <label
            :for="checkboxId"
            :class="[
                'flex items-start gap-3',
                disabled ? 'cursor-not-allowed' : 'cursor-pointer',
            ]"
        >
            <!-- Hidden native checkbox -->
            <input
                :id="checkboxId"
                type="checkbox"
                :checked="modelValue"
                :disabled="disabled"
                :required="required"
                :aria-invalid="hasError || undefined"
                :aria-describedby="helperIds"
                class="peer sr-only"
                @change="toggle"
            />

            <!-- Visual checkbox -->
            <div
                :class="[
                    'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center',
                    'rounded border',
                    'transition-colors duration-[var(--transition-fast)]',
                    'peer-focus:ring-2 peer-focus:ring-focus-ring peer-focus:ring-offset-2',

                    modelValue
                        ? 'border-primary-600 bg-primary-600 dark:border-primary-500 dark:bg-primary-500'
                        : hasError
                          ? 'border-danger bg-input-bg'
                          : 'border-input-border bg-input-bg',
                ]"
                aria-hidden="true"
            >
                <svg
                    v-if="modelValue"
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

            <!-- Label + description -->
            <div v-if="label || description" class="select-none">
                <span class="text-sm font-medium text-text">
                    {{ label }}
                    <span v-if="required" class="ml-0.5 text-danger">*</span>
                </span>
                <p
                    v-if="description"
                    :id="`${checkboxId}-description`"
                    class="text-sm text-muted"
                >
                    {{ description }}
                </p>
            </div>
        </label>

        <!-- Helper text (error / hint) -->
        <p
            v-if="error || hint"
            :id="`${checkboxId}-helper`"
            :class="[
                'mt-1.5 ml-8 text-sm',
                hasError ? 'text-danger' : 'text-muted',
            ]"
        >
            {{ error || hint }}
        </p>
    </div>
</template>
