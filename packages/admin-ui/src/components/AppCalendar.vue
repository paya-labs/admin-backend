<script setup lang="ts">
import {ref, computed} from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import type {
  CalendarOptions,
  EventClickArg,
  EventDropArg,
  DateSelectArg,
  EventContentArg,
  CalendarApi,
  EventInput,
} from '@fullcalendar/core'
import type {DateClickArg, EventResizeDoneArg} from '@fullcalendar/interaction'

export interface CalendarEvent extends EventInput {
  id?: string
  title: string
  start: string | Date
  end?: string | Date
  allDay?: boolean
  backgroundColor?: string
}

export interface HeaderToolbar {
  left?: string
  center?: string
  right?: string
}

interface Props {
  events?: CalendarEvent[]
  initialView?: string
  editable?: boolean
  headerToolbar?: HeaderToolbar
  height?: string | number
}

const props = withDefaults(defineProps<Props>(), {
  events: () => [],
  initialView: 'dayGridMonth',
  editable: true,
  headerToolbar: () => ({
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
  }),
  height: 700,
})

const emit = defineEmits<{
  eventClick: [info: EventClickArg]
  dateClick: [info: DateClickArg]
  eventDrop: [info: EventDropArg]
  eventResize: [info: EventResizeDoneArg]
  select: [info: DateSelectArg]
}>()

const calendarRef = ref<InstanceType<typeof FullCalendar> | null>(null)

const calendarOptions = computed<CalendarOptions>(() => ({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
  initialView: props.initialView,
  editable: props.editable,
  headerToolbar: props.headerToolbar,
  events: props.events,
  dayMaxEvents: true,
  nowIndicator: true,
  firstDay: 1,
  eventDisplay: 'block',
  height: props.height,
  buttonText: {
    today: 'Today',
  },

  // Callbacks
  eventClick: (info: EventClickArg) => emit('eventClick', info),
  dateClick: (info: DateClickArg) => emit('dateClick', info),
  eventDrop: (info: EventDropArg) => emit('eventDrop', info),
  eventResize: (info: EventResizeDoneArg) => emit('eventResize', info),
  select: (info: DateSelectArg) => emit('select', info),

  // Custom event content rendering
  eventContent: (arg: EventContentArg) => {
    const color = arg.event.backgroundColor || 'var(--color-primary-500)'
    const title = arg.event.title

    // All-day events: colored pill style (Google Calendar inspired)
    if (arg.event.allDay) {
      return {
        html: `
          <div class="app-calendar-event-allday" style="--event-color: ${color}">
            <span class="app-calendar-event-title">${title}</span>
          </div>
        `,
      }
    }

    // Timed events: dot + time + title style
    const startTime = arg.event.start
        ? arg.event.start.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', hour12: false})
        : ''

    return {
      html: `
        <div class="app-calendar-event-timed" style="--event-color: ${color}; height: 100%; display: flex; align-items: start">
          <span class="app-calendar-event-title">${title}</span>
        </div>
      `,
    }
  },

  // View-specific options
  views: {
    dayGridMonth: {
      dayMaxEventRows: 3,
    },
    timeGridWeek: {
      slotMinTime: '07:00:00',
      slotMaxTime: '21:00:00',
      slotDuration: '00:10:00',
      slotLabelInterval: '00:10:00',
      slotLabelFormat: {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      },
      snapDuration: '00:10:00',
    },
    timeGridDay: {
      slotMinTime: '07:00:00',
      slotMaxTime: '21:00:00',
      slotDuration: '00:10:00',
      slotLabelInterval: '00:10:00',
      slotLabelFormat: {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      },
      snapDuration: '00:10:00',
    },
    listWeek: {
      eventTimeFormat: {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      },
    },
  },
}))

// Expose calendar API to parent
defineExpose({
  getApi: (): CalendarApi | undefined => calendarRef.value?.getApi(),
})
</script>

<template>
  <div class="app-calendar-wrapper">
    <FullCalendar ref="calendarRef" :options="calendarOptions"/>
  </div>
</template>

<style>
/* ==========================================================================
   APP CALENDAR - FULLCALENDAR THEME
   Uses design system tokens from themes/base.css
   ========================================================================== */

/* ---------- wrapper card ---------- */
.app-calendar-wrapper {
  font-family: ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji';
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  padding: 1.25rem;
  color: var(--color-text);
}

/* ==========================================================================
   TOOLBAR
   ========================================================================== */

.app-calendar-wrapper .fc .fc-toolbar {
  margin-bottom: 1.25rem;
  gap: 0.75rem;
  flex-wrap: wrap;
}

/* Title */
.app-calendar-wrapper .fc .fc-toolbar-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-text);
  letter-spacing: -0.01em;
}

/* Button base - matches AppButton outline variant */
.app-calendar-wrapper .fc .fc-button {
  background: transparent;
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 500;
  padding: 0.4375rem 0.875rem;
  text-transform: none;
  box-shadow: none;
  transition: all var(--transition-fast);
  line-height: 1.25rem;
}

.app-calendar-wrapper .fc .fc-button:hover {
  background: var(--color-surface-hover);
  color: var(--color-text);
  border-color: var(--color-border);
}

.app-calendar-wrapper .fc .fc-button:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px var(--color-surface), 0 0 0 4px var(--color-focus-ring, var(--color-primary-500));
}

/* Active / pressed state — matches AppButton secondary variant */
.app-calendar-wrapper .fc .fc-button-active,
.app-calendar-wrapper .fc .fc-button.fc-button-active {
  background: var(--color-gray-200) !important;
  color: var(--color-text) !important;
  border-color: var(--color-gray-200) !important;
  box-shadow: none;
}

/* Button groups — connected pill shapes */
.app-calendar-wrapper .fc .fc-button-group {
  border-radius: var(--radius-md);
  overflow: hidden;
}

.app-calendar-wrapper .fc .fc-button-group > .fc-button {
  border-radius: 0;
}

.app-calendar-wrapper .fc .fc-button-group > .fc-button:first-child {
  border-top-left-radius: var(--radius-md);
  border-bottom-left-radius: var(--radius-md);
}

.app-calendar-wrapper .fc .fc-button-group > .fc-button:last-child {
  border-top-right-radius: var(--radius-md);
  border-bottom-right-radius: var(--radius-md);
}

.app-calendar-wrapper .fc .fc-button-group > .fc-button + .fc-button {
  margin-left: -1px;
}

/* Today button - matches AppButton primary variant */
.app-calendar-wrapper .fc .fc-today-button {
  background: var(--color-primary-600);
  color: white;
  border-color: var(--color-primary-600);
  font-weight: 500;
}

.app-calendar-wrapper .fc .fc-today-button:hover {
  background: var(--color-primary-700);
  border-color: var(--color-primary-700);
  color: white;
}

.app-calendar-wrapper .fc .fc-today-button:active {
  background: var(--color-primary-800);
  border-color: var(--color-primary-800);
}

.app-calendar-wrapper .fc .fc-today-button:disabled {
  display: none;
}

/* Prev / Next arrows */
.app-calendar-wrapper .fc .fc-prev-button,
.app-calendar-wrapper .fc .fc-next-button {
  padding: 0.4375rem 0.625rem;
}

/* ==========================================================================
   TABLE / GRID
   ========================================================================== */

.app-calendar-wrapper .fc table {
  border-collapse: separate;
  border-spacing: 0;
}

/* Scrollgrid borders - rounded corners */
.app-calendar-wrapper .fc .fc-scrollgrid {
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.app-calendar-wrapper .fc .fc-scrollgrid-section > td {
  border: none;
}

/* All day cell - week view */
.fc-timegrid-axis.fc-scrollgrid-shrink {
  border: 1px solid var(--color-border-strong);
}

.app-calendar-wrapper .fc th {
  background: transparent;
  border: none;
  border-collapse: collapse;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-muted);
}

.app-calendar-wrapper .fc th div.fc-scrollgrid-sync-inner {
  padding: 0.625rem 0;
}

/* Day grid cells */
.app-calendar-wrapper .fc .fc-daygrid-day {
  border: 1px solid var(--color-border);
  transition: background-color 0.1s ease;
}

.app-calendar-wrapper .fc .fc-daygrid-day:hover {
  background: var(--color-surface-hover);
}

/* Today highlight - only for month view day cells */
.app-calendar-wrapper .fc .fc-daygrid-day.fc-day-today {
  background: var(--color-primary-50) !important;
}

/* Remove today highlight from time grid (week/day views) - too prominent */
.app-calendar-wrapper .fc .fc-timegrid-col.fc-day-today {
  background: transparent !important;
}

/* Day numbers */
.app-calendar-wrapper .fc .fc-daygrid-day-number {
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  padding: 0.5rem;
}

/* Other-month days */
.app-calendar-wrapper .fc .fc-day-other .fc-daygrid-day-number {
  color: var(--color-gray-400);
}

.app-calendar-wrapper .fc .fc-day-other {
  background: var(--color-gray-50);
}

/* ==========================================================================
   EVENTS
   ========================================================================== */

.app-calendar-wrapper .fc .fc-event,
.app-calendar-wrapper .fc .fc-daygrid-event {
  border: none;
  border-radius: var(--radius-sm);
  padding: 0;
  cursor: pointer;
  transition: all var(--transition-fast);
  background: transparent;
}

.app-calendar-wrapper .fc .fc-event:hover {
  filter: brightness(0.95);
  box-shadow: var(--shadow-sm);
}

/* ---------- All-day events: Google Calendar pill style ---------- */
.app-calendar-event-allday {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.125rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1.4;
  color: white;
  background: var(--event-color, var(--color-primary-500));
  border-radius: 4px;
  min-height: 1.375rem;
  overflow: hidden;
}

.app-calendar-event-allday:hover {
  filter: brightness(0.9);
}

.app-calendar-event-allday .app-calendar-event-title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ---------- Timed events: dot + time + title style ---------- */
.app-calendar-event-timed {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1.25;
  color: var(--color-gray-700);
  background: color-mix(in oklch, var(--event-color, var(--color-primary-500)) 12%, var(--color-surface));
  border-left: 3px solid var(--event-color, var(--color-primary-500));
  border-radius: var(--radius-sm);
  min-height: 1.625rem;
  overflow: hidden;
}

.app-calendar-event-timed:hover {
  background: color-mix(in oklch, var(--event-color, var(--color-primary-500)) 18%, var(--color-surface));
}

.app-calendar-event-title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ---------- Time grid all-day section (Google Calendar style) ---------- */

/* Sticky header section - keeps column headers and all-day events fixed */
.app-calendar-wrapper .fc .fc-scrollgrid-section-sticky > * {
  background: var(--color-surface);
  z-index: 3;
}

/* All-day events area in week/day views - compact styling */
.app-calendar-wrapper .fc .fc-daygrid-body-natural .fc-daygrid-day-events {
  margin-bottom: 0.25rem;
}

/* All-day row container - keep it compact */
.app-calendar-wrapper .fc .fc-timegrid-axis-chunk {
  background: var(--color-surface);
}

/* All-day events in time grid view (week/day) */
.app-calendar-wrapper .fc .fc-timegrid .fc-daygrid-event {
  margin: 1px 2px;
}

/* Scrollable time grid body */
.app-calendar-wrapper .fc .fc-timegrid-body {
  overflow: auto;
}

/* All-day section label */
.app-calendar-wrapper .fc .fc-timegrid-axis-cushion {
  font-size: 0.6875rem;
  font-weight: 500;
  color: var(--color-muted);
  text-transform: uppercase;
}

/* "+N more" link */
.app-calendar-wrapper .fc .fc-daygrid-more-link {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-primary-600);
  padding: 0.125rem 0.5rem;
  border-radius: var(--radius-sm);
  transition: background 0.1s;
}

.app-calendar-wrapper .fc .fc-daygrid-more-link:hover {
  background: var(--color-primary-50);
  color: var(--color-primary-700);
}

/* ==========================================================================
   TIME GRID (week / day views)
   ========================================================================== */

.app-calendar-wrapper .fc .fc-timegrid-slot {
  height: 2rem;
  border-color: var(--color-gray-100);
}

.app-calendar-wrapper .fc .fc-timegrid-slot-label {
  font-size: 0.6875rem;
  font-weight: 500;
  color: var(--color-muted);
  text-transform: uppercase;
  padding-right: 0.75rem;
  vertical-align: top;
  padding-top: 0.25rem;
}

.app-calendar-wrapper .fc .fc-timegrid-col {
  border-color: var(--color-border);
}

.app-calendar-wrapper .fc .fc-timegrid-event {
  border-radius: var(--radius-sm);
  border: none !important;
  box-shadow: none;
  background: transparent !important;
}

.app-calendar-wrapper .fc .fc-timegrid-event .fc-event-main {
  background: transparent;
}

/* Ensure event harness doesn't add spacing issues */
.app-calendar-wrapper .fc .fc-timegrid-event-harness {
  margin: 1px 2px;
}

/* Now indicator line */
.app-calendar-wrapper .fc .fc-timegrid-now-indicator-line {
  border-width: 2px;
}

/* ==========================================================================
   LIST VIEW
   ========================================================================== */

.app-calendar-wrapper .fc .fc-list {
  border: none;
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--color-surface);
}

.app-calendar-wrapper .fc .fc-list-table {
  border: none;
}

.app-calendar-wrapper .fc .fc-list-day th {
  border: none;
}

.app-calendar-wrapper .fc .fc-list-event td {
  border: none;
}

.app-calendar-wrapper .fc .fc-list-day-cushion {
  background: var(--color-gray-50);
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-gray-700);
  padding: 0.625rem 1rem;
}

.app-calendar-wrapper .fc .fc-list-sticky .fc-list-day > * {
  background: var(--color-gray-50);
}

.app-calendar-wrapper .fc .fc-list-event td {
  padding: 0.5rem 1rem;
  font-size: 0.8125rem;
}

.app-calendar-wrapper .fc .fc-list-event:hover td {
  background: var(--color-surface-hover);
}

/* List view event styling - use native FullCalendar dot but ensure consistent look */
.app-calendar-wrapper .fc .fc-list-event-dot {
  display: none;
}

/* List view event bar - match timed event style */
.app-calendar-wrapper .fc .fc-list-event .fc-list-event-graphic {
  padding-right: 0.75rem;
}

.app-calendar-wrapper .fc .fc-list-event-title {
  font-weight: 500;
}

/* ==========================================================================
   POPOVER (more events)
   ========================================================================== */

.app-calendar-wrapper .fc .fc-popover {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  overflow: hidden;
}

.app-calendar-wrapper .fc .fc-popover-header {
  background: var(--color-gray-50);
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-gray-700);
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid var(--color-border);
}

.app-calendar-wrapper .fc .fc-popover-body {
  padding: 0.5rem;
}

/* ==========================================================================
   SCROLLBAR
   ========================================================================== */

.app-calendar-wrapper .fc ::-webkit-scrollbar {
  width: 6px;
}

.app-calendar-wrapper .fc ::-webkit-scrollbar-track {
  background: transparent;
}

.app-calendar-wrapper .fc ::-webkit-scrollbar-thumb {
  background: var(--color-gray-300);
  border-radius: 3px;
}

.app-calendar-wrapper .fc ::-webkit-scrollbar-thumb:hover {
  background: var(--color-gray-400);
}

/* ==========================================================================
   RESPONSIVE
   ========================================================================== */

@media (max-width: 768px) {
  .app-calendar-wrapper {
    padding: 0.75rem;
  }

  .app-calendar-wrapper .fc .fc-toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .app-calendar-wrapper .fc .fc-toolbar-chunk {
    display: flex;
    justify-content: center;
  }

  .app-calendar-wrapper .fc .fc-toolbar-title {
    font-size: 1rem;
    text-align: center;
  }

  .app-calendar-wrapper .fc .fc-button {
    font-size: 0.75rem;
    padding: 0.375rem 0.625rem;
  }
}

/* ==========================================================================
   DARK MODE
   Inherits semantic color overrides from .dark in base.css
   ========================================================================== */

.dark .app-calendar-wrapper {
  border-color: var(--color-border-strong);
}

/* Button base in dark mode - transparent with border */
.dark .app-calendar-wrapper .fc .fc-button {
  background: transparent;
  color: var(--color-text-secondary);
  border-color: var(--color-border);
}

.dark .app-calendar-wrapper .fc .fc-button:hover {
  background: var(--color-surface-hover);
  color: var(--color-text);
}

/* Active button in dark mode - matches AppButton secondary dark variant */
.dark .app-calendar-wrapper .fc .fc-button-active,
.dark .app-calendar-wrapper .fc .fc-button.fc-button-active {
  background: var(--color-gray-700) !important;
  color: var(--color-gray-100) !important;
  border-color: var(--color-gray-700) !important;
}

.dark .app-calendar-wrapper .fc .fc-button-active:hover,
.dark .app-calendar-wrapper .fc .fc-button.fc-button-active:hover {
  background: var(--color-gray-600) !important;
}

.dark .app-calendar-wrapper .fc .fc-daygrid-day {
  border-color: var(--color-border-strong);
}

.dark .app-calendar-wrapper .fc .fc-daygrid-day:hover {
  background: var(--color-gray-700);
}

/* Today highlight in dark mode - only for month view */
.dark .app-calendar-wrapper .fc .fc-daygrid-day.fc-day-today {
  background: color-mix(in oklch, var(--color-primary-500) 10%, transparent) !important;
}

/* Remove today highlight from time grid in dark mode */
.dark .app-calendar-wrapper .fc .fc-timegrid-col.fc-day-today {
  background: transparent !important;
}

.dark .app-calendar-wrapper .fc .fc-daygrid-day-number {
  color: var(--color-gray-300);
}

.dark .app-calendar-wrapper .fc .fc-day-other {
  background: var(--color-gray-900);
}

.dark .app-calendar-wrapper .fc th {
  color: var(--color-gray-600);
}

/* All-day events in dark mode */
.dark .app-calendar-event-allday {
  /* Keep the colored background, slightly reduce brightness */
  filter: brightness(0.9);
}

.dark .app-calendar-event-allday:hover {
  filter: brightness(0.8);
}

/* Timed events in dark mode */
.dark .app-calendar-event-timed {
  background: color-mix(in oklch, var(--event-color, var(--color-primary-500)) 20%, var(--color-gray-800));
  color: var(--color-gray-200);
}

.dark .app-calendar-event-timed:hover {
  background: color-mix(in oklch, var(--event-color, var(--color-primary-500)) 28%, var(--color-gray-800));
}

.dark .app-calendar-wrapper .fc .fc-list {
  border: 1px solid var(--color-border-strong);
}

.dark .app-calendar-wrapper .fc .fc-list-day-cushion {
  background: var(--color-surface);
  color: var(--color-gray-200);
}

.dark .app-calendar-wrapper .fc .fc-list-sticky .fc-list-day > * {
  background: var(--color-gray-700);
}

.dark .app-calendar-wrapper .fc .fc-list-event td {
  background: var(--color-gray-800);
  color: var(--color-gray-300);
}

/* "+N more" link in dark mode */
.dark .app-calendar-wrapper .fc .fc-daygrid-more-link {
  color: var(--color-primary-400);
}

.dark .app-calendar-wrapper .fc .fc-daygrid-more-link:hover {
  background: color-mix(in oklch, var(--color-primary-500) 15%, transparent);
  color: var(--color-primary-300);
}

/* Popover in dark mode */
.dark .app-calendar-wrapper .fc .fc-popover {
  background: var(--color-gray-800);
  border-color: var(--color-border-strong);
}

.dark .app-calendar-wrapper .fc .fc-popover-header {
  background: var(--color-gray-700);
  color: var(--color-gray-200);
  border-bottom-color: var(--color-border-strong);
}

.dark .app-calendar-wrapper .fc .fc-popover-body {
  background: var(--color-gray-800);
}

.dark .app-calendar-wrapper .fc .fc-timegrid-slot {
  border-color: var(--color-border-strong);
}

/* Sticky sections in dark mode */
.dark .app-calendar-wrapper .fc .fc-scrollgrid-section-sticky > * {
  background: var(--color-surface);
}

.dark .app-calendar-wrapper .fc .fc-timegrid-axis-chunk {
  background: var(--color-surface);
}

.dark .app-calendar-wrapper .fc .fc-timegrid-divider {
  background: var(--color-border-strong);
}

.dark .app-calendar-wrapper .fc ::-webkit-scrollbar-thumb {
  background: var(--color-gray-600);
}

.dark .app-calendar-wrapper .fc ::-webkit-scrollbar-thumb:hover {
  background: var(--color-gray-500);
}
</style>
