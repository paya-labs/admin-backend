import type { IconName } from '../icons';

export interface NavigationItem {
    label: string;
    to?: string;
    href?: string;
    icon?: IconName;
    children?: NavigationItem[];
    badge?: string | number;
}

export interface User {
    id?: string | number;
    name: string;
    email: string;
    avatar?: string;
}
