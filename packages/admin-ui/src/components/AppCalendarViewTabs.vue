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

const emit = defineEmits<{
    change: [view: string];
}>();

const handleSelectChange = (event: Event) => {
    const target = event.target as HTMLSelectElement;
    emit('change', target.value);
};
</script>

<template>
    <!-- Mobile: Select dropdown -->
    <select
        class="app-calendar-view-select md:hidden"
        :value="currentView"
        @change="handleSelectChange"
    >
        <option
            v-for="view in props.views"
            :key="view.value"
            :value="view.value"
        >
            {{ view.label }}
        </option>
    </select>

    <!-- Desktop: Tab buttons -->
    <div
        class="p-0.5 md:flex hidden rounded-lg border border-border bg-surface"
    >
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

<style>
.app-calendar-view-select {
    padding: 0.5rem 2rem 0.5rem 0.75rem;
    font-size: 0.875rem;
    font-weight: 500;
    border-radius: 0.5rem;
    border: 1px solid var(--color-border);
    background-color: var(--color-surface);
    color: var(--color-text);
    cursor: pointer;
    appearance: none;
    background-repeat: no-repeat;
    background-position: right 0.5rem center;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
}

.app-calendar-view-select:focus {
    outline: none;
    border-color: var(--color-primary-500);
    box-shadow: 0 0 0 2px
        color-mix(in oklch, var(--color-primary-500) 20%, transparent);
}

.dark .app-calendar-view-select {
    background-color: var(--color-surface);
    border-color: var(--color-border);
    color: var(--color-text);
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
}
</style>
