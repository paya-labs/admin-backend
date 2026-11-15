import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import AppIcon from '../../src/components/AppIcon.vue';
import { icons } from '../../src/icons';

describe('AppIcon', () => {
    it('renders an outline icon as a stroked path on a 24px grid', () => {
        const svg = mount(AppIcon, { props: { name: 'repeat' } }).find('svg');

        expect(svg.attributes('viewBox')).toBe('0 0 24 24');
        expect(svg.attributes('fill')).toBe('none');
        expect(svg.attributes('stroke')).toBe('currentColor');
        expect(svg.find('path').attributes('d')).toBe(icons.repeat.path);
    });

    it('renders a solid icon filled, even-odd, with its own viewBox', () => {
        const svg = mount(AppIcon, {
            props: { name: 'exclamation-triangle-solid' },
        }).find('svg');

        expect(svg.attributes('viewBox')).toBe('0 0 20 20');
        expect(svg.attributes('fill')).toBe('currentColor');
        expect(svg.attributes('stroke')).toBeUndefined();
        expect(svg.find('path').attributes('fill-rule')).toBe('evenodd');
    });

    it('renders a multi-colour logo with its fixed colours', () => {
        const svg = mount(AppIcon, { props: { name: 'google' } }).find('svg');

        expect(svg.attributes('viewBox')).toBe('0 0 48 48');
        expect(svg.findAll('path').map((p) => p.attributes('fill'))).toEqual([
            '#EA4335',
            '#4285F4',
            '#FBBC05',
            '#34A853',
        ]);
    });

    it('renders a placeholder for an unknown name', () => {
        const wrapper = mount(AppIcon, { props: { name: 'nope' } });

        expect(wrapper.find('svg').exists()).toBe(false);
        expect(wrapper.find('span').attributes('title')).toContain('nope');
    });

    it('gives every icon path data that starts with an absolute moveto', () => {
        for (const [name, icon] of Object.entries(icons)) {
            expect(icon.path, name).toMatch(/^M/);
        }
    });
});
