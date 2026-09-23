import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import AppDatePanel from '../../src/components/AppDatePanel.vue';

const dayButtons = (wrapper) => wrapper.findAll('button[data-iso]');
const dayButton = (wrapper, iso) => wrapper.find(`button[data-iso="${iso}"]`);
const heading = (wrapper) =>
    wrapper.find(
        'button[aria-label="Choose month"], button[aria-label="Choose year"]',
    );

describe('AppDatePanel', () => {
    beforeEach(() => {
        vi.useFakeTimers({ now: new Date(2026, 8, 23, 12) });
    });

    afterEach(() => {
        vi.useRealTimers();
        document.body.innerHTML = '';
    });

    it('renders 6 weeks starting on Monday for the selected month', () => {
        const wrapper = mount(AppDatePanel, {
            props: { modelValue: '2026-09-23' },
        });

        const days = dayButtons(wrapper);
        expect(days.length).toBe(42);
        expect(days[0].attributes('data-iso')).toBe('2026-08-31');
        expect(days[0].attributes('aria-label')).toBe('Mon, 31 Aug 2026');
        expect(heading(wrapper).text()).toBe('September 2026');
    });

    it('emits the picked day as a plain ISO date without UTC drift', async () => {
        const wrapper = mount(AppDatePanel, {
            props: { modelValue: '2026-09-23' },
        });

        await dayButton(wrapper, '2026-10-01').trigger('click');

        expect(wrapper.emitted('update:modelValue')[0]).toEqual(['2026-10-01']);
    });

    it('marks today and the selected day', () => {
        const wrapper = mount(AppDatePanel, {
            props: { modelValue: '2026-09-10' },
        });

        expect(
            dayButton(wrapper, '2026-09-23').attributes('aria-current'),
        ).toBe('date');
        expect(
            dayButton(wrapper, '2026-09-10').attributes('aria-pressed'),
        ).toBe('true');
    });

    it('disables days outside min/max', () => {
        const wrapper = mount(AppDatePanel, {
            props: {
                modelValue: '2026-09-15',
                min: '2026-09-10',
                max: '2026-09-20',
            },
        });

        expect(dayButton(wrapper, '2026-09-09').element.disabled).toBe(true);
        expect(dayButton(wrapper, '2026-09-10').element.disabled).toBe(false);
        expect(dayButton(wrapper, '2026-09-20').element.disabled).toBe(false);
        expect(dayButton(wrapper, '2026-09-21').element.disabled).toBe(true);
    });

    it('shades the range with an exclusive end', () => {
        const wrapper = mount(AppDatePanel, {
            props: {
                modelValue: '2026-09-23',
                rangeStart: '2026-09-21',
                rangeEnd: '2026-09-28',
            },
        });

        expect(dayButton(wrapper, '2026-09-21').classes()).toContain(
            'bg-primary-soft',
        );
        expect(dayButton(wrapper, '2026-09-27').classes()).toContain(
            'bg-primary-soft',
        );
        expect(dayButton(wrapper, '2026-09-28').classes()).not.toContain(
            'bg-primary-soft',
        );
    });

    it('drills up to months and years and back down', async () => {
        const wrapper = mount(AppDatePanel, {
            props: { modelValue: '2026-09-23' },
        });

        await heading(wrapper).trigger('click');
        expect(wrapper.find('button[aria-label="March"]').exists()).toBe(true);
        expect(heading(wrapper).text()).toBe('2026');

        await heading(wrapper).trigger('click');
        const years = wrapper
            .findAll('button')
            .filter((b) => /^\d{4}$/.test(b.text()));
        expect(years.map((b) => b.text())).toEqual(
            Array.from({ length: 12 }, (_, i) => String(2016 + i)),
        );

        await wrapper.find('button[aria-label="Next years"]').trigger('click');
        await wrapper
            .findAll('button')
            .find((b) => b.text() === '2028')
            .trigger('click');
        expect(heading(wrapper).text()).toBe('2028');

        await wrapper.find('button[aria-label="March"]').trigger('click');
        expect(heading(wrapper).text()).toBe('March 2028');
        expect(dayButton(wrapper, '2028-03-01').exists()).toBe(true);
    });

    it('navigates months with the header arrows', async () => {
        const wrapper = mount(AppDatePanel, {
            props: { modelValue: '2026-12-05' },
        });

        await wrapper.find('button[aria-label="Next month"]').trigger('click');
        expect(heading(wrapper).text()).toBe('January 2027');

        await wrapper
            .find('button[aria-label="Previous month"]')
            .trigger('click');
        expect(heading(wrapper).text()).toBe('December 2026');
    });

    it('moves the focused day with arrow keys across month edges', async () => {
        const wrapper = mount(AppDatePanel, {
            props: { modelValue: '2026-09-30' },
            attachTo: document.body,
        });

        expect(dayButton(wrapper, '2026-09-30').attributes('tabindex')).toBe(
            '0',
        );

        await dayButton(wrapper, '2026-09-30').trigger('keydown', {
            key: 'ArrowRight',
        });
        await nextTick();

        expect(heading(wrapper).text()).toBe('October 2026');
        expect(dayButton(wrapper, '2026-10-01').attributes('tabindex')).toBe(
            '0',
        );
        expect(document.activeElement).toBe(
            dayButton(wrapper, '2026-10-01').element,
        );
    });

    it('selects today from the footer and closes on Close and Escape', async () => {
        const wrapper = mount(AppDatePanel, {
            props: { modelValue: '2020-01-01' },
        });

        const links = wrapper
            .findAll('button')
            .filter((b) => ['Today', 'Close'].includes(b.text()));
        await links[0].trigger('click');
        expect(wrapper.emitted('update:modelValue')[0]).toEqual(['2026-09-23']);

        await links[1].trigger('click');
        await wrapper.trigger('keydown', { key: 'Escape' });
        expect(wrapper.emitted('close').length).toBe(2);
    });
});
