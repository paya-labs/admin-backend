<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';
import { useBreakpoint } from '../composables/useBreakpoint';
import { usePopover } from '../composables/usePopover';
import { toIsoDate } from '../utils/isoDate';
import AppBottomSheet from './AppBottomSheet.vue';
import AppButton from './AppButton.vue';
import AppDatePanel from './AppDatePanel.vue';
import AppIcon from './AppIcon.vue';

interface Props {
    title: string;
    viewLabel?: string;
    /** ISO anchor date of the visible range; turns the heading into a jump control */
    date?: string;
    rangeStart?: string;
    rangeEnd?: string;
}

withDefaults(defineProps<Props>(), {
    viewLabel: '',
    date: '',
    rangeStart: '',
    rangeEnd: '',
});

const emit = defineEmits<{
    prev: [];
    next: [];
    goto: [date: string];
}>();

const triggerRef = ref<HTMLButtonElement | null>(null);
const popoverRef = ref<HTMLDivElement | null>(null);
const panelRef = ref<InstanceType<typeof AppDatePanel> | null>(null);
const { isOpen, style, close, toggle, onFocusOut, onKeydown } = usePopover(
    triggerRef,
    popoverRef,
    { align: 'center' },
);

const { isMobile } = useBreakpoint();
const sheetOpen = ref(false);
const expanded = computed(() => isOpen.value || sheetOpen.value);

const closeSheet = (): void => {
    sheetOpen.value = false;
    triggerRef.value?.focus({ preventScroll: true });
};

const openToggle = (): void => {
    if (!isMobile.value) {
        toggle(() => panelRef.value?.focus());
        return;
    }
    if (sheetOpen.value) {
        closeSheet();
        return;
    }
    sheetOpen.value = true;
    nextTick(() => panelRef.value?.focus());
};

const onGoto = (date: string): void => {
    emit('goto', date);
    if (sheetOpen.value) closeSheet();
    else close(true);
};

const goToday = (): void => onGoto(toIsoDate(new Date()));
</script>

<template>
    <div class="flex min-w-0 items-center gap-1 md:gap-3">
        <div class="flex min-w-0 items-center">
            <AppButton
                variant="ghost"
                icon-only
                size="sm"
                aria-label="Previous"
                @click="$emit('prev')"
            >
                <svg
                    class="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 19l-7-7 7-7"
                    />
                </svg>
            </AppButton>

            <!-- Heading: jump control when an anchor date is known -->
            <button
                v-if="date"
                ref="triggerRef"
                type="button"
                title="Go to date"
                aria-haspopup="dialog"
                :aria-expanded="expanded"
                :class="[
                    'text-text flex min-h-[36px] min-w-0 cursor-pointer items-center gap-1 rounded-md px-2 text-lg font-semibold',
                    'hover:bg-surface-hover focus-visible:ring-focus-ring focus-visible:ring-2 focus-visible:outline-none',
                    expanded && 'bg-surface-hover',
                ]"
                @click="openToggle"
                @keydown.escape.prevent="close(true)"
                @focusout="onFocusOut"
            >
                <AppIcon name="calendar" class="text-text shrink-0" />
                <span class="truncate">{{ title }}</span>
            </button>
            <h1 v-else class="text-text truncate px-2 text-lg font-semibold">
                {{ title }}
            </h1>

            <AppButton
                variant="ghost"
                icon-only
                size="sm"
                aria-label="Next"
                @click="$emit('next')"
            >
                <svg
                    class="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 5l7 7-7 7"
                    />
                </svg>
            </AppButton>
        </div>

        <!-- Current view label (hidden on mobile) -->
        <span v-if="viewLabel" class="text-muted hidden text-sm md:inline">{{
            viewLabel
        }}</span>

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
                    aria-label="Go to date"
                    :style="style"
                    @focusout="onFocusOut"
                    @keydown="onKeydown"
                    class="z-[var(--z-dropdown,9999)] w-max"
                >
                    <AppDatePanel
                        ref="panelRef"
                        :model-value="date"
                        :range-start="rangeStart"
                        :range-end="rangeEnd"
                        @update:model-value="onGoto"
                        @close="close(true)"
                    />
                </div>
            </Transition>
        </Teleport>

        <!-- Bottom sheet (phones) -->
        <AppBottomSheet
            :open="sheetOpen"
            title="Go to date"
            @close="closeSheet"
        >
            <template #secondary>
                <button
                    type="button"
                    class="text-text-secondary cursor-pointer"
                    @click="goToday"
                >
                    Today
                </button>
            </template>
            <AppDatePanel
                ref="panelRef"
                fluid
                :model-value="date"
                :range-start="rangeStart"
                :range-end="rangeEnd"
                @update:model-value="onGoto"
                @close="closeSheet"
            />
        </AppBottomSheet>
    </div>
</template>
