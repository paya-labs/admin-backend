import { config, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import AppToastContainer from '../../src/components/AppToastContainer.vue';
import { useToast } from '../../src/composables/useToast.js';

// Disable teleport for testing
config.global.stubs = {
    teleport: true,
};

describe('AppToastContainer', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        const { dismissAll } = useToast();
        dismissAll();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('renders container with correct position classes', () => {
        const wrapper = mount(AppToastContainer, {
            props: { position: 'top-right' },
        });

        const container = wrapper.find('[aria-live="polite"]');
        expect(container.exists()).toBe(true);
        expect(container.classes()).toContain('top-4');
        expect(container.classes()).toContain('right-4');
    });

    it('uses bottom-right position by default', () => {
        const wrapper = mount(AppToastContainer);

        const container = wrapper.find('[aria-live="polite"]');
        expect(container.classes()).toContain('bottom-4');
        expect(container.classes()).toContain('right-4');
    });

    it('renders toasts from useToast', async () => {
        const wrapper = mount(AppToastContainer);
        const { show } = useToast();

        show({ message: 'Test toast', duration: 0 });
        await wrapper.vm.$nextTick();

        const toasts = wrapper.findAll('[role="alert"]');
        expect(toasts).toHaveLength(1);
        expect(toasts[0].text()).toContain('Test toast');
    });

    it('renders toast with title', async () => {
        const wrapper = mount(AppToastContainer);
        const { show } = useToast();

        show({ message: 'Message', title: 'Title', duration: 0 });
        await wrapper.vm.$nextTick();

        const toast = wrapper.find('[role="alert"]');
        expect(toast.text()).toContain('Title');
        expect(toast.text()).toContain('Message');
    });

    it('applies correct variant classes for success', async () => {
        const wrapper = mount(AppToastContainer);
        const { success } = useToast();

        success('Success message');
        await wrapper.vm.$nextTick();

        const toast = wrapper.find('[role="alert"]');
        expect(toast.classes().join(' ')).toContain('bg-success');
    });

    it('applies correct variant classes for error', async () => {
        const wrapper = mount(AppToastContainer);
        const { error } = useToast();

        error('Error message');
        await wrapper.vm.$nextTick();

        const toast = wrapper.find('[role="alert"]');
        expect(toast.classes().join(' ')).toContain('bg-danger');
    });

    it('applies correct variant classes for warning', async () => {
        const wrapper = mount(AppToastContainer);
        const { warning } = useToast();

        warning('Warning message');
        await wrapper.vm.$nextTick();

        const toast = wrapper.find('[role="alert"]');
        expect(toast.classes().join(' ')).toContain('bg-warning');
    });

    it('applies correct variant classes for info', async () => {
        const wrapper = mount(AppToastContainer);
        const { info } = useToast();

        info('Info message');
        await wrapper.vm.$nextTick();

        const toast = wrapper.find('[role="alert"]');
        expect(toast.classes().join(' ')).toContain('bg-info');
    });

    it('limits visible toasts to max prop', async () => {
        const wrapper = mount(AppToastContainer, {
            props: { max: 2 },
        });
        const { show } = useToast();

        show({ message: 'First', duration: 0 });
        show({ message: 'Second', duration: 0 });
        show({ message: 'Third', duration: 0 });
        await wrapper.vm.$nextTick();

        const toasts = wrapper.findAll('[role="alert"]');
        expect(toasts).toHaveLength(2);
    });

    it('dismisses toast when close button clicked', async () => {
        const wrapper = mount(AppToastContainer);
        const { show, toasts } = useToast();

        show({ message: 'Test', duration: 0 });
        await wrapper.vm.$nextTick();

        expect(toasts.value).toHaveLength(1);

        const closeButton = wrapper.find(
            'button[aria-label="Dismiss notification"]',
        );
        await closeButton.trigger('click');

        expect(toasts.value).toHaveLength(0);
    });

    it('has correct aria attributes for accessibility', () => {
        const wrapper = mount(AppToastContainer);

        const container = wrapper.find('[aria-live="polite"]');
        expect(container.attributes('aria-label')).toBe('Notifications');
    });

    it('renders icon for each variant', async () => {
        const wrapper = mount(AppToastContainer);
        const { success } = useToast();

        success('Test');
        await wrapper.vm.$nextTick();

        const toast = wrapper.find('[role="alert"]');
        const icon = toast.find('svg');
        expect(icon.exists()).toBe(true);
    });
});
