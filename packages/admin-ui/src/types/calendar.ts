import type { EventInput } from '@fullcalendar/core';

export interface CalendarEvent extends EventInput {
    id?: string;
    title: string;
    start: string | Date;
    end?: string | Date;
    allDay?: boolean;
    backgroundColor?: string;
}

export interface HeaderToolbar {
    left?: string;
    center?: string;
    right?: string;
}

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
