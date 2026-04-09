<script setup>
import {
    AppButton,
    AppCalendar,
    AppCalendarNavigation,
    AppCalendarViewTabs,
    AppInput,
} from '@paya-labs/admin-ui';
import { computed, ref } from 'vue';
import events from './calendar-events.json';

// Calendar ref to access exposed methods
const calendarRef = ref(null);

// Panel state
const panelOpen = ref(false);

// Category dropdown state
const selectedCategoryId = ref(null);

// Category dropdown options
const categoryOptions = [
    { value: 1, label: 'Category 1' },
    { value: 2, label: 'Category 2' },
    { value: 3, label: 'Category 3' },
];

// Computed properties that read from the calendar ref
const currentTitle = computed(() => calendarRef.value?.currentTitle ?? '');

// Map internal view to display view (3-day maps to week for UI display)
const currentView = computed(() => {
    const view = calendarRef.value?.currentView ?? 'timeGridWeek';
    // Map 3-day view back to week for the dropdown display
    if (view === 'timeGrid3Day') {
        return 'timeGridWeek';
    }
    return view;
});

// Navigation handlers
const handlePrev = () => calendarRef.value?.prev();
const handleNext = () => calendarRef.value?.next();
const handleToday = () => calendarRef.value?.today();
const handleViewChange = (view) => calendarRef.value?.changeView(view);

// Event handlers
function onEventClick(info) {
    console.log('Event clicked:', info.event.title);
}

function onDateClick(info) {
    console.log('Date clicked:', info.dateStr);
}
</script>

<template>
    <!-- Desktop: Navigation controls teleported to header (hidden on mobile) -->
    <Teleport to="#header-left">
        <div class="hidden items-center gap-2 md:flex">
            <AppCalendarNavigation
                @prev="handlePrev"
                @next="handleNext"
                @today="handleToday"
            />
            <h1 class="text-text text-lg font-semibold">
                {{ currentTitle }}
            </h1>
        </div>
    </Teleport>

    <Teleport to="#header-right">
        <div class="hidden md:block">
            <AppCalendarViewTabs
                :current-view="currentView"
                @change="handleViewChange"
            />
        </div>
    </Teleport>

    <!-- Fullscreen Calendar -->
    <AppCalendar
        ref="calendarRef"
        :events="events"
        initial-view="timeGridWeek"
        :header-toolbar="false"
        layout-mode="panel"
        :panel-open="panelOpen"
        panel-size="md"
        fullscreen
        header-offset="64px"
        hide-builtin-panel-header
        @update:panel-open="panelOpen = $event"
        @event-click="onEventClick"
        @date-click="onDateClick"
    >
        <!-- Mobile toolbar slot -->
        <template #mobile-toolbar>
            <AppCalendarNavigation
                :title="currentTitle"
                @prev="handlePrev"
                @next="handleNext"
                @today="handleToday"
            />
            <AppCalendarViewTabs
                :current-view="currentView"
                @change="handleViewChange"
            />
        </template>

        <!-- Custom panel content -->
        <template #panel="{ event, newEvent, mode, close }">
            <div class="space-y-4 p-4">
                <div class="flex items-center justify-between">
                    <h3 class="text-text text-lg font-semibold">
                        {{ mode === 'add' ? 'New Event' : 'Event Details' }}
                    </h3>
                    <AppButton
                        variant="ghost"
                        size="sm"
                        icon-only
                        @click="close"
                    >
                        <svg
                            class="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </AppButton>
                </div>

                <!-- Add event form -->
                <template v-if="mode === 'add'">
                    <AppInput
                        v-model="newEvent.title"
                        label="Event Title"
                        placeholder="Enter event title"
                    />

                    <div>
                        <p
                            class="text-muted mb-2 text-xs font-medium tracking-wide uppercase"
                        >
                            Category
                        </p>
                        <AppSelect
                            v-model="selectedCategoryId"
                            :options="categoryOptions"
                            required
                        />
                        <!-- Category pill with color -->
                        <div
                            v-if="selectedCategory"
                            class="mt-2 flex items-center gap-2"
                        >
                            <div
                                class="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
                                :style="{
                                    backgroundColor:
                                        selectedCategory.color + '20',
                                    color: selectedCategory.color,
                                }"
                            >
                                <span
                                    class="h-2 w-2 rounded-full"
                                    :style="{
                                        backgroundColor: selectedCategory.color,
                                    }"
                                ></span>
                                {{ selectedCategory.name }}
                            </div>
                            <span class="text-muted text-xs">
                                {{
                                    selectedCategory.defaultDurationMinutes
                                }}
                                min default
                            </span>
                        </div>
                    </div>

                    <div class="text-muted text-sm">
                        <p>
                            <span class="font-medium">Start:</span>
                            {{ newEvent.start?.toLocaleString() }}
                        </p>
                        <p v-if="newEvent.end">
                            <span class="font-medium">End:</span>
                            {{ newEvent.end?.toLocaleString() }}
                        </p>
                    </div>
                    <div class="flex gap-2 pt-4">
                        <AppButton variant="outline" @click="close">
                            Cancel
                        </AppButton>
                        <AppButton variant="primary"> Save Event </AppButton>
                    </div>
                </template>

                <!-- Event details -->
                <template v-else-if="event">
                    <div
                        class="h-2 w-full rounded"
                        :style="{ backgroundColor: event.backgroundColor }"
                    ></div>
                    <div class="space-y-2">
                        <h4 class="text-text text-xl font-semibold">
                            {{ event.title }}
                        </h4>
                        <p class="text-muted text-sm">
                            <span class="font-medium">Start:</span>
                            {{ event.start?.toLocaleString() }}
                        </p>
                        <p v-if="event.end" class="text-muted text-sm">
                            <span class="font-medium">End:</span>
                            {{ event.end?.toLocaleString() }}
                        </p>
                        <p v-if="event.allDay" class="text-muted text-sm">
                            All-day event
                        </p>
                    </div>
                    <div class="flex gap-2 pt-4">
                        <AppButton variant="outline" @click="close">
                            Close
                        </AppButton>
                        <AppButton variant="danger"> Delete </AppButton>
                    </div>
                </template>
            </div>
        </template>
    </AppCalendar>
</template>
