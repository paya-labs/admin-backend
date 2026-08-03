export type ButtonVariant =
    | 'primary'
    | 'secondary'
    | 'danger'
    | 'ghost'
    | 'outline';
export type ControlSize = 'sm' | 'md' | 'lg';

export type BadgeVariant =
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'danger';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
    id: number;
    message: string;
    variant: ToastVariant;
    title?: string;
    duration?: number;
}

export interface ToastOptions {
    title?: string;
    duration?: number;
}

export interface TableColumn {
    key: string;
    label: string;
    width?: string;
    sortable?: boolean;
    align?: 'left' | 'center' | 'right';
    format?: (value: unknown, row: unknown) => string;
}

export interface TableAction<T = unknown> {
    label: string;
    icon?: string;
    variant?: ButtonVariant;
    handler: (row: T) => void;
}

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export type DrawerSize = 'sm' | 'md' | 'lg' | 'xl';
export type DrawerPosition = 'left' | 'right';

export type InputType =
    | 'text'
    | 'password'
    | 'email'
    | 'number'
    | 'tel'
    | 'url'
    | 'search';

export interface SelectOption {
    value: string | number;
    label: string;
    disabled?: boolean;
}
