import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vite-plus/test';
import { nextTick } from 'vue';
import AppBottomSheet from '../../src/components/AppBottomSheet.vue';

let wrapper;
const sheet = () => document.body.querySelector('[role="dialog"]');

const mountSheet = (props = {}) => {
    wrapper = mount(AppBottomSheet, {
        props: { open: true, title: 'Pick a date', ...props },
        slots: {
            default: '<button id="inside">Inside</button>',
            secondary: '<button id="clear">Clear</button>',
        },
        global: { stubs: { transition: false } },
    });
};

describe('AppBottomSheet', () => {
    afterEach(() => {
        wrapper?.unmount();
        document.body.innerHTML = '';
        document.body.style.overflow = '';
    });

    it('renders nothing while closed', () => {
        mountSheet({ open: false });
        expect(sheet()).toBeNull();
    });

    it('teleports a labelled modal dialog with both slots', () => {
        mountSheet();
        expect(sheet().getAttribute('aria-modal')).toBe('true');
        expect(sheet().getAttribute('aria-label')).toBe('Pick a date');
        expect(sheet().querySelector('#inside')).not.toBeNull();
        expect(sheet().querySelector('#clear')).not.toBeNull();
    });

    it('emits close from Done, the backdrop and Escape', () => {
        mountSheet();
        const done = [...sheet().querySelectorAll('button')].find(
            (b) => b.textContent.trim() === 'Done',
        );
        done.click();
        sheet().previousElementSibling.click();
        sheet().dispatchEvent(
            new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
        );
        expect(wrapper.emitted('close')).toHaveLength(3);
    });

    it('locks body scroll while open', async () => {
        mountSheet({ open: false });
        await wrapper.setProps({ open: true });
        expect(document.body.style.overflow).toBe('hidden');
        await wrapper.setProps({ open: false });
        await nextTick();
        expect(document.body.style.overflow).toBe('');
    });
});
