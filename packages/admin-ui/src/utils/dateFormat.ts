import { getModuleConfig } from '../composables/useModuleConfig';

/**
 * Format a date with full date and time.
 * Example: "Mon, Mar 25, 2026, 14:30"
 */
export const formatDateTime = (date: Date | string): string => {
    const { locale, timezone } = getModuleConfig();
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleString(locale, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: timezone,
    });
};

/**
 * Format just the time portion.
 * Example: "14:30"
 */
export const formatTime = (date: Date | string): string => {
    const { locale, timezone } = getModuleConfig();
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleTimeString(locale, {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: timezone,
    });
};

/**
 * Format date with weekday.
 * Example: "Mon, Mar 25"
 */
export const formatDate = (date: Date | string): string => {
    const { locale, timezone } = getModuleConfig();
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString(locale, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        timeZone: timezone,
    });
};

/**
 * Format date without weekday.
 * Example: "Mar 25, 2026"
 */
export const formatDateShort = (date: Date | string): string => {
    const { locale, timezone } = getModuleConfig();
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString(locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        timeZone: timezone,
    });
};

/**
 * Format date for HTML datetime-local input (YYYY-MM-DDTHH:mm).
 * Uses local timezone, not the configured timezone.
 */
export const formatDateTimeLocal = (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
};

/**
 * Check if a date is valid.
 */
export const isValidDate = (date: Date): boolean => {
    return date instanceof Date && !isNaN(date.getTime());
};
