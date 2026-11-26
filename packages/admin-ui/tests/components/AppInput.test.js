import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vite-plus/test';
import AppInput from '../../src/components/AppInput.vue';

describe('AppInput', () => {
    it('renders with default props', () => {
        const wrapper = mount(AppInput);

        expect(wrapper.find('input').exists()).toBe(true);
        expect(wrapper.find('label').exists()).toBe(false);
    });

    it('renders label when provided', () => {
        const wrapper = mount(AppInput, {
            props: {
                label: 'Username',
            },
        });

        expect(wrapper.find('label').text()).toBe('Username');
    });

    it('renders label with required indicator', () => {
        const wrapper = mount(AppInput, {
            props: {
                label: 'Email',
                required: true,
            },
        });

        expect(wrapper.find('label').text()).toContain('Email');
        expect(wrapper.find('label span').text()).toBe('*');
    });

    it('binds v-model correctly', async () => {
        const wrapper = mount(AppInput, {
            props: {
                modelValue: 'initial',
                'onUpdate:modelValue': (e) =>
                    wrapper.setProps({ modelValue: e }),
            },
        });

        expect(wrapper.find('input').element.value).toBe('initial');

        await wrapper.find('input').setValue('updated');
        expect(wrapper.emitted('update:modelValue')).toBeTruthy();
        expect(wrapper.emitted('update:modelValue')[0]).toEqual(['updated']);
    });

    it('displays error message when provided', () => {
        const wrapper = mount(AppInput, {
            props: {
                error: 'This field is required',
            },
        });

        const helperText = wrapper.find('p');
        expect(helperText.exists()).toBe(true);
        expect(helperText.text()).toBe('This field is required');
    });

    it('displays hint when provided and no error', () => {
        const wrapper = mount(AppInput, {
            props: {
                hint: 'Enter your username',
            },
        });

        const helperText = wrapper.find('p');
        expect(helperText.exists()).toBe(true);
        expect(helperText.text()).toBe('Enter your username');
    });

    it('displays error over hint when both provided', () => {
        const wrapper = mount(AppInput, {
            props: {
                error: 'Invalid input',
                hint: 'Some hint',
            },
        });

        const helperText = wrapper.find('p');
        expect(helperText.text()).toBe('Invalid input');
    });

    it('disables input when disabled prop is true', () => {
        const wrapper = mount(AppInput, {
            props: {
                disabled: true,
            },
        });

        expect(wrapper.find('input').element.disabled).toBe(true);
    });

    it('sets placeholder correctly', () => {
        const wrapper = mount(AppInput, {
            props: {
                placeholder: 'Enter text...',
            },
        });

        expect(wrapper.find('input').attributes('placeholder')).toBe(
            'Enter text...',
        );
    });

    it('sets input type correctly', () => {
        const wrapper = mount(AppInput, {
            props: {
                type: 'password',
            },
        });

        expect(wrapper.find('input').attributes('type')).toBe('password');
    });

    it('renders prefix slot when provided', () => {
        const wrapper = mount(AppInput, {
            slots: {
                prefix: '<span class="prefix-icon">@</span>',
            },
        });

        expect(wrapper.find('.prefix-icon').exists()).toBe(true);
        expect(wrapper.find('.prefix-icon').text()).toBe('@');
    });

    it('renders suffix slot when provided', () => {
        const wrapper = mount(AppInput, {
            slots: {
                suffix: '<span class="suffix-icon">!</span>',
            },
        });

        expect(wrapper.find('.suffix-icon').exists()).toBe(true);
        expect(wrapper.find('.suffix-icon').text()).toBe('!');
    });

    describe('revealable', () => {
        const toggle = (wrapper) =>
            wrapper.find('button[aria-label$="password"]');

        it('renders no toggle without revealable', () => {
            const wrapper = mount(AppInput, { props: { type: 'password' } });

            expect(wrapper.find('button').exists()).toBe(false);
        });

        it('renders no toggle for non-password types', () => {
            const wrapper = mount(AppInput, {
                props: { type: 'email', revealable: true },
            });

            expect(wrapper.find('button').exists()).toBe(false);
        });

        it('toggles the input type and the button state', async () => {
            const wrapper = mount(AppInput, {
                props: { type: 'password', revealable: true },
            });
            const input = wrapper.find('input');

            expect(input.attributes('type')).toBe('password');
            expect(toggle(wrapper).attributes('aria-label')).toBe(
                'Show password',
            );
            expect(toggle(wrapper).attributes('aria-pressed')).toBe('false');

            await toggle(wrapper).trigger('click');

            expect(input.attributes('type')).toBe('text');
            expect(toggle(wrapper).attributes('aria-label')).toBe(
                'Hide password',
            );
            expect(toggle(wrapper).attributes('aria-pressed')).toBe('true');

            await toggle(wrapper).trigger('click');

            expect(input.attributes('type')).toBe('password');
        });

        it('never submits a wrapping form', async () => {
            let submits = 0;
            const wrapper = mount(
                {
                    components: { AppInput },
                    template:
                        '<form @submit.prevent="onSubmit"><AppInput type="password" revealable /></form>',
                    methods: { onSubmit: () => submits++ },
                },
                { attachTo: document.body },
            );

            expect(toggle(wrapper).attributes('type')).toBe('button');
            await toggle(wrapper).trigger('click');
            expect(submits).toBe(0);

            wrapper.unmount();
        });

        it('replaces suffix slot content', () => {
            const wrapper = mount(AppInput, {
                props: { type: 'password', revealable: true },
                slots: { suffix: '<span class="suffix-icon">!</span>' },
            });

            expect(toggle(wrapper).exists()).toBe(true);
            expect(wrapper.find('.suffix-icon').exists()).toBe(false);
        });
    });
});
