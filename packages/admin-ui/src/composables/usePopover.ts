import { nextTick, onBeforeUnmount, ref, watch, type Ref } from 'vue';

/**
 * Fixed-position popover anchored below a trigger (flips upward when it
 * would run off the viewport, clamps to the viewport horizontally). Closes on
 * outside click, ancestor scroll and resize. Same approach as AppSelect.
 */
export function usePopover(
    trigger: Ref<HTMLElement | null>,
    popover: Ref<HTMLElement | null>,
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
        style.value = {
            position: 'fixed',
            ...(flip
                ? { bottom: `${window.innerHeight - rect.top + 4}px` }
                : { top: `${rect.bottom + 4}px` }),
            left: `${Math.max(8, Math.min(rect.left, window.innerWidth - width - 8))}px`,
        };
    };

    const open = (): void => {
        isOpen.value = true;
        nextTick(position);
    };

    const close = (restoreFocus = false): void => {
        if (!isOpen.value) return;
        isOpen.value = false;
        if (restoreFocus) trigger.value?.focus();
    };

    const toggle = (): void => (isOpen.value ? close(true) : open());

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
        const target = event.target as Node;
        if (
            !trigger.value?.contains(target) &&
            !popover.value?.contains(target)
        ) {
            close();
        }
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

    return { isOpen, style, open, close, toggle };
}
