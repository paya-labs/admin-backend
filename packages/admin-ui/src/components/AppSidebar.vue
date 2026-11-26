<script setup lang="ts">
import { computed, ref } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { useTheme } from '../composables/useTheme';
import { vClickOutside } from '../directives/clickOutside';
import type { NavigationItem, User } from '../types';
import AppIcon from './AppIcon.vue';

interface SidebarNavigationItem extends NavigationItem {
    children?: SidebarNavigationItem[];
    badgeVariant?: 'primary' | 'danger' | 'warning';
}

interface Props {
    navigation: SidebarNavigationItem[];
    logo?: string;
    logoAlt?: string;
    isCollapsed?: boolean;
    isOpen?: boolean;
    user?: User;
}

withDefaults(defineProps<Props>(), {
    logo: '',
    logoAlt: 'Logo',
    isCollapsed: false,
    isOpen: false,
    user: () => ({
        id: '',
        name: 'User',
        email: 'user@example.com',
        avatar: '',
    }),
});

const emit = defineEmits<{
    close: [];
    toggleCollapse: [];
    logout: [];
}>();

const route = useRoute();

const expandedGroups = ref<Set<string>>(new Set());

const toggleGroup = (groupId: string): void => {
    if (expandedGroups.value.has(groupId)) {
        expandedGroups.value.delete(groupId);
    } else {
        expandedGroups.value.add(groupId);
    }
};

const isGroupExpanded = (groupId: string): boolean =>
    expandedGroups.value.has(groupId);

const isActive = (path: string): boolean => route.path === path;

const getItemPath = (item: SidebarNavigationItem): string =>
    item.to || (item as SidebarNavigationItem & { route?: string }).route || '';

const hasActiveChild = (children?: SidebarNavigationItem[]): boolean => {
    return children?.some((child) => isActive(getItemPath(child))) || false;
};

const isUserMenuOpen = ref(false);
const toggleUserMenu = (): void => {
    isUserMenuOpen.value = !isUserMenuOpen.value;
};
const closeUserMenu = (): void => {
    isUserMenuOpen.value = false;
};
const handleLogout = (): void => {
    closeUserMenu();
    emit('logout');
};

// Theme lives in the user menu: cycling it keeps the menu open so the
// user can see each mode land.
const { mode, toggleTheme } = useTheme();
const themeLabel = computed(() =>
    mode.value === 'dark'
        ? 'Dark'
        : mode.value === 'light'
          ? 'Light'
          : 'System',
);
const themeIcon = computed(() =>
    mode.value === 'dark'
        ? 'moon'
        : mode.value === 'light'
          ? 'sun'
          : 'desktop-computer',
);
</script>

<template>
    <!-- Mobile backdrop overlay -->
    <Teleport to="body">
        <Transition
            enter-active-class="transition-opacity duration-200"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition-opacity duration-200"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
        >
            <div
                v-if="isOpen"
                class="fixed inset-0 z-[var(--z-overlay)] bg-black/50 lg:hidden"
                @click="emit('close')"
            />
        </Transition>
    </Teleport>

    <!-- Sidebar -->
    <aside
        :class="[
            'fixed top-0 left-0 z-[var(--z-sidebar)] h-full',
            'border-border bg-sidebar border-r',
            'flex flex-col',
            'transition-all duration-200',

            // Width based on collapsed state
            isCollapsed
                ? 'w-[var(--sidebar-collapsed-width)]'
                : 'w-[var(--sidebar-width)]',

            // Mobile positioning (slide in/out)
            'lg:translate-x-0',
            isOpen ? 'translate-x-0' : '-translate-x-full',
        ]"
    >
        <!-- Logo area -->
        <div
            :class="[
                'border-border flex h-[var(--header-height)] items-center border-b px-4',
                isCollapsed ? 'justify-center' : 'justify-between',
            ]"
        >
            <RouterLink to="/" class="flex min-w-0 items-center gap-3">
                <img
                    v-if="logo"
                    :src="logo"
                    :alt="logoAlt"
                    class="h-8 w-8 flex-shrink-0 object-contain"
                />
                <div
                    v-else
                    class="bg-primary-600 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md text-sm font-bold text-white"
                >
                    {{ logoAlt.charAt(0) }}
                </div>
                <span
                    v-if="!isCollapsed"
                    class="text-text truncate font-semibold"
                >
                    {{ logoAlt }}
                </span>
            </RouterLink>

            <!-- Collapse toggle (desktop only) -->
            <button
                v-if="!isCollapsed"
                type="button"
                class="text-muted hover:bg-surface-hover hover:text-text hidden h-8 w-8 items-center justify-center rounded-md transition-colors lg:flex"
                @click="emit('toggleCollapse')"
            >
                <svg
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
                        d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                    />
                </svg>
            </button>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 overflow-y-auto px-3 py-4">
            <ul class="space-y-1">
                <li
                    v-for="item in navigation"
                    :key="getItemPath(item) || item.label"
                >
                    <!-- Item with children (group) -->
                    <template v-if="item.children && item.children.length">
                        <button
                            type="button"
                            :class="[
                                'flex min-h-[44px] w-full items-center gap-3 px-3 py-2.5',
                                'rounded-md',
                                'hover:bg-surface-hover',
                                'transition-colors duration-150',
                                isCollapsed && 'justify-center px-0',
                                hasActiveChild(item.children)
                                    ? 'text-text'
                                    : 'text-text-secondary hover:text-text',
                            ]"
                            @click="toggleGroup(item.label)"
                        >
                            <AppIcon
                                v-if="item.icon"
                                :name="item.icon"
                                size="md"
                                class="flex-shrink-0"
                            />
                            <span
                                v-if="!isCollapsed"
                                class="flex-1 truncate text-left text-sm font-medium"
                            >
                                {{ item.label }}
                            </span>
                            <svg
                                v-if="!isCollapsed"
                                :class="[
                                    'h-4 w-4 transition-transform duration-150',
                                    isGroupExpanded(item.label) && 'rotate-180',
                                ]"
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

                        <!-- Children -->
                        <Transition
                            enter-active-class="transition-all duration-150 ease-out overflow-hidden"
                            enter-from-class="max-h-0 opacity-0"
                            enter-to-class="max-h-96 opacity-100"
                            leave-active-class="transition-all duration-150 ease-in overflow-hidden"
                            leave-from-class="max-h-96 opacity-100"
                            leave-to-class="max-h-0 opacity-0"
                        >
                            <ul
                                v-if="
                                    !isCollapsed && isGroupExpanded(item.label)
                                "
                                class="mt-1 ml-4 space-y-1"
                            >
                                <li
                                    v-for="child in item.children"
                                    :key="getItemPath(child)"
                                >
                                    <RouterLink
                                        :to="getItemPath(child) || '/'"
                                        :class="[
                                            'flex min-h-[40px] items-center gap-3 px-3 py-2',
                                            'rounded-md text-sm',
                                            'transition-colors duration-150',
                                            isActive(getItemPath(child))
                                                ? 'bg-primary-subtle text-on-primary-soft'
                                                : 'text-text-secondary hover:bg-surface-hover hover:text-text',
                                        ]"
                                        @click="emit('close')"
                                    >
                                        <AppIcon
                                            v-if="child.icon"
                                            :name="child.icon"
                                            size="sm"
                                        />
                                        <span class="truncate">{{
                                            child.label
                                        }}</span>
                                    </RouterLink>
                                </li>
                            </ul>
                        </Transition>
                    </template>

                    <!-- Single item -->
                    <template v-else>
                        <RouterLink
                            :to="getItemPath(item) || '/'"
                            :class="[
                                'flex min-h-[44px] items-center gap-3 px-3 py-2.5',
                                'rounded-md',
                                'transition-colors duration-150',
                                isCollapsed && 'justify-center px-0',
                                isActive(getItemPath(item))
                                    ? 'bg-primary-subtle text-on-primary-soft'
                                    : 'text-text-secondary hover:bg-surface-hover hover:text-text',
                            ]"
                            :title="isCollapsed ? item.label : undefined"
                            @click="emit('close')"
                        >
                            <AppIcon
                                v-if="item.icon"
                                :name="item.icon"
                                size="md"
                                class="flex-shrink-0"
                            />
                            <span
                                v-if="!isCollapsed"
                                class="truncate text-sm font-medium"
                            >
                                {{ item.label }}
                            </span>
                            <!-- Badge -->
                            <span
                                v-if="!isCollapsed && item.badge"
                                :class="[
                                    'ml-auto rounded-full px-2 py-0.5 text-xs font-medium',
                                    item.badgeVariant === 'danger' &&
                                        'bg-danger text-white',
                                    item.badgeVariant === 'warning' &&
                                        'bg-warning text-black',
                                    (!item.badgeVariant ||
                                        item.badgeVariant === 'primary') &&
                                        'bg-primary-soft text-on-primary-soft',
                                ]"
                            >
                                {{ item.badge }}
                            </span>
                        </RouterLink>
                    </template>
                </li>
            </ul>
        </nav>

        <!-- User menu -->
        <div
            v-click-outside="closeUserMenu"
            :class="[
                'border-border relative border-t',
                isCollapsed ? 'p-2' : 'p-3',
            ]"
        >
            <button
                type="button"
                :class="[
                    'hover:bg-surface-hover flex w-full items-center rounded-md transition-colors',
                    isCollapsed ? 'justify-center p-1.5' : 'gap-3 px-2 py-1.5',
                ]"
                aria-haspopup="true"
                :aria-expanded="isUserMenuOpen"
                :title="isCollapsed ? user.name : undefined"
                @click="toggleUserMenu"
            >
                <div
                    class="bg-primary-soft text-on-primary-soft flex h-9 w-9 flex-shrink-0 items-center justify-center overflow-hidden rounded-full text-sm font-medium"
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
                <div v-if="!isCollapsed" class="min-w-0 flex-1 text-left">
                    <p class="text-text truncate text-sm font-medium">
                        {{ user.name }}
                    </p>
                    <p class="text-muted truncate text-xs">
                        {{ user.email }}
                    </p>
                </div>
                <AppIcon
                    v-if="!isCollapsed"
                    name="chevron-up"
                    size="sm"
                    class="text-muted flex-shrink-0"
                />
            </button>

            <!-- Dropdown menu (opens upward) -->
            <Transition
                enter-active-class="transition duration-150 ease-out"
                enter-from-class="transform translate-y-1 opacity-0"
                enter-to-class="transform translate-y-0 opacity-100"
                leave-active-class="transition duration-100 ease-in"
                leave-from-class="transform translate-y-0 opacity-100"
                leave-to-class="transform translate-y-1 opacity-0"
            >
                <div
                    v-if="isUserMenuOpen"
                    :class="[
                        'border-border bg-surface absolute bottom-full mb-2 w-56 rounded-lg border py-1 shadow-[var(--shadow-lg)]',
                        isCollapsed ? 'left-2' : 'right-3 left-3',
                    ]"
                    role="menu"
                >
                    <div
                        v-if="isCollapsed"
                        class="border-border border-b px-3 py-2"
                    >
                        <p class="text-text truncate text-sm font-medium">
                            {{ user.name }}
                        </p>
                        <p class="text-muted truncate text-xs">
                            {{ user.email }}
                        </p>
                    </div>
                    <button
                        type="button"
                        class="text-text hover:bg-surface-hover flex min-h-10 w-full items-center gap-3 px-3 py-2 text-sm"
                        role="menuitem"
                        aria-label="Toggle theme"
                        @click="toggleTheme"
                    >
                        <AppIcon :name="themeIcon" size="sm" />
                        Theme: {{ themeLabel }}
                    </button>
                    <button
                        type="button"
                        class="text-danger hover:bg-surface-hover flex min-h-10 w-full items-center gap-3 px-3 py-2 text-sm"
                        role="menuitem"
                        @click="handleLogout"
                    >
                        <AppIcon name="logout" size="sm" />
                        Sign out
                    </button>
                </div>
            </Transition>
        </div>

        <!-- Expand button when collapsed (desktop) -->
        <div
            v-if="isCollapsed"
            class="border-border hidden items-center justify-center border-t p-4 lg:flex"
        >
            <button
                type="button"
                class="text-muted hover:bg-surface-hover hover:text-text flex h-10 w-10 items-center justify-center rounded-md transition-colors"
                @click="emit('toggleCollapse')"
            >
                <svg
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
                        d="M13 5l7 7-7 7M5 5l7 7-7 7"
                    />
                </svg>
            </button>
        </div>
    </aside>
</template>
