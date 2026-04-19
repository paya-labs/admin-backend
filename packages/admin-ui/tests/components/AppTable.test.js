import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import AppTable from '../../src/components/AppTable.vue';

const defaultColumns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
];

const defaultRows = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
];

describe('AppTable', () => {
    it('renders table headers from columns', () => {
        const wrapper = mount(AppTable, {
            props: { columns: defaultColumns, rows: defaultRows },
        });

        const headers = wrapper.findAll('th');
        expect(headers[0].text()).toBe('Name');
        expect(headers[1].text()).toBe('Email');
    });

    it('renders data rows', () => {
        const wrapper = mount(AppTable, {
            props: { columns: defaultColumns, rows: defaultRows },
        });

        const rows = wrapper.findAll('tbody tr');
        expect(rows).toHaveLength(2);
        expect(rows[0].text()).toContain('John Doe');
        expect(rows[0].text()).toContain('john@example.com');
    });

    it('shows empty message when no rows', () => {
        const wrapper = mount(AppTable, {
            props: { columns: defaultColumns, rows: [] },
        });

        expect(wrapper.text()).toContain('No data available');
    });

    it('shows custom empty message', () => {
        const wrapper = mount(AppTable, {
            props: {
                columns: defaultColumns,
                rows: [],
                emptyMessage: 'Nothing here',
            },
        });

        expect(wrapper.text()).toContain('Nothing here');
    });

    it('emits row-click when row is clicked', async () => {
        const wrapper = mount(AppTable, {
            props: { columns: defaultColumns, rows: defaultRows },
        });

        await wrapper.findAll('tbody tr')[0].trigger('click');
        expect(wrapper.emitted('row-click')).toBeTruthy();
        expect(wrapper.emitted('row-click')[0]).toEqual([defaultRows[0]]);
    });

    it('renders loading skeleton when loading is true', () => {
        const wrapper = mount(AppTable, {
            props: { columns: defaultColumns, loading: true },
        });

        const skeletonRows = wrapper.findAll('tbody tr');
        expect(skeletonRows).toHaveLength(5);
        expect(wrapper.findAll('.animate-pulse').length).toBeGreaterThan(0);
    });

    it('uses custom cell slot', () => {
        const wrapper = mount(AppTable, {
            props: { columns: defaultColumns, rows: defaultRows },
            slots: {
                'cell-name': ({ value }) => `Custom: ${value}`,
            },
        });

        expect(wrapper.text()).toContain('Custom: John Doe');
    });

    it('renders footer slot', () => {
        const wrapper = mount(AppTable, {
            props: { columns: defaultColumns, rows: defaultRows },
            slots: {
                footer: 'Footer content',
            },
        });

        expect(wrapper.text()).toContain('Footer content');
    });

    describe('responsive mode', () => {
        it('renders mobile layout by default', () => {
            const wrapper = mount(AppTable, {
                props: { columns: defaultColumns, rows: defaultRows },
            });

            const mobileLayout = wrapper.find('[data-testid="mobile-layout"]');
            expect(mobileLayout.exists()).toBe(true);
        });

        it('hides mobile layout when responsive is false', () => {
            const wrapper = mount(AppTable, {
                props: {
                    columns: defaultColumns,
                    rows: defaultRows,
                    responsive: false,
                },
            });

            const mobileLayout = wrapper.find('[data-testid="mobile-layout"]');
            expect(mobileLayout.exists()).toBe(false);
        });

        it('renders column labels in mobile layout', () => {
            const wrapper = mount(AppTable, {
                props: { columns: defaultColumns, rows: defaultRows },
            });

            const mobileLayout = wrapper.find('[data-testid="mobile-layout"]');
            expect(mobileLayout.text()).toContain('Name');
            expect(mobileLayout.text()).toContain('Email');
        });

        it('renders cell values in mobile layout', () => {
            const wrapper = mount(AppTable, {
                props: { columns: defaultColumns, rows: defaultRows },
            });

            const mobileLayout = wrapper.find('[data-testid="mobile-layout"]');
            expect(mobileLayout.text()).toContain('John Doe');
            expect(mobileLayout.text()).toContain('john@example.com');
        });

        it('renders all rows as stacked blocks', () => {
            const wrapper = mount(AppTable, {
                props: { columns: defaultColumns, rows: defaultRows },
            });

            const mobileRows = wrapper.findAll('[data-testid="mobile-row"]');
            expect(mobileRows).toHaveLength(2);
        });

        it('uses cell slots in mobile layout', () => {
            const wrapper = mount(AppTable, {
                props: { columns: defaultColumns, rows: defaultRows },
                slots: {
                    'cell-name': ({ value }) => `Custom: ${value}`,
                },
            });

            const mobileLayout = wrapper.find('[data-testid="mobile-layout"]');
            expect(mobileLayout.text()).toContain('Custom: John Doe');
        });

        it('emits row-click from mobile row', async () => {
            const wrapper = mount(AppTable, {
                props: { columns: defaultColumns, rows: defaultRows },
            });

            const mobileRows = wrapper.findAll('[data-testid="mobile-row"]');
            await mobileRows[0].trigger('click');

            expect(wrapper.emitted('row-click')).toBeTruthy();
            expect(wrapper.emitted('row-click')[0]).toEqual([defaultRows[0]]);
        });

        it('shows empty state in mobile layout when no rows', () => {
            const wrapper = mount(AppTable, {
                props: { columns: defaultColumns, rows: [] },
            });

            const mobileLayout = wrapper.find('[data-testid="mobile-layout"]');
            expect(mobileLayout.text()).toContain('No data available');
        });

        it('shows loading skeleton in mobile layout', () => {
            const wrapper = mount(AppTable, {
                props: { columns: defaultColumns, loading: true },
            });

            const mobileLayout = wrapper.find('[data-testid="mobile-layout"]');
            expect(mobileLayout.findAll('.animate-pulse').length).toBeGreaterThan(0);
        });

        it('renders action buttons in mobile layout', async () => {
            const handler = vi.fn();
            const wrapper = mount(AppTable, {
                props: {
                    columns: defaultColumns,
                    rows: defaultRows,
                    actions: [{ label: 'Edit', handler }],
                },
            });

            const mobileLayout = wrapper.find('[data-testid="mobile-layout"]');
            const actionBtn = mobileLayout.findAll('button').find(
                (b) => b.text() === 'Edit',
            );
            expect(actionBtn).toBeTruthy();

            await actionBtn.trigger('click');
            expect(handler).toHaveBeenCalledWith(defaultRows[0]);
        });

        it('action click does not emit row-click', async () => {
            const handler = vi.fn();
            const wrapper = mount(AppTable, {
                props: {
                    columns: defaultColumns,
                    rows: defaultRows,
                    actions: [{ label: 'Edit', handler }],
                },
            });

            const mobileLayout = wrapper.find('[data-testid="mobile-layout"]');
            const actionBtn = mobileLayout.findAll('button').find(
                (b) => b.text() === 'Edit',
            );
            await actionBtn.trigger('click');

            expect(wrapper.emitted('row-click')).toBeFalsy();
        });

        it('uses mobile-row override slot when provided', () => {
            const wrapper = mount(AppTable, {
                props: { columns: defaultColumns, rows: defaultRows },
                slots: {
                    'mobile-row': ({ row }) => `Override: ${row.name}`,
                },
            });

            const mobileLayout = wrapper.find('[data-testid="mobile-layout"]');
            expect(mobileLayout.text()).toContain('Override: John Doe');
            expect(mobileLayout.text()).toContain('Override: Jane Smith');
        });

        it('applies striped class to mobile rows', () => {
            const wrapper = mount(AppTable, {
                props: {
                    columns: defaultColumns,
                    rows: defaultRows,
                    striped: true,
                },
            });

            const mobileRows = wrapper.findAll('[data-testid="mobile-row"]');
            expect(mobileRows[1].classes()).toContain('bg-surface-hover/50');
        });

        it('renders footer in responsive mode', () => {
            const wrapper = mount(AppTable, {
                props: { columns: defaultColumns, rows: defaultRows },
                slots: {
                    footer: 'Pagination here',
                },
            });

            expect(wrapper.text()).toContain('Pagination here');
        });
    });
});
