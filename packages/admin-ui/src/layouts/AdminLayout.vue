<script setup lang="ts">
import { provide } from 'vue';
import AppHeader from '../components/AppHeader.vue';
import AppSidebar from '../components/AppSidebar.vue';
import { useSidebar } from '../composables/useSidebar';
import { useTheme } from '../composables/useTheme';
import type { NavigationItem, User } from '../types';

interface Props {
    navigation: NavigationItem[];
    logo?: string;
    logoAlt?: string;
    user?: User;
    showSearch?: boolean;
    fullscreen?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    logo: '',
    logoAlt: 'Admin',
    user: () => ({ id: '', name: 'User', email: 'user@example.com' }),
    showSearch: true,
    fullscreen: false,
});

const emit = defineEmits<{
    logout: [];
    search: [query: string];
    'search-input': [query: string];
    'search-focus': [];
    'search-blur': [];
}>();

const { isOpen, isCollapsed, isMobile, toggle, toggleCollapse, close } =
    useSidebar();

useTheme();

provide('sidebar', {
    isOpen,
    isCollapsed,
    isMobile,
    toggle,
    toggleCollapse,
    close,
});

const handleLogout = (): void => {
    emit('logout');
};

const handleSearch = (query: string): void => {
    emit('search', query);
};

const handleSearchInput = (query: string): void => {
    emit('search-input', query);
};

const handleSearchFocus = (): void => {
    emit('search-focus');
};

const handleSearchBlur = (): void => {
    emit('search-blur');
};
</script>

<template>
    <div class="min-h-screen bg-[var(--bg-body)]">
        <!-- Sidebar -->
        <AppSidebar
            :navigation="props.navigation"
            :logo="props.logo"
            :logo-alt="props.logoAlt"
            :is-collapsed="isCollapsed"
            :is-open="isOpen"
            @close="close"
            @toggle-collapse="toggleCollapse"
        />

        <!-- Header -->
        <AppHeader
            :user="props.user"
            :is-collapsed="isCollapsed"
            :show-search="props.showSearch"
            @toggle-sidebar="toggle"
            @logout="handleLogout"
            @search="handleSearch"
            @search-input="handleSearchInput"
            @search-focus="handleSearchFocus"
            @search-blur="handleSearchBlur"
        >
            <template #left>
                <slot name="header-left">
                    <slot name="breadcrumbs" />
                </slot>
            </template>
            <template #center>
                <slot name="header-center" />
            </template>
            <template #right>
                <slot name="header-right" />
            </template>
            <template #search-dropdown>
                <slot name="search-dropdown" />
            </template>
        </AppHeader>

        <!-- Main content -->
        <main
            :class="[
                'min-h-screen pt-[var(--header-height)]',
                'transition-[padding-left] duration-200',
                isCollapsed
                    ? 'lg:pl-[var(--sidebar-collapsed-width)]'
                    : 'lg:pl-[var(--sidebar-width)]',
            ]"
        >
            <div :class="props.fullscreen ? '' : 'p-4 lg:p-6'">
                <slot />
            </div>
        </main>
    </div>
</template>
