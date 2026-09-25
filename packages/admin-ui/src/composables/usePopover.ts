import { nextTick, onBeforeUnmount, ref, watch, type Ref } from 'vue';

/**
 * Fixed-position popover anchored below a trigger (flips upward when it
 * would run off the viewport, clamps to the viewport otherwise). Closes on
 * outside click, focus leaving, ancestor scroll and resize. Same approach as
 * AppSelect.
 */
export function usePopover(
    trigger: Ref<HTMLElement | null>,
    popover: Ref<HTMLElement | null>,
    { align = 'start' }: { align?: 'start' | 'center' } = {},
) {
    const isOpen = ref(false);
    const style = ref<Record<string, string>>({});

    const position = (): void => {
        if (!trigger.value) return;
        const rect = trigger.value.getBoundingClientRect();
        const width = popover.value?.offsetWidth || 300;
        const height = popover.value?.offsetHeight || 360;
        const spaceBelow = window.innerHeight - rect.bottom;
        const flip = spaceBelow < height && rect.top > spaceBelow;
        const top = flip ? rect.top - height - 4 : rect.bottom + 4;
        const left =
            align === 'center'
                ? rect.left + rect.width / 2 - width / 2
                : rect.left;
        style.value = {
            position: 'fixed',
            // Clamp to the viewport when the popover fits neither below nor above
            top: `${Math.max(8, Math.min(top, window.innerHeight - height - 8))}px`,
            left: `${Math.max(8, Math.min(left, window.innerWidth - width - 8))}px`,
        };
    };

    // Position from the trigger rect before the popover mounts (fallback
    // sizes), so it never renders in flow; re-measure once mounted and only
    // then hand focus over, otherwise focus() scrolls the page to the popover.
    const open = (afterOpen?: () => void): void => {
        position();
        isOpen.value = true;
        nextTick(() => {
            position();
            afterOpen?.();
        });
    };

    const close = (restoreFocus = false): void => {
        if (!isOpen.value) return;
        isOpen.value = false;
        if (restoreFocus) trigger.value?.focus();
    };

    const toggle = (afterOpen?: () => void): void =>
        isOpen.value ? close(true) : open(afterOpen);

    const onScroll = (event: Event): void => {
        if (
            event.target instanceof Node &&
            popover.value?.contains(event.target)
        ) {
            return;
        }
        close();
    };

    const onResize = (): void => close();

    const onClick = (event: MouseEvent): void => {
        // Dispatch-time path: a button that removes itself in its own handler
        // (panel drill-up) is already detached when this bubbles to document.
        const path = event.composedPath();
        if (
            !(trigger.value && path.includes(trigger.value)) &&
            !(popover.value && path.includes(popover.value))
        ) {
            close();
        }
    };

    // Non-modal dialog: close when focus moves out of trigger + popover
    const onFocusOut = (event: FocusEvent): void => {
        const next = event.relatedTarget;
        if (
            next instanceof Node &&
            !trigger.value?.contains(next) &&
            !popover.value?.contains(next)
        ) {
            close();
        }
    };

    // Escape closes. Tab past either end of the popover closes it and hands
    // focus back to the trigger, so the default Tab continues from there.
    const onKeydown = (event: KeyboardEvent): void => {
        if (event.key === 'Escape') {
            event.preventDefault();
            close(true);
            return;
        }
        if (event.key !== 'Tab' || !popover.value) return;
        const focusable = popover.value.querySelectorAll<HTMLElement>(
            'button:not([disabled]):not([tabindex="-1"]), input:not([disabled])',
        );
        const edge = event.shiftKey
            ? focusable[0]
            : focusable[focusable.length - 1];
        if (edge && event.target === edge) close(true);
    };

    const unbind = (): void => {
        window.removeEventListener('scroll', onScroll, true);
        window.removeEventListener('resize', onResize);
        document.removeEventListener('click', onClick);
    };

    watch(isOpen, (value) => {
        if (value) {
            window.addEventListener('scroll', onScroll, true);
            window.addEventListener('resize', onResize);
            document.addEventListener('click', onClick);
        } else {
            unbind();
        }
    });

    onBeforeUnmount(unbind);

    return { isOpen, style, open, close, toggle, onFocusOut, onKeydown };
}
