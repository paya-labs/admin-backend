import { ref, type Ref } from 'vue';
import type { Toast, ToastVariant, ToastOptions } from '../types';

export interface ShowToastOptions {
    message: string;
    variant?: ToastVariant;
    title?: string;
    duration?: number;
}

export interface UseToastReturn {
    toasts: Ref<Toast[]>;
    show: (options: ShowToastOptions | string) => number;
    success: (message: string, title?: string) => number;
    error: (message: string, title?: string) => number;
    warning: (message: string, title?: string) => number;
    info: (message: string, title?: string) => number;
    dismiss: (id: number) => void;
    dismissAll: () => void;
}

const toasts = ref<Toast[]>([]);
const timeouts = new Map<number, ReturnType<typeof setTimeout>>();

let nextId = 0;

export function useToast(): UseToastReturn {
    const show = (options: ShowToastOptions | string): number => {
        const id = nextId++;

        const toast: Toast =
            typeof options === 'string'
                ? {
                      id,
                      message: options,
                      variant: 'info',
                      duration: 3000,
                  }
                : {
                      id,
                      message: options.message,
                      variant: options.variant || 'info',
                      title: options.title,
                      duration: options.duration ?? 3000,
                  };

        toasts.value.push(toast);

        if (toast.duration && toast.duration > 0) {
            const timeout = setTimeout(() => {
                dismiss(id);
            }, toast.duration);
            timeouts.set(id, timeout);
        }

        return id;
    };

    const success = (message: string, title?: string): number => {
        return show({ message, title, variant: 'success' });
    };

    const error = (message: string, title?: string): number => {
        return show({ message, title, variant: 'error' });
    };

    const warning = (message: string, title?: string): number => {
        return show({ message, title, variant: 'warning' });
    };

    const info = (message: string, title?: string): number => {
        return show({ message, title, variant: 'info' });
    };

    const dismiss = (id: number): void => {
        const timeout = timeouts.get(id);
        if (timeout) {
            clearTimeout(timeout);
            timeouts.delete(id);
        }

        const index = toasts.value.findIndex((t) => t.id === id);
        if (index !== -1) {
            toasts.value.splice(index, 1);
        }
    };

    const dismissAll = (): void => {
        for (const timeout of timeouts.values()) {
            clearTimeout(timeout);
        }
        timeouts.clear();
        toasts.value = [];
    };

    return {
        toasts,
        show,
        success,
        error,
        warning,
        info,
        dismiss,
        dismissAll,
    };
}
