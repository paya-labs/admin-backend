import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
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
});
