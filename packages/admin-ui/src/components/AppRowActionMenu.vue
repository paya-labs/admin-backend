<script setup lang="ts">
import { computed, nextTick, ref, useTemplateRef, watch } from 'vue';
import { BREAKPOINTS } from '../composables/useBreakpoint';

// Teleported row menu for data tables: a dropdown anchored to the trigger and,
// with `sheet`, a bottom sheet below md. Open while `trigger` is set; the
// parent renders the items (AppRowActionMenuItem) in the default slot.
const props = defineProps<{
    trigger: HTMLElement | null;
    sheet?: boolean;
    /** Adds a Cancel button at the bottom of the phone sheet. */
    cancel?: boolean;
    /** Overrides the dropdown's default width. */
    menuClass?: string;
}>();
const emit = defineEmits<{ close: [] }>();

const GAP = 8;
const menu = useTemplateRef<HTMLElement>('menu');
const menuStyle = ref<Record<string, string>>({});

// Right-aligns the fixed menu with the trigger below it, flipping above when
// it does not fit below and there is more room above. The sheet on phones
// gets no inline position so its max-md: classes apply. usePopover is not
// used: it left-aligns, owns its own open state and closes on scroll.
const anchor = async (trigger: HTMLElement): Promise<void> => {
    const phone = `(max-width: ${BREAKPOINTS.md - 1}px)`;
    if (props.sheet && window.matchMedia(phone).matches) {
        menuStyle.value = {};
        return;
    }
    const rect = trigger.getBoundingClientRect();
    const right = `${window.innerWidth - rect.right}px`;
    menuStyle.value = { top: `${rect.bottom + GAP}px`, right };
    await nextTick();
    const height = menu.value?.offsetHeight ?? 0;
    const roomBelow = window.innerHeight - rect.bottom;
    if (height + GAP > roomBelow && rect.top > roomBelow) {
        menuStyle.value = {
            bottom: `${window.innerHeight - rect.top + GAP}px`,
            right,
        };
    }
};

// Opening focuses the first item; closing hands focus back to the trigger.
watch(
    () => props.trigger,
    (trigger, previous) => {
        if (!trigger) {
            previous?.focus();
            return;
        }
        void anchor(trigger);
        void nextTick(() =>
            menu.value
                ?.querySelector<HTMLElement>('a,button,input:not(:disabled)')
                ?.focus(),
        );
    },
);

const hiddenClass = computed(() =>
    props.sheet
        ? 'opacity-0 translate-y-1 max-md:translate-y-full'
        : 'opacity-0 translate-y-1',
);
</script>

<template>
    <Teleport to="body">
        <Transition
            enter-active-class="transition-opacity duration-150 ease-out"
            leave-active-class="transition-opacity duration-100 ease-in"
            enter-from-class="opacity-0"
            leave-to-class="opacity-0"
        >
            <div
                v-if="trigger"
                class="inset-0 fixed z-[var(--z-dropdown)]"
                :class="sheet && 'max-md:bg-black/40'"
                data-row-menu-backdrop
                @click="emit('close')"
            />
        </Transition>
        <Transition
            enter-active-class="transition duration-150 ease-out"
            leave-active-class="transition duration-100 ease-in"
            :enter-from-class="hiddenClass"
            :leave-to-class="hiddenClass"
        >
            <div
                v-if="trigger"
                ref="menu"
                data-row-menu
                class="p-1.5 fixed z-[var(--z-dropdown)] rounded-lg border border-border bg-surface text-left shadow-lg"
                :class="[
                    menuClass ?? 'w-48',
                    sheet &&
                        'max-md:inset-x-0 max-md:bottom-0 max-md:w-auto max-md:rounded-t-xl max-md:rounded-b-none max-md:border-b-0 max-md:p-2 max-md:pb-[max(0.5rem,env(safe-area-inset-bottom))] max-md:[&>button]:py-3',
                ]"
                :style="menuStyle"
                @keydown.esc.stop.prevent="emit('close')"
            >
                <slot />
                <button
                    v-if="sheet && cancel"
                    type="button"
                    class="mt-1 px-3 py-2 text-sm md:hidden flex w-full items-center justify-center rounded-lg border-t border-border text-text hover:bg-surface-hover"
                    @click="emit('close')"
                >
                    Cancel
                </button>
            </div>
        </Transition>
    </Teleport>
</template>
