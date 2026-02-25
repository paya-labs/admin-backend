<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import type { NavigationItem } from '../types';
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
}

withDefaults(defineProps<Props>(), {
    logo: '',
    logoAlt: 'Logo',
    isCollapsed: false,
    isOpen: false,
});

const emit = defineEmits<{
    close: [];
    toggleCollapse: [];
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
                class="inset-0 bg-black/50 lg:hidden fixed z-[var(--z-overlay)]"
                @click="emit('close')"
            />
        </Transition>
    </Teleport>

    <!-- Sidebar -->
    <aside
        :class="[
            'top-0 left-0 fixed z-[var(--z-sidebar)] h-full',
            'border-r border-border bg-sidebar',
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
                'px-4 flex h-[var(--header-height)] items-center border-b border-border',
                isCollapsed ? 'justify-center' : 'justify-between',
            ]"
        >
            <RouterLink to="/" class="min-w-0 gap-3 flex items-center">
                <img
                    v-if="logo"
                    :src="logo"
                    :alt="logoAlt"
                    class="h-8 w-8 flex-shrink-0 object-contain"
                />
                <div
                    v-else
                    class="h-8 w-8 text-sm font-bold text-white flex flex-shrink-0 items-center justify-center rounded-md bg-primary-600"
                >
                    {{ logoAlt.charAt(0) }}
                </div>
                <span
                    v-if="!isCollapsed"
                    class="font-semibold truncate text-text"
                >
                    {{ logoAlt }}
                </span>
            </RouterLink>

            <!-- Collapse toggle (desktop only) -->
            <button
                v-if="!isCollapsed"
                type="button"
                class="h-8 w-8 lg:flex hidden items-center justify-center rounded-md text-muted transition-colors hover:bg-surface-hover hover:text-text"
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
        <nav class="px-3 py-4 flex-1 overflow-y-auto">
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
                                'gap-3 px-3 py-2.5 flex min-h-[44px] w-full items-center',
                                'rounded-md',
                                'hover:bg-surface-hover',
                                'transition-colors duration-150',
                                isCollapsed && 'px-0 justify-center',
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
                                class="text-sm font-medium flex-1 truncate text-left"
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
                                            'gap-3 px-3 py-2 flex min-h-[40px] items-center',
                                            'text-sm rounded-md',
                                            'transition-colors duration-150',
                                            isActive(getItemPath(child))
                                                ? 'bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300'
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
                                'gap-3 px-3 py-2.5 flex min-h-[44px] items-center',
                                'rounded-md',
                                'transition-colors duration-150',
                                isCollapsed && 'px-0 justify-center',
                                isActive(getItemPath(item))
                                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300'
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
                                class="text-sm font-medium truncate"
                            >
                                {{ item.label }}
                            </span>
                            <!-- Badge -->
                            <span
                                v-if="!isCollapsed && item.badge"
                                :class="[
                                    'px-2 py-0.5 text-xs font-medium ml-auto rounded-full',
                                    item.badgeVariant === 'danger' &&
                                        'text-white bg-danger',
                                    item.badgeVariant === 'warning' &&
                                        'text-black bg-warning',
                                    (!item.badgeVariant ||
                                        item.badgeVariant === 'primary') &&
                                        'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300',
                                ]"
                            >
                                {{ item.badge }}
                            </span>
                        </RouterLink>
                    </template>
                </li>
            </ul>
        </nav>

        <!-- Expand button when collapsed (desktop) -->
        <div
            v-if="isCollapsed"
            class="p-4 lg:flex hidden items-center justify-center border-t border-border"
        >
            <button
                type="button"
                class="h-10 w-10 flex items-center justify-center rounded-md text-muted transition-colors hover:bg-surface-hover hover:text-text"
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
