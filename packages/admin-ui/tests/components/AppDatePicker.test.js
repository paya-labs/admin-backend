import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import AppDatePicker from '../../src/components/AppDatePicker.vue';

const findDialog = () => document.querySelector('[role="dialog"]');
const timeButtons = () => [
    ...document.querySelectorAll('[role="dialog"] li button'),
];

let wrapper;
const mountPicker = (props = {}) =>
    (wrapper = mount(AppDatePicker, {
        props,
        attachTo: document.body,
        global: { stubs: { transition: true } },
    }));

const open = async (wrapper) => {
    await wrapper.find('button').trigger('click');
    await nextTick();
};

describe('AppDatePicker', () => {
    beforeEach(() => {
        vi.useFakeTimers({ now: new Date(2026, 8, 23, 12) });
    });

    afterEach(() => {
        wrapper.unmount();
        vi.useRealTimers();
        document.body.innerHTML = '';
    });

    it('renders the placeholder when empty and the formatted date when set', async () => {
        const wrapper = mountPicker({ label: 'Due', placeholder: 'Not set' });

        expect(wrapper.find('label').text()).toBe('Due');
        expect(wrapper.find('button').text()).toBe('Not set');

        await wrapper.setProps({ modelValue: '2026-09-23' });
        expect(wrapper.find('button').text()).toBe('Wed, 23 Sep 2026');
    });

    it('opens a dialog popover and emits the picked ISO date', async () => {
        const wrapper = mountPicker({ modelValue: '2026-09-23' });
        const trigger = wrapper.find('button');

        expect(trigger.attributes('aria-haspopup')).toBe('dialog');
        expect(trigger.attributes('aria-expanded')).toBe('false');
        expect(findDialog()).toBeNull();

        await open(wrapper);
        expect(trigger.attributes('aria-expanded')).toBe('true');
        expect(findDialog().style.position).toBe('fixed');

        findDialog().querySelector('button[data-iso="2026-10-01"]').click();
        await nextTick();

        expect(wrapper.emitted('update:modelValue')[0]).toEqual(['2026-10-01']);
        expect(trigger.attributes('aria-expanded')).toBe('false');
    });

    it('passes min/max through to the panel', async () => {
        const wrapper = mountPicker({
            modelValue: '2026-09-15',
            max: '2026-09-20',
        });

        await open(wrapper);
        expect(
            findDialog().querySelector('button[data-iso="2026-09-21"]')
                .disabled,
        ).toBe(true);
    });

    it('closes on Escape and does not open when disabled', async () => {
        const wrapper = mountPicker({ modelValue: '2026-09-15' });

        await open(wrapper);
        await wrapper.find('button').trigger('keydown', { key: 'Escape' });
        await nextTick();
        expect(wrapper.find('button').attributes('aria-expanded')).toBe(
            'false',
        );

        await wrapper.setProps({ disabled: true });
        await open(wrapper);
        expect(findDialog()).toBeNull();
    });

    it('clears the value from the clear button', async () => {
        const wrapper = mountPicker({
            modelValue: '2026-09-15',
            clearable: true,
        });

        await wrapper.find('button[aria-label="Clear"]').trigger('click');
        expect(wrapper.emitted('update:modelValue')[0]).toEqual(['']);
    });

    it('lists times at the given step in time mode', async () => {
        const wrapper = mountPicker({ mode: 'time', modelValue: '09:30' });

        expect(wrapper.find('button').text()).toBe('09:30');
        await open(wrapper);

        const buttons = timeButtons();
        expect(buttons.length).toBe(96);
        expect(buttons[0].textContent.trim()).toBe('00:00');
        expect(buttons[95].textContent.trim()).toBe('23:45');
        expect(buttons[38].getAttribute('aria-pressed')).toBe('true');

        await wrapper.setProps({ step: 30 });
        expect(timeButtons().length).toBe(48);
    });

    it('starts after `from` and labels each entry with its duration', async () => {
        const wrapper = mountPicker({ mode: 'time', from: '09:30' });

        await open(wrapper);
        const labels = timeButtons().map((b) =>
            b.textContent.replace(/\s+/g, ' ').trim(),
        );

        expect(labels[0]).toBe('09:45 15m');
        expect(labels[1]).toBe('10:00 30m');
        expect(labels[3]).toBe('10:30 1h');
        expect(labels[6]).toBe('11:15 1h 45m');
        expect(labels[labels.length - 1]).toBe('23:45 14h 15m');
    });

    it('applies typed times on Enter', async () => {
        const wrapper = mountPicker({ mode: 'time' });

        for (const [typed, expected] of [
            ['14', '14:00'],
            ['9.30', '09:30'],
            ['930', '09:30'],
            ['9am', '09:00'],
            ['9pm', '21:00'],
        ]) {
            await open(wrapper);
            const input = findDialog().querySelector('input');
            input.value = typed;
            input.dispatchEvent(
                new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }),
            );
            await nextTick();
            expect(wrapper.emitted('update:modelValue').at(-1)).toEqual([
                expected,
            ]);
            expect(findDialog()).toBeNull();
        }
    });

    it('ignores unparsable typed times', async () => {
        const wrapper = mountPicker({ mode: 'time' });

        await open(wrapper);
        const input = findDialog().querySelector('input');
        input.value = '25:99';
        input.dispatchEvent(
            new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }),
        );
        await nextTick();

        expect(wrapper.emitted('update:modelValue')).toBeFalsy();
        expect(findDialog()).not.toBeNull();
    });

    it('emits the current time snapped to the step from Now', async () => {
        const wrapper = mountPicker({ mode: 'time', step: 30 });

        await open(wrapper);
        [...findDialog().querySelectorAll('button')]
            .find((b) => b.textContent.trim() === 'Now')
            .click();
        await nextTick();

        expect(wrapper.emitted('update:modelValue')[0]).toEqual(['12:00']);
    });

    it('closes when focus leaves the popover', async () => {
        const wrapper = mountPicker({ modelValue: '2026-09-15' });
        const outside = document.createElement('button');
        document.body.appendChild(outside);

        await open(wrapper);
        findDialog().dispatchEvent(
            new FocusEvent('focusout', {
                relatedTarget: outside,
                bubbles: true,
            }),
        );
        await nextTick();

        expect(wrapper.find('button').attributes('aria-expanded')).toBe(
            'false',
        );
    });

    it('clamps the popover to the viewport when it fits neither below nor above', async () => {
        const wrapper = mountPicker({ modelValue: '2026-09-15' });
        window.innerHeight = 500;
        wrapper.find('button').element.getBoundingClientRect = () => ({
            top: 200,
            bottom: 240,
            left: 20,
            right: 120,
            width: 100,
            height: 40,
        });

        await open(wrapper);

        // jsdom reports no size, so the composable falls back to 360px height
        expect(findDialog().style.top).toBe('132px');
        expect(findDialog().style.left).toBe('20px');
    });

    it('keeps the popover open when a drill-up click detaches its own button', async () => {
        const wrapper = mountPicker({ modelValue: '2026-09-15' });
        await open(wrapper);

        // Real clicks re-render between the button handler and the document
        // listener; emulate that by detaching the target in the capture phase.
        document.addEventListener(
            'click',
            (e) => {
                const { target } = e;
                const parent = target.parentNode;
                const next = target.nextSibling;
                target.remove();
                // put it back before Vue's flush so the patch still works
                queueMicrotask(() => parent.insertBefore(target, next));
            },
            { capture: true, once: true },
        );
        findDialog().querySelector('button[aria-label="Choose month"]').click();
        await nextTick();

        expect(wrapper.find('button').attributes('aria-expanded')).toBe('true');
        expect(findDialog()).not.toBeNull();
    });

    it('closes and returns focus to the trigger when tabbing past the last control', async () => {
        const wrapper = mountPicker({ modelValue: '2026-09-15' });
        await open(wrapper);

        const buttons = [...findDialog().querySelectorAll('button')];
        const closeButton = buttons.find(
            (b) => b.textContent.trim() === 'Close',
        );
        closeButton.focus();
        // Vue skips listeners attached "after" an event; move the frozen clock
        vi.advanceTimersByTime(1);
        closeButton.dispatchEvent(
            new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }),
        );
        await nextTick();

        expect(wrapper.find('button').attributes('aria-expanded')).toBe(
            'false',
        );
        expect(document.activeElement).toBe(wrapper.find('button').element);
    });

    it.each(['date', 'time'])(
        'positions the %s popover before focus moves into it',
        async (mode) => {
            const wrapper = mountPicker({ mode });
            const positionWhenFocused = [];
            const spy = vi
                .spyOn(HTMLElement.prototype, 'focus')
                .mockImplementation(function () {
                    const dialog = findDialog();
                    if (dialog?.contains(this)) {
                        positionWhenFocused.push(dialog.style.position);
                    }
                });

            await open(wrapper);
            await nextTick();
            spy.mockRestore();

            // focus() on an unpositioned popover scrolls the page to it
            expect(positionWhenFocused).toEqual(['fixed']);
        },
    );

    describe('bottom sheet below the md breakpoint', () => {
        const desktopWidth = window.innerWidth;
        beforeEach(() => {
            window.innerWidth = 500;
        });
        afterEach(() => {
            window.innerWidth = desktopWidth;
        });

        it('opens the time list in a sheet without the typed input', async () => {
            const wrapper = mountPicker({ mode: 'time', modelValue: '09:30' });
            await open(wrapper);

            const dialog = findDialog();
            expect(dialog.getAttribute('aria-label')).toBe('Time');
            expect(dialog.getAttribute('aria-modal')).toBe('true');
            expect(dialog.querySelector('input')).toBeNull();
            expect(dialog.style.position).toBe('');
            expect(timeButtons().length).toBe(96);
            expect(document.body.style.overflow).toBe('hidden');
            expect(wrapper.find('button').attributes('aria-expanded')).toBe(
                'true',
            );
        });

        it('titles the sheet from the trigger aria-label and renders the panel fluid', async () => {
            const wrapper = mountPicker({
                modelValue: '2026-09-15',
                'aria-label': 'Start date',
            });
            await open(wrapper);

            const dialog = findDialog();
            expect(dialog.getAttribute('aria-label')).toBe('Start date');
            expect(
                dialog.querySelector('[data-iso]').closest('.w-\\[300px\\]'),
            ).toBeNull();
            expect(
                dialog.querySelector('[data-iso="2026-09-15"]').className,
            ).not.toContain('h-[34px]');
        });

        it('picks, closes on Done and Escape, and returns focus to the trigger', async () => {
            const wrapper = mountPicker({ modelValue: '2026-09-15' });
            await open(wrapper);
            findDialog().querySelector('[data-iso="2026-09-20"]').click();
            await nextTick();

            expect(wrapper.emitted('update:modelValue')[0]).toEqual([
                '2026-09-20',
            ]);
            expect(findDialog()).toBeNull();
            expect(document.activeElement).toBe(wrapper.find('button').element);
            expect(document.body.style.overflow).toBe('');

            await open(wrapper);
            [...findDialog().querySelectorAll('button')]
                .find((b) => b.textContent.trim() === 'Done')
                .click();
            await nextTick();
            expect(findDialog()).toBeNull();

            await open(wrapper);
            findDialog().dispatchEvent(
                new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
            );
            await nextTick();
            expect(findDialog()).toBeNull();
        });

        it('keeps the popover with the typed input at desktop widths', async () => {
            window.innerWidth = 1024;
            const wrapper = mountPicker({ mode: 'time' });
            await open(wrapper);

            expect(findDialog().querySelector('input')).not.toBeNull();
            expect(findDialog().style.position).toBe('fixed');
        });
    });
});
