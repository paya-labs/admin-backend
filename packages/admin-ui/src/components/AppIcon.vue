<script setup lang="ts">
import { computed } from 'vue';
import { icons, type IconDefinition, type IconName } from '../icons';

type IconSize = 'sm' | 'md' | 'lg' | 'xl';

interface Props {
    name: IconName;
    size?: IconSize;
}

const props = withDefaults(defineProps<Props>(), {
    size: 'md',
});

// `name` is typed, but plain-JS callers and names cast from data can still miss.
const icon = computed<IconDefinition | undefined>(() => icons[props.name]);

const sizeClasses = computed(() => {
    const sizes: Record<IconSize, string> = {
        sm: 'h-4 w-4',
        md: 'h-5 w-5',
        lg: 'h-6 w-6',
        xl: 'h-8 w-8',
    };
    return sizes[props.size] || sizes.md;
});
</script>

<template>
    <!-- One root element, so a caller's class and attributes land on the icon -->
    <svg
        v-if="icon?.layers"
        :class="sizeClasses"
        :viewBox="icon.viewBox ?? '0 0 24 24'"
        aria-hidden="true"
    >
        <path
            v-for="layer in icon.layers"
            :key="layer.d"
            :fill="layer.fill"
            :d="layer.d"
        />
    </svg>
    <svg
        v-else-if="icon?.solid"
        :class="sizeClasses"
        fill="currentColor"
        :viewBox="icon.viewBox ?? '0 0 24 24'"
        aria-hidden="true"
    >
        <path fill-rule="evenodd" clip-rule="evenodd" :d="icon.path" />
    </svg>
    <svg
        v-else-if="icon"
        :class="sizeClasses"
        fill="none"
        :viewBox="icon.viewBox ?? '0 0 24 24'"
        stroke="currentColor"
        stroke-width="1.5"
        aria-hidden="true"
    >
        <path stroke-linecap="round" stroke-linejoin="round" :d="icon.path" />
        <path
            v-if="icon.path2"
            stroke-linecap="round"
            stroke-linejoin="round"
            :d="icon.path2"
            :transform="icon.path2Transform"
            :vector-effect="
                icon.path2Transform ? 'non-scaling-stroke' : undefined
            "
        />
    </svg>
    <span
        v-else
        :class="[sizeClasses, 'rounded inline-block bg-current opacity-20']"
        :title="`Icon '${name}' not found`"
    />
</template>
