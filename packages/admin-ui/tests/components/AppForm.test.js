import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import AppForm from '../../src/components/AppForm.vue';

describe('AppForm', () => {
    it('renders a form element', () => {
        const wrapper = mount(AppForm);

        expect(wrapper.find('form').exists()).toBe(true);
    });

    it('renders default slot placeholder when no slot provided', () => {
        const wrapper = mount(AppForm);

        expect(wrapper.text()).toContain('Form component placeholder');
    });

    it('renders custom slot content', () => {
        const wrapper = mount(AppForm, {
            slots: {
                default: '<input type="text" class="custom-input" />',
            },
        });

        expect(wrapper.find('.custom-input').exists()).toBe(true);
    });

    it('emits submit event with modelValue on form submit', async () => {
        const formData = { name: 'John', email: 'john@example.com' };

        const wrapper = mount(AppForm, {
            props: {
                modelValue: formData,
            },
            slots: {
                default: '<button type="submit">Submit</button>',
            },
        });

        await wrapper.find('form').trigger('submit');

        expect(wrapper.emitted('submit')).toBeTruthy();
        expect(wrapper.emitted('submit')[0]).toEqual([formData]);
    });

    it('prevents default form submission and emits submit', async () => {
        const wrapper = mount(AppForm, {
            props: {
                modelValue: { test: 'value' },
            },
            slots: {
                default: '<button type="submit">Submit</button>',
            },
        });

        // Trigger submit - if preventDefault wasn't called, the form would navigate away
        await wrapper.find('form').trigger('submit');

        // The component calls event.preventDefault() internally and emits submit
        expect(wrapper.emitted('submit')).toBeTruthy();
        expect(wrapper.emitted('submit')[0]).toEqual([{ test: 'value' }]);
    });

    it('passes fields prop to slot', () => {
        const fields = [
            { name: 'username', type: 'text', label: 'Username' },
            { name: 'password', type: 'password', label: 'Password' },
        ];

        const wrapper = mount(AppForm, {
            props: {
                fields,
            },
            slots: {
                default: `
                    <template #default="{ fields }">
                        <div class="field-count">{{ fields.length }}</div>
                    </template>
                `,
            },
        });

        expect(wrapper.find('.field-count').text()).toBe('2');
    });

    it('passes modelValue as model to slot', () => {
        const formData = { username: 'testuser' };

        const wrapper = mount(AppForm, {
            props: {
                modelValue: formData,
            },
            slots: {
                default: `
                    <template #default="{ model }">
                        <div class="model-data">{{ model.username }}</div>
                    </template>
                `,
            },
        });

        expect(wrapper.find('.model-data').text()).toBe('testuser');
    });

    it('applies space-y-4 class to form', () => {
        const wrapper = mount(AppForm);

        expect(wrapper.find('form').classes()).toContain('space-y-4');
    });

    it('uses empty object as default modelValue', () => {
        const wrapper = mount(AppForm, {
            slots: {
                default: `
                    <template #default="{ model }">
                        <div class="model-keys">{{ Object.keys(model).length }}</div>
                    </template>
                `,
            },
        });

        expect(wrapper.find('.model-keys').text()).toBe('0');
    });

    it('uses empty array as default fields', () => {
        const wrapper = mount(AppForm, {
            slots: {
                default: `
                    <template #default="{ fields }">
                        <div class="fields-length">{{ fields.length }}</div>
                    </template>
                `,
            },
        });

        expect(wrapper.find('.fields-length').text()).toBe('0');
    });
});
