<script setup lang="ts">
import { useTheme } from '../composables/useTheme';
import AppButton from './AppButton.vue';
import AppIcon from './AppIcon.vue';

interface Props {
    isCollapsed?: boolean;
}

withDefaults(defineProps<Props>(), {
    isCollapsed: false,
});

const emit = defineEmits<{
    toggleSidebar: [];
}>();

const { mode, toggleTheme } = useTheme();

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
            </div>
        </div>
    </header>
</template>
