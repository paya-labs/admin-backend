<script setup lang="ts">
import type {
    CalendarApi,
    CalendarOptions,
    DateSelectArg,
    DatesSetArg,
    EventApi,
    EventClickArg,
    EventContentArg,
    EventDropArg,
} from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import type {
    DateClickArg,
    EventResizeDoneArg,
} from '@fullcalendar/interaction';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import FullCalendar from '@fullcalendar/vue3';
import { computed, onMounted, readonly, ref, useSlots, watch } from 'vue';
import { useBreakpoint } from '../composables/useBreakpoint';
import { useCalendarHelpers } from '../composables/useCalendarHelpers';
import { useCalendarState } from '../composables/useCalendarState';
import { useModuleConfig } from '../composables/useModuleConfig';
import type {
    BusinessHoursInput,
    ButtonText,
    CalendarEvent,
    CalendarLayoutMode,
    FrequencyOption,
    HeaderToolbar,
    NewEventData,
    PanelSize,
    SelectAllowFunc,
    SelectedEvent,
} from '../types';
import AppCalendarAddEventModal from './AppCalendarAddEventModal.vue';
import AppCalendarEventModal from './AppCalendarEventModal.vue';

// Import calendar styles
import '../styles/calendar.css';

interface Props {
    events?: CalendarEvent[];
    initialView?: string;
    editable?: boolean;
    headerToolbar?: HeaderToolbar;
    height?: string | number;
    // Modal control props
    enableEventDetailsModal?: boolean;
    enableCreateEventModal?: boolean;
    enableEventDeletion?: boolean;
    // Customization props
    frequencyOptions?: FrequencyOption[];
    defaultEventColor?: string;
    defaultEventDuration?: number; // in minutes
    // Time slot configuration
    slotMinTime?: string;
    slotMaxTime?: string;
    slotDuration?: string;
    slotHeight?: string; // Minimum CSS height for time slots (e.g., '3rem', '48px'); rows grow with slotDuration
    // Day configuration
    firstDay?: number;
    hiddenDays?: number[];
    weekends?: boolean;
    // Business hours and selection constraints
    businessHours?: BusinessHoursInput | false;
    selectConstraint?: 'businessHours' | string;
    selectAllow?: SelectAllowFunc;
    // View customization
    views?: Record<string, unknown>;
    buttonText?: ButtonText;
    // Modal sizes
    eventDetailsModalSize?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    addEventModalSize?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    // Layout mode
    layoutMode?: CalendarLayoutMode;
    panelOpen?: boolean;
    panelSize?: PanelSize;
    // Scroll preservation during panel transitions
    preserveScrollPosition?: boolean;
    // Fullscreen mode
    fullscreen?: boolean;
    headerOffset?: string; // CSS value, e.g., '64px' for header height
    hideBuiltinPanelHeader?: boolean;
    // Panel behavior
    panelForceView?: string; // e.g., 'timeGridWeek' - auto-switch when panel opens
    // Editing event overlay
    editingEvent?: CalendarEvent | null; // Temporary event to overlay during editing
    editingEventMode?: 'add' | 'replace'; // How to handle the editing event
    // Timezone
    timeZone?: string; // IANA timezone (e.g., 'Asia/Nicosia'). Defaults to module config timezone.
}

const props = withDefaults(defineProps<Props>(), {
    events: () => [],
    initialView: 'dayGridMonth',
    editable: true,
    headerToolbar: () => ({
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridWorkWeek,timeGridDay,listWeek',
    }),
    height: 700,
    enableEventDetailsModal: true,
    enableCreateEventModal: true,
    enableEventDeletion: true,
    frequencyOptions: () => [
        { value: 'none', label: 'Does not repeat' },
        { value: 'daily', label: 'Daily' },
        { value: 'weekly', label: 'Weekly' },
        { value: 'monthly', label: 'Monthly' },
        { value: 'yearly', label: 'Yearly' },
    ],
    defaultEventColor: '#4285f4',
    defaultEventDuration: 10,
    // Time slot defaults
    slotMinTime: '07:00:00',
    slotMaxTime: '21:00:00',
    slotDuration: '00:10:00',
    slotHeight: undefined,
    // Day configuration defaults
    firstDay: 1,
    hiddenDays: () => [],
    weekends: true,
    // Business hours and selection (undefined by default)
    businessHours: false,
    selectConstraint: undefined,
    selectAllow: undefined,
    // View customization (undefined by default)
    views: undefined,
    buttonText: undefined,
    // Modal sizes
    eventDetailsModalSize: 'sm',
    addEventModalSize: 'sm',
    // Layout mode
    layoutMode: 'modal',
    panelOpen: false,
    panelSize: 'md',
    // Scroll preservation
    preserveScrollPosition: true,
    // Fullscreen mode
    fullscreen: false,
    headerOffset: '0px',
    hideBuiltinPanelHeader: false,
    // Panel behavior
    panelForceView: undefined,
    // Editing event overlay
    editingEvent: null,
    editingEventMode: 'add',
    // Timezone
    timeZone: undefined,
});

const emit = defineEmits<{
    eventClick: [info: EventClickArg];
    dateClick: [info: DateClickArg];
    eventDrop: [info: EventDropArg];
    eventResize: [info: EventResizeDoneArg];
    select: [info: DateSelectArg];
    addEvent: [event: NewEventData];
    beforeAddEvent: [event: NewEventData, cancel: () => void];
    deleteEvent: [payload: { event: SelectedEvent; calendarEvent: EventApi }];
    datesSet: [info: DatesSetArg];
    'update:panelOpen': [value: boolean];
    panelClose: [];
}>();

const moduleConfig = useModuleConfig();
const calendarRef = ref<InstanceType<typeof FullCalendar> | null>(null);
const slots: ReturnType<typeof useSlots> = useSlots();

// Check if mobile toolbar slot is provided
const hasMobileToolbar = computed(() => !!slots['mobile-toolbar']);

// Slot rows scale with slotDuration so the 1.625rem (26px) min-height on
// .app-calendar-event-timed stays proportional for events >= 10 minutes;
// slotHeight acts as the floor for short slot durations.
const slotHeightStyle = computed(() => {
    const [hours = 0, minutes = 0] = props.slotDuration.split(':').map(Number);
    const proportionalPx = (hours * 60 + minutes) * 2.6; // 26px / 10min
    return {
        '--app-calendar-slot-height': `max(${props.slotHeight ?? '2rem'}, ${proportionalPx}px)`,
    };
});

// Use composables
const {
    showEventModal,
    showAddEventModal,
    selectedEvent,
    newEventData,
    panelMode,
    validationError,
    resetNewEventData,
    setValidationError,
    initNewEventFromDate,
    initNewEventFromSelection,
} = useCalendarState({ defaultEventColor: props.defaultEventColor });

const { isWithinBusinessHours } = useCalendarHelpers();

// Scroll preservation state
const savedScrollTime = ref<string | null>(null);

// Navigation state tracking
const currentTitle = ref('');
const currentView = ref(props.initialView);

// Mobile detection
const { isMobile } = useBreakpoint();

// Touch/swipe gesture state
const touchStart = ref<{ x: number; y: number; time: number } | null>(null);
const SWIPE_THRESHOLD = 50;
const SWIPE_TIME_LIMIT = 300; // ms

// Auto-switch to 3-day view on mobile after calendar initializes
onMounted(() => {
    if (isMobile.value) {
        // Small delay to ensure FullCalendar has initialized
        setTimeout(() => {
            const api = calendarRef.value?.getApi();
            if (api) {
                const currentViewType = api.view.type;
                if (
                    currentViewType === 'timeGridWeek' ||
                    currentViewType === 'timeGridWorkWeek'
                ) {
                    api.changeView('timeGrid3Day');
                }
            }
        }, 50);
    }
});

// Touch handlers for swipe navigation
const handleTouchStart = (e: TouchEvent) => {
    touchStart.value = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        time: Date.now(),
    };
};

const handleTouchEnd = (e: TouchEvent) => {
    if (!touchStart.value) return;

    const deltaX = e.changedTouches[0].clientX - touchStart.value.x;
    const deltaY = e.changedTouches[0].clientY - touchStart.value.y;
    const deltaTime = Date.now() - touchStart.value.time;

    // Only trigger if:
    // 1. Horizontal swipe is dominant (more horizontal than vertical)
    // 2. Swipe distance exceeds threshold
    // 3. Swipe was fast enough
    if (
        Math.abs(deltaX) > Math.abs(deltaY) &&
        Math.abs(deltaX) > SWIPE_THRESHOLD &&
        deltaTime < SWIPE_TIME_LIMIT
    ) {
        const api = calendarRef.value?.getApi();
        if (deltaX > 0) {
            api?.prev();
        } else {
            api?.next();
        }
    }

    touchStart.value = null;
};

// Merged events with editing overlay
const mergedEvents = computed(() => {
    if (!props.editingEvent) return props.events;

    const events = [...props.events];

    if (props.editingEventMode === 'replace') {
        const index = events.findIndex((e) => e.id === props.editingEvent!.id);
        if (index >= 0) {
            events[index] = props.editingEvent;
            return events;
        }
    }

    // Default: add mode - append the editing event
    events.push(props.editingEvent);
    return events;
});

// Save scroll position before panel changes
const saveScrollPosition = () => {
    const api = calendarRef.value?.getApi();
    if (!api) return;

    const scrollerEl = document.querySelector(
        '.fc-scroller-liquid-absolute',
    ) as HTMLElement | null;
    if (!scrollerEl) return;

    const scrollTop = scrollerEl.scrollTop;
    const slotsContainer = scrollerEl.querySelector('.fc-timegrid-slots');
    if (!slotsContainer) return;

    const slotElements = slotsContainer.querySelectorAll('tr[data-time]');
    if (slotElements.length === 0) return;

    // Find the slot closest to the current scroll position
    for (const slot of slotElements) {
        const slotEl = slot as HTMLElement;
        if (slotEl.offsetTop >= scrollTop) {
            const time = slotEl.getAttribute('data-time');
            if (time) {
                savedScrollTime.value = time;
                return;
            }
        }
    }

    // Fallback: use the last slot's time
    const lastSlot = slotElements[slotElements.length - 1] as HTMLElement;
    const lastTime = lastSlot.getAttribute('data-time');
    if (lastTime) {
        savedScrollTime.value = lastTime;
    }
};

// Restore scroll position
const restoreScrollPosition = () => {
    const api = calendarRef.value?.getApi();
    if (api && savedScrollTime.value) {
        api.scrollToTime(savedScrollTime.value);
        savedScrollTime.value = null;
    }
};

// Watch panelOpen for scroll preservation and animated resize
watch(
    () => props.panelOpen,
    (newVal, oldVal) => {
        if (newVal === oldVal) return;

        const api = calendarRef.value?.getApi();
        if (!api) return;

        // Force view change when panel opens
        if (newVal && props.panelForceView) {
            if (api.view.type !== props.panelForceView) {
                api.changeView(props.panelForceView);
            }
        }

        if (!props.preserveScrollPosition) return;

        saveScrollPosition();

        // Animate resize during panel transition (300ms animation)
        const startTime = performance.now();
        const animationDuration = 300;

        const animate = () => {
            api.updateSize();
            if (performance.now() - startTime < animationDuration) {
                requestAnimationFrame(animate);
            } else {
                api.updateSize();
                setTimeout(restoreScrollPosition, 50);
            }
        };

        requestAnimationFrame(animate);
    },
);

// Panel size class
const panelSizeClass = computed(() => {
    const sizeMap: Record<PanelSize, string> = {
        sm: 'app-calendar-panel--sm',
        md: 'app-calendar-panel--md',
        lg: 'app-calendar-panel--lg',
    };
    return sizeMap[props.panelSize || 'md'];
});

// Close panel helper
const closePanel = () => {
    emit('update:panelOpen', false);
    emit('panelClose');
    panelMode.value = null;
};

const handleEventClick = (info: EventClickArg) => {
    selectedEvent.value = {
        id: info.event.id,
        title: info.event.title,
        start: info.event.start,
        end: info.event.end,
        allDay: info.event.allDay,
        backgroundColor: info.event.backgroundColor || props.defaultEventColor,
    };

    if (props.layoutMode === 'panel') {
        panelMode.value = 'edit';
        emit('update:panelOpen', true);
    } else if (props.enableEventDetailsModal) {
        showEventModal.value = true;
    }
    emit('eventClick', info);
};

const handleDateClick = (info: DateClickArg) => {
    // Check if click is within allowed time based on selectConstraint
    if (
        !isWithinBusinessHours(
            info.date,
            info.allDay,
            props.businessHours,
            props.selectConstraint,
        )
    ) {
        emit('dateClick', info);
        return; // Don't open modal for clicks outside business hours
    }

    initNewEventFromDate(info.date, info.allDay, props.defaultEventDuration);

    if (props.layoutMode === 'panel') {
        panelMode.value = 'add';
        emit('update:panelOpen', true);
    } else if (props.enableCreateEventModal) {
        showAddEventModal.value = true;
    }
    emit('dateClick', info);
};

const handleSelect = (info: DateSelectArg) => {
    initNewEventFromSelection(
        info.start,
        info.end,
        info.allDay,
        props.defaultEventDuration,
    );
    if (props.enableCreateEventModal) {
        showAddEventModal.value = true;
    }
    emit('select', info);
};

const handleAddEvent = () => {
    setValidationError(null);

    // Validate title
    if (!newEventData.value.title.trim()) {
        setValidationError('Title is required');
        return;
    }

    // Validate start date is set
    if (!newEventData.value.start) {
        setValidationError('Start date is required');
        return;
    }

    // Validate end > start for non-all-day events
    if (
        !newEventData.value.allDay &&
        newEventData.value.start &&
        newEventData.value.end
    ) {
        if (
            newEventData.value.end.getTime() <=
            newEventData.value.start.getTime()
        ) {
            setValidationError('End time must be after start time');
            return;
        }
    }

    const eventData = { ...newEventData.value };

    // Allow consumers to cancel the event creation
    let cancelled = false;
    emit('beforeAddEvent', eventData, () => {
        cancelled = true;
    });

    if (cancelled) {
        return;
    }

    // Add the event to the calendar
    const calendarApi = calendarRef.value?.getApi();
    if (calendarApi && eventData.start) {
        // For all-day events, use date strings without time
        let start: Date | string = eventData.start;
        let end: Date | string | undefined = eventData.end || undefined;

        if (eventData.allDay) {
            // Format as YYYY-MM-DD for all-day events
            const pad = (n: number) => n.toString().padStart(2, '0');
            start = `${eventData.start.getFullYear()}-${pad(eventData.start.getMonth() + 1)}-${pad(eventData.start.getDate())}`;
            if (eventData.end) {
                end = `${eventData.end.getFullYear()}-${pad(eventData.end.getMonth() + 1)}-${pad(eventData.end.getDate())}`;
            }
        }

        calendarApi.addEvent({
            id: crypto.randomUUID(),
            title: eventData.title,
            start,
            end,
            allDay: eventData.allDay,
            backgroundColor: eventData.backgroundColor,
            // TODO: eventData.frequency is captured but not used - recurring events not yet implemented
        });
    }

    emit('addEvent', eventData);
    showAddEventModal.value = false;
    resetNewEventData();
};

const handleDeleteEvent = () => {
    if (!selectedEvent.value) return;

    const calendarApi = calendarRef.value?.getApi();
    if (!calendarApi) return;

    const calendarEvent = calendarApi.getEventById(selectedEvent.value.id);
    if (!calendarEvent) return;

    emit('deleteEvent', { event: selectedEvent.value, calendarEvent });
    calendarEvent.remove();
    showEventModal.value = false;
    // Don't nullify selectedEvent immediately - let modal transition complete
    // It will be replaced when a new event is clicked
};

// Default view configurations
const defaultViews = computed(() => ({
    dayGridMonth: {
        dayMaxEventRows: 3,
    },
    timeGridWeek: {
        slotMinTime: props.slotMinTime,
        slotMaxTime: props.slotMaxTime,
        slotDuration: props.slotDuration,
        slotLabelInterval: props.slotDuration,
        slotLabelFormat: {
            hour: '2-digit' as const,
            minute: '2-digit' as const,
            hour12: false,
        },
        snapDuration: props.slotDuration,
    },
    timeGridWorkWeek: {
        type: 'timeGrid' as const,
        duration: { weeks: 1 },
        hiddenDays: [0, 6], // Hide Sunday (0) and Saturday (6)
        slotMinTime: props.slotMinTime,
        slotMaxTime: props.slotMaxTime,
        slotDuration: props.slotDuration,
        slotLabelInterval: props.slotDuration,
        slotLabelFormat: {
            hour: '2-digit' as const,
            minute: '2-digit' as const,
            hour12: false,
        },
        snapDuration: props.slotDuration,
    },
    timeGridDay: {
        slotMinTime: props.slotMinTime,
        slotMaxTime: props.slotMaxTime,
        slotDuration: props.slotDuration,
        slotLabelInterval: props.slotDuration,
        slotLabelFormat: {
            hour: '2-digit' as const,
            minute: '2-digit' as const,
            hour12: false,
        },
        snapDuration: props.slotDuration,
    },
    // Mobile-optimized 3-day view
    timeGrid3Day: {
        type: 'timeGrid' as const,
        duration: { days: 3 },
        slotMinTime: props.slotMinTime,
        slotMaxTime: props.slotMaxTime,
        slotDuration: props.slotDuration,
        slotLabelInterval: props.slotDuration,
        slotLabelFormat: {
            hour: '2-digit' as const,
            minute: '2-digit' as const,
            hour12: false,
        },
        snapDuration: props.slotDuration,
    },
    listWeek: {
        eventTimeFormat: {
            hour: '2-digit' as const,
            minute: '2-digit' as const,
            hour12: false,
        },
    },
}));

// Default button text
const defaultButtonText = {
    today: 'Today',
    dayGridMonth: 'Month',
    timeGridWeek: 'Week',
    timeGridWorkWeek: 'Work Week',
    timeGridDay: 'Day',
    listWeek: 'Agenda',
};

// Merge user views with defaults
const mergedViews = computed(() => {
    if (!props.views) return defaultViews.value;
    return {
        ...defaultViews.value,
        ...props.views,
    };
});

// Merge user button text with defaults
const mergedButtonText = computed(() => {
    if (!props.buttonText) return defaultButtonText;
    return {
        ...defaultButtonText,
        ...props.buttonText,
    };
});

const calendarOptions = computed<CalendarOptions>(() => ({
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
    timeZone: props.timeZone ?? moduleConfig?.timezone ?? 'local',
    initialView: props.initialView,
    editable: props.editable,
    headerToolbar: props.headerToolbar,
    events: mergedEvents.value,
    dayMaxEvents: true,
    nowIndicator: true,
    firstDay: props.firstDay,
    hiddenDays: props.hiddenDays,
    weekends: props.weekends,
    eventDisplay: 'block',
    height: props.fullscreen ? '100%' : props.height,
    buttonText: mergedButtonText.value,

    // Business hours and selection constraints
    businessHours: props.businessHours,
    selectConstraint: props.selectConstraint,
    selectAllow: props.selectAllow,

    // Callbacks
    eventClick: handleEventClick,
    dateClick: handleDateClick,
    eventDrop: (info: EventDropArg) => emit('eventDrop', info),
    eventResize: (info: EventResizeDoneArg) => emit('eventResize', info),
    select: handleSelect,
    selectable: props.editable, // Link selectable to editable
    datesSet: (info: DatesSetArg) => {
        currentTitle.value = info.view.title;
        currentView.value = info.view.type;
        emit('datesSet', info);
    },

    // Custom event content rendering
    eventContent: (arg: EventContentArg) => {
        const color = arg.event.backgroundColor || 'var(--color-primary-500)';
        const title = arg.event.title;

        // Escape HTML entities to prevent XSS
        const escapeHtml = (str: string) =>
            str
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
        const safeTitle = escapeHtml(title);

        // Validate color to prevent CSS injection (hex colors only, or CSS variable)
        const isValidColor = (c: string) =>
            /^#[0-9A-Fa-f]{3}([0-9A-Fa-f]{3})?$/.test(c) ||
            /^var\(--[\w-]+\)$/.test(c);
        const safeColor = isValidColor(color)
            ? color
            : 'var(--color-primary-500)';

        // All-day events: colored pill style (Google Calendar inspired)
        if (arg.event.allDay) {
            return {
                html: `
          <div class="app-calendar-event-allday" style="--event-color: ${safeColor}">
            <span class="app-calendar-event-title">${safeTitle}</span>
          </div>
        `,
            };
        }

        return {
            html: `
        <div class="app-calendar-event-timed" style="--event-color: ${safeColor}; height: 100%; display: flex; align-items: start">
          <span class="app-calendar-event-title">${safeTitle}</span>
        </div>
      `,
        };
    },

    // View-specific options (merged with user-provided views)
    views: mergedViews.value,
}));

// Expose calendar API and modal controls to parent
defineExpose({
    getApi: (): CalendarApi | undefined => calendarRef.value?.getApi(),
    showEventDetails: (event: SelectedEvent) => {
        selectedEvent.value = event;
        showEventModal.value = true;
    },
    showCreateEvent: (start?: Date, end?: Date, allDay = false) => {
        const startDate = start || new Date();
        const endDate =
            end ||
            new Date(
                startDate.getTime() + props.defaultEventDuration * 60 * 1000,
            );
        newEventData.value = {
            title: '',
            start: startDate,
            end: endDate,
            allDay,
            backgroundColor: props.defaultEventColor,
            frequency: 'none',
        };
        validationError.value = null;
        showAddEventModal.value = true;
    },
    closeModals: () => {
        showEventModal.value = false;
        showAddEventModal.value = false;
    },
    deleteEvent: handleDeleteEvent,
    scrollToEvent: (date: Date, paddingMinutes = 30) => {
        const api = calendarRef.value?.getApi();
        if (!api) return;

        api.gotoDate(date);

        // Extract hours/minutes in the configured timezone
        const tz = props.timeZone ?? moduleConfig?.timezone ?? 'UTC';
        const parts = new Intl.DateTimeFormat('en-US', {
            timeZone: tz,
            hour: 'numeric',
            minute: 'numeric',
            hour12: false,
        }).formatToParts(date);
        const get = (type: string) =>
            parseInt(parts.find((p) => p.type === type)?.value ?? '0');
        let h = get('hour');
        if (h === 24) h = 0;
        const totalMinutes = h * 60 + get('minute');

        const scrollMinutes = Math.max(0, totalMinutes - paddingMinutes);
        const hours = Math.floor(scrollMinutes / 60);
        const mins = scrollMinutes % 60;
        api.scrollToTime(
            `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:00`,
        );
    },

    // Navigation state (reactive, read-only)
    currentTitle: readonly(currentTitle),
    currentView: readonly(currentView),
    isMobile: readonly(isMobile),

    // Navigation methods
    prev: () => {
        calendarRef.value?.getApi()?.prev();
    },
    next: () => {
        calendarRef.value?.getApi()?.next();
    },
    today: () => {
        calendarRef.value?.getApi()?.today();
    },
    changeView: (view: string) => {
        const api = calendarRef.value?.getApi();
        if (!api) return;

        // On mobile, map week views to 3-day view for better readability
        if (
            isMobile.value &&
            (view === 'timeGridWeek' || view === 'timeGridWorkWeek')
        ) {
            api.changeView('timeGrid3Day');
        } else {
            api.changeView(view);
        }
    },
});
</script>

<template>
    <!-- Outer wrapper for mobile toolbar layout -->
    <div
        class="app-calendar-outer"
        :class="{
            'app-calendar-has-mobile-toolbar': hasMobileToolbar && fullscreen,
        }"
    >
        <!-- Mobile toolbar slot (visible only on mobile) -->
        <div v-if="hasMobileToolbar" class="app-calendar-mobile-toolbar">
            <slot name="mobile-toolbar" />
        </div>

        <div
            class="app-calendar-container"
            :class="{
                'app-calendar-panel-mode': layoutMode === 'panel',
                'app-calendar-fullscreen': fullscreen,
                'app-calendar-hide-panel-header': hideBuiltinPanelHeader,
            }"
            :style="
                fullscreen
                    ? { '--app-calendar-header-offset': headerOffset }
                    : {}
            "
        >
            <!-- Calendar area -->
            <div
                class="app-calendar-main"
                :class="{
                    'app-calendar-main--with-panel':
                        layoutMode === 'panel' && panelOpen,
                }"
            >
                <div
                    class="app-calendar-wrapper"
                    :style="slotHeightStyle"
                    @touchstart.passive="handleTouchStart"
                    @touchend.passive="handleTouchEnd"
                >
                    <FullCalendar
                        ref="calendarRef"
                        :options="calendarOptions"
                    />
                </div>
            </div>

            <!-- Side Panel (panel mode only) -->
            <Transition
                v-if="layoutMode === 'panel'"
                enter-active-class="app-calendar-panel-enter"
                leave-active-class="app-calendar-panel-leave"
                enter-from-class="app-calendar-panel-enter-from"
                leave-to-class="app-calendar-panel-leave-to"
            >
                <div
                    v-if="panelOpen"
                    class="app-calendar-panel"
                    :class="panelSizeClass"
                >
                    <!-- Panel Header -->
                    <div class="app-calendar-panel-header">
                        <slot
                            name="panel-header"
                            :event="selectedEvent"
                            :new-event="newEventData"
                            :mode="panelMode"
                        >
                            <h2 class="app-calendar-panel-title">
                                {{
                                    panelMode === 'add'
                                        ? 'Add Event'
                                        : 'Event Details'
                                }}
                            </h2>
                        </slot>
                        <button
                            type="button"
                            class="app-calendar-panel-close"
                            @click="closePanel"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            >
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>

                    <!-- Panel Body -->
                    <div class="app-calendar-panel-body">
                        <slot
                            name="panel"
                            :event="selectedEvent"
                            :new-event="newEventData"
                            :mode="panelMode"
                            :close="closePanel"
                        >
                            <!-- Default content placeholder -->
                            <div class="app-calendar-panel-default">
                                <p v-if="panelMode === 'add'">
                                    Configure the panel slot to show your add
                                    event form.
                                </p>
                                <p v-else>
                                    Configure the panel slot to show your event
                                    details.
                                </p>
                            </div>
                        </slot>
                    </div>

                    <!-- Panel Footer -->
                    <div
                        v-if="$slots['panel-footer']"
                        class="app-calendar-panel-footer"
                    >
                        <slot
                            name="panel-footer"
                            :event="selectedEvent"
                            :new-event="newEventData"
                            :mode="panelMode"
                            :close="closePanel"
                        />
                    </div>
                </div>
            </Transition>

            <!-- Modals (modal mode only) -->
            <template v-if="layoutMode === 'modal'">
                <!-- Event Details Modal -->
                <AppCalendarEventModal
                    v-model="showEventModal"
                    :event="selectedEvent"
                    :enable-deletion="enableEventDeletion"
                    :size="eventDetailsModalSize"
                    @delete="handleDeleteEvent"
                >
                    <template #default="eventModalProps">
                        <slot
                            name="event-modal"
                            :event="eventModalProps.event"
                            :format-time="eventModalProps.formatTime"
                            :close="eventModalProps.close"
                            :delete-event="eventModalProps.deleteEvent"
                        />
                    </template>
                    <template
                        v-if="!slots['event-modal']"
                        #footer="footerProps"
                    >
                        <slot
                            name="event-modal-footer"
                            :event="footerProps.event"
                            :close="footerProps.close"
                            :delete-event="footerProps.deleteEvent"
                        />
                    </template>
                </AppCalendarEventModal>

                <!-- Add Event Modal -->
                <AppCalendarAddEventModal
                    v-model="showAddEventModal"
                    :event-data="newEventData"
                    :frequency-options="frequencyOptions"
                    :validation-error="validationError"
                    :size="addEventModalSize"
                    @update:event-data="newEventData = $event"
                    @save="handleAddEvent"
                >
                    <template #default="addModalProps">
                        <slot
                            name="add-event-modal"
                            :event="addModalProps.event"
                            :close="addModalProps.close"
                            :save="addModalProps.save"
                        />
                    </template>
                    <template
                        v-if="!slots['add-event-modal']"
                        #footer="footerProps"
                    >
                        <slot
                            name="add-event-footer"
                            :close="footerProps.close"
                            :save="footerProps.save"
                        />
                    </template>
                </AppCalendarAddEventModal>
            </template>
        </div>
    </div>
</template>
