import FullCalendar from '@fullcalendar/vue3';
import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
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

const calendarOptions = (wrapper) =>
    wrapper.findComponent(FullCalendar).props('options');

describe('AppCalendar scroll time', () => {
    afterEach(() => {
        vi.useRealTimers();
    });

    const mountAt = (systemTime, props = {}) => {
        vi.useFakeTimers();
        vi.setSystemTime(systemTime);
        return mountCalendar(props);
    };

    it('opens one hour before now, rounded down to the hour', () => {
        const wrapper = mountAt(new Date(2026, 10, 26, 14, 37));

        expect(calendarOptions(wrapper).scrollTime).toBe('13:00:00');
    });

    it('opens at midnight before 01:00', () => {
        const wrapper = mountAt(new Date(2026, 10, 26, 0, 20));

        expect(calendarOptions(wrapper).scrollTime).toBe('00:00:00');
    });

    it('works out the hour in the calendar timezone', () => {
        const wrapper = mountAt(new Date('2026-11-26T12:37:00Z'), {
            timeZone: 'Asia/Nicosia',
        });

        expect(calendarOptions(wrapper).scrollTime).toBe('13:00:00');
    });

    it('passes a given scrollTime through', () => {
        const wrapper = mountAt(new Date(2026, 10, 26, 14, 37), {
            scrollTime: '09:00:00',
        });

        expect(calendarOptions(wrapper).scrollTime).toBe('09:00:00');
    });

    it('keeps the scroll on date changes unless scrollTimeReset is passed', () => {
        expect(calendarOptions(mountCalendar()).scrollTimeReset).toBe(false);
        expect(
            calendarOptions(mountCalendar({ scrollTimeReset: true }))
                .scrollTimeReset,
        ).toBe(true);
    });
});
