import { ref } from 'vue';
import type {
    CalendarStateOptions,
    CalendarStateReturn,
    NewEventData,
    PanelMode,
    SelectedEvent,
} from '../types';

export type { CalendarStateReturn } from '../types/calendar';

/**
 * Composable for managing calendar modal and panel state.
 */
export function useCalendarState(
    options: CalendarStateOptions,
): CalendarStateReturn {
    const { defaultEventColor } = options;

    // Modal visibility
    const showEventModal = ref(false);
    const showAddEventModal = ref(false);

    // Event data
    const selectedEvent = ref<SelectedEvent | null>(null);
    const newEventData = ref<NewEventData>({
        title: '',
        start: null,
        end: null,
        allDay: false,
        backgroundColor: defaultEventColor,
        frequency: 'none',
    });

    // Panel mode (add vs edit)
    const panelMode = ref<PanelMode>(null);

    // Validation state
    const validationError = ref<string | null>(null);

    /**
     * Open the event details modal with the given event.
     */
    const openEventModal = (event: SelectedEvent) => {
        selectedEvent.value = event;
        showEventModal.value = true;
    };

    /**
     * Close the event details modal.
     */
    const closeEventModal = () => {
        showEventModal.value = false;
    };

    /**
     * Open the add event modal with optional pre-filled dates.
     */
    const openAddEventModal = (
        start?: Date,
        end?: Date,
        allDay: boolean = false,
    ) => {
        const startDate = start || new Date();
        const endDate = end || new Date(startDate.getTime() + 10 * 60 * 1000); // 10 min default

        newEventData.value = {
            title: '',
            start: startDate,
            end: endDate,
            allDay,
            backgroundColor: defaultEventColor,
            frequency: 'none',
        };
        validationError.value = null;
        showAddEventModal.value = true;
    };

    /**
     * Close the add event modal.
     */
    const closeAddEventModal = () => {
        showAddEventModal.value = false;
    };

    /**
     * Reset the new event data to defaults.
     */
    const resetNewEventData = () => {
        newEventData.value = {
            title: '',
            start: null,
            end: null,
            allDay: false,
            backgroundColor: defaultEventColor,
            frequency: 'none',
        };
        validationError.value = null;
    };

    /**
     * Set a validation error message.
     */
    const setValidationError = (error: string | null) => {
        validationError.value = error;
    };

    /**
     * Initialize new event data from a date click.
     */
    const initNewEventFromDate = (
        date: Date,
        allDay: boolean,
        defaultDuration: number,
    ) => {
        const start = date;
        const end = new Date(start.getTime() + defaultDuration * 60 * 1000);
        newEventData.value = {
            title: '',
            start,
            end,
            allDay,
            backgroundColor: defaultEventColor,
            frequency: 'none',
        };
        validationError.value = null;
    };

    /**
     * Initialize new event data from a selection.
     */
    const initNewEventFromSelection = (
        start: Date,
        end: Date,
        allDay: boolean,
        defaultDuration: number,
    ) => {
        let adjustedEnd = end;
        // If start and end are the same (single click), add default duration
        if (start.getTime() === end.getTime()) {
            adjustedEnd = new Date(
                start.getTime() + defaultDuration * 60 * 1000,
            );
        }
        newEventData.value = {
            title: '',
            start,
            end: adjustedEnd,
            allDay,
            backgroundColor: defaultEventColor,
            frequency: 'none',
        };
        validationError.value = null;
    };

    return {
        showEventModal,
        showAddEventModal,
        selectedEvent,
        newEventData,
        panelMode,
        validationError,
        openEventModal,
        closeEventModal,
        openAddEventModal,
        closeAddEventModal,
        resetNewEventData,
        setValidationError,
        initNewEventFromDate,
        initNewEventFromSelection,
    };
}
