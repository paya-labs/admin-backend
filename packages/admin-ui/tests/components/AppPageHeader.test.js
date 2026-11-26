import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vite-plus/test';
import AppPageHeader from '../../src/components/AppPageHeader.vue';

vi.mock('vue-router', () => ({
    RouterLink: { props: ['to'], template: '<a :href="to"><slot /></a>' },
}));

describe('AppPageHeader', () => {
    it('renders title and description without a breadcrumb', () => {
        const wrapper = mount(AppPageHeader, {
            props: { title: 'Staff', description: 'Who can sign in' },
        });
        expect(wrapper.find('h1').text()).toBe('Staff');
        expect(wrapper.text()).toContain('Who can sign in');
        expect(wrapper.find('nav').exists()).toBe(false);
    });

    it('links earlier crumbs and marks the last as the current page', () => {
        const wrapper = mount(AppPageHeader, {
            props: {
                title: 'Jane',
                breadcrumbs: [
                    { label: 'Team', to: '/team' },
                    { label: 'Jane', to: '/team/1' },
                ],
            },
        });
        const nav = wrapper.find('nav[aria-label="Breadcrumb"]');
        const links = nav.findAll('a');
        expect(links).toHaveLength(1);
        expect(links[0].attributes('href')).toBe('/team');
        expect(nav.find('[aria-current="page"]').text()).toBe('Jane');
        expect(nav.text()).toBe('Team › Jane');
    });

    it('renders actions from the default slot', () => {
        const wrapper = mount(AppPageHeader, {
            props: { title: 'Staff' },
            slots: { default: '<button>Add staff</button>' },
        });
        expect(wrapper.find('button').text()).toBe('Add staff');
    });
});
