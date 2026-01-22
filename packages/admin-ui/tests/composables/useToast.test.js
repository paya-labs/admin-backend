import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useToast } from '../../src/composables/useToast.js';

describe('useToast', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        // Clear toasts between tests
        const { dismissAll } = useToast();
        dismissAll();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    describe('show', () => {
        it('adds toast with string message', () => {
            const { show, toasts } = useToast();

            show('Hello world');

            expect(toasts.value).toHaveLength(1);
            expect(toasts.value[0].message).toBe('Hello world');
            expect(toasts.value[0].variant).toBe('info');
        });

        it('adds toast with options object', () => {
            const { show, toasts } = useToast();

            show({
                message: 'Custom toast',
                variant: 'success',
                title: 'Title',
                duration: 5000,
            });

            expect(toasts.value).toHaveLength(1);
            expect(toasts.value[0].message).toBe('Custom toast');
            expect(toasts.value[0].variant).toBe('success');
            expect(toasts.value[0].title).toBe('Title');
            expect(toasts.value[0].duration).toBe(5000);
        });

        it('returns unique id for each toast', () => {
            const { show } = useToast();

            const id1 = show('First');
            const id2 = show('Second');
            const id3 = show('Third');

            expect(id1).not.toBe(id2);
            expect(id2).not.toBe(id3);
        });

        it('auto-dismisses after duration', () => {
            const { show, toasts } = useToast();

            show({ message: 'Auto dismiss', duration: 3000 });

            expect(toasts.value).toHaveLength(1);

            vi.advanceTimersByTime(3000);

            expect(toasts.value).toHaveLength(0);
        });

        it('does not auto-dismiss when duration is 0', () => {
            const { show, toasts } = useToast();

            show({ message: 'Persistent', duration: 0 });

            expect(toasts.value).toHaveLength(1);

            vi.advanceTimersByTime(10000);

            expect(toasts.value).toHaveLength(1);
        });

        it('uses default duration of 3000ms', () => {
            const { show, toasts } = useToast();

            show('Default duration');

            expect(toasts.value).toHaveLength(1);

            vi.advanceTimersByTime(2999);
            expect(toasts.value).toHaveLength(1);

            vi.advanceTimersByTime(1);
            expect(toasts.value).toHaveLength(0);
        });
    });

    describe('variant shortcuts', () => {
        it('success creates success toast', () => {
            const { success, toasts } = useToast();

            success('Operation completed');

            expect(toasts.value[0].variant).toBe('success');
            expect(toasts.value[0].message).toBe('Operation completed');
        });

        it('error creates error toast', () => {
            const { error, toasts } = useToast();

            error('Something went wrong');

            expect(toasts.value[0].variant).toBe('error');
            expect(toasts.value[0].message).toBe('Something went wrong');
        });

        it('warning creates warning toast', () => {
            const { warning, toasts } = useToast();

            warning('Please check input');

            expect(toasts.value[0].variant).toBe('warning');
            expect(toasts.value[0].message).toBe('Please check input');
        });

        it('info creates info toast', () => {
            const { info, toasts } = useToast();

            info('FYI');

            expect(toasts.value[0].variant).toBe('info');
            expect(toasts.value[0].message).toBe('FYI');
        });

        it('variant shortcuts accept optional title', () => {
            const { success, toasts } = useToast();

            success('Saved successfully', 'Success');

            expect(toasts.value[0].title).toBe('Success');
            expect(toasts.value[0].message).toBe('Saved successfully');
        });
    });

    describe('dismiss', () => {
        it('removes specific toast by id', () => {
            const { show, dismiss, toasts } = useToast();

            const id1 = show('First');
            show('Second');

            expect(toasts.value).toHaveLength(2);

            dismiss(id1);

            expect(toasts.value).toHaveLength(1);
            expect(toasts.value[0].message).toBe('Second');
        });

        it('clears auto-dismiss timeout when manually dismissed', () => {
            const { show, dismiss, toasts } = useToast();

            const id = show({ message: 'Test', duration: 5000 });

            dismiss(id);

            expect(toasts.value).toHaveLength(0);

            // Ensure no error when timeout fires
            vi.advanceTimersByTime(5000);
            expect(toasts.value).toHaveLength(0);
        });

        it('does nothing for non-existent id', () => {
            const { show, dismiss, toasts } = useToast();

            show('Test');

            expect(toasts.value).toHaveLength(1);

            dismiss(99999);

            expect(toasts.value).toHaveLength(1);
        });
    });

    describe('dismissAll', () => {
        it('removes all toasts', () => {
            const { show, dismissAll, toasts } = useToast();

            show('First');
            show('Second');
            show('Third');

            expect(toasts.value).toHaveLength(3);

            dismissAll();

            expect(toasts.value).toHaveLength(0);
        });

        it('clears all auto-dismiss timeouts', () => {
            const { show, dismissAll, toasts } = useToast();

            show({ message: 'First', duration: 1000 });
            show({ message: 'Second', duration: 2000 });

            dismissAll();

            expect(toasts.value).toHaveLength(0);

            // Ensure no errors when timeouts would fire
            vi.advanceTimersByTime(5000);
            expect(toasts.value).toHaveLength(0);
        });
    });

    describe('shared state', () => {
        it('shares state between multiple useToast calls', () => {
            const toast1 = useToast();
            const toast2 = useToast();

            toast1.show('From first');

            expect(toast2.toasts.value).toHaveLength(1);
            expect(toast2.toasts.value[0].message).toBe('From first');
        });
    });
});
