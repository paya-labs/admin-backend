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
import AppModal from './AppModal.vue'
import AppButton from './AppButton.vue'

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

export interface EventColor {
  name: string
  value: string
}

export interface FrequencyOption {
  value: EventFrequency
  label: string
}

interface Props {
  events?: CalendarEvent[]
  initialView?: string
  editable?: boolean
  headerToolbar?: HeaderToolbar
  height?: string | number
  // Modal control props
  enableEventDetailsModal?: boolean
  enableCreateEventModal?: boolean
  // Customization props
  eventColors?: EventColor[]
  frequencyOptions?: FrequencyOption[]
  defaultEventColor?: string
  defaultEventDuration?: number // in minutes
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
  enableEventDetailsModal: true,
  enableCreateEventModal: true,
  eventColors: () => [
    {name: 'Tomato', value: '#d50000'},
    {name: 'Flamingo', value: '#e67c73'},
    {name: 'Tangerine', value: '#f4511e'},
    {name: 'Banana', value: '#f6bf26'},
    {name: 'Sage', value: '#33b679'},
    {name: 'Basil', value: '#0b8043'},
    {name: 'Peacock', value: '#039be5'},
    {name: 'Blueberry', value: '#4285f4'},
    {name: 'Lavender', value: '#7986cb'},
    {name: 'Grape', value: '#8e24aa'},
    {name: 'Graphite', value: '#616161'},
  ],
  frequencyOptions: () => [
    {value: 'none', label: 'Does not repeat'},
    {value: 'daily', label: 'Daily'},
    {value: 'weekly', label: 'Weekly'},
    {value: 'monthly', label: 'Monthly'},
    {value: 'yearly', label: 'Yearly'},
  ],
  defaultEventColor: '#4285f4',
  defaultEventDuration: 10,
})

const emit = defineEmits<{
  eventClick: [info: EventClickArg]
  dateClick: [info: DateClickArg]
  eventDrop: [info: EventDropArg]
  eventResize: [info: EventResizeDoneArg]
  select: [info: DateSelectArg]
  addEvent: [event: NewEventData]
  'beforeAddEvent': [event: NewEventData, cancel: () => void]
}>()

const calendarRef = ref<InstanceType<typeof FullCalendar> | null>(null)

// Modal state
export interface SelectedEvent {
  id: string
  title: string
  start: Date | null
  end: Date | null
  allDay: boolean
  backgroundColor: string
}

export type EventFrequency = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly'

export interface NewEventData {
  title: string
  start: Date | null
  end: Date | null
  allDay: boolean
  backgroundColor: string
  frequency: EventFrequency
}

const showEventModal = ref(false)
const selectedEvent = ref<SelectedEvent | null>(null)

// Add event modal state
const showAddEventModal = ref(false)
const newEventData = ref<NewEventData>({
  title: '',
  start: null,
  end: null,
  allDay: false,
  backgroundColor: props.defaultEventColor,
  frequency: 'none',
})

// Validation state
const validationError = ref<string | null>(null)

const handleEventClick = (info: EventClickArg) => {
  selectedEvent.value = {
    id: info.event.id,
    title: info.event.title,
    start: info.event.start,
    end: info.event.end,
    allDay: info.event.allDay,
    backgroundColor: info.event.backgroundColor || props.defaultEventColor,
  }
  if (props.enableEventDetailsModal) {
    showEventModal.value = true
  }
  emit('eventClick', info)
}

const formatEventTime = (date: Date | null, allDay: boolean): string => {
  if (!date) return ''
  if (allDay) {
    return date.toLocaleDateString([], {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})
  }
  return date.toLocaleString([], {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

const formatDateForInput = (date: Date | null): string => {
  if (!date) return ''
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

const parseDateFromInput = (value: string): Date | null => {
  if (!value) return null
  return new Date(value)
}

const handleDateClick = (info: DateClickArg) => {
  const start = info.date
  const end = new Date(start.getTime() + props.defaultEventDuration * 60 * 1000)
  newEventData.value = {
    title: '',
    start,
    end,
    allDay: info.allDay,
    backgroundColor: props.defaultEventColor,
    frequency: 'none',
  }
  validationError.value = null
  if (props.enableCreateEventModal) {
    showAddEventModal.value = true
  }
  emit('dateClick', info)
}

const handleSelect = (info: DateSelectArg) => {
  let end = info.end
  // If start and end are the same (single click), add default duration
  if (info.start.getTime() === info.end.getTime()) {
    end = new Date(info.start.getTime() + props.defaultEventDuration * 60 * 1000)
  }
  newEventData.value = {
    title: '',
    start: info.start,
    end,
    allDay: info.allDay,
    backgroundColor: props.defaultEventColor,
    frequency: 'none',
  }
  validationError.value = null
  if (props.enableCreateEventModal) {
    showAddEventModal.value = true
  }
  emit('select', info)
}

const handleAddEvent = () => {
  validationError.value = null

  // Validate title
  if (!newEventData.value.title.trim()) {
    validationError.value = 'Title is required'
    return
  }

  // Validate end > start for non-all-day events
  if (!newEventData.value.allDay && newEventData.value.start && newEventData.value.end) {
    if (newEventData.value.end.getTime() <= newEventData.value.start.getTime()) {
      validationError.value = 'End time must be after start time'
      return
    }
  }

  const eventData = {...newEventData.value}

  // Allow consumers to cancel the event creation
  let cancelled = false
  emit('beforeAddEvent', eventData, () => { cancelled = true })

  if (cancelled) {
    return
  }

  // Add the event to the calendar
  const calendarApi = calendarRef.value?.getApi()
  if (calendarApi && eventData.start) {
    // For all-day events, use date strings without time
    let start: Date | string = eventData.start
    let end: Date | string | undefined = eventData.end || undefined

    if (eventData.allDay) {
      // Format as YYYY-MM-DD for all-day events
      const pad = (n: number) => n.toString().padStart(2, '0')
      start = `${eventData.start.getFullYear()}-${pad(eventData.start.getMonth() + 1)}-${pad(eventData.start.getDate())}`
      if (eventData.end) {
        end = `${eventData.end.getFullYear()}-${pad(eventData.end.getMonth() + 1)}-${pad(eventData.end.getDate())}`
      }
    }

    calendarApi.addEvent({
      title: eventData.title,
      start,
      end,
      allDay: eventData.allDay,
      backgroundColor: eventData.backgroundColor,
    })
  }

  emit('addEvent', eventData)
  showAddEventModal.value = false
  // Reset form
  newEventData.value = {
    title: '',
    start: null,
    end: null,
    allDay: false,
    backgroundColor: props.defaultEventColor,
    frequency: 'none',
  }
}

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
  eventClick: handleEventClick,
  dateClick: handleDateClick,
  eventDrop: (info: EventDropArg) => emit('eventDrop', info),
  eventResize: (info: EventResizeDoneArg) => emit('eventResize', info),
  select: handleSelect,
  selectable: true,

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

// Expose calendar API and modal controls to parent
defineExpose({
  getApi: (): CalendarApi | undefined => calendarRef.value?.getApi(),
  showEventDetails: (event: SelectedEvent) => {
    selectedEvent.value = event
    showEventModal.value = true
  },
  showCreateEvent: (start?: Date, end?: Date, allDay = false) => {
    const startDate = start || new Date()
    const endDate = end || new Date(startDate.getTime() + props.defaultEventDuration * 60 * 1000)
    newEventData.value = {
      title: '',
      start: startDate,
      end: endDate,
      allDay,
      backgroundColor: props.defaultEventColor,
      frequency: 'none',
    }
    validationError.value = null
    showAddEventModal.value = true
  },
  closeModals: () => {
    showEventModal.value = false
    showAddEventModal.value = false
  },
})
</script>

<template>
  <div class="app-calendar-wrapper">
    <FullCalendar ref="calendarRef" :options="calendarOptions"/>

    <!-- Event Details Modal -->
    <AppModal
      v-model="showEventModal"
      :title="selectedEvent?.title || 'Event Details'"
      size="sm"
    >
      <!-- Slot for custom modal content, with selectedEvent and formatEventTime as slot props -->
      <slot name="event-modal" :event="selectedEvent" :format-time="formatEventTime" :close="() => showEventModal = false">
        <!-- Default content when no slot is provided -->
        <div v-if="selectedEvent" class="app-calendar-modal-content">
          <div class="app-calendar-modal-color-bar" :style="{ backgroundColor: selectedEvent.backgroundColor }" />

          <div class="app-calendar-modal-details">
            <div class="app-calendar-modal-row">
              <svg class="app-calendar-modal-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <div>
                <div class="app-calendar-modal-label">{{ selectedEvent.allDay ? 'Date' : 'Start' }}</div>
                <div class="app-calendar-modal-value">{{ formatEventTime(selectedEvent.start, selectedEvent.allDay) }}</div>
              </div>
            </div>

            <div v-if="selectedEvent.end && !selectedEvent.allDay" class="app-calendar-modal-row">
              <svg class="app-calendar-modal-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              <div>
                <div class="app-calendar-modal-label">End</div>
                <div class="app-calendar-modal-value">{{ formatEventTime(selectedEvent.end, false) }}</div>
              </div>
            </div>

            <div v-if="selectedEvent.allDay" class="app-calendar-modal-row">
              <svg class="app-calendar-modal-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2v20M2 12h20"/>
              </svg>
              <div>
                <div class="app-calendar-modal-label">Type</div>
                <div class="app-calendar-modal-value">All-day event</div>
              </div>
            </div>
          </div>
        </div>
      </slot>

      <template #footer>
        <slot name="event-modal-footer" :event="selectedEvent" :close="() => showEventModal = false">
          <!-- Default: no footer for event details modal -->
        </slot>
      </template>
    </AppModal>

    <!-- Add Event Modal -->
    <AppModal
      v-model="showAddEventModal"
      title="Add Event"
      size="sm"
    >
      <slot
        name="add-event-modal"
        :event="newEventData"
        :close="() => showAddEventModal = false"
        :save="handleAddEvent"
      >
        <!-- Default form content -->
        <div class="app-calendar-modal-content">
          <!-- Validation error -->
          <div v-if="validationError" class="app-calendar-validation-error" role="alert">
            {{ validationError }}
          </div>

          <div class="app-calendar-add-form">
            <label>
              <span class="app-calendar-modal-label">Title</span>
              <input v-model="newEventData.title" type="text" class="app-calendar-input" placeholder="Event title" />
            </label>

            <label class="app-calendar-checkbox">
              <input v-model="newEventData.allDay" type="checkbox" />
              <span>All-day event</span>
            </label>

            <!-- Date inputs for all-day events -->
            <template v-if="newEventData.allDay">
              <label>
                <span class="app-calendar-modal-label">Date</span>
                <input
                  type="date"
                  class="app-calendar-input"
                  :value="newEventData.start ? newEventData.start.toISOString().split('T')[0] : ''"
                  @input="newEventData.start = parseDateFromInput(($event.target as HTMLInputElement).value)"
                />
              </label>
            </template>

            <!-- Datetime inputs for timed events -->
            <template v-else>
              <label>
                <span class="app-calendar-modal-label">Start</span>
                <input
                  type="datetime-local"
                  class="app-calendar-input"
                  :value="formatDateForInput(newEventData.start)"
                  @input="newEventData.start = parseDateFromInput(($event.target as HTMLInputElement).value)"
                />
              </label>

              <label>
                <span class="app-calendar-modal-label">End</span>
                <input
                  type="datetime-local"
                  class="app-calendar-input"
                  :value="formatDateForInput(newEventData.end)"
                  @input="newEventData.end = parseDateFromInput(($event.target as HTMLInputElement).value)"
                />
              </label>
            </template>

            <label>
              <span class="app-calendar-modal-label">Repeat</span>
              <select v-model="newEventData.frequency" class="app-calendar-input app-calendar-select">
                <option v-for="opt in props.frequencyOptions" :key="opt.value" :value="opt.value">
                  {{ opt.label }}
                </option>
              </select>
            </label>

            <div class="app-calendar-color-picker">
              <span id="color-picker-label" class="app-calendar-modal-label">Color</span>
              <div
                class="app-calendar-color-options"
                role="radiogroup"
                aria-labelledby="color-picker-label"
              >
                <button
                  v-for="color in props.eventColors"
                  :key="color.value"
                  type="button"
                  role="radio"
                  class="app-calendar-color-swatch"
                  :class="{ 'app-calendar-color-swatch--selected': newEventData.backgroundColor === color.value }"
                  :style="{ backgroundColor: color.value }"
                  :title="color.name"
                  :aria-label="color.name"
                  :aria-checked="newEventData.backgroundColor === color.value"
                  @click="newEventData.backgroundColor = color.value"
                >
                  <svg v-if="newEventData.backgroundColor === color.value" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </slot>

      <template #footer>
        <slot name="add-event-footer" :close="() => showAddEventModal = false" :save="handleAddEvent">
          <AppButton variant="outline" @click="showAddEventModal = false">Cancel</AppButton>
          <AppButton variant="primary" @click="handleAddEvent">Add Event</AppButton>
        </slot>
      </template>
    </AppModal>
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

/* ==========================================================================
   EVENT DETAILS MODAL
   ========================================================================== */

.app-calendar-modal-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.app-calendar-modal-color-bar {
  height: 4px;
  border-radius: 2px;
  margin-bottom: 0.5rem;
}

.app-calendar-modal-details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.app-calendar-modal-row {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.app-calendar-modal-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--color-muted);
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.app-calendar-modal-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--color-muted);
  text-transform: uppercase;
  letter-spacing: 0.025em;
  margin-bottom: 0.125rem;
}

.app-calendar-modal-value {
  font-size: 0.875rem;
  color: var(--color-text);
}

/* ==========================================================================
   ADD EVENT FORM
   ========================================================================== */

.app-calendar-add-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.app-calendar-add-form label {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.app-calendar-input {
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  background: var(--color-surface);
  color: var(--color-text);
}

.app-calendar-input:focus {
  outline: none;
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 2px color-mix(in oklch, var(--color-primary-500) 20%, transparent);
}

.app-calendar-select {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  padding-right: 2rem;
}

.app-calendar-checkbox {
  flex-direction: row !important;
  align-items: center;
  gap: 0.5rem;
}

.app-calendar-validation-error {
  padding: 0.5rem 0.75rem;
  background: color-mix(in oklch, var(--color-red-500, #ef4444) 10%, transparent);
  border: 1px solid var(--color-red-500, #ef4444);
  border-radius: var(--radius-md);
  color: var(--color-red-700, #b91c1c);
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.app-calendar-color-picker {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.app-calendar-color-options {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.app-calendar-color-swatch {
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
  padding: 0;
}

.app-calendar-color-swatch:hover {
  transform: scale(1.1);
}

.app-calendar-color-swatch--selected {
  border-color: var(--color-text);
  box-shadow: 0 0 0 2px var(--color-surface);
}

.app-calendar-color-swatch svg {
  width: 1rem;
  height: 1rem;
  color: white;
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

/* Add event form in dark mode */
.dark .app-calendar-input {
  background: var(--color-gray-800);
  border-color: var(--color-border-strong);
}
</style>
