import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import AppCalendar from '../../src/components/AppCalendar.vue';

const mountCalendar = (props = {}) =>
    mount(AppCalendar, {
        props,
        global: {
            stubs: { FullCalendar: true, Teleport: true, Transition: true },
        },
    });

const slotHeightVar = (wrapper) =>
    wrapper.find('.app-calendar-wrapper').attributes('style');

describe('AppCalendar slot height', () => {
    it('uses slotHeight as the floor for short slot durations', () => {
        const wrapper = mountCalendar({
            slotDuration: '00:10:00',
            slotHeight: '2.5rem',
        });

        expect(slotHeightVar(wrapper)).toContain('max(2.5rem, 26px)');
    });

    it('scales slot height proportionally for long slot durations', () => {
        const wrapper = mountCalendar({
            slotDuration: '01:00:00',
            slotHeight: '2.5rem',
        });

        expect(slotHeightVar(wrapper)).toContain('max(2.5rem, 156px)');
    });

    it('falls back to the 2rem floor when slotHeight is not provided', () => {
        const wrapper = mountCalendar({ slotDuration: '00:30:00' });

        expect(slotHeightVar(wrapper)).toContain('max(2rem, 78px)');
    });
});
