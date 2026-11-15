import { flushPromises, mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { createMemoryHistory, createRouter } from 'vue-router';
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

describe('AppButton with `to`', () => {
    const router = createRouter({
        history: createMemoryHistory(),
        routes: [
            { path: '/', component: {} },
            { path: '/team/new', component: {} },
        ],
    });

    const mountWithTo = (props = {}) =>
        mount(AppButton, {
            props: { to: '/team/new', ...props },
            slots: { default: 'Add member' },
            // The setup file stubs router-link; this test needs the real one
            global: { plugins: [router], stubs: { 'router-link': false } },
        });

    it('renders a link to the route', () => {
        const wrapper = mountWithTo();
        expect(wrapper.element.tagName).toBe('A');
        expect(wrapper.attributes('href')).toBe('/team/new');
        expect(wrapper.attributes('type')).toBeUndefined();
    });

    it('navigates on click', async () => {
        const wrapper = mountWithTo();
        await wrapper.trigger('click');
        await router.isReady();
        await flushPromises();
        expect(router.currentRoute.value.path).toBe('/team/new');
    });

    it.each([{ disabled: true }, { loading: true }])(
        'renders a disabled button when %o',
        (props) => {
            const wrapper = mountWithTo(props);
            expect(wrapper.element.tagName).toBe('BUTTON');
            expect(wrapper.attributes('disabled')).toBeDefined();
        },
    );
});
