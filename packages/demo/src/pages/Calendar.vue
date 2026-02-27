<script setup>
import { AppCalendar } from '@paya-labs/admin-ui';
import events from './calendar-events.json';

/**
 * @param {{ event: { title: any; }; }} info
 */
function onEventClick(info) {
    console.log('Event clicked:', info.event.title);
}

/**
 * @param {{ dateStr: string; }} info
 */
function onDateClick(info) {
    console.log('Date clicked:', info.dateStr);
}
</script>

<template>
    <AppCalendar
        :events="events"
        height="800px"
        @event-click="onEventClick"
        @date-click="onDateClick"
    />
</template>
