<script setup lang="ts">
export interface ViewOption {
    value: string;
    label: string;
}

interface Props {
    currentView: string;
    views?: ViewOption[];
}

const props = withDefaults(defineProps<Props>(), {
    views: () => [
        { value: 'dayGridMonth', label: 'Month' },
        { value: 'timeGridWeek', label: 'Week' },
        { value: 'timeGridWorkWeek', label: 'Work Week' },
        { value: 'timeGridDay', label: 'Day' },
        { value: 'listWeek', label: 'Agenda' },
    ],
});

defineEmits<{
    change: [view: string];
}>();
</script>

<template>
    <div class="p-0.5 flex rounded-lg border border-border bg-surface">
        <button
            v-for="view in props.views"
            :key="view.value"
            type="button"
            :class="[
                'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                currentView === view.value
                    ? 'bg-surface-hover text-text'
                    : 'text-muted hover:text-text',
            ]"
            @click="$emit('change', view.value)"
        >
            {{ view.label }}
        </button>
    </div>
</template>
