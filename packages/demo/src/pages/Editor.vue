<script setup>
import { AppEditor } from '@paya-labs/admin-ui';
import { ref } from 'vue';

const basicContent = ref('');
const placeholderContent = ref('');
const errorContent = ref('');
const prePopulatedContent = ref(
    '<h2>Welcome to the Editor</h2><p>This is <strong>pre-populated</strong> content with <em>various</em> formatting.</p><ul><li>First item</li><li>Second item</li></ul><blockquote><p>A sample blockquote</p></blockquote>',
);
const disabledContent = ref(
    '<p>This content <strong>cannot</strong> be edited.</p>',
);
const liveContent = ref('');
const markdownContent = ref('');
</script>

<template>
    <div class="space-y-8">
        <h1 class="text-text text-2xl font-bold">Rich Text Editor</h1>

        <!-- Basic Editor -->
        <section class="space-y-4">
            <h2 class="text-text text-lg font-semibold">Basic Editor</h2>
            <div class="border-border bg-surface rounded-lg border p-6">
                <div class="max-w-2xl">
                    <AppEditor
                        v-model="basicContent"
                        label="Article Body"
                        required
                    />
                </div>
            </div>
        </section>

        <!-- With Placeholder and Hint -->
        <section class="space-y-4">
            <h2 class="text-text text-lg font-semibold">
                With Placeholder &amp; Hint
            </h2>
            <div class="border-border bg-surface rounded-lg border p-6">
                <div class="max-w-2xl">
                    <AppEditor
                        v-model="placeholderContent"
                        label="Description"
                        placeholder="Start writing your article..."
                        hint="Use the toolbar to format your content. Markdown shortcuts are also supported."
                    />
                </div>
            </div>
        </section>

        <!-- With Validation Error -->
        <section class="space-y-4">
            <h2 class="text-text text-lg font-semibold">Validation Error</h2>
            <div class="border-border bg-surface rounded-lg border p-6">
                <div class="max-w-2xl">
                    <AppEditor
                        v-model="errorContent"
                        label="Content"
                        error="Content is required and must not be empty"
                        required
                    />
                </div>
            </div>
        </section>

        <!-- Pre-populated Content -->
        <section class="space-y-4">
            <h2 class="text-text text-lg font-semibold">
                Pre-populated Content
            </h2>
            <div class="border-border bg-surface rounded-lg border p-6">
                <div class="max-w-2xl">
                    <AppEditor
                        v-model="prePopulatedContent"
                        label="Edit Article"
                    />
                </div>
            </div>
        </section>

        <!-- Markdown Mode -->
        <section class="space-y-4">
            <h2 class="text-text text-lg font-semibold">Markdown Mode</h2>
            <div class="border-border bg-surface rounded-lg border p-6">
                <div class="max-w-2xl space-y-4">
                    <p class="text-muted text-sm">
                        Click the <strong>MD</strong> button at the far right of
                        the toolbar to toggle between rich text and markdown
                        editing.
                    </p>
                    <AppEditor
                        v-model="markdownContent"
                        label="Markdown Editor"
                        placeholder="Try toggling the MD button in the toolbar..."
                    />
                </div>
            </div>
        </section>

        <!-- Disabled State -->
        <section class="space-y-4">
            <h2 class="text-text text-lg font-semibold">Disabled</h2>
            <div class="border-border bg-surface rounded-lg border p-6">
                <div class="max-w-2xl">
                    <AppEditor
                        v-model="disabledContent"
                        label="Read Only Content"
                        disabled
                    />
                </div>
            </div>
        </section>

        <!-- Live HTML Output -->
        <section class="space-y-4">
            <h2 class="text-text text-lg font-semibold">
                Live HTML Output Preview
            </h2>
            <div class="border-border bg-surface rounded-lg border p-6">
                <div class="max-w-2xl space-y-4">
                    <AppEditor
                        v-model="liveContent"
                        label="Type something"
                        placeholder="Write here and see the HTML output below..."
                    />
                    <div
                        class="border-border bg-surface-hover rounded-md border p-4"
                    >
                        <p
                            class="text-muted mb-2 text-xs font-semibold uppercase"
                        >
                            HTML Output
                        </p>
                        <pre
                            class="text-text-secondary text-xs break-all whitespace-pre-wrap"
                            >{{ liveContent || '(empty)' }}</pre
                        >
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>
