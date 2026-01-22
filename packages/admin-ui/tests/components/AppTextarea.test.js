import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import AppTextarea from '../../src/components/AppTextarea.vue';

describe('AppTextarea', () => {
    it('renders textarea element', () => {
        const wrapper = mount(AppTextarea);
        expect(wrapper.find('textarea').exists()).toBe(true);
    });

    it('renders label when provided', () => {
        const wrapper = mount(AppTextarea, {
            props: { label: 'Description' },
        });

        expect(wrapper.find('label').text()).toBe('Description');
    });

    it('renders label with required indicator', () => {
        const wrapper = mount(AppTextarea, {
            props: { label: 'Description', required: true },
        });

        expect(wrapper.find('label').text()).toContain('Description');
        expect(wrapper.find('label span').text()).toBe('*');
    });

    it('binds v-model correctly', async () => {
        const wrapper = mount(AppTextarea, {
            props: {
                modelValue: 'initial text',
                'onUpdate:modelValue': (e) =>
                    wrapper.setProps({ modelValue: e }),
            },
        });

        expect(wrapper.find('textarea').element.value).toBe('initial text');

        await wrapper.find('textarea').setValue('updated text');
        expect(wrapper.emitted('update:modelValue')).toBeTruthy();
        expect(wrapper.emitted('update:modelValue')[0]).toEqual([
            'updated text',
        ]);
    });

    it('displays placeholder', () => {
        const wrapper = mount(AppTextarea, {
            props: { placeholder: 'Enter description...' },
        });

        expect(wrapper.find('textarea').attributes('placeholder')).toBe(
            'Enter description...',
        );
    });

    it('displays error message when provided', () => {
        const wrapper = mount(AppTextarea, {
            props: { error: 'This field is required' },
        });

        const helperText = wrapper.find('p');
        expect(helperText.exists()).toBe(true);
        expect(helperText.text()).toBe('This field is required');
        expect(helperText.classes()).toContain('text-danger');
    });

    it('displays hint when provided and no error', () => {
        const wrapper = mount(AppTextarea, {
            props: { hint: 'Max 500 characters' },
        });

        const helperText = wrapper.find('p');
        expect(helperText.exists()).toBe(true);
        expect(helperText.text()).toBe('Max 500 characters');
        expect(helperText.classes()).toContain('text-muted');
    });

    it('prefers error over hint when both provided', () => {
        const wrapper = mount(AppTextarea, {
            props: {
                error: 'Error message',
                hint: 'Hint message',
            },
        });

        const helperText = wrapper.find('p');
        expect(helperText.text()).toBe('Error message');
    });

    it('disables textarea when disabled prop is true', () => {
        const wrapper = mount(AppTextarea, {
            props: { disabled: true },
        });

        expect(wrapper.find('textarea').element.disabled).toBe(true);
    });

    it('sets rows attribute', () => {
        const wrapper = mount(AppTextarea, {
            props: { rows: 5 },
        });

        expect(wrapper.find('textarea').attributes('rows')).toBe('5');
    });

    it('sets maxlength attribute and shows character count', () => {
        const wrapper = mount(AppTextarea, {
            props: {
                modelValue: 'hello',
                maxlength: 100,
            },
        });

        expect(wrapper.find('textarea').attributes('maxlength')).toBe('100');
        expect(wrapper.text()).toContain('5/100');
    });

    it('updates character count as user types', async () => {
        const wrapper = mount(AppTextarea, {
            props: {
                modelValue: '',
                maxlength: 50,
                'onUpdate:modelValue': (e) =>
                    wrapper.setProps({ modelValue: e }),
            },
        });

        expect(wrapper.text()).toContain('0/50');

        await wrapper.find('textarea').setValue('test');
        expect(wrapper.text()).toContain('4/50');
    });

    it('applies resize-none class when resize is none', () => {
        const wrapper = mount(AppTextarea, {
            props: { resize: 'none' },
        });

        expect(wrapper.find('textarea').classes()).toContain('resize-none');
    });

    it('applies resize-y class by default', () => {
        const wrapper = mount(AppTextarea);
        expect(wrapper.find('textarea').classes()).toContain('resize-y');
    });

    it('applies resize-x class when resize is horizontal', () => {
        const wrapper = mount(AppTextarea, {
            props: { resize: 'horizontal' },
        });

        expect(wrapper.find('textarea').classes()).toContain('resize-x');
    });

    it('applies resize class when resize is both', () => {
        const wrapper = mount(AppTextarea, {
            props: { resize: 'both' },
        });

        expect(wrapper.find('textarea').classes()).toContain('resize');
    });

    it('applies error border class when error is present', () => {
        const wrapper = mount(AppTextarea, {
            props: { error: 'Error' },
        });

        expect(wrapper.find('textarea').classes()).toContain('border-danger');
    });

    it('applies normal border class when no error', () => {
        const wrapper = mount(AppTextarea);
        expect(wrapper.find('textarea').classes()).toContain(
            'border-input-border',
        );
    });
});
