import type { ControlSize } from '../types';

export interface AppComboboxProps<T> {
    modelValue?: T | T[] | null;
    fetcher: (_query: string) => Promise<T[]>;
    multiple?: boolean;
    getKey?: (_item: T) => string | number;
    getLabel?: (_item: T) => string;
    placeholder?: string;
    minChars?: number;
    debounceMs?: number;
    maxResults?: number;
    clearOnSelect?: boolean;
    error?: string;
    disabled?: boolean;
    minLengthHint?: string;
    size?: ControlSize;
}
