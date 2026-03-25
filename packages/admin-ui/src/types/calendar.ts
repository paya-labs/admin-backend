import type { EventInput } from '@fullcalendar/core';

export interface CalendarEvent extends EventInput {
    id?: string;
    title: string;
    start: string | Date;
    end?: string | Date;
    allDay?: boolean;
    backgroundColor?: string;
}

export interface HeaderToolbarConfig {
    left?: string;
    center?: string;
    right?: string;
}

export type HeaderToolbar = HeaderToolbarConfig | false;

export interface EventColor {
    name: string;
    value: string;
}

export type EventFrequency = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface FrequencyOption {
    value: EventFrequency;
    label: string;
}

export interface SelectedEvent {
    id: string;
    title: string;
    start: Date | null;
    end: Date | null;
    allDay: boolean;
    backgroundColor: string;
}

export interface NewEventData {
    title: string;
    start: Date | null;
    end: Date | null;
    allDay: boolean;
    backgroundColor: string;
    frequency: EventFrequency;
}

export interface BusinessHoursConfig {
    daysOfWeek: number[];
    startTime: string;
    endTime: string;
}

export type BusinessHoursInput =
    | boolean
    | BusinessHoursConfig
    | BusinessHoursConfig[];

export type SelectAllowFunc = (selectInfo: {
    start: Date;
    end: Date;
    startStr: string;
    endStr: string;
    allDay: boolean;
}) => boolean;

export interface ButtonText {
    today?: string;
    month?: string;
    week?: string;
    day?: string;
    list?: string;
    dayGridMonth?: string;
    timeGridWeek?: string;
    timeGridWorkWeek?: string;
    timeGridDay?: string;
    listWeek?: string;
}

export type CalendarLayoutMode = 'modal' | 'panel';
export type PanelSize = 'sm' | 'md' | 'lg';
export type PanelMode = 'add' | 'edit' | null;

export interface CalendarStateOptions {
    defaultEventColor: string;
}

export interface CalendarStateReturn {
    showEventModal: import('vue').Ref<boolean>;
    showAddEventModal: import('vue').Ref<boolean>;
    selectedEvent: import('vue').Ref<SelectedEvent | null>;
    newEventData: import('vue').Ref<NewEventData>;
    panelMode: import('vue').Ref<PanelMode>;
    validationError: import('vue').Ref<string | null>;
    openEventModal: (event: SelectedEvent) => void;
    closeEventModal: () => void;
    openAddEventModal: (start?: Date, end?: Date, allDay?: boolean) => void;
    closeAddEventModal: () => void;
    resetNewEventData: () => void;
    setValidationError: (error: string | null) => void;
    initNewEventFromDate: (
        date: Date,
        allDay: boolean,
        defaultDuration: number,
    ) => void;
    initNewEventFromSelection: (
        start: Date,
        end: Date,
        allDay: boolean,
        defaultDuration: number,
    ) => void;
}

export interface CalendarHelpersReturn {
    formatEventTime: (date: Date | null, allDay: boolean) => string;
    formatDateForInput: (date: Date | null) => string;
    formatDateOnlyForInput: (date: Date | null) => string;
    parseDateFromInput: (value: string) => Date | null;
    isWithinBusinessHours: (
        date: Date,
        allDay: boolean,
        businessHours: BusinessHoursInput | false,
        selectConstraint?: 'businessHours' | string,
    ) => boolean;
}
