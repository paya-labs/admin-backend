import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import AppSelect from '../../src/components/AppSelect.vue';

const defaultOptions = [
    { value: 'opt1', label: 'Option 1' },
    { value: 'opt2', label: 'Option 2' },
    { value: 'opt3', label: 'Option 3' },
];

// Helper to find the teleported listbox in document.body
const findListbox = () => document.querySelector('ul[role="listbox"]');
const findAllOptions = () => document.querySelectorAll('li[role="option"]');

describe('AppSelect', () => {
    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('renders with required options prop', () => {
        const wrapper = mount(AppSelect, {
            props: {
                options: defaultOptions,
            },
            attachTo: document.body,
        });

        expect(wrapper.find('button').exists()).toBe(true);
    });

    it('renders placeholder when no value selected', () => {
        const wrapper = mount(AppSelect, {
            props: {
                options: defaultOptions,
                placeholder: 'Choose one...',
            },
            attachTo: document.body,
        });

        expect(wrapper.find('button').text()).toContain('Choose one...');
    });

    it('renders default placeholder when not provided', () => {
        const wrapper = mount(AppSelect, {
            props: {
                options: defaultOptions,
            },
            attachTo: document.body,
        });

        expect(wrapper.find('button').text()).toContain('Select an option');
    });

    it('renders selected option label', () => {
        const wrapper = mount(AppSelect, {
            props: {
                options: defaultOptions,
                modelValue: 'opt2',
            },
            attachTo: document.body,
        });

        expect(wrapper.find('button').text()).toContain('Option 2');
    });

    it('renders label when provided', () => {
        const wrapper = mount(AppSelect, {
            props: {
                options: defaultOptions,
                label: 'Country',
            },
            attachTo: document.body,
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
            attachTo: document.body,
        });

        expect(wrapper.find('label').text()).toContain('Country');
        expect(wrapper.find('label span').text()).toBe('*');
    });

    it('opens dropdown on click', async () => {
        const wrapper = mount(AppSelect, {
            props: {
                options: defaultOptions,
            },
            attachTo: document.body,
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
            attachTo: document.body,
        });

        await wrapper.find('button').trigger('click');
        await nextTick();

        const options = findAllOptions();
        expect(options.length).toBe(3);
        expect(options[0].textContent).toContain('Option 1');
        expect(options[1].textContent).toContain('Option 2');
        expect(options[2].textContent).toContain('Option 3');
    });

    it('emits update:modelValue when option is selected', async () => {
        const wrapper = mount(AppSelect, {
            props: {
                options: defaultOptions,
                modelValue: '',
                'onUpdate:modelValue': (e) =>
                    wrapper.setProps({ modelValue: e }),
            },
            attachTo: document.body,
        });

        await wrapper.find('button').trigger('click');
        await nextTick();

        const options = findAllOptions();
        options[1].click();
        await nextTick();

        expect(wrapper.emitted('update:modelValue')).toBeTruthy();
        expect(wrapper.emitted('update:modelValue')[0]).toEqual(['opt2']);
    });

    it('closes dropdown after selection', async () => {
        const wrapper = mount(AppSelect, {
            props: {
                options: defaultOptions,
            },
            attachTo: document.body,
        });

        await wrapper.find('button').trigger('click');
        await nextTick();
        expect(wrapper.find('button').attributes('aria-expanded')).toBe('true');

        const options = findAllOptions();
        options[0].click();
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
            attachTo: document.body,
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
            attachTo: document.body,
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
            attachTo: document.body,
        });

        expect(wrapper.find('button').element.disabled).toBe(true);
    });

    it('does not open dropdown when disabled', async () => {
        const wrapper = mount(AppSelect, {
            props: {
                options: defaultOptions,
                disabled: true,
            },
            attachTo: document.body,
        });

        await wrapper.find('button').trigger('click');
        await nextTick();

        const listbox = findListbox();
        expect(listbox.style.display).toBe('none');
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
            attachTo: document.body,
        });

        await wrapper.find('button').trigger('click');
        await nextTick();

        const options = findAllOptions();
        expect(options[1].getAttribute('aria-disabled')).toBe('true');
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
            attachTo: document.body,
        });

        await wrapper.find('button').trigger('click');
        await nextTick();

        const options = findAllOptions();
        options[1].click();
        await nextTick();

        expect(wrapper.emitted('update:modelValue')).toBeFalsy();
    });

    it('shows checkmark on selected option', async () => {
        const wrapper = mount(AppSelect, {
            props: {
                options: defaultOptions,
                modelValue: 'opt2',
            },
            attachTo: document.body,
        });

        await wrapper.find('button').trigger('click');
        await nextTick();

        const options = findAllOptions();
        expect(options[1].querySelector('svg')).not.toBeNull();
    });

    it('sets aria-expanded correctly', async () => {
        const wrapper = mount(AppSelect, {
            props: {
                options: defaultOptions,
            },
            attachTo: document.body,
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
            attachTo: document.body,
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
            attachTo: document.body,
        });

        await wrapper.find('button').trigger('keydown', { key: 'Enter' });
        await nextTick();

        const listbox = findListbox();
        expect(listbox.style.display).not.toBe('none');
    });

    it('opens dropdown on Space key', async () => {
        const wrapper = mount(AppSelect, {
            props: {
                options: defaultOptions,
            },
            attachTo: document.body,
        });

        await wrapper.find('button').trigger('keydown', { key: ' ' });
        await nextTick();

        const listbox = findListbox();
        expect(listbox.style.display).not.toBe('none');
    });

    it('closes dropdown on Escape key', async () => {
        const wrapper = mount(AppSelect, {
            props: {
                options: defaultOptions,
            },
            attachTo: document.body,
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
            attachTo: document.body,
        });

        await wrapper.find('button').trigger('keydown', { key: 'ArrowDown' });
        await nextTick();

        const listbox = findListbox();
        expect(listbox.style.display).not.toBe('none');
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

        const listbox = findListbox();
        expect(listbox.style.position).toBe('fixed');
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

        const listbox = findListbox();
        // In jsdom getBoundingClientRect returns 0s, so width should be '0px'
        expect(listbox.style.width).toMatch(/^\d+px$/);
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

        const listbox = findListbox();
        expect(listbox.style.top).toMatch(/^\d+px$/);
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
        expect(removeSpy).toHaveBeenCalledWith('resize', expect.any(Function));

        removeSpy.mockRestore();
    });

    it('scrolls selected option to top when dropdown opens', async () => {
        const manyOptions = Array.from({ length: 20 }, (_, i) => ({
            value: `opt${i + 1}`,
            label: `Option ${i + 1}`,
        }));

        const wrapper = mount(AppSelect, {
            props: {
                options: manyOptions,
                modelValue: 'opt15',
            },
            attachTo: document.body,
        });

        // Mock scrollIntoView on all option elements before opening
        const scrollIntoViewMock = vi.fn();
        const allOptions = findAllOptions();
        allOptions.forEach((opt) => {
            opt.scrollIntoView = scrollIntoViewMock;
        });

        await wrapper.find('button').trigger('click');
        await nextTick();

        // scrollIntoView should be called with block: 'start' on the selected option (index 14)
        expect(scrollIntoViewMock).toHaveBeenCalledWith({ block: 'start' });
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
        expect(removeSpy).toHaveBeenCalledWith('resize', expect.any(Function));

        removeSpy.mockRestore();
    });
});
