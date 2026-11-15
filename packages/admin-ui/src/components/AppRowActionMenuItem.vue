<script setup lang="ts">
import { RouterLink, type RouteLocationRaw } from 'vue-router';
import AppIcon from './AppIcon.vue';

// One entry in an AppRowActionMenu: an icon and a label. A <button> by
// default, a RouterLink with `to`, a plain link with `href`. max-md:py-3 gives
// every entry the 44px tap height the bottom sheet needs.
defineProps<{
    icon?: string;
    danger?: boolean;
    to?: RouteLocationRaw;
    href?: string;
}>();
</script>

<template>
    <component
        :is="to ? RouterLink : href ? 'a' : 'button'"
        :to="to"
        :href="href"
        :type="to || href ? undefined : 'button'"
        class="gap-3 px-3 py-2 text-sm max-md:py-3 flex w-full cursor-pointer items-center rounded-lg text-left hover:bg-surface-hover"
        :class="danger ? 'text-danger' : 'text-text'"
    >
        <AppIcon v-if="icon" :name="icon" size="sm" class="shrink-0" />
        <slot />
    </component>
</template>
