import type { Directive, DirectiveBinding } from 'vue';

interface ClickOutsideElement extends HTMLElement {
    _clickOutsideHandler?: (event: MouseEvent) => void;
}

export const vClickOutside: Directive<
    HTMLElement,
    (event: MouseEvent) => void
> = {
    mounted(
        el: ClickOutsideElement,
        binding: DirectiveBinding<(event: MouseEvent) => void>,
    ) {
        const handler = (event: MouseEvent): void => {
            const target = event.target as Node;
            if (!(el === target || el.contains(target))) {
                binding.value(event);
            }
        };

        el._clickOutsideHandler = handler;

        setTimeout(() => {
            document.addEventListener('click', handler);
        }, 0);
    },

    unmounted(el: ClickOutsideElement) {
        if (el._clickOutsideHandler) {
            document.removeEventListener('click', el._clickOutsideHandler);
            delete el._clickOutsideHandler;
        }
    },
};
