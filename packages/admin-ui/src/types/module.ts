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
    theme?: ModuleTheme;
    api?: ModuleApi;
    navigation: NavigationItem[];
}
