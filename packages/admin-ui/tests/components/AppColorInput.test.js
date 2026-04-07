import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { nextTick } from 'vue';
import AppColorInput, {
    DEFAULT_PALETTE,
} from '../../src/components/AppColorInput.vue';

// Stub Transition so leave animations don't block element removal in jsdom
function mountColorInput(props = {}) {
    return mount(AppColorInput, {
        props,
        global: { stubs: { Transition: true } },
    });
}

// Helper to open the picker dropdown
async function openPicker(wrapper) {
    await wrapper.find('button').trigger('click');
    await nextTick();
}

describe('AppColorInput', () => {
    // --- Rendering ---

    it('renders with default props', () => {
        const wrapper = mountColorInput();

        expect(wrapper.find('button').exists()).toBe(true);
        expect(wrapper.find('label').exists()).toBe(false);
    });

    it('displays the current color value in the trigger', () => {
        const wrapper = mountColorInput({ modelValue: '#ff0000' });

        expect(wrapper.find('button').text()).toContain('#ff0000');
    });

    it('hides hex code in trigger when showHex is false', () => {
        const wrapper = mountColorInput({
            modelValue: '#ff0000',
            showHex: false,
        });

        expect(wrapper.find('button').text()).not.toContain('#ff0000');
    });

    it('shows hex code in trigger by default', () => {
        const wrapper = mountColorInput({ modelValue: '#ff0000' });

        expect(wrapper.find('button').text()).toContain('#ff0000');
    });

    it('shows color swatch preview with correct background', () => {
        const wrapper = mountColorInput({ modelValue: '#33b679' });

        const swatch = wrapper.find('button span[aria-hidden="true"]');
        expect(swatch.attributes('style')).toContain(
            'background-color: rgb(51, 182, 121)',
        );
    });

    it('renders label when provided', () => {
        const wrapper = mountColorInput({ label: 'Brand Color' });

        expect(wrapper.find('label').text()).toBe('Brand Color');
    });

    it('renders label with required indicator', () => {
        const wrapper = mountColorInput({
            label: 'Theme Color',
            required: true,
        });

        expect(wrapper.find('label').text()).toContain('Theme Color');
        expect(wrapper.find('label span').text()).toBe('*');
    });

    it('does not show required indicator when not required', () => {
        const wrapper = mountColorInput({
            label: 'Color',
            required: false,
        });

        expect(wrapper.find('label span').exists()).toBe(false);
    });

    // --- Helper text ---

    it('displays error message when provided', () => {
        const wrapper = mountColorInput({ error: 'Invalid color' });

        const helperText = wrapper.find('p');
        expect(helperText.exists()).toBe(true);
        expect(helperText.text()).toBe('Invalid color');
    });

    it('displays hint when provided and no error', () => {
        const wrapper = mountColorInput({ hint: 'Choose a brand color' });

        const helperText = wrapper.find('p');
        expect(helperText.exists()).toBe(true);
        expect(helperText.text()).toBe('Choose a brand color');
    });

    it('displays error over hint when both provided', () => {
        const wrapper = mountColorInput({
            error: 'Color not allowed',
            hint: 'Some hint',
        });

        const helperText = wrapper.find('p');
        expect(helperText.text()).toBe('Color not allowed');
    });

    it('does not show helper text when neither error nor hint', () => {
        const wrapper = mountColorInput();

        expect(wrapper.find('p').exists()).toBe(false);
    });

    // --- Styling ---

    it('applies error styling to the trigger button', () => {
        const wrapper = mountColorInput({ error: 'Bad color' });

        expect(wrapper.find('button').classes()).toContain('border-danger');
    });

    it('applies normal border when no error', () => {
        const wrapper = mountColorInput();

        expect(wrapper.find('button').classes()).toContain(
            'border-input-border',
        );
        expect(wrapper.find('button').classes()).not.toContain('border-danger');
    });

    // --- Disabled ---

    it('disables button when disabled prop is true', () => {
        const wrapper = mountColorInput({ disabled: true });

        expect(wrapper.find('button').element.disabled).toBe(true);
    });

    it('does not open picker when disabled', async () => {
        const wrapper = mountColorInput({ disabled: true });

        await openPicker(wrapper);

        expect(wrapper.find('[role="application"]').exists()).toBe(false);
    });

    // --- Picker open/close ---

    it('opens picker on click', async () => {
        const wrapper = mountColorInput();

        expect(wrapper.find('[role="application"]').exists()).toBe(false);

        await openPicker(wrapper);

        expect(wrapper.find('[role="application"]').exists()).toBe(true);
    });

    it('closes picker on second click', async () => {
        const wrapper = mountColorInput();

        await openPicker(wrapper);
        expect(wrapper.find('[role="application"]').exists()).toBe(true);

        await wrapper.find('button').trigger('click');
        await nextTick();

        expect(wrapper.find('[role="application"]').exists()).toBe(false);
    });

    it('closes picker on Escape key', async () => {
        const wrapper = mountColorInput();

        await openPicker(wrapper);
        expect(wrapper.find('[role="application"]').exists()).toBe(true);

        await wrapper
            .find('[role="application"]')
            .trigger('keydown', { key: 'Escape' });
        await nextTick();

        expect(wrapper.find('[role="application"]').exists()).toBe(false);
    });

    // --- v-model ---

    it('emits update:modelValue when palette color is selected', async () => {
        const wrapper = mountColorInput({
            modelValue: '#000000',
            'onUpdate:modelValue': (e) => wrapper.setProps({ modelValue: e }),
        });

        await openPicker(wrapper);

        const swatches = wrapper.findAll(
            '.flex.flex-wrap button[type="button"]',
        );
        expect(swatches.length).toBe(DEFAULT_PALETTE.length);

        await swatches[0].trigger('click');

        expect(wrapper.emitted('update:modelValue')).toBeTruthy();
        expect(wrapper.emitted('update:modelValue')[0]).toEqual([
            DEFAULT_PALETTE[0].toLowerCase(),
        ]);
    });

    it('syncs internal state when modelValue prop changes', async () => {
        const wrapper = mountColorInput({ modelValue: '#ff0000' });

        expect(wrapper.find('button').text()).toContain('#ff0000');

        await wrapper.setProps({ modelValue: '#00ff00' });
        await nextTick();

        expect(wrapper.find('button').text()).toContain('#00ff00');
    });

    // --- Palette ---

    it('renders default palette swatches', async () => {
        const wrapper = mountColorInput();

        await openPicker(wrapper);

        const swatches = wrapper.findAll(
            '.flex.flex-wrap button[type="button"]',
        );
        expect(swatches.length).toBe(DEFAULT_PALETTE.length);
    });

    it('renders custom palette when provided', async () => {
        const customPalette = ['#ff0000', '#00ff00', '#0000ff'];
        const wrapper = mountColorInput({ palette: customPalette });

        await openPicker(wrapper);

        const swatches = wrapper.findAll(
            '.flex.flex-wrap button[type="button"]',
        );
        expect(swatches.length).toBe(3);
    });

    it('renders no palette when palette is false', async () => {
        const wrapper = mountColorInput({ palette: false });

        await openPicker(wrapper);

        const swatchContainer = wrapper.find('.flex.flex-wrap');
        expect(swatchContainer.exists()).toBe(false);
    });

    it('highlights the selected palette swatch', async () => {
        const wrapper = mountColorInput({ modelValue: '#d50000' });

        await openPicker(wrapper);

        const swatches = wrapper.findAll(
            '.flex.flex-wrap button[type="button"]',
        );
        expect(swatches[0].classes()).toContain('border-text');
        expect(swatches[1].classes()).not.toContain('border-text');
    });

    it('handles case-insensitive palette matching', async () => {
        const wrapper = mountColorInput({
            modelValue: '#D50000',
            palette: ['#d50000', '#ff0000'],
        });

        await openPicker(wrapper);

        const swatches = wrapper.findAll(
            '.flex.flex-wrap button[type="button"]',
        );
        expect(swatches[0].classes()).toContain('border-text');
    });

    // --- Hex input ---

    it('commits valid hex on Enter', async () => {
        const wrapper = mountColorInput({
            modelValue: '#000000',
            'onUpdate:modelValue': (e) => wrapper.setProps({ modelValue: e }),
        });

        await openPicker(wrapper);

        const hexInput = wrapper.find('input[type="text"]');
        await hexInput.setValue('#abcdef');
        await hexInput.trigger('keydown', { key: 'Enter' });

        expect(wrapper.emitted('update:modelValue')).toBeTruthy();
        const emissions = wrapper.emitted('update:modelValue');
        expect(emissions[emissions.length - 1]).toEqual(['#abcdef']);
    });

    it('commits valid hex on blur', async () => {
        const wrapper = mountColorInput({
            modelValue: '#000000',
            'onUpdate:modelValue': (e) => wrapper.setProps({ modelValue: e }),
        });

        await openPicker(wrapper);

        const hexInput = wrapper.find('input[type="text"]');
        await hexInput.setValue('#123456');
        await hexInput.trigger('blur');

        const emissions = wrapper.emitted('update:modelValue');
        expect(emissions[emissions.length - 1]).toEqual(['#123456']);
    });

    it('reverts invalid hex on blur', async () => {
        const wrapper = mountColorInput({ modelValue: '#ff0000' });

        await openPicker(wrapper);

        const hexInput = wrapper.find('input[type="text"]');
        await hexInput.setValue('not-a-color');
        await hexInput.trigger('blur');

        // Should not emit for invalid hex
        const emissions = wrapper.emitted('update:modelValue');
        expect(emissions).toBeFalsy();
    });

    it('sets maxlength on hex input', async () => {
        const wrapper = mountColorInput();

        await openPicker(wrapper);

        const hexInput = wrapper.find('input[type="text"]');
        expect(hexInput.attributes('maxlength')).toBe('7');
    });

    // --- Accessibility ---

    it('gradient area has correct ARIA attributes', async () => {
        const wrapper = mountColorInput();

        await openPicker(wrapper);

        const gradient = wrapper.find('[role="application"]');
        expect(gradient.exists()).toBe(true);
        expect(gradient.attributes('aria-label')).toBe(
            'Color saturation and brightness',
        );
        expect(gradient.attributes('tabindex')).toBe('0');
    });

    it('hue slider has correct ARIA attributes', async () => {
        const wrapper = mountColorInput();

        await openPicker(wrapper);

        const hue = wrapper.find('[role="slider"]');
        expect(hue.exists()).toBe(true);
        expect(hue.attributes('aria-label')).toBe('Hue');
        expect(hue.attributes('aria-valuemin')).toBe('0');
        expect(hue.attributes('aria-valuemax')).toBe('360');
        expect(hue.attributes('tabindex')).toBe('0');
    });

    it('label is linked to trigger button via for/id', () => {
        const wrapper = mountColorInput({ label: 'Color' });

        const label = wrapper.find('label');
        const button = wrapper.find('button');
        expect(label.attributes('for')).toBe(button.attributes('id'));
    });

    // --- Keyboard navigation: gradient ---

    it('ArrowRight on gradient increases saturation', async () => {
        const wrapper = mountColorInput({
            modelValue: '#808080',
            'onUpdate:modelValue': (e) => wrapper.setProps({ modelValue: e }),
        });

        await openPicker(wrapper);

        const gradient = wrapper.find('[role="application"]');
        await gradient.trigger('keydown', { key: 'ArrowRight' });

        expect(wrapper.emitted('update:modelValue')).toBeTruthy();
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted[0][0]).not.toBe('#808080');
    });

    it('ArrowLeft on gradient decreases saturation', async () => {
        const wrapper = mountColorInput({
            modelValue: '#ff0000',
            'onUpdate:modelValue': (e) => wrapper.setProps({ modelValue: e }),
        });

        await openPicker(wrapper);

        const gradient = wrapper.find('[role="application"]');
        await gradient.trigger('keydown', { key: 'ArrowLeft' });

        expect(wrapper.emitted('update:modelValue')).toBeTruthy();
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted[0][0]).not.toBe('#ff0000');
    });

    it('ArrowUp on gradient increases brightness', async () => {
        const wrapper = mountColorInput({
            modelValue: '#808080',
            'onUpdate:modelValue': (e) => wrapper.setProps({ modelValue: e }),
        });

        await openPicker(wrapper);

        const gradient = wrapper.find('[role="application"]');
        await gradient.trigger('keydown', { key: 'ArrowUp' });

        expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    });

    it('ArrowDown on gradient decreases brightness', async () => {
        const wrapper = mountColorInput({
            modelValue: '#808080',
            'onUpdate:modelValue': (e) => wrapper.setProps({ modelValue: e }),
        });

        await openPicker(wrapper);

        const gradient = wrapper.find('[role="application"]');
        await gradient.trigger('keydown', { key: 'ArrowDown' });

        expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    });

    it('gradient saturation does not exceed boundaries', async () => {
        const wrapper = mountColorInput({
            modelValue: '#ff0000',
            'onUpdate:modelValue': (e) => wrapper.setProps({ modelValue: e }),
        });

        await openPicker(wrapper);

        const gradient = wrapper.find('[role="application"]');

        // Press ArrowRight many times - saturation should cap at 1
        for (let i = 0; i < 25; i++) {
            await gradient.trigger('keydown', { key: 'ArrowRight' });
        }

        // Should still produce a valid hex color
        const emitted = wrapper.emitted('update:modelValue');
        const lastColor = emitted[emitted.length - 1][0];
        expect(lastColor).toMatch(/^#[0-9a-f]{6}$/);
    });

    // --- Keyboard navigation: hue slider ---

    it('ArrowRight on hue slider increases hue', async () => {
        const wrapper = mountColorInput({
            modelValue: '#ff0000',
            'onUpdate:modelValue': (e) => wrapper.setProps({ modelValue: e }),
        });

        await openPicker(wrapper);

        const hue = wrapper.find('[role="slider"]');
        await hue.trigger('keydown', { key: 'ArrowRight' });

        expect(wrapper.emitted('update:modelValue')).toBeTruthy();
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted[0][0]).not.toBe('#ff0000');
    });

    it('ArrowLeft on hue slider decreases hue', async () => {
        const wrapper = mountColorInput({
            modelValue: '#00ff00',
            'onUpdate:modelValue': (e) => wrapper.setProps({ modelValue: e }),
        });

        await openPicker(wrapper);

        const hue = wrapper.find('[role="slider"]');
        await hue.trigger('keydown', { key: 'ArrowLeft' });

        expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    });

    it('hue slider wraps around at 360 degrees', async () => {
        const wrapper = mountColorInput({
            modelValue: '#ff0000',
            'onUpdate:modelValue': (e) => wrapper.setProps({ modelValue: e }),
        });

        await openPicker(wrapper);

        const hue = wrapper.find('[role="slider"]');

        // Press ArrowRight 72 times (72 * 5 = 360 degrees) to wrap around
        for (let i = 0; i < 72; i++) {
            await hue.trigger('keydown', { key: 'ArrowRight' });
        }

        // Should produce a valid hex color after wrapping
        const emitted = wrapper.emitted('update:modelValue');
        const lastColor = emitted[emitted.length - 1][0];
        expect(lastColor).toMatch(/^#[0-9a-f]{6}$/);
    });

    it('hue slider updates aria-valuenow', async () => {
        const wrapper = mountColorInput({
            modelValue: '#ff0000',
            'onUpdate:modelValue': (e) => wrapper.setProps({ modelValue: e }),
        });

        await openPicker(wrapper);

        const hue = wrapper.find('[role="slider"]');
        const initialValue = hue.attributes('aria-valuenow');

        await hue.trigger('keydown', { key: 'ArrowRight' });
        await nextTick();

        const newValue = hue.attributes('aria-valuenow');
        expect(Number(newValue)).toBeGreaterThan(Number(initialValue));
    });

    it('non-arrow keys on gradient do not emit', async () => {
        const wrapper = mountColorInput({ modelValue: '#ff0000' });

        await openPicker(wrapper);

        const gradient = wrapper.find('[role="application"]');
        await gradient.trigger('keydown', { key: 'a' });

        expect(wrapper.emitted('update:modelValue')).toBeFalsy();
    });

    it('non-arrow keys on hue slider do not emit', async () => {
        const wrapper = mountColorInput({ modelValue: '#ff0000' });

        await openPicker(wrapper);

        const hue = wrapper.find('[role="slider"]');
        await hue.trigger('keydown', { key: 'Tab' });

        expect(wrapper.emitted('update:modelValue')).toBeFalsy();
    });
});
