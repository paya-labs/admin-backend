<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import { useTheme } from '../composables/useTheme';
import { vClickOutside } from '../directives/clickOutside';
import type { User } from '../types';
import AppButton from './AppButton.vue';

interface Props {
    user?: User;
    showSearch?: boolean;
    isCollapsed?: boolean;
}

withDefaults(defineProps<Props>(), {
    user: () => ({
        name: 'User',
        email: 'user@example.com',
        avatar: '',
    }),
    showSearch: true,
    isCollapsed: false,
});

const emit = defineEmits<{
    toggleSidebar: [];
    logout: [];
    search: [query: string];
}>();

const { mode, toggleTheme } = useTheme();

const isUserMenuOpen = ref(false);
const searchQuery = ref('');

const toggleUserMenu = (): void => {
    isUserMenuOpen.value = !isUserMenuOpen.value;
};

const closeUserMenu = (): void => {
    isUserMenuOpen.value = false;
};

const handleSearch = (): void => {
    if (searchQuery.value.trim()) {
        emit('search', searchQuery.value);
    }
};

const getThemeLabel = (): string => {
    if (mode.value === 'dark') return 'Dark';
    if (mode.value === 'light') return 'Light';
    return 'System';
};
</script>

<template>
    <header
        :class="[
            'top-0 right-0 fixed z-[var(--z-header)] h-[var(--header-height)]',
            'border-b border-border bg-header',
            'transition-[left] duration-200',
            'left-0',
            isCollapsed
                ? 'lg:left-[var(--sidebar-collapsed-width)]'
                : 'lg:left-[var(--sidebar-width)]',
        ]"
    >
        <div class="px-4 lg:px-6 flex h-full items-center justify-between">
            <!-- Left section -->
            <div class="gap-4 flex items-center">
                <!-- Mobile hamburger -->
                <AppButton
                    variant="ghost"
                    icon-only
                    size="md"
                    class="lg:hidden"
                    aria-label="Toggle sidebar"
                    @click="emit('toggleSidebar')"
                >
                    <svg
                        class="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    </svg>
                </AppButton>

                <!-- Left slot (default: breadcrumbs) -->
                <slot name="left">
                    <slot name="breadcrumbs" />
                </slot>

                <!-- Teleport target for external left content -->
                <div id="header-left" />
            </div>

            <!-- Center section -->
            <div class="lg:flex hidden flex-1 justify-center">
                <slot name="center" />
                <!-- Teleport target for external center content -->
                <div id="header-center" />
            </div>

            <!-- Right section -->
            <div class="gap-2 lg:gap-3 flex items-center">
                <!-- Right slot for custom content -->
                <slot name="right" />
                <!-- Teleport target for external right content (always visible) -->
                <div id="header-right" class="flex items-center" />

                <!-- Search (desktop) -->
                <div v-if="showSearch" class="md:block relative hidden">
                    <form @submit.prevent="handleSearch">
                        <input
                            v-model="searchQuery"
                            type="search"
                            placeholder="Search..."
                            class="w-64 py-2 pr-4 pl-10 text-sm rounded-lg border border-border bg-surface text-text transition-colors placeholder:text-muted focus:border-transparent focus:ring-2 focus:ring-focus-ring focus:outline-none"
                        />
                        <svg
                            class="left-3 h-5 w-5 absolute top-1/2 -translate-y-1/2 text-muted"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </form>
                </div>

                <!-- Theme toggle -->
                <AppButton
                    variant="ghost"
                    icon-only
                    size="md"
                    :title="`Theme: ${getThemeLabel()}`"
                    aria-label="Toggle theme"
                    @click="toggleTheme"
                >
                    <!-- Sun icon (light mode) -->
                    <svg
                        v-if="mode === 'light'"
                        class="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                    </svg>
                    <!-- Moon icon (dark mode) -->
                    <svg
                        v-else-if="mode === 'dark'"
                        class="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                        />
                    </svg>
                    <!-- System icon -->
                    <svg
                        v-else
                        class="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                    </svg>
                </AppButton>

                <!-- User menu -->
                <div class="relative">
                    <button
                        type="button"
                        class="gap-2 px-2 py-1.5 flex min-h-[44px] items-center rounded-md transition-colors hover:bg-surface-hover"
                        aria-haspopup="true"
                        :aria-expanded="isUserMenuOpen"
                        @click="toggleUserMenu"
                    >
                        <div
                            class="h-8 w-8 text-sm font-medium flex items-center justify-center overflow-hidden rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300"
                        >
                            <img
                                v-if="user.avatar"
                                :src="user.avatar"
                                :alt="user.name"
                                class="h-full w-full object-cover"
                            />
                            <span v-else>{{
                                user.name?.charAt(0)?.toUpperCase() || 'U'
                            }}</span>
                        </div>
                        <span
                            class="text-sm font-medium lg:block hidden max-w-[120px] truncate text-text"
                        >
                            {{ user.name }}
                        </span>
                        <svg
                            class="h-4 w-4 lg:block hidden text-muted"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </button>

                    <!-- Dropdown menu -->
                    <Transition
                        enter-active-class="transition duration-150 ease-out"
                        enter-from-class="transform scale-95 opacity-0"
                        enter-to-class="transform scale-100 opacity-100"
                        leave-active-class="transition duration-100 ease-in"
                        leave-from-class="transform scale-100 opacity-100"
                        leave-to-class="transform scale-95 opacity-0"
                    >
                        <div
                            v-if="isUserMenuOpen"
                            v-click-outside="closeUserMenu"
                            class="right-0 mt-2 w-56 py-2 absolute rounded-lg border border-border bg-surface shadow-[var(--shadow-lg)]"
                            role="menu"
                        >
                            <div class="px-4 py-2 border-b border-border">
                                <p
                                    class="text-sm font-medium truncate text-text"
                                >
                                    {{ user.name }}
                                </p>
                                <p class="text-xs truncate text-muted">
                                    {{ user.email }}
                                </p>
                            </div>

                            <div class="py-1">
                                <RouterLink
                                    to="/profile"
                                    class="gap-3 px-4 py-2 text-sm flex min-h-[40px] items-center text-text-secondary hover:bg-surface-hover hover:text-text"
                                    role="menuitem"
                                    @click="closeUserMenu"
                                >
                                    <svg
                                        class="h-4 w-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        />
                                    </svg>
                                    Profile
                                </RouterLink>
                                <RouterLink
                                    to="/settings"
                                    class="gap-3 px-4 py-2 text-sm flex min-h-[40px] items-center text-text-secondary hover:bg-surface-hover hover:text-text"
                                    role="menuitem"
                                    @click="closeUserMenu"
                                >
                                    <svg
                                        class="h-4 w-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                        />
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                    </svg>
                                    Settings
                                </RouterLink>
                            </div>

                            <div class="pt-1 border-t border-border">
                                <button
                                    type="button"
                                    class="gap-3 px-4 py-2 text-sm flex min-h-[40px] w-full items-center text-danger hover:bg-surface-hover"
                                    role="menuitem"
                                    @click="
                                        closeUserMenu();
                                        emit('logout');
                                    "
                                >
                                    <svg
                                        class="h-4 w-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                        />
                                    </svg>
                                    Sign out
                                </button>
                            </div>
                        </div>
                    </Transition>
                </div>
            </div>
        </div>
    </header>
</template>
