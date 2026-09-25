import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import AppSidebar from '../../src/components/AppSidebar.vue';

vi.mock('vue-router', () => ({
    useRoute: () => ({ path: '/' }),
    RouterLink: { template: '<a><slot /></a>' },
}));

let wrapper;
const themeItem = () =>
    wrapper.find('[role="menu"] button[aria-label="Toggle theme"]');

describe('AppSidebar user menu', () => {
    beforeEach(() => {
        window.matchMedia = () => ({
            matches: false,
            addEventListener: () => {},
            removeEventListener: () => {},
        });
        localStorage.clear();
        wrapper = mount(AppSidebar, {
            props: { navigation: [] },
            global: { stubs: { transition: true } },
        });
    });

    afterEach(() => wrapper.unmount());

    it('cycles the theme from the user menu and keeps it open', async () => {
        await wrapper.find('button[aria-haspopup="true"]').trigger('click');
        expect(themeItem().text()).toBe('Theme: System');

        await themeItem().trigger('click');
        expect(themeItem().text()).toBe('Theme: Light');
        expect(localStorage.getItem('admin-theme-mode')).toBe('light');

        await themeItem().trigger('click');
        expect(themeItem().text()).toBe('Theme: Dark');

        const items = wrapper.findAll('[role="menuitem"]');
        expect(items.at(-1).text()).toBe('Sign out');
    });
});
