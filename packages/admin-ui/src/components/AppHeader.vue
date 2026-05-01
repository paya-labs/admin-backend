<script setup lang="ts">
import { ref } from 'vue';
import { useTheme } from '../composables/useTheme';
import { vClickOutside } from '../directives/clickOutside';
import type { User } from '../types';
import AppButton from './AppButton.vue';
import AppIcon from './AppIcon.vue';

interface Props {
    user?: User;
    isCollapsed?: boolean;
}

withDefaults(defineProps<Props>(), {
    user: () => ({
        name: 'User',
        email: 'user@example.com',
        avatar: '',
    }),
    isCollapsed: false,
});

const emit = defineEmits<{
    toggleSidebar: [];
    logout: [];
}>();

const { mode, toggleTheme } = useTheme();

const isUserMenuOpen = ref(false);

const toggleUserMenu = (): void => {
    isUserMenuOpen.value = !isUserMenuOpen.value;
};

const closeUserMenu = (): void => {
    isUserMenuOpen.value = false;
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
                    <AppIcon name="menu" size="lg" />
                </AppButton>

                <!-- Teleport target: page-level header content (left) -->
                <div id="header-left" class="flex items-center" />
            </div>

            <!-- Center section -->
            <div class="lg:flex hidden flex-1 justify-center">
                <!-- Teleport target: page-level header content (center) -->
                <div id="header-center" class="flex items-center" />
            </div>

            <!-- Right section -->
            <div class="gap-2 lg:gap-3 flex items-center">
                <!-- Teleport target: page-level header content (right) -->
                <div id="header-right" class="flex items-center" />
                <!-- Teleport target: app-level trailing content (search, etc.) -->
                <div id="header-end" class="flex items-center" />

                <!-- Theme toggle -->
                <AppButton
                    variant="ghost"
                    icon-only
                    size="md"
                    :title="`Theme: ${getThemeLabel()}`"
                    aria-label="Toggle theme"
                    @click="toggleTheme"
                >
                    <AppIcon v-if="mode === 'light'" name="sun" size="md" />
                    <AppIcon
                        v-else-if="mode === 'dark'"
                        name="moon"
                        size="md"
                    />
                    <AppIcon v-else name="desktop-computer" size="md" />
                </AppButton>

                <!-- User menu -->
                <div class="relative">
                    <button
                        type="button"
                        class="gap-2 px-2 py-1.5 min-h-11 flex items-center rounded-md transition-colors hover:bg-surface-hover"
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
                            class="text-sm font-medium lg:block max-w-30 hidden truncate text-text"
                        >
                            {{ user.name }}
                        </span>
                        <AppIcon
                            name="chevron-down"
                            size="sm"
                            class="lg:block hidden text-muted"
                        />
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

                            <div class="pt-1 border-t border-border">
                                <button
                                    type="button"
                                    class="gap-3 px-4 py-2 text-sm min-h-10 flex w-full items-center text-danger hover:bg-surface-hover"
                                    role="menuitem"
                                    @click="
                                        closeUserMenu();
                                        emit('logout');
                                    "
                                >
                                    <AppIcon name="logout" size="sm" />
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
