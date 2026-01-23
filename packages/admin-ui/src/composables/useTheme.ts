import {
    computed,
    onMounted,
    onUnmounted,
    ref,
    watch,
    type ComputedRef,
    type Ref,
} from 'vue';
import type { ResolvedTheme, ThemeMode } from '../types';

export interface UseThemeReturn {
    mode: Ref<ThemeMode>;
    resolvedTheme: ComputedRef<ResolvedTheme>;
    setTheme: (mode: ThemeMode) => void;
    toggleTheme: () => void;
}

const STORAGE_KEY = 'admin-theme-mode';

const mode = ref<ThemeMode>('system');
const systemPrefersDark = ref(false);

let initialized = false;

export function useTheme(): UseThemeReturn {
    let mediaQuery: MediaQueryList | null = null;

    const handleSystemChange = (e: MediaQueryListEvent): void => {
        systemPrefersDark.value = e.matches;
    };

    const resolvedTheme = computed<ResolvedTheme>(() => {
        if (mode.value === 'system') {
            return systemPrefersDark.value ? 'dark' : 'light';
        }
        return mode.value;
    });

    const setTheme = (newMode: ThemeMode): void => {
        mode.value = newMode;
        localStorage.setItem(STORAGE_KEY, newMode);
    };

    const toggleTheme = (): void => {
        const modes: ThemeMode[] = ['light', 'dark', 'system'];
        const currentIndex = modes.indexOf(mode.value);
        const nextIndex = (currentIndex + 1) % modes.length;
        setTheme(modes[nextIndex]);
    };

    const applyTheme = (): void => {
        const root = document.documentElement;
        if (resolvedTheme.value === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    };

    onMounted(() => {
        if (!initialized) {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved && ['light', 'dark', 'system'].includes(saved)) {
                mode.value = saved as ThemeMode;
            }

            mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            systemPrefersDark.value = mediaQuery.matches;
            mediaQuery.addEventListener('change', handleSystemChange);

            initialized = true;
        }

        applyTheme();
    });

    onUnmounted(() => {
        if (mediaQuery) {
            mediaQuery.removeEventListener('change', handleSystemChange);
        }
    });

    watch(resolvedTheme, applyTheme);

    return {
        mode,
        resolvedTheme,
        setTheme,
        toggleTheme,
    };
}
