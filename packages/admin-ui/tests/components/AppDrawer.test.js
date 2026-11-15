import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import AppDrawer from '../../src/components/AppDrawer.vue';

describe('AppDrawer', () => {
    it('goes full width below md', () => {
        const wrapper = mount(AppDrawer, {
            props: { modelValue: true, size: 'xl' },
            global: { stubs: { teleport: true } },
        });
        const panel = wrapper.find('[role="dialog"]');

        expect(panel.classes()).toContain('w-[600px]');
        expect(panel.classes()).toContain('max-md:w-full');
        wrapper.unmount();
    });
});
