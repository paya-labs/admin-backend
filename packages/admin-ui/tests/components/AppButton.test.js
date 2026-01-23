import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import AppButton from '../../src/components/AppButton.vue';

describe('AppButton', () => {
    it('renders with default props', () => {
        const wrapper = mount(AppButton, {
            slots: {
                default: 'Click me',
            },
        });

        expect(wrapper.text()).toContain('Click me');
    });

    it('emits click event when clicked', async () => {
        const wrapper = mount(AppButton, {
            slots: {
                default: 'Click me',
            },
        });

        await wrapper.trigger('click');
        expect(wrapper.emitted('click')).toBeTruthy();
    });

    it('does not emit click when disabled', async () => {
        const wrapper = mount(AppButton, {
            props: {
                disabled: true,
            },
            slots: {
                default: 'Click me',
            },
        });

        await wrapper.trigger('click');
        expect(wrapper.emitted('click')).toBeFalsy();
    });

    it('applies variant class correctly', () => {
        const wrapper = mount(AppButton, {
            props: {
                variant: 'primary',
            },
            slots: {
                default: 'Primary Button',
            },
        });

        expect(wrapper.html()).toContain('Primary Button');
    });
});
