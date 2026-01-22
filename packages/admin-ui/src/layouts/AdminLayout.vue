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
}

withDefaults(defineProps<Props>(), {
    logo: '',
    logoAlt: 'Admin',
    user: () => ({ id: '', name: 'User', email: 'user@example.com' }),
    showSearch: true,
});

const emit = defineEmits<{
    logout: [];
    search: [query: string];
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
</script>

<template>
    <div class="min-h-screen bg-[var(--bg-body)]">
        <!-- Sidebar -->
        <AppSidebar
            :navigation="navigation"
            :logo="logo"
            :logo-alt="logoAlt"
            :is-collapsed="isCollapsed"
            :is-open="isOpen"
            @close="close"
            @toggle-collapse="toggleCollapse"
        />

        <!-- Header -->
        <AppHeader
            :user="user"
            :is-collapsed="isCollapsed"
            :show-search="showSearch"
            @toggle-sidebar="toggle"
            @logout="handleLogout"
            @search="handleSearch"
        >
            <template #breadcrumbs>
                <slot name="breadcrumbs" />
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
            <div class="p-4 lg:p-6">
                <slot />
            </div>
        </main>
    </div>
</template>
