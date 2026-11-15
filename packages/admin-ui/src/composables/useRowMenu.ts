import { ref, type Ref } from 'vue';

export interface UseRowMenuReturn<T> {
    /** The row the menu is open for, `null` while closed. */
    menuRow: Ref<T | null>;
    /** The trigger button the menu anchors to; pass it to `AppRowActionMenu`. */
    menuTrigger: Ref<HTMLElement | null>;
    /** Opens the menu for `row` at the clicked trigger, or closes it when that row is already open. */
    toggleMenu: (row: T, event: MouseEvent) => void;
    closeMenu: () => void;
}

/**
 * State for the one teleported `AppRowActionMenu` a table shares across its
 * rows: the row the menu is open for and the trigger it anchors to. Clicking
 * the open row's trigger again closes the menu.
 */
export function useRowMenu<
    T extends { id: string | number },
>(): UseRowMenuReturn<T> {
    const menuRow = ref(null) as Ref<T | null>;
    const menuTrigger = ref<HTMLElement | null>(null);

    const closeMenu = (): void => {
        menuRow.value = null;
        menuTrigger.value = null;
    };

    const toggleMenu = (row: T, event: MouseEvent): void => {
        if (menuTrigger.value && menuRow.value?.id === row.id) {
            closeMenu();
            return;
        }
        menuRow.value = row;
        menuTrigger.value = event.currentTarget as HTMLElement;
    };

    return { menuRow, menuTrigger, toggleMenu, closeMenu };
}
