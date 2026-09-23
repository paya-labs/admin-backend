import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import { nextTick } from 'vue';
import AppCalendarNavigation from '../../src/components/AppCalendarNavigation.vue';

const findDialog = () => document.querySelector('[role="dialog"]');

let wrapper;
const mountNav = (props) =>
    (wrapper = mount(AppCalendarNavigation, {
        props,
        attachTo: document.body,
        global: { stubs: { transition: true } },
    }));

describe('AppCalendarNavigation', () => {
    afterEach(() => {
        wrapper.unmount();
        document.body.innerHTML = '';
    });

    it('renders a plain heading and emits prev/next/today without a date', async () => {
        mountNav({ title: 'September 2026' });

        expect(wrapper.find('h1').text()).toBe('September 2026');
        expect(wrapper.find('[aria-haspopup="dialog"]').exists()).toBe(false);

        await wrapper.find('button[aria-label="Previous"]').trigger('click');
        await wrapper.find('button[aria-label="Next"]').trigger('click');
        await wrapper
            .findAll('button')
            .find((b) => b.text() === 'Today')
            .trigger('click');

        expect(wrapper.emitted('prev')).toHaveLength(1);
        expect(wrapper.emitted('next')).toHaveLength(1);
        expect(wrapper.emitted('today')).toHaveLength(1);
    });

    it('turns the heading into a jump control that emits goto', async () => {
        mountNav({
            title: 'Sep 21 – 27, 2026',
            date: '2026-09-23',
            rangeStart: '2026-09-21',
            rangeEnd: '2026-09-28',
        });

        const heading = wrapper.find('[aria-haspopup="dialog"]');
        expect(wrapper.find('h1').exists()).toBe(false);
        expect(heading.text()).toBe('Sep 21 – 27, 2026');
        expect(heading.attributes('aria-expanded')).toBe('false');

        await heading.trigger('click');
        await nextTick();
        expect(heading.attributes('aria-expanded')).toBe('true');
        expect(findDialog().getAttribute('aria-label')).toBe('Go to date');
        expect(
            findDialog().querySelector('[data-iso="2026-09-24"]').className,
        ).toContain('bg-primary-soft');

        findDialog().querySelector('[data-iso="2026-10-02"]').click();
        await nextTick();

        expect(wrapper.emitted('goto')[0]).toEqual(['2026-10-02']);
        expect(heading.attributes('aria-expanded')).toBe('false');
        expect(findDialog()).toBeNull();
    });
});
