<script setup lang="ts">
import { computed, ref, useAttrs, useId } from 'vue';
import { usePopover } from '../composables/usePopover';
import type { ControlSize, DatePickerMode } from '../types';
import { formatIsoDate } from '../utils/isoDate';
import AppDatePanel from './AppDatePanel.vue';
import AppIcon from './AppIcon.vue';

defineOptions({ inheritAttrs: false });

interface Props {
    modelValue?: string;
    mode?: DatePickerMode;
    label?: string;
    size?: ControlSize;
    placeholder?: string;
    error?: string;
    hint?: string;
    required?: boolean;
    disabled?: boolean;
    clearable?: boolean;
    min?: string;
    max?: string;
    step?: number;
    from?: string;
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: '',
    mode: 'date',
    label: '',
    size: 'md',
    placeholder: '',
    error: '',
    hint: '',
    required: false,
    disabled: false,
    clearable: false,
    min: '',
    max: '',
    step: 15,
    from: '',
});

const emit = defineEmits<{
    'update:modelValue': [value: string];
}>();

const id = useId();
const triggerRef = ref<HTMLButtonElement | null>(null);
const popoverRef = ref<HTMLDivElement | null>(null);
const panelRef = ref<InstanceType<typeof AppDatePanel> | null>(null);
const timeInputRef = ref<HTMLInputElement | null>(null);
const listRef = ref<HTMLUListElement | null>(null);
const { isOpen, style, close, toggle, onFocusOut, onKeydown } = usePopover(
    triggerRef,
    popoverRef,
);

const isTime = computed(() => props.mode === 'time');
const hasError = computed(() => Boolean(props.error));

const displayValue = computed(() =>
    isTime.value ? props.modelValue : formatIsoDate(props.modelValue),
);
const placeholderText = computed(
    () => props.placeholder || (isTime.value ? 'Pick a time' : 'Pick a date'),
);

// class/style stay on the wrapper, the rest (aria-*, ...) goes on the trigger
const attrs = useAttrs();
const rootAttrs = computed(() => ({ class: attrs.class, style: attrs.style }));
const triggerAttrs = computed(() => {
    const { class: _class, style: _style, ...rest } = attrs;
    return rest;
});

const pick = (value: string): void => {
    emit('update:modelValue', value);
    close(true);
};

const openToggle = (): void => {
    if (props.disabled) return;
    toggle(() => {
        if (isTime.value) {
            timeInputRef.value?.focus();
            scrollToCurrent();
        } else {
            panelRef.value?.focus();
        }
    });
};

// --- time mode ---

const pad = (n: number): string => String(n).padStart(2, '0');
const toMinutes = (hhmm: string): number => {
    const [h, m] = hhmm.split(':').map(Number);
    return h * 60 + m;
};
const toHHMM = (mins: number): string =>
    `${pad(Math.floor(mins / 60))}:${pad(mins % 60)}`;

const formatDuration = (mins: number): string => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return [h && `${h} ${h === 1 ? 'hr' : 'hrs'}`, m && `${m} mins`]
        .filter(Boolean)
        .join(' ');
};

const times = computed(() => {
    const start = props.from ? toMinutes(props.from) : 0;
    const list = [];
    for (
        let mins = props.from ? start + props.step : start;
        mins < 1440;
        mins += props.step
    ) {
        list.push({
            value: toHHMM(mins),
            duration: props.from ? formatDuration(mins - start) : '',
            hourStart: mins % 60 === 0 && mins > start,
        });
    }
    return list;
});

const parseTime = (input: string): string | null => {
    const m = /^(\d{1,2})[:.h]?(\d{2})?\s*(am|pm)?$/.exec(
        input.trim().toLowerCase(),
    );
    if (!m) return null;
    let h = +m[1];
    const mins = m[2] ? +m[2] : 0;
    if (m[3] === 'pm' && h < 12) h += 12;
    if (m[3] === 'am' && h === 12) h = 0;
    return h < 24 && mins < 60 ? `${pad(h)}:${pad(mins)}` : null;
};

const applyTyped = (): void => {
    const value = parseTime(timeInputRef.value?.value ?? '');
    if (value) pick(value);
};

const pickNow = (): void => {
    const now = new Date();
    const snapped =
        Math.round((now.getHours() * 60 + now.getMinutes()) / props.step) *
        props.step;
    pick(toHHMM(Math.min(snapped, 1440 - props.step)));
};

const scrollToCurrent = (): void => {
    const list = listRef.value;
    if (!list) return;
    const now = new Date();
    const target = props.modelValue
        ? toMinutes(props.modelValue)
        : now.getHours() * 60 + now.getMinutes();
    const index = times.value.findIndex((t) => toMinutes(t.value) >= target);
    const item = list.children[index === -1 ? times.value.length - 1 : index];
    if (item instanceof HTMLElement) {
        list.scrollTop =
            item.offsetTop - list.clientHeight / 2 + item.offsetHeight / 2;
    }
};
</script>

<template>
    <div class="w-full" v-bind="rootAttrs">
        <!-- Label -->
        <label
            v-if="label"
            :for="id"
            class="mb-1.5 text-sm font-medium block text-text"
        >
            {{ label }}
            <span v-if="required" class="ml-0.5 text-danger">*</span>
        </label>

        <!-- Trigger -->
        <div class="group relative">
            <button
                :id="id"
                ref="triggerRef"
                type="button"
                v-bind="triggerAttrs"
                :disabled="disabled"
                aria-haspopup="dialog"
                :aria-expanded="isOpen"
                :aria-describedby="error || hint ? `${id}-helper` : undefined"
                :class="[
                    'gap-2 flex w-full items-center text-left',
                    {
                        sm: 'py-1.5 text-sm min-h-[36px]',
                        md: 'py-2.5 min-h-[44px]',
                        lg: 'py-3 min-h-[52px]',
                    }[size],
                    'pl-3 bg-input-bg',
                    clearable && modelValue ? 'pr-9' : 'pr-3',
                    'rounded-md border',
                    'transition-colors duration-[var(--transition-fast)]',
                    'focus:border-transparent focus:ring-2 focus:ring-focus-ring focus:outline-none',
                    'disabled:cursor-not-allowed disabled:bg-surface-hover disabled:opacity-50',
                    'cursor-pointer',
                    hasError
                        ? 'border-danger focus:ring-danger'
                        : isOpen
                          ? 'border-transparent ring-2 ring-focus-ring'
                          : 'border-input-border',
                ]"
                @click="openToggle"
                @keydown.escape.prevent="close(true)"
                @focusout="onFocusOut"
            >
                <AppIcon
                    :name="isTime ? 'clock' : 'calendar'"
                    size="sm"
                    class="shrink-0 text-muted"
                />
                <span
                    :class="[
                        'flex-1 truncate',
                        displayValue ? 'text-text' : 'text-muted',
                        isTime && 'tabular-nums',
                    ]"
                >
                    {{ displayValue || placeholderText }}
                </span>
            </button>

            <button
                v-if="clearable && modelValue && !disabled"
                type="button"
                aria-label="Clear"
                class="inset-y-0 right-2 h-5 w-5 absolute my-auto flex cursor-pointer items-center justify-center rounded-full text-muted opacity-0 group-hover:opacity-100 hover:bg-surface-hover hover:text-text focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:outline-none"
                @click="emit('update:modelValue', '')"
            >
                <AppIcon name="x" size="sm" />
            </button>
        </div>

        <!-- Popover -->
        <Teleport to="body">
            <Transition
                enter-active-class="transition duration-100 ease-out"
                enter-from-class="opacity-0 scale-95"
                enter-to-class="opacity-100 scale-100"
                leave-active-class="transition duration-75 ease-in"
                leave-from-class="opacity-100 scale-100"
                leave-to-class="opacity-0 scale-95"
            >
                <div
                    v-if="isOpen"
                    ref="popoverRef"
                    role="dialog"
                    :aria-label="isTime ? 'Pick a time' : 'Pick a date'"
                    :style="style"
                    @focusout="onFocusOut"
                    class="z-[var(--z-dropdown,9999)] w-max"
                    @keydown="onKeydown"
                >
                    <AppDatePanel
                        v-if="!isTime"
                        ref="panelRef"
                        :model-value="modelValue"
                        :min="min"
                        :max="max"
                        @update:model-value="pick"
                        @close="close(true)"
                    />

                    <div
                        v-else
                        :class="[
                            'p-3 text-sm rounded-xl border border-border-strong bg-surface text-text shadow-lg',
                            from ? 'w-[190px]' : 'w-[150px]',
                        ]"
                    >
                        <input
                            ref="timeInputRef"
                            type="text"
                            placeholder="hh:mm"
                            aria-label="Time"
                            autocomplete="off"
                            :value="modelValue"
                            class="h-8 px-2 text-sm w-full rounded-md border border-input-border bg-input-bg text-text tabular-nums placeholder:text-muted focus:border-transparent focus:ring-2 focus:ring-focus-ring focus:outline-none"
                            @keydown.enter.prevent="applyTyped"
                        />
                        <ul
                            ref="listRef"
                            class="mt-2 max-h-[268px] overflow-y-auto"
                        >
                            <li
                                v-for="t in times"
                                :key="t.value"
                                :class="t.hourStart && 'border-t border-border'"
                            >
                                <button
                                    type="button"
                                    :aria-pressed="t.value === modelValue"
                                    :class="[
                                        'px-2.5 flex h-[30px] w-full cursor-pointer items-center rounded-md text-left tabular-nums focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:outline-none',
                                        t.value === modelValue
                                            ? 'font-semibold bg-primary-soft text-on-primary-soft'
                                            : 'hover:bg-surface-hover',
                                    ]"
                                    @click="pick(t.value)"
                                >
                                    {{ t.value }}
                                    <span
                                        v-if="t.duration"
                                        class="ml-1.5 font-normal text-muted"
                                        >{{ t.duration }}</span
                                    >
                                </button>
                            </li>
                        </ul>
                        <div
                            class="mt-2.5 pt-2.5 flex items-center justify-between border-t border-border"
                        >
                            <button
                                type="button"
                                class="px-1.5 py-1 cursor-pointer rounded-md text-on-primary-soft hover:bg-surface-hover focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:outline-none"
                                @click="pickNow"
                            >
                                Now
                            </button>
                            <button
                                type="button"
                                class="px-1.5 py-1 cursor-pointer rounded-md text-on-primary-soft hover:bg-surface-hover focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:outline-none"
                                @click="close(true)"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            </Transition>
        </Teleport>

        <!-- Helper text -->
        <p
            v-if="error || hint"
            :id="`${id}-helper`"
            :class="['mt-1.5 text-sm', hasError ? 'text-danger' : 'text-muted']"
        >
            {{ error || hint }}
        </p>
    </div>
</template>
