<script setup lang="ts">
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

// The header owns nothing but the hamburger. Each region is a named slot and
// also a teleport target with the same id, so pages can fill it either way.
defineSlots<{
    'header-left'(): unknown;
    'header-center'(): unknown;
    'header-right'(): unknown;
    'header-end'(): unknown;
}>();
</script>

<template>
    <header
        :class="[
            'fixed top-0 right-0 z-[var(--z-header)] h-[var(--header-height)]',
            'border-border bg-header border-b',
            'transition-[left] duration-200',
            'left-0',
            isCollapsed
                ? 'lg:left-[var(--sidebar-collapsed-width)]'
                : 'lg:left-[var(--sidebar-width)]',
        ]"
    >
        <div class="flex h-full items-center justify-between px-4 lg:px-6">
            <!-- Left section -->
            <div class="flex items-center gap-4">
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
                <div id="header-left" class="flex items-center">
                    <slot name="header-left" />
                </div>
            </div>

            <!-- Center section -->
            <div class="hidden flex-1 justify-center lg:flex">
                <!-- Teleport target: page-level header content (center) -->
                <div id="header-center" class="flex items-center">
                    <slot name="header-center" />
                </div>
            </div>

            <!-- Right section -->
            <div class="flex items-center gap-2 lg:gap-3">
                <!-- Teleport target: page-level header content (right) -->
                <div id="header-right" class="flex items-center">
                    <slot name="header-right" />
                </div>
                <!-- Teleport target: app-level trailing content (search, etc.) -->
                <div id="header-end" class="flex items-center">
                    <slot name="header-end" />
                </div>
            </div>
        </div>
    </header>
</template>
