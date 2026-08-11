// Styles - bundled CSS with all Tailwind utilities
import './style.css';

// Components
import AppBadge from './components/AppBadge.vue';
import AppButton from './components/AppButton.vue';
import AppCalendar from './components/AppCalendar.vue';
import AppCalendarAddEventModal from './components/AppCalendarAddEventModal.vue';
import AppCalendarEventForm from './components/AppCalendarEventForm.vue';
import AppCalendarEventModal from './components/AppCalendarEventModal.vue';
import AppCalendarNavigation from './components/AppCalendarNavigation.vue';
import AppCalendarViewTabs from './components/AppCalendarViewTabs.vue';
import AppCard from './components/AppCard.vue';
import AppCheckbox from './components/AppCheckbox.vue';
import AppColorInput from './components/AppColorInput.vue';
import AppCombobox from './components/AppCombobox.vue';
import AppDrawer from './components/AppDrawer.vue';
import AppEditor from './components/AppEditor.vue';
import AppForm from './components/AppForm.vue';
import AppHeader from './components/AppHeader.vue';
import AppIcon from './components/AppIcon.vue';
import AppInput from './components/AppInput.vue';
import AppModal from './components/AppModal.vue';
import AppMultiSelect from './components/AppMultiSelect.vue';
import AppPagination from './components/AppPagination.vue';
import AppRadio from './components/AppRadio.vue';
import AppSelect from './components/AppSelect.vue';
import AppSidebar from './components/AppSidebar.vue';
import AppTable from './components/AppTable.vue';
import AppTextarea from './components/AppTextarea.vue';
import AppToastContainer from './components/AppToastContainer.vue';

// Layouts
import AdminLayout from './layouts/AdminLayout.vue';

// Composables
import { getAuthToken, setAuthToken } from './composables/authToken';
import {
    getGlobalApiErrorHandler,
    setGlobalApiErrorHandler,
} from './composables/globalApiError';
import { useApi } from './composables/useApi';
import { useAsyncSearch } from './composables/useAsyncSearch';
import { useAuth } from './composables/useAuth';
import { BREAKPOINTS, useBreakpoint } from './composables/useBreakpoint';
import { useCalendarHelpers } from './composables/useCalendarHelpers';
import { useCalendarState } from './composables/useCalendarState';
import {
    useCalendarViewPersistence,
    viewCalendarToUrl,
    viewUrlToCalendar,
} from './composables/useCalendarViewPersistence';
import { useCrud } from './composables/useCrud';
import {
    getModuleConfig,
    provideModuleConfig,
    useModuleConfig,
} from './composables/useModuleConfig';
import { usePagination } from './composables/usePagination';
import { useSidebar } from './composables/useSidebar';
import { useTheme } from './composables/useTheme';
import { useToast } from './composables/useToast';

// Utils
import {
    formatDate,
    formatDateShort,
    formatDateTime,
    formatDateTimeLocal,
    formatTime,
    isValidDate,
    localDateTimeToUTC,
} from './utils/dateFormat';

// Directives
import { vClickOutside } from './directives/clickOutside';

// Types
import type { App, Plugin } from 'vue';
import type { ApiError } from './composables/useApi';

// Re-export types
export * from './types';

// Re-export composable types
export type { ApiError, UseApiReturn } from './composables/useApi';
export type {
    UseAsyncSearchOptions,
    UseAsyncSearchReturn,
} from './composables/useAsyncSearch';
export type { UseAuthReturn } from './composables/useAuth';
export type {
    BreakpointKey,
    UseBreakpointReturn,
} from './composables/useBreakpoint';
export type { CalendarHelpersReturn } from './composables/useCalendarHelpers';
export type { CalendarStateReturn } from './composables/useCalendarState';
export type {
    UseCalendarViewPersistenceOptions,
    UseCalendarViewPersistenceReturn,
} from './composables/useCalendarViewPersistence';
export type { UseCrudReturn } from './composables/useCrud';
export type {
    UsePaginationOptions,
    UsePaginationReturn,
} from './composables/usePagination';
export type { UseSidebarReturn } from './composables/useSidebar';
export type { UseThemeReturn } from './composables/useTheme';
export type { ShowToastOptions, UseToastReturn } from './composables/useToast';

// Re-export icon types
export type { IconDefinition } from './icons';

// Re-export component types
export type { ViewOption } from './components/AppCalendarViewTabs.vue';
export type { AppComboboxProps } from './components/AppCombobox.types';
export type {
    EditorAttachment,
    EditorToolbarItem,
} from './components/appEditorToolbar';

// Editor toolbar configuration
export {
    EDITOR_TOOLBAR_COMPACT,
    EDITOR_TOOLBAR_ITEMS,
} from './components/appEditorToolbar';

// Re-export components
export {
    AdminLayout,
    AppBadge,
    AppButton,
    AppCalendar,
    AppCalendarAddEventModal,
    AppCalendarEventForm,
    AppCalendarEventModal,
    AppCalendarNavigation,
    AppCalendarViewTabs,
    AppCard,
    AppCheckbox,
    AppColorInput,
    AppCombobox,
    AppDrawer,
    AppEditor,
    AppForm,
    AppHeader,
    AppIcon,
    AppInput,
    AppModal,
    AppMultiSelect,
    AppPagination,
    AppRadio,
    AppSelect,
    AppSidebar,
    AppTable,
    AppTextarea,
    AppToastContainer,
};

// Re-export composables
export {
    BREAKPOINTS,
    getAuthToken,
    getGlobalApiErrorHandler,
    getModuleConfig,
    provideModuleConfig,
    setAuthToken,
    setGlobalApiErrorHandler,
    useApi,
    useAsyncSearch,
    useAuth,
    useBreakpoint,
    useCalendarHelpers,
    useCalendarState,
    useCalendarViewPersistence,
    useCrud,
    useModuleConfig,
    usePagination,
    useSidebar,
    useTheme,
    useToast,
    viewCalendarToUrl,
    viewUrlToCalendar,
};

// Re-export utils
export {
    formatDate,
    formatDateShort,
    formatDateTime,
    formatDateTimeLocal,
    formatTime,
    isValidDate,
    localDateTimeToUTC,
};

// Re-export directives
export { vClickOutside };

// Plugin for global registration
export interface AdminUIPluginOptions {
    prefix?: string;
    onApiError?: (error: ApiError) => void;
}

export const AdminUIPlugin: Plugin<AdminUIPluginOptions[]> = {
    install(app: App, options: AdminUIPluginOptions = {}) {
        const prefix = options.prefix ?? 'App';

        if (options.onApiError) {
            setGlobalApiErrorHandler(options.onApiError);
        }

        // Register components globally
        app.component(`${prefix}Button`, AppButton);
        app.component(`${prefix}Input`, AppInput);
        app.component(`${prefix}Select`, AppSelect);
        app.component(`${prefix}MultiSelect`, AppMultiSelect);
        app.component(`${prefix}Textarea`, AppTextarea);
        app.component(`${prefix}Badge`, AppBadge);
        app.component(`${prefix}Card`, AppCard);
        app.component(`${prefix}Checkbox`, AppCheckbox);
        app.component(`${prefix}Radio`, AppRadio);
        app.component(`${prefix}Table`, AppTable);
        app.component(`${prefix}Header`, AppHeader);
        app.component(`${prefix}Sidebar`, AppSidebar);
        app.component(`${prefix}Modal`, AppModal);
        app.component(`${prefix}Pagination`, AppPagination);
        app.component(`${prefix}Form`, AppForm);
        app.component(`${prefix}Icon`, AppIcon);
        app.component(`${prefix}ToastContainer`, AppToastContainer);
        app.component(`${prefix}Calendar`, AppCalendar);
        app.component(`${prefix}ColorInput`, AppColorInput);
        app.component(`${prefix}Drawer`, AppDrawer);
        app.component(`${prefix}Editor`, AppEditor);
        app.component('AdminLayout', AdminLayout);

        // Register directives
        app.directive('click-outside', vClickOutside);
    },
};
