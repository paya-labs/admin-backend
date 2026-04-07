<script lang="ts">
export const DEFAULT_PALETTE = [
    '#d50000',
    '#f4511e',
    '#f6bf26',
    '#33b679',
    '#0b8043',
    '#039be5',
    '#4285f4',
    '#7986cb',
    '#8e24aa',
];

export interface ColorInputProps {
    modelValue?: string;
    label?: string;
    error?: string;
    hint?: string;
    required?: boolean;
    disabled?: boolean;
    palette?: string[] | false;
    showHex?: boolean;
}
</script>

<script setup lang="ts">
import { computed, onBeforeUnmount, reactive, ref, useId, watch } from 'vue';
import { vClickOutside } from '../directives/clickOutside';

const props = withDefaults(defineProps<ColorInputProps>(), {
    modelValue: '#000000',
    label: '',
    error: '',
    hint: '',
    required: false,
    disabled: false,
    palette: () => DEFAULT_PALETTE,
    showHex: true,
});

const emit = defineEmits<{
    'update:modelValue': [value: string];
}>();

const inputId = useId();
const hasError = computed(() => Boolean(props.error));

// --- Color conversion ---
function hexToHsv(hex: string): { h: number; s: number; v: number } {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const d = max - min;
    let h = 0;
    if (d !== 0) {
        if (max === r) h = ((g - b) / d + 6) % 6;
        else if (max === g) h = (b - r) / d + 2;
        else h = (r - g) / d + 4;
        h *= 60;
    }
    return { h, s: max === 0 ? 0 : d / max, v: max };
}

function hsvToHex(h: number, s: number, v: number): string {
    const c = v * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = v - c;
    let r = 0,
        g = 0,
        b = 0;
    if (h < 60) {
        r = c;
        g = x;
    } else if (h < 120) {
        r = x;
        g = c;
    } else if (h < 180) {
        g = c;
        b = x;
    } else if (h < 240) {
        g = x;
        b = c;
    } else if (h < 300) {
        r = x;
        b = c;
    } else {
        r = c;
        b = x;
    }
    const toHex = (n: number) =>
        Math.round((n + m) * 255)
            .toString(16)
            .padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// --- State ---
const isOpen = ref(false);
const hsv = reactive(hexToHsv(props.modelValue));
const hexInput = ref(props.modelValue);
const gradientRef = ref<HTMLElement | null>(null);
const hueRef = ref<HTMLElement | null>(null);
const dragging = ref<'gradient' | 'hue' | null>(null);

const pureHueColor = computed(() => hsvToHex(hsv.h, 1, 1));

// Sync external prop changes into internal HSV state
watch(
    () => props.modelValue,
    (val) => {
        const newHsv = hexToHsv(val);
        hsv.h = newHsv.h;
        hsv.s = newHsv.s;
        hsv.v = newHsv.v;
        hexInput.value = val;
    },
);

function emitColor() {
    const hex = hsvToHex(hsv.h, hsv.s, hsv.v);
    hexInput.value = hex;
    emit('update:modelValue', hex);
}

// --- Picker visibility ---
function togglePicker() {
    if (!props.disabled) {
        isOpen.value = !isOpen.value;
    }
}

function closePicker() {
    isOpen.value = false;
}

// --- Gradient area (saturation + value) ---
function updateFromGradient(e: PointerEvent) {
    if (!gradientRef.value) return;
    const rect = gradientRef.value.getBoundingClientRect();
    hsv.s = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    hsv.v = Math.max(0, Math.min(1, 1 - (e.clientY - rect.top) / rect.height));
    emitColor();
}

function onGradientPointerDown(e: PointerEvent) {
    e.preventDefault();
    dragging.value = 'gradient';
    updateFromGradient(e);
    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);
}

// --- Hue slider ---
function updateFromHue(e: PointerEvent) {
    if (!hueRef.value) return;
    const rect = hueRef.value.getBoundingClientRect();
    hsv.h = Math.max(
        0,
        Math.min(360, ((e.clientX - rect.left) / rect.width) * 360),
    );
    emitColor();
}

function onHuePointerDown(e: PointerEvent) {
    e.preventDefault();
    dragging.value = 'hue';
    updateFromHue(e);
    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);
}

// --- Shared drag handlers ---
function onPointerMove(e: PointerEvent) {
    if (dragging.value === 'gradient') updateFromGradient(e);
    else if (dragging.value === 'hue') updateFromHue(e);
}

function onPointerUp() {
    dragging.value = null;
    document.removeEventListener('pointermove', onPointerMove);
    document.removeEventListener('pointerup', onPointerUp);
}

onBeforeUnmount(() => {
    document.removeEventListener('pointermove', onPointerMove);
    document.removeEventListener('pointerup', onPointerUp);
});

// --- Palette ---
const paletteColors = computed(() =>
    Array.isArray(props.palette) ? props.palette : [],
);

function selectPaletteColor(color: string) {
    emit('update:modelValue', color.toLowerCase());
}

// --- Keyboard accessibility for gradient and hue ---
const GRADIENT_STEP = 0.05;
const HUE_STEP = 5;

function onGradientKeyDown(e: KeyboardEvent) {
    let handled = true;
    switch (e.key) {
        case 'ArrowRight':
            hsv.s = Math.min(1, hsv.s + GRADIENT_STEP);
            break;
        case 'ArrowLeft':
            hsv.s = Math.max(0, hsv.s - GRADIENT_STEP);
            break;
        case 'ArrowUp':
            hsv.v = Math.min(1, hsv.v + GRADIENT_STEP);
            break;
        case 'ArrowDown':
            hsv.v = Math.max(0, hsv.v - GRADIENT_STEP);
            break;
        default:
            handled = false;
    }
    if (handled) {
        e.preventDefault();
        emitColor();
    }
}

function onHueKeyDown(e: KeyboardEvent) {
    let handled = true;
    switch (e.key) {
        case 'ArrowRight':
        case 'ArrowUp':
            hsv.h = (hsv.h + HUE_STEP) % 360;
            break;
        case 'ArrowLeft':
        case 'ArrowDown':
            hsv.h = (hsv.h - HUE_STEP + 360) % 360;
            break;
        default:
            handled = false;
    }
    if (handled) {
        e.preventDefault();
        emitColor();
    }
}

// --- Hex text input ---
function onHexInput(e: Event) {
    hexInput.value = (e.target as HTMLInputElement).value;
}

function commitHex() {
    const val = hexInput.value.trim();
    if (/^#[0-9a-fA-F]{6}$/.test(val)) {
        emit('update:modelValue', val.toLowerCase());
    } else {
        hexInput.value = props.modelValue;
    }
}
</script>

<template>
    <div v-click-outside="closePicker" class="relative w-full">
        <!-- Label -->
        <label
            v-if="label"
            :for="inputId"
            class="mb-1.5 text-sm font-medium block text-text"
        >
            {{ label }}
            <span v-if="required" class="ml-0.5 text-danger">*</span>
        </label>

        <!-- Trigger button -->
        <button
            :id="inputId"
            type="button"
            :disabled="disabled"
            :class="[
                'gap-3 inline-flex items-center',
                'px-3 py-2 min-h-[44px]',
                'rounded-md border bg-input-bg text-text',
                'transition-colors duration-[var(--transition-fast)]',
                'focus:border-transparent focus:ring-2 focus:ring-focus-ring focus:outline-none',
                'disabled:cursor-not-allowed disabled:opacity-50',
                hasError
                    ? 'border-danger focus:ring-danger'
                    : 'border-input-border',
            ]"
            @click="togglePicker"
        >
            <span
                class="size-7 border-black/10 shrink-0 rounded-md border shadow-sm"
                :style="{ backgroundColor: modelValue }"
                aria-hidden="true"
            />
            <span
                v-if="showHex"
                class="font-mono text-sm text-text-secondary select-all"
            >
                {{ modelValue }}
            </span>
        </button>

        <!-- Picker dropdown -->
        <Transition
            enter-active-class="transition duration-[var(--transition-fast)] ease-out"
            enter-from-class="scale-95 opacity-0"
            enter-to-class="scale-100 opacity-100"
            leave-active-class="transition duration-[var(--transition-fast)] ease-in"
            leave-from-class="scale-100 opacity-100"
            leave-to-class="scale-95 opacity-0"
        >
            <div
                v-if="isOpen"
                class="mt-1 w-64 p-3 absolute z-50 origin-top-left rounded-lg border border-border bg-surface shadow-lg"
                @keydown.escape="closePicker"
            >
                <!-- Saturation / Value gradient -->
                <div
                    ref="gradientRef"
                    class="h-40 relative w-full cursor-crosshair rounded-md"
                    :style="{ backgroundColor: pureHueColor }"
                    tabindex="0"
                    role="application"
                    aria-label="Color saturation and brightness"
                    @pointerdown="onGradientPointerDown"
                    @keydown="onGradientKeyDown"
                >
                    <!-- White overlay (left to right) -->
                    <div
                        class="inset-0 absolute rounded-md"
                        style="
                            background: linear-gradient(
                                to right,
                                #fff,
                                transparent
                            );
                        "
                    />
                    <!-- Black overlay (top to bottom) -->
                    <div
                        class="inset-0 absolute rounded-md"
                        style="
                            background: linear-gradient(
                                to bottom,
                                transparent,
                                #000
                            );
                        "
                    />
                    <!-- Cursor -->
                    <div
                        class="size-4 border-white pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 shadow-[0_0_0_1px_rgba(0,0,0,0.3)]"
                        :style="{
                            left: `${hsv.s * 100}%`,
                            top: `${(1 - hsv.v) * 100}%`,
                        }"
                    />
                </div>

                <!-- Hue slider -->
                <div
                    ref="hueRef"
                    class="mt-3 h-3 relative w-full cursor-pointer rounded-full"
                    style="
                        background: linear-gradient(
                            to right,
                            #f00 0%,
                            #ff0 17%,
                            #0f0 33%,
                            #0ff 50%,
                            #00f 67%,
                            #f0f 83%,
                            #f00 100%
                        );
                    "
                    tabindex="0"
                    role="slider"
                    aria-label="Hue"
                    :aria-valuemin="0"
                    :aria-valuemax="360"
                    :aria-valuenow="Math.round(hsv.h)"
                    @pointerdown="onHuePointerDown"
                    @keydown="onHueKeyDown"
                >
                    <div
                        class="size-4 border-white pointer-events-none absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 shadow-[0_0_0_1px_rgba(0,0,0,0.3)]"
                        :style="{
                            left: `${(hsv.h / 360) * 100}%`,
                            backgroundColor: pureHueColor,
                        }"
                    />
                </div>

                <!-- Palette swatches -->
                <div
                    v-if="paletteColors.length"
                    class="mt-3 gap-1.5 flex flex-wrap"
                >
                    <button
                        v-for="color in paletteColors"
                        :key="color"
                        type="button"
                        :title="color"
                        :class="[
                            'size-5 p-0 rounded-full border',
                            'transition-transform duration-[var(--transition-fast)]',
                            'hover:scale-125',
                            'focus:ring-2 focus:ring-focus-ring focus:ring-offset-1 focus:outline-none',
                            modelValue.toLowerCase() === color.toLowerCase()
                                ? 'border-text shadow-[0_0_0_1.5px_var(--color-surface)]'
                                : 'border-black/10',
                        ]"
                        :style="{ backgroundColor: color }"
                        @click="selectPaletteColor(color)"
                    />
                </div>

                <!-- Hex input -->
                <div class="mt-3 gap-2 flex items-center">
                    <span
                        class="size-8 border-black/10 shrink-0 rounded-md border"
                        :style="{ backgroundColor: modelValue }"
                    />
                    <input
                        type="text"
                        :value="hexInput"
                        maxlength="7"
                        class="px-2 py-1.5 font-mono text-sm w-full rounded-md border border-input-border bg-input-bg text-text focus:border-transparent focus:ring-2 focus:ring-focus-ring focus:outline-none"
                        @input="onHexInput"
                        @keydown.enter="commitHex"
                        @blur="commitHex"
                    />
                </div>
            </div>
        </Transition>

        <!-- Helper text -->
        <p
            v-if="error || hint"
            :class="['mt-1.5 text-sm', hasError ? 'text-danger' : 'text-muted']"
        >
            {{ error || hint }}
        </p>
    </div>
</template>
