import type { ComputedRef } from 'vue';
import { computed } from 'vue';

/**
 * User-friendly URL params to FullCalendar view types mapping
 */
export const viewUrlToCalendar: Record<string, string> = {
    month: 'dayGridMonth',
    week: 'timeGridWeek',
    workweek: 'timeGridWorkWeek',
    day: 'timeGridDay',
    agenda: 'listWeek',
};

/**
 * FullCalendar view types to user-friendly URL params mapping
 */
export const viewCalendarToUrl: Record<string, string> = {
    dayGridMonth: 'month',
    timeGridWeek: 'week',
    timeGridWorkWeek: 'workweek',
    timeGridDay: 'day',
    listWeek: 'agenda',
};

export interface UseCalendarViewPersistenceOptions {
    /**
     * Function to get the current view from URL query params
     */
    getQueryParam: () => string | undefined;
    /**
     * Function to set the view in URL query params
     */
    setQueryParam: (view: string) => void;
    /**
     * Default FullCalendar view type if none specified in URL
     * @default 'dayGridMonth'
     */
    defaultView?: string;
}

export interface UseCalendarViewPersistenceReturn {
    /**
     * Computed initial view for the calendar based on URL param
     */
    initialView: ComputedRef<string>;
    /**
     * Sync the current calendar view to the URL
     */
    syncViewToUrl: (calendarView: string) => void;
    /**
     * URL param to FullCalendar view mapping
     */
    viewUrlToCalendar: Record<string, string>;
    /**
     * FullCalendar view to URL param mapping
     */
    viewCalendarToUrl: Record<string, string>;
}

/**
 * Composable for persisting calendar view state to URL query params.
 * Router-agnostic - works with any routing library by accepting getter/setter functions.
 *
 * @example
 * ```typescript
 * // With Vue Router
 * const route = useRoute();
 * const router = useRouter();
 *
 * const { initialView, syncViewToUrl } = useCalendarViewPersistence({
 *   getQueryParam: () => route.query.view as string,
 *   setQueryParam: (view) => router.replace({ query: { ...route.query, view } }),
 * });
 *
 * // Use initialView.value for calendar's :initial-view prop
 * // Call syncViewToUrl(info.view.type) in datesSet handler
 * ```
 */
export function useCalendarViewPersistence(
    options: UseCalendarViewPersistenceOptions,
): UseCalendarViewPersistenceReturn {
    const {
        getQueryParam,
        setQueryParam,
        defaultView = 'dayGridMonth',
    } = options;

    const initialView = computed(() => {
        const urlView = getQueryParam();
        if (urlView && viewUrlToCalendar[urlView]) {
            return viewUrlToCalendar[urlView];
        }
        return defaultView;
    });

    const syncViewToUrl = (calendarView: string) => {
        const urlView = viewCalendarToUrl[calendarView] || calendarView;
        if (getQueryParam() !== urlView) {
            setQueryParam(urlView);
        }
    };

    return {
        initialView,
        syncViewToUrl,
        viewUrlToCalendar,
        viewCalendarToUrl,
    };
}
