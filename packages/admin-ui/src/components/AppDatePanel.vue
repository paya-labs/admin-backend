<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import {
    addDays,
    DAY_NAMES,
    formatIsoDate,
    MONTH_NAMES,
    parseIsoDate,
    toIsoDate,
} from '../utils/isoDate';
import AppButton from './AppButton.vue';

interface Props {
    modelValue?: string;
    min?: string;
    max?: string;
    rangeStart?: string;
    rangeEnd?: string;
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: '',
    min: '',
    max: '',
    rangeStart: '',
    rangeEnd: '',
});

const emit = defineEmits<{
    'update:modelValue': [value: string];
    close: [];
}>();

type View = 'days' | 'months' | 'years';

const anchor = parseIsoDate(props.modelValue) ?? new Date();
const view = ref<View>('days');
const year = ref(anchor.getFullYear());
const month = ref(anchor.getMonth());
const yearBase = ref(year.value - (year.value % 12));
const focused = ref(toIsoDate(anchor));
const gridRef = ref<HTMLDivElement | null>(null);
const rootRef = ref<HTMLDivElement | null>(null);

const todayIso = toIsoDate(new Date());
const isDisabled = (iso: string): boolean =>
    (!!props.min && iso < props.min) || (!!props.max && iso > props.max);
const selected = computed(() => parseIsoDate(props.modelValue));

const cells = computed(() => {
    const first = new Date(year.value, month.value, 1);
    const start = addDays(first, -((first.getDay() + 6) % 7));
    return Array.from({ length: 42 }, (_, i) => {
        const d = addDays(start, i);
        const iso = toIsoDate(d);
        const inRange =
            !!props.rangeStart &&
            !!props.rangeEnd &&
            iso >= props.rangeStart &&
            iso < props.rangeEnd;
        return {
            iso,
            day: d.getDate(),
            label: formatIsoDate(iso),
            out: d.getMonth() !== month.value,
            today: iso === todayIso,
            selected: iso === props.modelValue,
            disabled: isDisabled(iso),
            inRange,
            first: inRange && iso === props.rangeStart,
            last: inRange && toIsoDate(addDays(d, 1)) === props.rangeEnd,
        };
    });
});

// Roving tabindex: one focusable day per grid
// Roving tabindex target: the focused day if it is on this page and enabled,
// else the first enabled day of the month, else any enabled cell. Empty when
// min/max disable the whole page, in which case the heading takes focus.
const tabIso = computed(() => {
    const enabled = cells.value.filter((c) => !c.disabled);
    const cell =
        enabled.find((c) => c.iso === focused.value) ??
        enabled.find((c) => !c.out) ??
        enabled[0];
    return cell?.iso ?? '';
});

const years = computed(() =>
    Array.from({ length: 12 }, (_, i) => yearBase.value + i),
);

const setPage = (y: number, m: number): void => {
    const d = new Date(y, m, 1);
    year.value = d.getFullYear();
    month.value = d.getMonth();
};

watch(
    () => props.modelValue,
    (value) => {
        const d = parseIsoDate(value);
        if (!d) return;
        setPage(d.getFullYear(), d.getMonth());
        focused.value = value;
    },
);

const pick = (iso: string): void => emit('update:modelValue', iso);

// View changes remove the activated button, so move focus explicitly
const focusIn = (selector: string): void => {
    nextTick(() => {
        rootRef.value?.querySelector<HTMLElement>(selector)?.focus();
    });
};

const showMonths = (): void => {
    view.value = 'months';
    focusIn('[aria-label="Choose year"]');
};

const showYears = (): void => {
    yearBase.value = year.value - (year.value % 12);
    view.value = 'years';
    focusIn('[aria-label="Previous years"]');
};

const focusGrid = (): void => {
    if (tabIso.value) focusDay(tabIso.value);
    else focusIn('[aria-label="Choose month"]');
};

const pickMonth = (m: number): void => {
    month.value = m;
    view.value = 'days';
    focusGrid();
};

const pickYear = (y: number): void => {
    year.value = y;
    showMonths();
};

const focusDay = (iso: string): void => {
    focused.value = iso;
    nextTick(() => {
        gridRef.value
            ?.querySelector<HTMLButtonElement>(`[data-iso="${iso}"]`)
            ?.focus();
    });
};

const moveFocus = (delta: number): void => {
    const from = parseIsoDate(tabIso.value);
    if (!from) return;
    const d = addDays(from, delta);
    if (isDisabled(toIsoDate(d))) return;
    setPage(d.getFullYear(), d.getMonth());
    focusDay(toIsoDate(d));
};

const onGridKeydown = (event: KeyboardEvent): void => {
    const delta = {
        ArrowLeft: -1,
        ArrowRight: 1,
        ArrowUp: -7,
        ArrowDown: 7,
    }[event.key];
    if (!delta) return;
    event.preventDefault();
    moveFocus(delta);
};

defineExpose({ focus: focusGrid });

const chevron = {
    left: 'M15 19l-7-7 7-7',
    right: 'M9 5l7 7-7 7',
};
</script>

<template>
    <div
        ref="rootRef"
        class="p-3 text-sm w-[300px] rounded-xl border border-border-strong bg-surface text-text shadow-lg"
        @keydown.escape.prevent="emit('close')"
    >
        <!-- Header -->
        <div class="mb-2 gap-1 flex items-center">
            <AppButton
                variant="ghost"
                icon-only
                size="sm"
                :aria-label="
                    {
                        days: 'Previous month',
                        months: 'Previous year',
                        years: 'Previous years',
                    }[view]
                "
                @click="
                    view === 'days'
                        ? setPage(year, month - 1)
                        : view === 'months'
                          ? year--
                          : (yearBase -= 12)
                "
            >
                <svg
                    class="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        :d="chevron.left"
                    />
                </svg>
            </AppButton>

            <button
                v-if="view === 'days'"
                type="button"
                class="h-9 font-semibold flex-1 rounded-md hover:bg-surface-hover focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:outline-none"
                aria-label="Choose month"
                @click="showMonths"
            >
                {{ MONTH_NAMES[month] }} {{ year }}
            </button>
            <button
                v-else-if="view === 'months'"
                type="button"
                class="h-9 font-semibold flex-1 rounded-md hover:bg-surface-hover focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:outline-none"
                aria-label="Choose year"
                @click="showYears"
            >
                {{ year }}
            </button>
            <span v-else class="font-semibold flex-1 text-center">
                {{ years[0] }} – {{ years[11] }}
            </span>

            <AppButton
                variant="ghost"
                icon-only
                size="sm"
                :aria-label="
                    {
                        days: 'Next month',
                        months: 'Next year',
                        years: 'Next years',
                    }[view]
                "
                @click="
                    view === 'days'
                        ? setPage(year, month + 1)
                        : view === 'months'
                          ? year++
                          : (yearBase += 12)
                "
            >
                <svg
                    class="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        :d="chevron.right"
                    />
                </svg>
            </AppButton>
        </div>

        <!-- Days -->
        <template v-if="view === 'days'">
            <div
                class="mb-1 tracking-wider grid grid-cols-7 text-center text-[11px] text-muted uppercase"
                aria-hidden="true"
            >
                <span v-for="d in DAY_NAMES" :key="d">{{ d.slice(0, 2) }}</span>
            </div>
            <div
                ref="gridRef"
                class="gap-y-0.5 grid grid-cols-7"
                @keydown="onGridKeydown"
            >
                <button
                    v-for="c in cells"
                    :key="c.iso"
                    type="button"
                    :data-iso="c.iso"
                    :tabindex="c.iso === tabIso ? 0 : -1"
                    :disabled="c.disabled"
                    :aria-label="c.label"
                    :aria-pressed="c.selected"
                    :aria-current="c.today ? 'date' : undefined"
                    :class="[
                        'relative h-[34px] rounded-lg focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:outline-none',
                        c.disabled
                            ? 'cursor-not-allowed text-muted line-through opacity-35'
                            : 'cursor-pointer hover:bg-surface-hover',
                        c.out && !c.disabled && 'text-muted opacity-55',
                        c.today && 'font-bold text-success',
                        (c.inRange || c.selected) &&
                            'bg-primary-soft text-on-primary-soft',
                        c.inRange && !c.first && !c.last && 'rounded-none',
                        c.inRange && c.first && !c.last && 'rounded-r-none',
                        c.inRange && c.last && !c.first && 'rounded-l-none',
                        c.selected && 'font-semibold',
                    ]"
                    @click="pick(c.iso)"
                >
                    {{ c.day }}
                    <span
                        v-if="c.today"
                        class="bottom-1 h-1 w-1 absolute left-1/2 -translate-x-1/2 rounded-full bg-success"
                    />
                </button>
            </div>
        </template>

        <!-- Months -->
        <div v-else-if="view === 'months'" class="gap-1.5 grid grid-cols-3">
            <button
                v-for="(name, i) in MONTH_NAMES"
                :key="name"
                type="button"
                :aria-label="name"
                :class="[
                    'h-10 cursor-pointer rounded-lg hover:bg-surface-hover focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:outline-none',
                    selected &&
                        selected.getFullYear() === year &&
                        selected.getMonth() === i &&
                        'font-semibold bg-primary-soft text-on-primary-soft',
                    todayIso.startsWith(
                        `${year}-${String(i + 1).padStart(2, '0')}`,
                    ) && 'ring-1 ring-success ring-inset',
                ]"
                @click="pickMonth(i)"
            >
                {{ name.slice(0, 3) }}
            </button>
        </div>

        <!-- Years -->
        <div v-else class="gap-1.5 grid grid-cols-4">
            <button
                v-for="y in years"
                :key="y"
                type="button"
                :class="[
                    'h-10 cursor-pointer rounded-lg hover:bg-surface-hover focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:outline-none',
                    selected &&
                        selected.getFullYear() === y &&
                        'font-semibold bg-primary-soft text-on-primary-soft',
                    todayIso.startsWith(`${y}-`) &&
                        'ring-1 ring-success ring-inset',
                ]"
                @click="pickYear(y)"
            >
                {{ y }}
            </button>
        </div>

        <!-- Footer -->
        <div
            class="mt-2.5 pt-2.5 flex items-center justify-between border-t border-border"
        >
            <button
                type="button"
                class="px-1.5 py-1 cursor-pointer rounded-md text-on-primary-soft hover:bg-surface-hover focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                :disabled="isDisabled(todayIso)"
                @click="pick(todayIso)"
            >
                Today
            </button>
            <button
                type="button"
                class="px-1.5 py-1 cursor-pointer rounded-md text-on-primary-soft hover:bg-surface-hover focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:outline-none"
                @click="emit('close')"
            >
                Close
            </button>
        </div>
    </div>
</template>
