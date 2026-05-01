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
    fullscreen?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    logo: '',
    logoAlt: 'Admin',
    user: () => ({ id: '', name: 'User', email: 'user@example.com' }),
    fullscreen: false,
});

const emit = defineEmits<{
    logout: [];
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
            :user="props.user"
            @close="close"
            @toggle-collapse="toggleCollapse"
            @logout="handleLogout"
        />

        <!-- Header -->
        <AppHeader :is-collapsed="isCollapsed" @toggle-sidebar="toggle" />

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
