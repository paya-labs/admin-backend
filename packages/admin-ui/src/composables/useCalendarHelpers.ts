import type {
    BusinessHoursConfig,
    BusinessHoursInput,
    CalendarHelpersReturn,
} from '../types';

export type { CalendarHelpersReturn } from '../types/calendar';

/**
 * Composable providing pure utility functions for calendar date formatting and validation.
 */
export function useCalendarHelpers(): CalendarHelpersReturn {
    /**
     * Format a date for display, respecting all-day vs timed events.
     */
    const formatEventTime = (date: Date | null, allDay: boolean): string => {
        if (!date) return '';
        if (allDay) {
            return date.toLocaleDateString([], {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
        }
        return date.toLocaleString([], {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });
    };

    /**
     * Format a date for datetime-local input (YYYY-MM-DDTHH:mm).
     */
    const formatDateForInput = (date: Date | null): string => {
        if (!date) return '';
        const pad = (n: number) => n.toString().padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
    };

    /**
     * Format a date for date-only input (YYYY-MM-DD) using local timezone.
     */
    const formatDateOnlyForInput = (date: Date | null): string => {
        if (!date) return '';
        const pad = (n: number) => n.toString().padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    };

    /**
     * Parse a date string from input elements.
     * Handles both date-only (YYYY-MM-DD) and datetime (YYYY-MM-DDTHH:mm) formats.
     */
    const parseDateFromInput = (value: string): Date | null => {
        if (!value) return null;
        // If it's a date-only string (YYYY-MM-DD), append time to parse as local timezone
        // This prevents off-by-one day errors caused by UTC interpretation
        if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
            return new Date(value + 'T00:00:00');
        }
        return new Date(value);
    };

    /**
     * Check if a date falls within configured business hours.
     */
    const isWithinBusinessHours = (
        date: Date,
        allDay: boolean,
        businessHours: BusinessHoursInput | false,
        selectConstraint?: 'businessHours' | string,
    ): boolean => {
        if (!businessHours || selectConstraint !== 'businessHours') {
            return true;
        }

        // All-day events are always allowed in business hours mode
        if (allDay) return true;

        const configs: BusinessHoursConfig[] = Array.isArray(businessHours)
            ? businessHours
            : typeof businessHours === 'object'
              ? [businessHours]
              : [];

        const dayOfWeek = date.getDay();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const timeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

        for (const config of configs) {
            if (config.daysOfWeek.includes(dayOfWeek)) {
                if (timeStr >= config.startTime && timeStr < config.endTime) {
                    return true;
                }
            }
        }

        return false;
    };

    return {
        formatEventTime,
        formatDateForInput,
        formatDateOnlyForInput,
        parseDateFromInput,
        isWithinBusinessHours,
    };
}
