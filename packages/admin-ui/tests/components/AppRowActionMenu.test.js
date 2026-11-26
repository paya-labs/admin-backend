import { mount } from '@vue/test-utils';
import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from 'vite-plus/test';
import { h, nextTick } from 'vue';
import AppRowActionMenu from '../../src/components/AppRowActionMenu.vue';
import AppRowActionMenuItem from '../../src/components/AppRowActionMenuItem.vue';
import { useRowMenu } from '../../src/composables/useRowMenu';

// tests/setup.js stubs router-link globally; the stub keeps the `to` prop.
vi.mock('vue-router', () => ({
    RouterLink: { name: 'RouterLink', props: ['to'], template: '<a />' },
}));

const setPhone = (phone) => {
    window.matchMedia = () => ({
        matches: phone,
        addEventListener: () => {},
        removeEventListener: () => {},
    });
};

describe('useRowMenu', () => {
    const click = (el) => ({ currentTarget: el });

    it('opens for a row at the clicked trigger', () => {
        const { menuRow, menuTrigger, toggleMenu } = useRowMenu();
        const button = document.createElement('button');
        toggleMenu({ id: 1 }, click(button));
        expect(menuRow.value).toEqual({ id: 1 });
        expect(menuTrigger.value).toBe(button);
    });

    it("closes when the open row's trigger is clicked again", () => {
        const { menuRow, menuTrigger, toggleMenu } = useRowMenu();
        const button = document.createElement('button');
        toggleMenu({ id: 1 }, click(button));
        toggleMenu({ id: 1 }, click(button));
        expect(menuRow.value).toBeNull();
        expect(menuTrigger.value).toBeNull();
    });

    it('moves to another row instead of closing', () => {
        const { menuRow, menuTrigger, toggleMenu } = useRowMenu();
        const a = document.createElement('button');
        const b = document.createElement('button');
        toggleMenu({ id: 1 }, click(a));
        toggleMenu({ id: 2 }, click(b));
        expect(menuRow.value).toEqual({ id: 2 });
        expect(menuTrigger.value).toBe(b);
    });

    it('closeMenu clears row and trigger', () => {
        const { menuRow, menuTrigger, toggleMenu, closeMenu } = useRowMenu();
        toggleMenu({ id: 1 }, click(document.createElement('button')));
        closeMenu();
        expect(menuRow.value).toBeNull();
        expect(menuTrigger.value).toBeNull();
    });
});

describe('AppRowActionMenuItem', () => {
    it('renders a button by default', () => {
        const w = mount(AppRowActionMenuItem, { slots: { default: 'Edit' } });
        expect(w.element.tagName).toBe('BUTTON');
        expect(w.attributes('type')).toBe('button');
        expect(w.classes()).toContain('text-text');
    });

    it('renders a RouterLink with `to`', () => {
        const w = mount(AppRowActionMenuItem, { props: { to: '/users/1' } });
        expect(w.findComponent({ name: 'RouterLink' }).props('to')).toBe(
            '/users/1',
        );
        expect(w.attributes('type')).toBeUndefined();
    });

    it('renders a plain link with `href`', () => {
        const w = mount(AppRowActionMenuItem, {
            props: { href: 'https://example.com' },
        });
        expect(w.element.tagName).toBe('A');
        expect(w.attributes('href')).toBe('https://example.com');
        expect(w.findComponent({ name: 'RouterLink' }).exists()).toBe(false);
    });

    it('uses the danger colour with `danger`', () => {
        const w = mount(AppRowActionMenuItem, { props: { danger: true } });
        expect(w.classes()).toContain('text-danger');
        expect(w.classes()).not.toContain('text-text');
    });
});

describe('AppRowActionMenu', () => {
    let wrapper;
    let trigger;

    const mountMenu = (props = {}) => {
        trigger = document.createElement('button');
        document.body.appendChild(trigger);
        wrapper = mount(AppRowActionMenu, {
            props: { trigger: null, ...props },
            slots: {
                default: () => [
                    h(AppRowActionMenuItem, null, () => 'Edit'),
                    h(AppRowActionMenuItem, { danger: true }, () => 'Delete'),
                ],
            },
            attachTo: document.body,
            global: { stubs: { transition: true } },
        });
    };
    const open = async () => {
        await wrapper.setProps({ trigger });
        await nextTick();
    };
    const menuEl = () => document.body.querySelector('[data-row-menu]');

    beforeEach(() => setPhone(false));
    afterEach(() => {
        wrapper.unmount();
        trigger.remove();
    });

    it('focuses the first item on open', async () => {
        mountMenu();
        await open();
        expect(document.activeElement?.textContent).toBe('Edit');
    });

    it('emits close on Escape and on backdrop click', async () => {
        mountMenu();
        await open();
        menuEl().dispatchEvent(
            new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
        );
        document.body
            .querySelector('[data-row-menu-backdrop]')
            .dispatchEvent(new MouseEvent('click', { bubbles: true }));
        expect(wrapper.emitted('close')).toHaveLength(2);
    });

    it('returns focus to the trigger when closed', async () => {
        mountMenu();
        await open();
        await wrapper.setProps({ trigger: null });
        expect(document.activeElement).toBe(trigger);
        expect(menuEl()).toBeNull();
    });

    it('anchors below the trigger, right-aligned', async () => {
        mountMenu();
        await open();
        expect(menuEl().style.top).not.toBe('');
        expect(menuEl().style.right).not.toBe('');
    });

    it('adds a Cancel button in sheet mode that closes the menu', async () => {
        setPhone(true);
        mountMenu({ sheet: true, cancel: true });
        await open();
        expect(menuEl().style.top).toBe('');
        const cancel = [...menuEl().querySelectorAll('button')].find(
            (b) => b.textContent.trim() === 'Cancel',
        );
        expect(cancel).toBeTruthy();
        cancel.click();
        expect(wrapper.emitted('close')).toHaveLength(1);
    });

    it('has no Cancel button without `sheet`', async () => {
        mountMenu({ cancel: true });
        await open();
        expect(menuEl().textContent).not.toContain('Cancel');
    });
});
