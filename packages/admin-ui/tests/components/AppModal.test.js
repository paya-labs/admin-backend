import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import AppModal from '../../src/components/AppModal.vue';

describe('AppModal', () => {
    // Create teleport target before each test
    beforeEach(() => {
        const el = document.createElement('div');
        el.id = 'modal-target';
        document.body.appendChild(el);
    });

    afterEach(() => {
        document.body.innerHTML = '';
        document.body.style.overflow = '';
    });

    const mountModal = (props = {}, slots = {}) => {
        return mount(AppModal, {
            props: {
                modelValue: true,
                ...props,
            },
            slots,
            global: {
                stubs: {
                    teleport: true,
                },
            },
        });
    };

    it('does not render when modelValue is false', () => {
        const wrapper = mountModal({ modelValue: false });

        expect(wrapper.find('[role="dialog"]').exists()).toBe(false);
    });

    it('renders when modelValue is true', () => {
        const wrapper = mountModal({ modelValue: true });

        expect(wrapper.find('[role="dialog"]').exists()).toBe(true);
    });

    it('renders title when provided', () => {
        const wrapper = mountModal({ title: 'Test Modal' });

        expect(wrapper.find('h2').text()).toBe('Test Modal');
    });

    it('renders default slot content', () => {
        const wrapper = mountModal(
            {},
            {
                default: '<p class="modal-content">Hello World</p>',
            },
        );

        expect(wrapper.find('.modal-content').exists()).toBe(true);
        expect(wrapper.find('.modal-content').text()).toBe('Hello World');
    });

    it('renders header slot when provided', () => {
        const wrapper = mountModal(
            {},
            {
                header: '<h3 class="custom-header">Custom Header</h3>',
            },
        );

        expect(wrapper.find('.custom-header').exists()).toBe(true);
        expect(wrapper.find('.custom-header').text()).toBe('Custom Header');
    });

    it('renders footer slot when provided', () => {
        const wrapper = mountModal(
            {},
            {
                footer: '<button class="footer-btn">Submit</button>',
            },
        );

        expect(wrapper.find('.footer-btn').exists()).toBe(true);
        expect(wrapper.find('.footer-btn').text()).toBe('Submit');
    });

    it('emits update:modelValue and close when close button clicked', async () => {
        const wrapper = mountModal({ closable: true });

        const closeButton = wrapper.find('button[aria-label="Close modal"]');
        expect(closeButton.exists()).toBe(true);

        await closeButton.trigger('click');

        expect(wrapper.emitted('update:modelValue')).toBeTruthy();
        expect(wrapper.emitted('update:modelValue')[0]).toEqual([false]);
        expect(wrapper.emitted('close')).toBeTruthy();
    });

    it('does not show close button when closable is false', () => {
        const wrapper = mountModal({ closable: false });

        const closeButton = wrapper.find('button[aria-label="Close modal"]');
        expect(closeButton.exists()).toBe(false);
    });

    it('closes on backdrop click when closeOnBackdrop is true', async () => {
        const wrapper = mountModal({ closeOnBackdrop: true });

        const backdrop = wrapper.find('.bg-black\\/50');
        await backdrop.trigger('click');

        expect(wrapper.emitted('update:modelValue')).toBeTruthy();
        expect(wrapper.emitted('update:modelValue')[0]).toEqual([false]);
    });

    it('does not close on backdrop click when closeOnBackdrop is false', async () => {
        const wrapper = mountModal({ closeOnBackdrop: false });

        const backdrop = wrapper.find('.bg-black\\/50');
        await backdrop.trigger('click');

        expect(wrapper.emitted('update:modelValue')).toBeFalsy();
    });

    it('does not emit close when closable is false', async () => {
        const wrapper = mountModal({
            closable: false,
            closeOnBackdrop: true,
        });

        const backdrop = wrapper.find('.bg-black\\/50');
        await backdrop.trigger('click');

        expect(wrapper.emitted('close')).toBeFalsy();
    });

    it('applies correct size class for sm', () => {
        const wrapper = mountModal({ size: 'sm' });

        expect(wrapper.find('[role="dialog"]').classes()).toContain('max-w-sm');
    });

    it('applies correct size class for md', () => {
        const wrapper = mountModal({ size: 'md' });

        expect(wrapper.find('[role="dialog"]').classes()).toContain('max-w-md');
    });

    it('applies correct size class for lg', () => {
        const wrapper = mountModal({ size: 'lg' });

        expect(wrapper.find('[role="dialog"]').classes()).toContain('max-w-lg');
    });

    it('applies correct size class for xl', () => {
        const wrapper = mountModal({ size: 'xl' });

        expect(wrapper.find('[role="dialog"]').classes()).toContain('max-w-xl');
    });

    it('applies correct size class for full', () => {
        const wrapper = mountModal({ size: 'full' });

        expect(wrapper.find('[role="dialog"]').classes()).toContain(
            'max-w-none',
        );
    });

    it('closes on escape key when closeOnEscape is true', async () => {
        const wrapper = mountModal({ closeOnEscape: true });

        // Simulate escape key
        const event = new KeyboardEvent('keydown', { key: 'Escape' });
        document.dispatchEvent(event);

        await wrapper.vm.$nextTick();

        expect(wrapper.emitted('update:modelValue')).toBeTruthy();
        expect(wrapper.emitted('update:modelValue')[0]).toEqual([false]);
    });

    it('does not close on escape key when closeOnEscape is false', async () => {
        const wrapper = mountModal({ closeOnEscape: false });

        // Simulate escape key
        const event = new KeyboardEvent('keydown', { key: 'Escape' });
        document.dispatchEvent(event);

        await wrapper.vm.$nextTick();

        expect(wrapper.emitted('update:modelValue')).toBeFalsy();
    });

    it('sets body overflow to hidden when open', () => {
        mountModal({ modelValue: true });

        expect(document.body.style.overflow).toBe('hidden');
    });

    it('restores body overflow when closed', async () => {
        const wrapper = mountModal({ modelValue: true });

        expect(document.body.style.overflow).toBe('hidden');

        await wrapper.setProps({ modelValue: false });

        expect(document.body.style.overflow).toBe('');
    });

    it('has aria-modal attribute set to true', () => {
        const wrapper = mountModal();

        expect(wrapper.find('[role="dialog"]').attributes('aria-modal')).toBe(
            'true',
        );
    });
});
