<script setup lang="ts" generic="T extends string | number">
import { computed, useId } from 'vue';

const props = withDefaults(
    defineProps<{
        modelValue?: T;
        value: T;
        label?: string;
        description?: string;
        name?: string;
        error?: string;
        hint?: string;
        required?: boolean;
        disabled?: boolean;
    }>(),
    {
        modelValue: undefined,
        label: '',
        description: '',
        name: undefined,
        error: '',
        hint: '',
        required: false,
        disabled: false,
    },
);

const emit = defineEmits<{
    'update:modelValue': [value: T];
}>();

const radioId = useId();
const hasError = computed(() => Boolean(props.error));
const checked = computed(() => props.modelValue === props.value);

const helperIds = computed(() => {
    const ids: string[] = [];
    if (props.description) ids.push(`${radioId}-description`);
    if (props.error || props.hint) ids.push(`${radioId}-helper`);
    return ids.length ? ids.join(' ') : undefined;
});

const select = (): void => {
    if (props.disabled) return;
    emit('update:modelValue', props.value);
};
</script>

<template>
    <div :class="['relative', disabled && 'cursor-not-allowed opacity-50']">
        <label
            :for="radioId"
            :class="[
                'flex items-start gap-3',
                disabled ? 'cursor-not-allowed' : 'cursor-pointer',
            ]"
        >
            <!-- Hidden native radio -->
            <input
                :id="radioId"
                type="radio"
                :checked="checked"
                :value="value"
                :name="name"
                :disabled="disabled"
                :required="required"
                :aria-invalid="hasError || undefined"
                :aria-describedby="helperIds"
                class="peer sr-only"
                @change="select"
            />

            <!-- Visual radio -->
            <div
                :class="[
                    'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center',
                    'rounded-full border',
                    'transition-colors duration-[var(--transition-fast)]',
                    'peer-focus:ring-focus-ring peer-focus:ring-2 peer-focus:ring-offset-2',

                    checked
                        ? 'border-primary-600 bg-primary-600'
                        : hasError
                          ? 'border-danger bg-input-bg'
                          : 'border-input-border bg-input-bg',
                ]"
                aria-hidden="true"
            >
                <div v-if="checked" class="h-2 w-2 rounded-full bg-white" />
            </div>

            <!-- Label + description -->
            <div v-if="label || description" class="select-none">
                <span class="text-text text-sm font-medium">
                    {{ label }}
                    <span v-if="required" class="text-danger ml-0.5">*</span>
                </span>
                <p
                    v-if="description"
                    :id="`${radioId}-description`"
                    class="text-muted text-sm"
                >
                    {{ description }}
                </p>
            </div>
        </label>

        <!-- Helper text (error / hint) -->
        <p
            v-if="error || hint"
            :id="`${radioId}-helper`"
            :class="[
                'mt-1.5 ml-8 text-sm',
                hasError ? 'text-danger' : 'text-muted',
            ]"
        >
            {{ error || hint }}
        </p>
    </div>
</template>
