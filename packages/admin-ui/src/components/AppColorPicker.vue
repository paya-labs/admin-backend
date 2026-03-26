<script setup lang="ts">
import type { EventColor } from '../types';

interface Props {
    modelValue: string;
    colors: EventColor[];
    label?: string;
}

defineProps<Props>();

const emit = defineEmits<{
    'update:modelValue': [value: string];
}>();

const selectColor = (color: string) => {
    emit('update:modelValue', color);
};
</script>

<template>
    <div class="app-calendar-color-picker">
        <span
            v-if="label"
            :id="`color-picker-label-${$.uid}`"
            class="app-calendar-modal-label"
        >
            {{ label }}
        </span>
        <div
            class="app-calendar-color-options"
            role="radiogroup"
            :aria-labelledby="label ? `color-picker-label-${$.uid}` : undefined"
        >
            <button
                v-for="color in colors"
                :key="color.value"
                type="button"
                role="radio"
                class="app-calendar-color-swatch"
                :class="{
                    'app-calendar-color-swatch--selected':
                        modelValue === color.value,
                }"
                :style="{ backgroundColor: color.value }"
                :title="color.name"
                :aria-label="color.name"
                :aria-checked="modelValue === color.value"
                @click="selectColor(color.value)"
            >
                <svg
                    v-if="modelValue === color.value"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="3"
                    aria-hidden="true"
                >
                    <polyline points="20 6 9 17 4 12" />
                </svg>
            </button>
        </div>
    </div>
</template>
