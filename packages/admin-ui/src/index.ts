// Styles - bundled CSS with all Tailwind utilities
import './style.css';

// Components
import AppBadge from './components/AppBadge.vue';
import AppButton from './components/AppButton.vue';
import AppCalendar from './components/AppCalendar.vue';
import AppCard from './components/AppCard.vue';
import AppEditor from './components/AppEditor.vue';
import AppForm from './components/AppForm.vue';
import AppHeader from './components/AppHeader.vue';
import AppIcon from './components/AppIcon.vue';
import AppInput from './components/AppInput.vue';
import AppModal from './components/AppModal.vue';
import AppPagination from './components/AppPagination.vue';
import AppSelect from './components/AppSelect.vue';
import AppSidebar from './components/AppSidebar.vue';
import AppTable from './components/AppTable.vue';
import AppTextarea from './components/AppTextarea.vue';
import AppToastContainer from './components/AppToastContainer.vue';

// Layouts
import AdminLayout from './layouts/AdminLayout.vue';

// Composables
import { useApi } from './composables/useApi';
import { useAuth } from './composables/useAuth';
import { useCrud } from './composables/useCrud';
import { usePagination } from './composables/usePagination';
import { useSidebar } from './composables/useSidebar';
import { useTheme } from './composables/useTheme';
import { useToast } from './composables/useToast';

// Directives
import { vClickOutside } from './directives/clickOutside';

// Types
import type { App, Plugin } from 'vue';

// Re-export types
export * from './types';

// Re-export composable types
export type { ApiError, UseApiReturn } from './composables/useApi';
export type { UseAuthReturn } from './composables/useAuth';
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

// Re-export components
export {
    AdminLayout,
    AppBadge,
    AppButton,
    AppCalendar,
    AppCard,
    AppEditor,
    AppForm,
    AppHeader,
    AppIcon,
    AppInput,
    AppModal,
    AppPagination,
    AppSelect,
    AppSidebar,
    AppTable,
    AppTextarea,
    AppToastContainer,
};

// Re-export composables
export {
    useApi,
    useAuth,
    useCrud,
    usePagination,
    useSidebar,
    useTheme,
    useToast,
};

// Re-export directives
export { vClickOutside };

// Plugin for global registration
export interface AdminUIPluginOptions {
    prefix?: string;
}

export const AdminUIPlugin: Plugin<AdminUIPluginOptions[]> = {
    install(app: App, options: AdminUIPluginOptions = {}) {
        const prefix = options.prefix ?? 'App';

        // Register components globally
        app.component(`${prefix}Button`, AppButton);
        app.component(`${prefix}Input`, AppInput);
        app.component(`${prefix}Select`, AppSelect);
        app.component(`${prefix}Textarea`, AppTextarea);
        app.component(`${prefix}Badge`, AppBadge);
        app.component(`${prefix}Card`, AppCard);
        app.component(`${prefix}Table`, AppTable);
        app.component(`${prefix}Header`, AppHeader);
        app.component(`${prefix}Sidebar`, AppSidebar);
        app.component(`${prefix}Modal`, AppModal);
        app.component(`${prefix}Pagination`, AppPagination);
        app.component(`${prefix}Form`, AppForm);
        app.component(`${prefix}Icon`, AppIcon);
        app.component(`${prefix}ToastContainer`, AppToastContainer);
        app.component(`${prefix}Calendar`, AppCalendar);
        app.component(`${prefix}Editor`, AppEditor);
        app.component('AdminLayout', AdminLayout);

        // Register directives
        app.directive('click-outside', vClickOutside);
    },
};
