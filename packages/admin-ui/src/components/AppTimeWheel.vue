<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';

// iOS-style drum: two scroll-snap columns, the row under the band is the value
const props = defineProps<{ modelValue: string }>();
const emit = defineEmits<{ 'update:modelValue': [value: string] }>();

const ROW = 40;
const VISIBLE = 5;
const hours = Array.from({ length: 24 }, (_, i) => i);
const minutes = Array.from({ length: 60 }, (_, i) => i);
const pad = (n: number): string => String(n).padStart(2, '0');

const hourRef = ref<HTMLUListElement | null>(null);
const minuteRef = ref<HTMLUListElement | null>(null);

const parse = (): [number, number] => {
    if (props.modelValue) {
        const [h, m] = props.modelValue.split(':').map(Number);
        return [h, m];
    }
    const now = new Date();
    return [now.getHours(), now.getMinutes()];
};
const current = ref<[number, number]>(parse());

const scrollTo = (list: HTMLUListElement | null, index: number): void => {
    if (list) list.scrollTop = index * ROW;
};
const sync = (): void => {
    scrollTo(hourRef.value, current.value[0]);
    scrollTo(minuteRef.value, current.value[1]);
};

const commit = (): void => {
    const value = `${pad(current.value[0])}:${pad(current.value[1])}`;
    if (value !== props.modelValue) emit('update:modelValue', value);
};

// scroll-snap settles asynchronously; read the row once scrolling pauses
let settle: ReturnType<typeof setTimeout> | undefined;
const onScroll = (column: 0 | 1, event: Event): void => {
    const list = event.currentTarget as HTMLUListElement;
    const max = column === 0 ? 23 : 59;
    current.value[column] = Math.min(
        max,
        Math.max(0, Math.round(list.scrollTop / ROW)),
    );
    clearTimeout(settle);
    settle = setTimeout(commit, 120);
};

const select = (column: 0 | 1, value: number): void => {
    current.value[column] = value;
    commit();
    scrollTo(column === 0 ? hourRef.value : minuteRef.value, value);
};

onMounted(sync);
watch(
    () => props.modelValue,
    () => {
        current.value = parse();
        sync();
    },
);

const columnClass = `relative w-24 snap-y snap-mandatory overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`;
const rowClass =
    'flex h-10 w-full snap-center cursor-pointer items-center justify-center text-2xl tabular-nums transition-colors focus-visible:outline-none';
</script>

<template>
    <div
        class="gap-2 relative flex justify-center [mask-image:linear-gradient(transparent,black_30%,black_70%,transparent)]"
        :style="{ height: `${ROW * VISIBLE}px` }"
    >
        <div
            class="inset-x-6 h-10 absolute top-1/2 -translate-y-1/2 rounded-lg bg-surface-hover"
            aria-hidden="true"
        />
        <ul
            ref="hourRef"
            aria-label="Hour"
            :class="columnClass"
            :style="{ paddingBlock: `${ROW * 2}px` }"
            @scroll.passive="onScroll(0, $event)"
        >
            <li v-for="h in hours" :key="h">
                <button
                    type="button"
                    :aria-pressed="h === current[0]"
                    :class="[
                        rowClass,
                        h === current[0]
                            ? 'font-medium text-text'
                            : 'text-muted',
                    ]"
                    @click="select(0, h)"
                >
                    {{ pad(h) }}
                </button>
            </li>
        </ul>
        <ul
            ref="minuteRef"
            aria-label="Minute"
            :class="columnClass"
            :style="{ paddingBlock: `${ROW * 2}px` }"
            @scroll.passive="onScroll(1, $event)"
        >
            <li v-for="m in minutes" :key="m">
                <button
                    type="button"
                    :aria-pressed="m === current[1]"
                    :class="[
                        rowClass,
                        m === current[1]
                            ? 'font-medium text-text'
                            : 'text-muted',
                    ]"
                    @click="select(1, m)"
                >
                    {{ pad(m) }}
                </button>
            </li>
        </ul>
    </div>
</template>
