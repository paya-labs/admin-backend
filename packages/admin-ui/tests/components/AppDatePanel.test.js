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

    it('disables the Today link when today is outside min/max', () => {
        const wrapper = mount(AppDatePanel, {
            props: { modelValue: '2026-09-05', max: '2026-09-10' },
        });

        const today = wrapper
            .findAll('button')
            .find((b) => b.text() === 'Today');
        expect(today.element.disabled).toBe(true);
    });

    it('keeps the roving focus off disabled days', async () => {
        const wrapper = mount(AppDatePanel, {
            props: { modelValue: '2026-09-01', min: '2026-09-01' },
            attachTo: document.body,
        });

        await dayButton(wrapper, '2026-09-01').trigger('keydown', {
            key: 'ArrowLeft',
        });
        await nextTick();

        expect(heading(wrapper).text()).toBe('September 2026');
        expect(dayButton(wrapper, '2026-09-01').attributes('tabindex')).toBe(
            '0',
        );
    });

    it('moves focus to the new heading control on every view change', async () => {
        const wrapper = mount(AppDatePanel, {
            props: { modelValue: '2026-09-23' },
            attachTo: document.body,
        });
        const active = () => document.activeElement;

        await heading(wrapper).trigger('click');
        await nextTick();
        expect(active().getAttribute('aria-label')).toBe('Choose year');

        await heading(wrapper).trigger('click');
        await nextTick();
        expect(active().getAttribute('aria-label')).toBe('Previous years');

        await wrapper
            .findAll('button')
            .find((b) => b.text() === '2027')
            .trigger('click');
        await nextTick();
        expect(active().getAttribute('aria-label')).toBe('Choose year');

        await wrapper.find('button[aria-label="March"]').trigger('click');
        await nextTick();
        expect(active().dataset.iso).toBe('2027-03-01');
    });

    describe('roving tab stop never lands on a disabled day', () => {
        const tabStop = (wrapper) => {
            const stops = wrapper.findAll('button[data-iso][tabindex="0"]');
            expect(stops.length).toBeLessThanOrEqual(1);
            return stops[0];
        };

        it('min: previous month page starts at the first enabled day', async () => {
            const wrapper = mount(AppDatePanel, {
                props: { modelValue: '2026-09-15', min: '2026-08-20' },
            });
            await wrapper
                .find('button[aria-label="Previous month"]')
                .trigger('click');

            expect(tabStop(wrapper).attributes('data-iso')).toBe('2026-08-20');
        });

        it('max: next month page starts at the first enabled day (out-of-month lead-in)', async () => {
            const wrapper = mount(AppDatePanel, {
                props: { modelValue: '2026-09-15', max: '2026-09-29' },
            });
            await wrapper
                .find('button[aria-label="Next month"]')
                .trigger('click');

            // October 2026 has no enabled in-month day; the lead-in 28 Sep is enabled
            expect(tabStop(wrapper).attributes('data-iso')).toBe('2026-09-28');
        });

        it('pickMonth: focuses the first enabled day of the picked month', async () => {
            const wrapper = mount(AppDatePanel, {
                props: { modelValue: '2026-09-15', min: '2026-11-10' },
                attachTo: document.body,
            });
            await heading(wrapper).trigger('click');
            await wrapper
                .find('button[aria-label="November"]')
                .trigger('click');
            await nextTick();

            expect(tabStop(wrapper).attributes('data-iso')).toBe('2026-11-10');
            expect(document.activeElement.dataset.iso).toBe('2026-11-10');
        });

        it('pickYear then pickMonth: a fully disabled page has no tab stop and focuses the heading', async () => {
            const wrapper = mount(AppDatePanel, {
                props: { modelValue: '2026-09-15', max: '2026-09-20' },
                attachTo: document.body,
            });
            await heading(wrapper).trigger('click');
            await heading(wrapper).trigger('click');
            await wrapper
                .findAll('button')
                .find((b) => b.text() === '2027')
                .trigger('click');
            await wrapper.find('button[aria-label="March"]').trigger('click');
            await nextTick();

            expect(tabStop(wrapper)).toBeUndefined();
            expect(document.activeElement.getAttribute('aria-label')).toBe(
                'Choose month',
            );
            expect(
                wrapper.find('button[data-iso="2027-03-01"]').element.disabled,
            ).toBe(true);
        });

        it('exposed focus(): no value and min after the 1st lands on the first enabled day', async () => {
            vi.setSystemTime(new Date(2026, 8, 23, 12));
            const wrapper = mount(AppDatePanel, {
                props: { min: '2026-09-25' },
                attachTo: document.body,
            });
            wrapper.vm.focus();
            await nextTick();

            expect(tabStop(wrapper).attributes('data-iso')).toBe('2026-09-25');
            expect(document.activeElement.dataset.iso).toBe('2026-09-25');
        });
    });

    it('fluid drops the fixed width and chrome', () => {
        const fixed = mount(AppDatePanel, {
            props: { modelValue: '2026-09-23' },
        });
        const fluid = mount(AppDatePanel, {
            props: { modelValue: '2026-09-23', fluid: true },
        });

        expect(fixed.classes()).toContain('w-[300px]');
        expect(fluid.classes()).not.toContain('w-[300px]');
        expect(fluid.classes()).not.toContain('shadow-lg');
        expect(fluid.find('button[data-iso="2026-09-23"]').classes()).toContain(
            'h-11',
        );
        expect(fluid.findAll('button').some((b) => b.text() === 'Close')).toBe(
            false,
        );
    });
});
