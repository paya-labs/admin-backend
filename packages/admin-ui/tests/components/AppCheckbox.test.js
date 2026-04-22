import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import { nextTick } from 'vue';
import AppCheckbox from '../../src/components/AppCheckbox.vue';

describe('AppCheckbox', () => {
    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('renders with default props', () => {
        const wrapper = mount(AppCheckbox, {
            attachTo: document.body,
        });

        expect(wrapper.find('input[type="checkbox"]').exists()).toBe(true);
    });

    it('renders label when provided', () => {
        const wrapper = mount(AppCheckbox, {
            props: { label: 'Accept terms' },
            attachTo: document.body,
        });

        expect(wrapper.find('label').text()).toContain('Accept terms');
    });

    it('renders label with required indicator', () => {
        const wrapper = mount(AppCheckbox, {
            props: { label: 'Accept terms', required: true },
            attachTo: document.body,
        });

        expect(wrapper.find('label').text()).toContain('Accept terms');
        expect(wrapper.find('label span.text-danger').text()).toBe('*');
    });

    it('renders description when provided', () => {
        const wrapper = mount(AppCheckbox, {
            props: {
                label: 'Notifications',
                description: 'Receive email updates',
            },
            attachTo: document.body,
        });

        const description = wrapper.find('p.text-muted');
        expect(description.exists()).toBe(true);
        expect(description.text()).toBe('Receive email updates');
    });

    it('displays error message', () => {
        const wrapper = mount(AppCheckbox, {
            props: {
                label: 'Accept terms',
                error: 'You must accept the terms',
            },
            attachTo: document.body,
        });

        const helper = wrapper.find('p.text-danger');
        expect(helper.exists()).toBe(true);
        expect(helper.text()).toBe('You must accept the terms');
    });

    it('displays hint when provided', () => {
        const wrapper = mount(AppCheckbox, {
            props: {
                label: 'Newsletter',
                hint: 'We will not spam you',
            },
            attachTo: document.body,
        });

        const helper = wrapper.findAll('p').at(-1);
        expect(helper.text()).toBe('We will not spam you');
    });

    it('error takes priority over hint', () => {
        const wrapper = mount(AppCheckbox, {
            props: {
                label: 'Accept terms',
                error: 'Required',
                hint: 'Please read the terms',
            },
            attachTo: document.body,
        });

        const helpers = wrapper.findAll('p').filter((p) => {
            const id = p.attributes('id');
            return id && id.includes('-helper');
        });
        expect(helpers.length).toBe(1);
        expect(helpers[0].text()).toBe('Required');
    });

    it('emits update:modelValue on click', async () => {
        const wrapper = mount(AppCheckbox, {
            props: {
                label: 'Accept terms',
                modelValue: false,
            },
            attachTo: document.body,
        });

        await wrapper.find('input[type="checkbox"]').trigger('change');
        await nextTick();

        expect(wrapper.emitted('update:modelValue')).toBeTruthy();
        expect(wrapper.emitted('update:modelValue')[0]).toEqual([true]);
    });

    it('emits false when unchecking', async () => {
        const wrapper = mount(AppCheckbox, {
            props: {
                label: 'Accept terms',
                modelValue: true,
            },
            attachTo: document.body,
        });

        await wrapper.find('input[type="checkbox"]').trigger('change');
        await nextTick();

        expect(wrapper.emitted('update:modelValue')[0]).toEqual([false]);
    });

    it('does not emit when disabled', async () => {
        const wrapper = mount(AppCheckbox, {
            props: {
                label: 'Accept terms',
                modelValue: false,
                disabled: true,
            },
            attachTo: document.body,
        });

        await wrapper.find('input[type="checkbox"]').trigger('change');
        await nextTick();

        expect(wrapper.emitted('update:modelValue')).toBeFalsy();
    });

    it('shows checkmark svg when checked', () => {
        const wrapper = mount(AppCheckbox, {
            props: { modelValue: true },
            attachTo: document.body,
        });

        expect(wrapper.find('svg').exists()).toBe(true);
    });

    it('does not show checkmark svg when unchecked', () => {
        const wrapper = mount(AppCheckbox, {
            props: { modelValue: false },
            attachTo: document.body,
        });

        expect(wrapper.find('div[aria-hidden="true"] svg').exists()).toBe(
            false,
        );
    });

    it('sets aria-invalid when error is present', () => {
        const wrapper = mount(AppCheckbox, {
            props: {
                label: 'Accept terms',
                error: 'Required',
            },
            attachTo: document.body,
        });

        expect(
            wrapper.find('input[type="checkbox"]').attributes('aria-invalid'),
        ).toBe('true');
    });

    it('does not set aria-invalid when no error', () => {
        const wrapper = mount(AppCheckbox, {
            props: { label: 'Accept terms' },
            attachTo: document.body,
        });

        expect(
            wrapper.find('input[type="checkbox"]').attributes('aria-invalid'),
        ).toBeUndefined();
    });

    it('sets aria-describedby for description and helper text', () => {
        const wrapper = mount(AppCheckbox, {
            props: {
                label: 'Notifications',
                description: 'Receive updates',
                hint: 'Optional',
            },
            attachTo: document.body,
        });

        const input = wrapper.find('input[type="checkbox"]');
        const describedby = input.attributes('aria-describedby');
        expect(describedby).toContain('-description');
        expect(describedby).toContain('-helper');
    });

    it('applies disabled styling', () => {
        const wrapper = mount(AppCheckbox, {
            props: { label: 'Disabled', disabled: true },
            attachTo: document.body,
        });

        expect(wrapper.find('div').classes()).toContain('opacity-50');
        expect(wrapper.find('div').classes()).toContain('cursor-not-allowed');
    });

    it('applies error border on visual checkbox when unchecked', () => {
        const wrapper = mount(AppCheckbox, {
            props: {
                modelValue: false,
                error: 'Required',
            },
            attachTo: document.body,
        });

        const visual = wrapper.find('div[aria-hidden="true"]');
        expect(visual.classes()).toContain('border-danger');
    });

    it('applies checked styling on visual checkbox', () => {
        const wrapper = mount(AppCheckbox, {
            props: { modelValue: true },
            attachTo: document.body,
        });

        const visual = wrapper.find('div[aria-hidden="true"]');
        expect(visual.classes()).toContain('bg-primary-600');
        expect(visual.classes()).toContain('border-primary-600');
    });

    it('sets native disabled attribute on input', () => {
        const wrapper = mount(AppCheckbox, {
            props: { disabled: true },
            attachTo: document.body,
        });

        expect(wrapper.find('input[type="checkbox"]').element.disabled).toBe(
            true,
        );
    });

    it('sets native required attribute on input', () => {
        const wrapper = mount(AppCheckbox, {
            props: { required: true },
            attachTo: document.body,
        });

        expect(wrapper.find('input[type="checkbox"]').element.required).toBe(
            true,
        );
    });
});
