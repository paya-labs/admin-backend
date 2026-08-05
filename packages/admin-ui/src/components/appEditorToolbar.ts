export const EDITOR_TOOLBAR_ITEMS = [
    'h1',
    'h2',
    'h3',
    'bold',
    'italic',
    'underline',
    'strike',
    'bulletList',
    'orderedList',
    'blockquote',
    'markdown',
    'attach',
] as const;

export type EditorToolbarItem = (typeof EDITOR_TOOLBAR_ITEMS)[number];

export interface EditorAttachment {
    id: string;
    name: string;
    size?: number;
}

export const EDITOR_TOOLBAR_COMPACT: readonly EditorToolbarItem[] = [
    'bold',
    'italic',
    'underline',
    'bulletList',
    'orderedList',
];
