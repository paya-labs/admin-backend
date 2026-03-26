import { inject, provide, type InjectionKey } from 'vue';
import type { ModuleConfig } from '../types/module';

const MODULE_CONFIG_KEY: InjectionKey<ModuleConfig> = Symbol('moduleConfig');

/**
 * Provide module config to all descendant components.
 * Call this in App.vue setup to make config available throughout the app.
 */
export const provideModuleConfig = (config: ModuleConfig): void => {
    provide(MODULE_CONFIG_KEY, config);
};

/**
 * Get the module config from the provider.
 * Returns undefined if no config has been provided.
 */
export const useModuleConfig = (): ModuleConfig | undefined => {
    return inject(MODULE_CONFIG_KEY, undefined);
};

/**
 * Get locale and timezone from the module config with sensible defaults.
 * Use this in utilities that need locale/timezone but may run outside Vue components.
 */
export const getModuleConfig = (): { locale: string; timezone: string } => {
    const config = inject(MODULE_CONFIG_KEY, undefined);
    return {
        locale: config?.locale ?? 'en-US',
        timezone: config?.timezone ?? 'UTC',
    };
};
