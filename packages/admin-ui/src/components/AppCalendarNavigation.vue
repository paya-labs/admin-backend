<script setup lang="ts">
import { ref } from 'vue';
import { usePopover } from '../composables/usePopover';
import AppButton from './AppButton.vue';
import AppDatePanel from './AppDatePanel.vue';

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
    today: [];
    goto: [date: string];
}>();

const triggerRef = ref<HTMLButtonElement | null>(null);
const popoverRef = ref<HTMLDivElement | null>(null);
const panelRef = ref<InstanceType<typeof AppDatePanel> | null>(null);
const { isOpen, style, close, toggle, onFocusOut, onKeydown } = usePopover(
    triggerRef,
    popoverRef,
);

const openToggle = (): void => toggle(() => panelRef.value?.focus());

const onGoto = (date: string): void => {
    emit('goto', date);
    close(true);
};
</script>

<template>
    <div class="min-w-0 gap-1 md:gap-3 flex items-center">
        <!-- Today button -->
        <AppButton variant="secondary" size="sm" @click="$emit('today')">
            Today
        </AppButton>

        <div class="min-w-0 flex items-center">
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
                aria-haspopup="dialog"
                :aria-expanded="isOpen"
                :class="[
                    'min-w-0 gap-1 px-2 text-lg font-semibold flex min-h-[36px] cursor-pointer items-center rounded-md text-text',
                    'hover:bg-surface-hover focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:outline-none',
                    isOpen && 'bg-surface-hover',
                ]"
                @click="openToggle"
                @keydown.escape.prevent="close(true)"
                @focusout="onFocusOut"
            >
                <span class="truncate">{{ title }}</span>
                <svg
                    :class="[
                        'h-4 w-4 shrink-0 text-muted transition-transform duration-200',
                        isOpen && 'rotate-180',
                    ]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                    aria-hidden="true"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M6 9l6 6 6-6"
                    />
                </svg>
            </button>
            <h1 v-else class="px-2 text-lg font-semibold truncate text-text">
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
        <span v-if="viewLabel" class="text-sm md:inline hidden text-muted">{{
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
    </div>
</template>
