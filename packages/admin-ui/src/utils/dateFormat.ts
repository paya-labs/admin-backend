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
 * Uses the configured module timezone.
 */
export const formatDateTimeLocal = (date: Date | string): string => {
    const { timezone } = getModuleConfig();
    const d = typeof date === 'string' ? new Date(date) : date;

    const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    }).formatToParts(d);

    const get = (type: string) =>
        parts.find((p) => p.type === type)?.value ?? '';
    let hours = get('hour');
    if (hours === '24') hours = '00';

    return `${get('year')}-${get('month')}-${get('day')}T${hours}:${get('minute')}`;
};

/**
 * Convert date and time strings (in the module's configured timezone)
 * to a UTC ISO 8601 string.
 *
 * @param dateStr - Date in YYYY-MM-DD format (in configured timezone)
 * @param timeStr - Time in HH:mm format (in configured timezone)
 * @returns ISO 8601 UTC string (e.g., "2026-04-05T11:30:00.000Z")
 */
export const localDateTimeToUTC = (
    dateStr: string,
    timeStr: string,
): string => {
    const { timezone } = getModuleConfig();

    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false,
    });

    const getOffset = (utcMs: number): number => {
        const parts = formatter.formatToParts(new Date(utcMs));
        const g = (t: string) =>
            parseInt(parts.find((p) => p.type === t)?.value ?? '0');
        let h = g('hour');
        if (h === 24) h = 0;
        return (
            Date.UTC(
                g('year'),
                g('month') - 1,
                g('day'),
                h,
                g('minute'),
                g('second'),
            ) - utcMs
        );
    };

    const [y, m, d] = dateStr.split('-').map(Number);
    const [h, min] = timeStr.split(':').map(Number);
    const targetWallMs = Date.UTC(y, m - 1, d, h, min, 0);

    // Two-pass to handle DST transitions correctly
    const approxUtcMs = targetWallMs - getOffset(targetWallMs);
    const refinedUtcMs = targetWallMs - getOffset(approxUtcMs);

    return new Date(refinedUtcMs).toISOString();
};

/**
 * Check if a date is valid.
 */
export const isValidDate = (date: Date): boolean => {
    return date instanceof Date && !isNaN(date.getTime());
};
