export interface NavigationItem {
    label: string;
    to?: string;
    href?: string;
    icon?: string;
    children?: NavigationItem[];
    badge?: string | number;
}

export interface User {
    id?: string | number;
    name: string;
    email: string;
    avatar?: string;
}
