<script setup lang="ts">
import { RouterLink, type RouteLocationRaw } from 'vue-router';
import type { IconName } from '../icons';
import AppIcon from './AppIcon.vue';

// One entry in an AppRowActionMenu: an icon and a label. A <button> by
// default, a RouterLink with `to`, a plain link with `href`. max-md:py-3 gives
// every entry the 44px tap height the bottom sheet needs.
defineProps<{
    icon?: IconName;
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
        class="hover:bg-surface-hover flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-left text-sm max-md:py-3"
        :class="danger ? 'text-danger' : 'text-text'"
    >
        <AppIcon v-if="icon" :name="icon" size="sm" class="shrink-0" />
        <slot />
    </component>
</template>
