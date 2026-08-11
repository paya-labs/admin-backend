import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import AppMultiSelect from '../../src/components/AppMultiSelect.vue';

const defaultOptions = [
    { value: 'opt1', label: 'Option 1' },
    { value: 'opt2', label: 'Option 2' },
    { value: 'opt3', label: 'Option 3' },
];

// Helper to find the teleported listbox in document.body
const findListbox = () => document.querySelector('ul[role="listbox"]');
const findAllOptions = () => document.querySelectorAll('li[role="option"]');

const mountMultiSelect = (props = {}) =>
    mount(AppMultiSelect, {
        props: { options: defaultOptions, ...props },
        attachTo: document.body,
    });

describe('AppMultiSelect', () => {
    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('renders placeholder when nothing is selected', () => {
        const wrapper = mountMultiSelect({ placeholder: 'All types' });

        expect(wrapper.find('button').text()).toContain('All types');
    });

    it('renders the option label for a single selection', () => {
        const wrapper = mountMultiSelect({ modelValue: ['opt2'] });

        expect(wrapper.find('button').text()).toContain('Option 2');
    });

    it('renders a count for multiple selections', () => {
        const wrapper = mountMultiSelect({ modelValue: ['opt1', 'opt3'] });

        expect(wrapper.find('button').text()).toContain('2 selected');
    });

    it('opens the listbox with all options on click', async () => {
        const wrapper = mountMultiSelect();

        await wrapper.find('button').trigger('click');

        expect(findListbox()).not.toBeNull();
        expect(findAllOptions()).toHaveLength(3);
    });

    it('emits the added value when an option is clicked', async () => {
        const wrapper = mountMultiSelect({ modelValue: ['opt1'] });

        await wrapper.find('button').trigger('click');
        findAllOptions()[1].click();

        expect(wrapper.emitted('update:modelValue')[0][0]).toEqual([
            'opt1',
            'opt2',
        ]);
    });

    it('emits the removed value when a selected option is clicked', async () => {
        const wrapper = mountMultiSelect({ modelValue: ['opt1', 'opt2'] });

        await wrapper.find('button').trigger('click');
        findAllOptions()[0].click();

        expect(wrapper.emitted('update:modelValue')[0][0]).toEqual(['opt2']);
    });

    it('keeps the dropdown open after toggling an option', async () => {
        const wrapper = mountMultiSelect();

        await wrapper.find('button').trigger('click');
        findAllOptions()[0].click();
        await wrapper.vm.$nextTick();

        expect(wrapper.find('button').attributes('aria-expanded')).toBe('true');
    });

    it('does not emit for a disabled option', async () => {
        const wrapper = mountMultiSelect({
            options: [
                ...defaultOptions,
                { value: 'opt4', label: 'Option 4', disabled: true },
            ],
        });

        await wrapper.find('button').trigger('click');
        findAllOptions()[3].click();

        expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    });

    it('closes on a click outside', async () => {
        const wrapper = mountMultiSelect();

        await wrapper.find('button').trigger('click');
        document.body.click();
        await wrapper.vm.$nextTick();

        expect(wrapper.find('button').attributes('aria-expanded')).toBe(
            'false',
        );
    });
});
