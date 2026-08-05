<script setup>
import { AppEditor, EDITOR_TOOLBAR_COMPACT } from '@paya-labs/admin-ui';
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
const compactContent = ref('');

const attachmentContent = ref('');
const attachments = ref([
    { id: 'demo-1', name: 'quarterly-report.pdf', size: 655360 },
]);
const uploadingNames = ref([]);

// In a real app: POST each file to your upload endpoint, then push a pill
// with the id/name/size returned by the server. Simulated here with a delay.
async function onAttach(files) {
    for (const file of files) {
        uploadingNames.value.push(file.name);
        await new Promise((resolve) => setTimeout(resolve, 800));
        uploadingNames.value = uploadingNames.value.filter(
            (n) => n !== file.name,
        );
        attachments.value.push({
            id: crypto.randomUUID(),
            name: file.name,
            size: file.size,
        });
    }
}

// In a real app: DELETE the attachment server-side first, then drop the pill.
function onRemoveAttachment(id) {
    attachments.value = attachments.value.filter((a) => a.id !== id);
}
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

        <!-- Compact Toolbar -->
        <section class="space-y-4">
            <h2 class="text-text text-lg font-semibold">Compact Toolbar</h2>
            <div class="border-border bg-surface rounded-lg border p-6">
                <div class="max-w-2xl space-y-4">
                    <p class="text-muted text-sm">
                        Pass <code>:toolbar="EDITOR_TOOLBAR_COMPACT"</code> for
                        the compact preset, or any custom array like
                        <code>:toolbar="['bold', 'italic']"</code>.
                    </p>
                    <AppEditor
                        v-model="compactContent"
                        label="Short Note"
                        placeholder="Only basic formatting available..."
                        :toolbar="EDITOR_TOOLBAR_COMPACT"
                    />
                </div>
            </div>
        </section>

        <!-- Attachments -->
        <section class="space-y-4">
            <h2 class="text-text text-lg font-semibold">Attachments</h2>
            <div class="border-border bg-surface rounded-lg border p-6">
                <div class="max-w-2xl space-y-4">
                    <p class="text-muted text-sm">
                        Add <code>'attach'</code> to the toolbar to show the
                        paperclip button (it is opt-in and never part of the
                        default toolbar). The editor never uploads anything: it
                        emits <code>@attach</code> with the selected
                        <code>File[]</code>, the app uploads them and controls
                        the pills via the <code>attachments</code> prop
                        (<code>EditorAttachment[]</code>). Use
                        <code>accept</code> to restrict selectable file types.
                        This demo simulates an upload with a short delay.
                    </p>
                    <AppEditor
                        v-model="attachmentContent"
                        label="Message"
                        placeholder="Write a message and attach files..."
                        accept=".pdf,image/*,video/mp4"
                        :toolbar="[...EDITOR_TOOLBAR_COMPACT, 'attach']"
                        :attachments="attachments"
                        @attach="onAttach"
                        @remove-attachment="onRemoveAttachment"
                    />
                    <p
                        v-if="uploadingNames.length"
                        class="text-muted text-sm"
                        role="status"
                    >
                        Uploading {{ uploadingNames.join(', ') }}…
                    </p>
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
