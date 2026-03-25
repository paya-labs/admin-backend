import type { NavigationItem } from './navigation';

export interface ModuleTheme {
    primary?: string;
    secondary?: string;
    accent?: string;
}

export interface ModuleApi {
    baseUrl?: string;
}

export interface ModuleConfig {
    id: string;
    name: string;
    logo?: string | null;
    locale?: string; // e.g., 'en-CY'
    timezone?: string; // e.g., 'Asia/Nicosia'
    theme?: ModuleTheme;
    api?: ModuleApi;
    navigation: NavigationItem[];
}
