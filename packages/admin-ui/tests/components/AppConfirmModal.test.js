import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import AppConfirmModal from '../../src/components/AppConfirmModal.vue';

describe('AppConfirmModal', () => {
    afterEach(() => {
        document.body.innerHTML = '';
        document.body.style.overflow = '';
    });

    const mountConfirm = (props = {}, slots = {}) =>
        mount(AppConfirmModal, {
            props: { modelValue: true, title: 'Delete item?', ...props },
            slots: { default: '<p class="body">Gone for good.</p>', ...slots },
            global: { stubs: { teleport: true } },
        });

    const actions = (wrapper) =>
        wrapper.findAll('.border-t button').map((b) => b.text());

    const confirmButton = (wrapper) => wrapper.findAll('.border-t button')[1];
    const cancelButton = (wrapper) => wrapper.findAll('.border-t button')[0];

    const pressEscape = () =>
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    it('renders title, body and default labels', () => {
        const wrapper = mountConfirm();

        expect(wrapper.find('h2').text()).toBe('Delete item?');
        expect(wrapper.find('.body').text()).toBe('Gone for good.');
        expect(actions(wrapper)).toEqual(['Cancel', 'Confirm']);
    });

    it('renders custom labels', () => {
        const wrapper = mountConfirm({
            confirmLabel: 'Discard changes',
            cancelLabel: 'Keep editing',
        });

        expect(actions(wrapper)).toEqual(['Keep editing', 'Discard changes']);
    });

    it('emits confirm without closing', async () => {
        const wrapper = mountConfirm();

        await confirmButton(wrapper).trigger('click');

        expect(wrapper.emitted('confirm')).toHaveLength(1);
        expect(wrapper.emitted('update:modelValue')).toBeFalsy();
    });

    it('closes on cancel', async () => {
        const wrapper = mountConfirm();

        await cancelButton(wrapper).trigger('click');

        expect(wrapper.emitted('update:modelValue')[0]).toEqual([false]);
        expect(wrapper.emitted('confirm')).toBeFalsy();
    });

    it('closes on backdrop and Escape when not loading', async () => {
        const backdrop = mountConfirm();
        await backdrop.find('.bg-black\\/50').trigger('click');
        expect(backdrop.emitted('update:modelValue')[0]).toEqual([false]);
        backdrop.unmount();

        const escape = mountConfirm();
        pressEscape();
        expect(escape.emitted('update:modelValue')[0]).toEqual([false]);
    });

    it('ignores backdrop, Escape and cancel while loading', async () => {
        const wrapper = mountConfirm({ loading: true });

        await wrapper.find('.bg-black\\/50').trigger('click');
        pressEscape();
        await cancelButton(wrapper).trigger('click');
        await confirmButton(wrapper).trigger('click');

        expect(wrapper.emitted('update:modelValue')).toBeFalsy();
        expect(wrapper.emitted('confirm')).toBeFalsy();
        expect(cancelButton(wrapper).attributes('disabled')).toBeDefined();
        expect(confirmButton(wrapper).find('svg.animate-spin').exists()).toBe(
            true,
        );
    });

    it('uses the primary variant by default and danger when set', () => {
        expect(confirmButton(mountConfirm()).classes()).toContain(
            'bg-primary-600',
        );
        expect(
            confirmButton(mountConfirm({ danger: true })).classes(),
        ).toContain('bg-danger');
    });

    it('replaces the cancel button through the cancel slot', () => {
        const wrapper = mountConfirm(
            {},
            { cancel: '<a class="custom-cancel" href="#">Back</a>' },
        );

        expect(wrapper.find('.custom-cancel').text()).toBe('Back');
        expect(actions(wrapper)).toEqual(['Confirm']);
    });

    it('stacks actions full width with Cancel last on phones', () => {
        const wrapper = mountConfirm();
        const row = wrapper.find('.border-t > div');

        expect(row.classes()).toEqual(
            expect.arrayContaining([
                'flex',
                'justify-end',
                'max-md:w-full',
                'max-md:flex-col-reverse',
                'max-md:*:w-full',
            ]),
        );
        // column-reverse puts the last child (the action) on top
        expect(actions(wrapper)).toEqual(['Cancel', 'Confirm']);
    });
});
