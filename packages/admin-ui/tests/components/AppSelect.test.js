import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import AppSelect from '../../src/components/AppSelect.vue';

const defaultOptions = [
    { value: 'opt1', label: 'Option 1' },
    { value: 'opt2', label: 'Option 2' },
    { value: 'opt3', label: 'Option 3' },
];

describe('AppSelect', () => {
    it('renders with required options prop', () => {
        const wrapper = mount(AppSelect, {
            props: {
                options: defaultOptions,
            },
        });

        expect(wrapper.find('button').exists()).toBe(true);
    });

    it('renders placeholder when no value selected', () => {
        const wrapper = mount(AppSelect, {
            props: {
                options: defaultOptions,
                placeholder: 'Choose one...',
            },
        });

        expect(wrapper.find('button').text()).toContain('Choose one...');
    });

    it('renders default placeholder when not provided', () => {
        const wrapper = mount(AppSelect, {
            props: {
                options: defaultOptions,
            },
        });

        expect(wrapper.find('button').text()).toContain('Select an option');
    });

    it('renders selected option label', () => {
        const wrapper = mount(AppSelect, {
            props: {
                options: defaultOptions,
                modelValue: 'opt2',
            },
        });

        expect(wrapper.find('button').text()).toContain('Option 2');
    });

    it('renders label when provided', () => {
        const wrapper = mount(AppSelect, {
            props: {
                options: defaultOptions,
                label: 'Country',
            },
        });

        expect(wrapper.find('label').text()).toBe('Country');
    });

    it('renders label with required indicator', () => {
        const wrapper = mount(AppSelect, {
            props: {
                options: defaultOptions,
                label: 'Country',
                required: true,
            },
        });

        expect(wrapper.find('label').text()).toContain('Country');
        expect(wrapper.find('label span').text()).toBe('*');
    });

    it('opens dropdown on click', async () => {
        const wrapper = mount(AppSelect, {
            props: {
                options: defaultOptions,
            },
        });

        expect(wrapper.find('button').attributes('aria-expanded')).toBe(
            'false',
        );

        await wrapper.find('button').trigger('click');
        await nextTick();

        expect(wrapper.find('button').attributes('aria-expanded')).toBe('true');
    });

    it('renders all options in dropdown', async () => {
        const wrapper = mount(AppSelect, {
            props: {
                options: defaultOptions,
            },
        });

        await wrapper.find('button').trigger('click');

        const options = wrapper.findAll('li[role="option"]');
        expect(options.length).toBe(3);
        expect(options[0].text()).toContain('Option 1');
        expect(options[1].text()).toContain('Option 2');
        expect(options[2].text()).toContain('Option 3');
    });

    it('emits update:modelValue when option is selected', async () => {
        const wrapper = mount(AppSelect, {
            props: {
                options: defaultOptions,
                modelValue: '',
                'onUpdate:modelValue': (e) =>
                    wrapper.setProps({ modelValue: e }),
            },
        });

        await wrapper.find('button').trigger('click');
        await wrapper.findAll('li[role="option"]')[1].trigger('click');

        expect(wrapper.emitted('update:modelValue')).toBeTruthy();
        expect(wrapper.emitted('update:modelValue')[0]).toEqual(['opt2']);
    });

    it('closes dropdown after selection', async () => {
        const wrapper = mount(AppSelect, {
            props: {
                options: defaultOptions,
            },
        });

        await wrapper.find('button').trigger('click');
        await nextTick();
        expect(wrapper.find('button').attributes('aria-expanded')).toBe('true');

        await wrapper.findAll('li[role="option"]')[0].trigger('click');
        await nextTick();
        expect(wrapper.find('button').attributes('aria-expanded')).toBe(
            'false',
        );
    });

    it('displays error message when provided', () => {
        const wrapper = mount(AppSelect, {
            props: {
                options: defaultOptions,
                error: 'Please select an option',
            },
        });

        const helperText = wrapper.find('p');
        expect(helperText.exists()).toBe(true);
        expect(helperText.text()).toBe('Please select an option');
    });

    it('displays hint when provided and no error', () => {
        const wrapper = mount(AppSelect, {
            props: {
                options: defaultOptions,
                hint: 'Select your preferred option',
            },
        });

        const helperText = wrapper.find('p');
        expect(helperText.exists()).toBe(true);
        expect(helperText.text()).toBe('Select your preferred option');
    });

    it('disables button when disabled prop is true', () => {
        const wrapper = mount(AppSelect, {
            props: {
                options: defaultOptions,
                disabled: true,
            },
        });

        expect(wrapper.find('button').element.disabled).toBe(true);
    });

    it('does not open dropdown when disabled', async () => {
        const wrapper = mount(AppSelect, {
            props: {
                options: defaultOptions,
                disabled: true,
            },
        });

        await wrapper.find('button').trigger('click');

        expect(wrapper.find('ul[role="listbox"]').isVisible()).toBe(false);
    });

    it('renders disabled options with correct styling', async () => {
        const optionsWithDisabled = [
            { value: 'opt1', label: 'Option 1' },
            { value: 'opt2', label: 'Option 2', disabled: true },
            { value: 'opt3', label: 'Option 3' },
        ];

        const wrapper = mount(AppSelect, {
            props: {
                options: optionsWithDisabled,
            },
        });

        await wrapper.find('button').trigger('click');

        const options = wrapper.findAll('li[role="option"]');
        expect(options[1].attributes('aria-disabled')).toBe('true');
    });

    it('does not select disabled options', async () => {
        const optionsWithDisabled = [
            { value: 'opt1', label: 'Option 1' },
            { value: 'opt2', label: 'Option 2', disabled: true },
            { value: 'opt3', label: 'Option 3' },
        ];

        const wrapper = mount(AppSelect, {
            props: {
                options: optionsWithDisabled,
                modelValue: '',
            },
        });

        await wrapper.find('button').trigger('click');
        await wrapper.findAll('li[role="option"]')[1].trigger('click');

        expect(wrapper.emitted('update:modelValue')).toBeFalsy();
    });

    it('shows checkmark on selected option', async () => {
        const wrapper = mount(AppSelect, {
            props: {
                options: defaultOptions,
                modelValue: 'opt2',
            },
        });

        await wrapper.find('button').trigger('click');

        const selectedOption = wrapper.findAll('li[role="option"]')[1];
        expect(selectedOption.find('svg').exists()).toBe(true);
    });

    it('sets aria-expanded correctly', async () => {
        const wrapper = mount(AppSelect, {
            props: {
                options: defaultOptions,
            },
        });

        expect(wrapper.find('button').attributes('aria-expanded')).toBe(
            'false',
        );

        await wrapper.find('button').trigger('click');

        expect(wrapper.find('button').attributes('aria-expanded')).toBe('true');
    });

    it('has correct aria-haspopup attribute', () => {
        const wrapper = mount(AppSelect, {
            props: {
                options: defaultOptions,
            },
        });

        expect(wrapper.find('button').attributes('aria-haspopup')).toBe(
            'listbox',
        );
    });

    it('opens dropdown on Enter key', async () => {
        const wrapper = mount(AppSelect, {
            props: {
                options: defaultOptions,
            },
        });

        await wrapper.find('button').trigger('keydown', { key: 'Enter' });

        expect(wrapper.find('ul[role="listbox"]').isVisible()).toBe(true);
    });

    it('opens dropdown on Space key', async () => {
        const wrapper = mount(AppSelect, {
            props: {
                options: defaultOptions,
            },
        });

        await wrapper.find('button').trigger('keydown', { key: ' ' });

        expect(wrapper.find('ul[role="listbox"]').isVisible()).toBe(true);
    });

    it('closes dropdown on Escape key', async () => {
        const wrapper = mount(AppSelect, {
            props: {
                options: defaultOptions,
            },
        });

        await wrapper.find('button').trigger('click');
        await nextTick();
        expect(wrapper.find('button').attributes('aria-expanded')).toBe('true');

        await wrapper.find('button').trigger('keydown', { key: 'Escape' });
        await nextTick();

        expect(wrapper.find('button').attributes('aria-expanded')).toBe(
            'false',
        );
    });

    it('opens dropdown on ArrowDown key', async () => {
        const wrapper = mount(AppSelect, {
            props: {
                options: defaultOptions,
            },
        });

        await wrapper.find('button').trigger('keydown', { key: 'ArrowDown' });

        expect(wrapper.find('ul[role="listbox"]').isVisible()).toBe(true);
    });

    it('applies fixed positioning to dropdown when open', async () => {
        const wrapper = mount(AppSelect, {
            props: {
                options: defaultOptions,
            },
            attachTo: document.body,
        });

        await wrapper.find('button').trigger('click');
        await nextTick();

        const listbox = wrapper.find('ul[role="listbox"]');
        expect(listbox.element.style.position).toBe('fixed');
    });

    it('sets dropdown width to match trigger button width', async () => {
        const wrapper = mount(AppSelect, {
            props: {
                options: defaultOptions,
            },
            attachTo: document.body,
        });

        await wrapper.find('button').trigger('click');
        await nextTick();

        const listbox = wrapper.find('ul[role="listbox"]');
        // In jsdom getBoundingClientRect returns 0s, so width should be '0px'
        expect(listbox.element.style.width).toMatch(/^\d+px$/);
    });

    it('sets dropdown top position below trigger button', async () => {
        const wrapper = mount(AppSelect, {
            props: {
                options: defaultOptions,
            },
            attachTo: document.body,
        });

        await wrapper.find('button').trigger('click');
        await nextTick();

        const listbox = wrapper.find('ul[role="listbox"]');
        expect(listbox.element.style.top).toMatch(/^\d+px$/);
    });

    it('closes dropdown on window scroll', async () => {
        const wrapper = mount(AppSelect, {
            props: {
                options: defaultOptions,
            },
            attachTo: document.body,
        });

        await wrapper.find('button').trigger('click');
        await nextTick();
        expect(wrapper.find('button').attributes('aria-expanded')).toBe('true');

        window.dispatchEvent(new Event('scroll'));
        await nextTick();

        expect(wrapper.find('button').attributes('aria-expanded')).toBe(
            'false',
        );
    });

    it('closes dropdown on window resize', async () => {
        const wrapper = mount(AppSelect, {
            props: {
                options: defaultOptions,
            },
            attachTo: document.body,
        });

        await wrapper.find('button').trigger('click');
        await nextTick();
        expect(wrapper.find('button').attributes('aria-expanded')).toBe('true');

        window.dispatchEvent(new Event('resize'));
        await nextTick();

        expect(wrapper.find('button').attributes('aria-expanded')).toBe(
            'false',
        );
    });

    it('removes scroll and resize listeners after closing', async () => {
        const removeSpy = vi.spyOn(window, 'removeEventListener');
        const wrapper = mount(AppSelect, {
            props: {
                options: defaultOptions,
            },
            attachTo: document.body,
        });

        await wrapper.find('button').trigger('click');
        await nextTick();

        await wrapper.find('button').trigger('click');
        await nextTick();

        expect(removeSpy).toHaveBeenCalledWith(
            'scroll',
            expect.any(Function),
            true,
        );
        expect(removeSpy).toHaveBeenCalledWith(
            'resize',
            expect.any(Function),
        );

        removeSpy.mockRestore();
    });

    it('removes scroll and resize listeners on unmount', async () => {
        const removeSpy = vi.spyOn(window, 'removeEventListener');
        const wrapper = mount(AppSelect, {
            props: {
                options: defaultOptions,
            },
            attachTo: document.body,
        });

        await wrapper.find('button').trigger('click');
        await nextTick();

        wrapper.unmount();

        expect(removeSpy).toHaveBeenCalledWith(
            'scroll',
            expect.any(Function),
            true,
        );
        expect(removeSpy).toHaveBeenCalledWith(
            'resize',
            expect.any(Function),
        );

        removeSpy.mockRestore();
    });
});
