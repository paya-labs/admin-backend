<script setup>
import {
    AppButton,
    AppSelect,
    AppToastContainer,
    useToast,
} from '@paya-labs/admin-ui';
import { ref } from 'vue';

const toast = useToast();

// Position control
const position = ref('bottom-right');
const positionOptions = [
    { value: 'top-right', label: 'Top Right' },
    { value: 'top-left', label: 'Top Left' },
    { value: 'bottom-right', label: 'Bottom Right' },
    { value: 'bottom-left', label: 'Bottom Left' },
];

// Demo handlers
const showSuccess = () => {
    toast.success('Changes saved successfully!', 'Success');
};

const showError = () => {
    toast.error('Something went wrong. Please try again.', 'Error');
};

const showWarning = () => {
    toast.warning('Please review your input before submitting.');
};

const showInfo = () => {
    toast.info('A new version is available.');
};

const showCustomDuration = () => {
    toast.show({
        message: 'This toast will stay for 10 seconds',
        variant: 'info',
        title: 'Long Duration',
        duration: 10000,
    });
};

const showPersistent = () => {
    toast.show({
        message: 'This toast will not auto-dismiss. Click X to close.',
        variant: 'warning',
        title: 'Persistent Toast',
        duration: 0,
    });
};

const showMultiple = () => {
    toast.success('First notification');
    setTimeout(() => toast.info('Second notification'), 200);
    setTimeout(() => toast.warning('Third notification'), 400);
    setTimeout(() => toast.error('Fourth notification'), 600);
};

const clearAll = () => {
    toast.dismissAll();
};
</script>

<template>
    <div class="space-y-8">
        <div>
            <h1 class="text-text text-2xl font-bold">Toast Notifications</h1>
            <p class="text-muted mt-1">
                The
                <code class="bg-surface-hover rounded px-1">useToast</code>
                composable and
                <code class="bg-surface-hover rounded px-1"
                    >AppToastContainer</code
                >
                for notifications.
            </p>
        </div>

        <!-- Position Control -->
        <section class="space-y-4">
            <h2 class="text-text text-lg font-semibold">Position</h2>
            <div class="border-border bg-surface rounded-lg border p-6">
                <div class="max-w-xs">
                    <AppSelect
                        v-model="position"
                        label="Toast Position"
                        :options="positionOptions"
                    />
                </div>
            </div>
        </section>

        <!-- Variants -->
        <section class="space-y-4">
            <h2 class="text-text text-lg font-semibold">Variants</h2>
            <div class="border-border bg-surface rounded-lg border p-6">
                <div class="flex flex-wrap gap-3">
                    <AppButton variant="primary" @click="showSuccess">
                        Success
                    </AppButton>
                    <AppButton variant="danger" @click="showError">
                        Error
                    </AppButton>
                    <AppButton variant="outline" @click="showWarning">
                        Warning
                    </AppButton>
                    <AppButton variant="secondary" @click="showInfo">
                        Info
                    </AppButton>
                </div>

                <pre
                    class="bg-surface-hover text-muted mt-4 overflow-x-auto rounded-md p-4 text-xs"
                ><code>const toast = useToast();

toast.success('Saved!', 'Success');
toast.error('Failed!', 'Error');
toast.warning('Check input');
toast.info('New update');</code></pre>
            </div>
        </section>

        <!-- Duration Options -->
        <section class="space-y-4">
            <h2 class="text-text text-lg font-semibold">Duration Options</h2>
            <div class="border-border bg-surface rounded-lg border p-6">
                <div class="flex flex-wrap gap-3">
                    <AppButton variant="outline" @click="showCustomDuration">
                        10 Second Toast
                    </AppButton>
                    <AppButton variant="outline" @click="showPersistent">
                        Persistent Toast
                    </AppButton>
                </div>

                <pre
                    class="bg-surface-hover text-muted mt-4 overflow-x-auto rounded-md p-4 text-xs"
                ><code>// Custom duration (10 seconds)
toast.show({
    message: 'Long toast',
    duration: 10000,
});

// Persistent (no auto-dismiss)
toast.show({
    message: 'Click X to close',
    duration: 0,
});</code></pre>
            </div>
        </section>

        <!-- Multiple Toasts -->
        <section class="space-y-4">
            <h2 class="text-text text-lg font-semibold">Multiple Toasts</h2>
            <div class="border-border bg-surface rounded-lg border p-6">
                <div class="flex flex-wrap gap-3">
                    <AppButton variant="primary" @click="showMultiple">
                        Show Multiple
                    </AppButton>
                    <AppButton variant="ghost" @click="clearAll">
                        Clear All
                    </AppButton>
                </div>

                <pre
                    class="bg-surface-hover text-muted mt-4 overflow-x-auto rounded-md p-4 text-xs"
                ><code>// Dismiss all toasts
toast.dismissAll();

// Dismiss specific toast
const id = toast.info('Message');
toast.dismiss(id);</code></pre>
            </div>
        </section>

        <!-- Usage -->
        <section class="space-y-4">
            <h2 class="text-text text-lg font-semibold">Usage</h2>
            <div class="border-border bg-surface rounded-lg border p-6">
                <pre
                    class="bg-surface-hover text-muted overflow-x-auto rounded-md p-4 text-xs"
                ><code>// 1. Add container to your App.vue or layout (once)
&lt;AppToastContainer position="bottom-right" :max="5" /&gt;

// 2. Use the composable anywhere
import { useToast } from '@paya-labs/admin-ui';

const toast = useToast();

// Shorthand methods
toast.success('Saved!');
toast.error('Failed!');
toast.warning('Warning!');
toast.info('Info');

// Full options
toast.show({
    message: 'Message text',
    variant: 'success',  // success | error | warning | info
    title: 'Optional title',
    duration: 5000,      // ms, 0 = no auto-dismiss
});

// Control
toast.dismiss(id);    // Dismiss specific
toast.dismissAll();   // Clear all</code></pre>
            </div>
        </section>

        <!-- API Reference -->
        <section class="space-y-4">
            <h2 class="text-text text-lg font-semibold">API Reference</h2>
            <div class="border-border bg-surface rounded-lg border p-6">
                <div class="space-y-6">
                    <div>
                        <h3 class="text-text mb-2 font-medium">
                            AppToastContainer Props
                        </h3>
                        <div class="text-muted space-y-1 text-sm">
                            <p>
                                <code class="bg-surface-hover rounded px-1"
                                    >position</code
                                >
                                - 'top-right' | 'top-left' | 'bottom-right' |
                                'bottom-left' (default: 'bottom-right')
                            </p>
                            <p>
                                <code class="bg-surface-hover rounded px-1"
                                    >max</code
                                >
                                - Maximum visible toasts (default: 5)
                            </p>
                        </div>
                    </div>

                    <div>
                        <h3 class="text-text mb-2 font-medium">
                            useToast Methods
                        </h3>
                        <div class="text-muted space-y-1 text-sm">
                            <p>
                                <code class="bg-surface-hover rounded px-1"
                                    >show(options)</code
                                >
                                - Show toast with full options
                            </p>
                            <p>
                                <code class="bg-surface-hover rounded px-1"
                                    >success(message, title?)</code
                                >
                                - Show success toast
                            </p>
                            <p>
                                <code class="bg-surface-hover rounded px-1"
                                    >error(message, title?)</code
                                >
                                - Show error toast
                            </p>
                            <p>
                                <code class="bg-surface-hover rounded px-1"
                                    >warning(message, title?)</code
                                >
                                - Show warning toast
                            </p>
                            <p>
                                <code class="bg-surface-hover rounded px-1"
                                    >info(message, title?)</code
                                >
                                - Show info toast
                            </p>
                            <p>
                                <code class="bg-surface-hover rounded px-1"
                                    >dismiss(id)</code
                                >
                                - Dismiss specific toast
                            </p>
                            <p>
                                <code class="bg-surface-hover rounded px-1"
                                    >dismissAll()</code
                                >
                                - Clear all toasts
                            </p>
                        </div>
                    </div>

                    <div>
                        <h3 class="text-text mb-2 font-medium">
                            Toast Options
                        </h3>
                        <div class="text-muted space-y-1 text-sm">
                            <p>
                                <code class="bg-surface-hover rounded px-1"
                                    >message</code
                                >
                                - Toast message (required)
                            </p>
                            <p>
                                <code class="bg-surface-hover rounded px-1"
                                    >variant</code
                                >
                                - 'success' | 'error' | 'warning' | 'info'
                                (default: 'info')
                            </p>
                            <p>
                                <code class="bg-surface-hover rounded px-1"
                                    >title</code
                                >
                                - Optional title
                            </p>
                            <p>
                                <code class="bg-surface-hover rounded px-1"
                                    >duration</code
                                >
                                - Auto-dismiss in ms (default: 3000, 0 = never)
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Dynamic Toast Container -->
        <AppToastContainer :position="position" />
    </div>
</template>
