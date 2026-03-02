<script setup lang="ts">
import { computed, useId, onBeforeUnmount, watch } from 'vue';
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';

interface Props {
    modelValue?: string;
    label?: string;
    placeholder?: string;
    error?: string;
    hint?: string;
    required?: boolean;
    disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: '',
    label: '',
    placeholder: '',
    error: '',
    hint: '',
    required: false,
    disabled: false,
});

const emit = defineEmits<{
    'update:modelValue': [value: string];
}>();

const editorId = useId();

const hasError = computed(() => Boolean(props.error));

const editor = useEditor({
    content: props.modelValue,
    editable: !props.disabled,
    extensions: [
        StarterKit.configure({
            heading: { levels: [1, 2, 3] },
        }),
    ],
    editorProps: {
        attributes: {
            id: editorId,
            class: 'app-editor-content',
            role: 'textbox',
            'aria-multiline': 'true',
            'aria-label': props.label || 'Rich text editor',
            ...(props.placeholder ? { 'data-placeholder': props.placeholder } : {}),
        },
    },
    onUpdate: ({ editor: ed }) => {
        const html = ed.getHTML();
        emit('update:modelValue', html === '<p></p>' ? '' : html);
    },
});

watch(
    () => props.modelValue,
    (newValue) => {
        if (!editor.value) return;
        const currentHTML = editor.value.getHTML();
        const normalized = newValue || '';
        if (currentHTML !== normalized && !(normalized === '' && currentHTML === '<p></p>')) {
            editor.value.commands.setContent(normalized, { emitUpdate: false });
        }
    },
);

watch(
    () => props.disabled,
    (disabled) => {
        editor.value?.setEditable(!disabled);
    },
);

onBeforeUnmount(() => {
    editor.value?.destroy();
});

type ToolbarAction = {
    key: string;
    label: string;
    ariaLabel: string;
    icon: string;
    isActive: () => boolean;
    action: () => void;
};

type ToolbarGroup = ToolbarAction[];

const toolbarGroups = computed<ToolbarGroup[]>(() => {
    const ed = editor.value;
    if (!ed) return [];

    return [
        // Headings
        [
            {
                key: 'h1',
                label: 'H1',
                ariaLabel: 'Heading 1',
                icon: '',
                isActive: () => ed.isActive('heading', { level: 1 }),
                action: () => ed.chain().focus().toggleHeading({ level: 1 }).run(),
            },
            {
                key: 'h2',
                label: 'H2',
                ariaLabel: 'Heading 2',
                icon: '',
                isActive: () => ed.isActive('heading', { level: 2 }),
                action: () => ed.chain().focus().toggleHeading({ level: 2 }).run(),
            },
            {
                key: 'h3',
                label: 'H3',
                ariaLabel: 'Heading 3',
                icon: '',
                isActive: () => ed.isActive('heading', { level: 3 }),
                action: () => ed.chain().focus().toggleHeading({ level: 3 }).run(),
            },
        ],
        // Text decoration
        [
            {
                key: 'bold',
                label: 'B',
                ariaLabel: 'Bold',
                icon: 'font-bold',
                isActive: () => ed.isActive('bold'),
                action: () => ed.chain().focus().toggleBold().run(),
            },
            {
                key: 'italic',
                label: 'I',
                ariaLabel: 'Italic',
                icon: 'font-italic',
                isActive: () => ed.isActive('italic'),
                action: () => ed.chain().focus().toggleItalic().run(),
            },
            {
                key: 'underline',
                label: 'U',
                ariaLabel: 'Underline',
                icon: 'font-underline',
                isActive: () => ed.isActive('underline'),
                action: () => ed.chain().focus().toggleUnderline().run(),
            },
            {
                key: 'strike',
                label: 'S',
                ariaLabel: 'Strikethrough',
                icon: 'font-strike',
                isActive: () => ed.isActive('strike'),
                action: () => ed.chain().focus().toggleStrike().run(),
            },
        ],
        // Lists
        [
            {
                key: 'bulletList',
                label: 'UL',
                ariaLabel: 'Bullet list',
                icon: 'list-bullet',
                isActive: () => ed.isActive('bulletList'),
                action: () => ed.chain().focus().toggleBulletList().run(),
            },
            {
                key: 'orderedList',
                label: 'OL',
                ariaLabel: 'Ordered list',
                icon: 'list-ordered',
                isActive: () => ed.isActive('orderedList'),
                action: () => ed.chain().focus().toggleOrderedList().run(),
            },
        ],
        // Block
        [
            {
                key: 'blockquote',
                label: 'Quote',
                ariaLabel: 'Blockquote',
                icon: 'blockquote',
                isActive: () => ed.isActive('blockquote'),
                action: () => ed.chain().focus().toggleBlockquote().run(),
            },
        ],
    ];
});
</script>

<template>
    <div class="app-editor-wrapper w-full">
        <!-- Label -->
        <label
            v-if="label"
            :for="editorId"
            class="mb-1.5 text-sm font-medium block text-text"
        >
            {{ label }}
            <span v-if="required" class="ml-0.5 text-danger">*</span>
        </label>

        <!-- Editor container -->
        <div
            :class="[
                'rounded-md border overflow-hidden',
                'bg-input-bg',
                'transition-colors duration-[var(--transition-fast)]',
                'focus-within:border-transparent focus-within:ring-2 focus-within:ring-focus-ring',
                disabled ? 'cursor-not-allowed opacity-50' : '',
                hasError
                    ? 'border-danger focus-within:ring-danger'
                    : 'border-input-border',
            ]"
        >
            <!-- Toolbar -->
            <div
                v-if="editor"
                class="app-editor-toolbar flex flex-wrap items-center gap-1 border-b border-input-border bg-surface-hover px-2 py-1.5"
                role="toolbar"
                aria-label="Formatting options"
            >
                <template v-for="(group, groupIndex) in toolbarGroups" :key="groupIndex">
                    <div
                        v-if="groupIndex > 0"
                        class="mx-0.5 h-5 w-px bg-border-strong"
                        role="separator"
                    />
                    <button
                        v-for="btn in group"
                        :key="btn.key"
                        type="button"
                        :aria-label="btn.ariaLabel"
                        :aria-pressed="btn.isActive()"
                        :disabled="disabled"
                        :class="[
                            'inline-flex items-center justify-center',
                            'h-7 min-w-[28px] px-1.5',
                            'rounded text-xs font-semibold',
                            'transition-colors duration-[var(--transition-fast)]',
                            'disabled:cursor-not-allowed disabled:opacity-50',
                            btn.isActive()
                                ? 'bg-primary-500 text-inverse'
                                : 'text-text-secondary hover:bg-surface hover:text-text',
                        ]"
                        @click="btn.action()"
                    >
                        {{ btn.label }}
                    </button>
                </template>
            </div>

            <!-- Editor content -->
            <EditorContent :editor="editor" />
        </div>

        <!-- Footer: error / hint -->
        <div
            v-if="error || hint"
            class="mt-1.5 flex items-start"
        >
            <p
                :class="['text-sm', hasError ? 'text-danger' : 'text-muted']"
            >
                {{ error || hint }}
            </p>
        </div>
    </div>
</template>

<style>
/* Editor content area */
.app-editor-wrapper .tiptap {
    padding: 0.625rem 0.75rem;
    min-height: 10rem;
    outline: none;
    color: var(--color-text);
    font-size: 0.875rem;
    line-height: 1.625;
}

.app-editor-wrapper .tiptap p.is-editor-empty:first-child::before {
    content: attr(data-placeholder);
    float: left;
    color: var(--color-muted);
    pointer-events: none;
    height: 0;
}

/* Prose styling for editor content */
.app-editor-wrapper .tiptap h1 {
    font-size: 1.5rem;
    font-weight: 700;
    line-height: 1.3;
    margin: 0.75rem 0 0.5rem;
}

.app-editor-wrapper .tiptap h2 {
    font-size: 1.25rem;
    font-weight: 600;
    line-height: 1.3;
    margin: 0.75rem 0 0.5rem;
}

.app-editor-wrapper .tiptap h3 {
    font-size: 1.125rem;
    font-weight: 600;
    line-height: 1.3;
    margin: 0.75rem 0 0.5rem;
}

.app-editor-wrapper .tiptap h1:first-child,
.app-editor-wrapper .tiptap h2:first-child,
.app-editor-wrapper .tiptap h3:first-child {
    margin-top: 0;
}

.app-editor-wrapper .tiptap ul {
    list-style-type: disc;
    padding-left: 1.5rem;
    margin: 0.5rem 0;
}

.app-editor-wrapper .tiptap ol {
    list-style-type: decimal;
    padding-left: 1.5rem;
    margin: 0.5rem 0;
}

.app-editor-wrapper .tiptap li {
    margin: 0.125rem 0;
}

.app-editor-wrapper .tiptap blockquote {
    border-left: 3px solid var(--color-border-strong);
    padding-left: 1rem;
    margin: 0.5rem 0;
    color: var(--color-text-secondary);
    font-style: italic;
}

.app-editor-wrapper .tiptap p {
    margin: 0.25rem 0;
}

.app-editor-wrapper .tiptap p:first-child {
    margin-top: 0;
}

.app-editor-wrapper .tiptap p:last-child {
    margin-bottom: 0;
}
</style>
