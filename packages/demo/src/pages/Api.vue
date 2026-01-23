<script setup>
import {
    AppBadge,
    AppButton,
    AppInput,
    AppTextarea,
    useApi,
    useToast,
} from '@paya-labs/admin-ui';
import { ref } from 'vue';

const toast = useToast();
const BASE_URL = 'https://jsonplaceholder.typicode.com';

// GET demo
const getApi = useApi({ baseUrl: BASE_URL });
const userId = ref(1);

const fetchUser = async () => {
    try {
        await getApi.get(`/users/${userId.value}`);
        toast.success('User fetched successfully');
    } catch {
        toast.error('Failed to fetch user');
    }
};

// POST demo
const postApi = useApi({ baseUrl: BASE_URL });
const newPost = ref({
    title: 'My New Post',
    body: 'This is the content of my post.',
    userId: 1,
});

const createPost = async () => {
    try {
        await postApi.post('/posts', newPost.value);
        toast.success('Post created successfully');
    } catch {
        toast.error('Failed to create post');
    }
};

// Error demo
const errorApi = useApi({ baseUrl: BASE_URL });

const triggerError = async () => {
    try {
        await errorApi.get('/users/99999');
    } catch {
        toast.error('Request failed (404 Not Found)');
    }
};

// Format JSON for display
const formatJson = (obj) => {
    if (!obj) return '';
    return JSON.stringify(obj, null, 2);
};
</script>

<template>
    <div class="space-y-8">
        <div>
            <h1 class="text-text text-2xl font-bold">API Client</h1>
            <p class="text-muted mt-1">
                The
                <code class="bg-surface-hover rounded px-1">useApi</code>
                composable for HTTP requests with loading/error states.
            </p>
        </div>

        <!-- GET Request Demo -->
        <section class="space-y-4">
            <h2 class="text-text text-lg font-semibold">GET Request</h2>
            <div class="border-border bg-surface rounded-lg border p-6">
                <div class="space-y-4">
                    <div class="flex items-end gap-4">
                        <div class="w-32">
                            <AppInput
                                v-model="userId"
                                label="User ID"
                                type="number"
                            />
                        </div>
                        <AppButton
                            variant="primary"
                            :loading="getApi.loading.value"
                            @click="fetchUser"
                        >
                            Fetch User
                        </AppButton>
                    </div>

                    <!-- Status badges -->
                    <div class="flex flex-wrap items-center gap-2">
                        <AppBadge
                            :variant="
                                getApi.loading.value ? 'warning' : 'secondary'
                            "
                        >
                            {{ getApi.loading.value ? 'Loading...' : 'Idle' }}
                        </AppBadge>
                        <AppBadge
                            v-if="getApi.status.value"
                            :variant="
                                getApi.status.value < 400 ? 'success' : 'danger'
                            "
                        >
                            Status: {{ getApi.status.value }}
                        </AppBadge>
                    </div>

                    <!-- Response -->
                    <div v-if="getApi.data.value" class="space-y-2">
                        <p class="text-text text-sm font-medium">Response:</p>
                        <pre
                            class="bg-surface-hover text-muted max-h-64 overflow-auto rounded-md p-4 text-xs"
                        ><code>{{ formatJson(getApi.data.value) }}</code></pre>
                    </div>

                    <!-- Code example -->
                    <pre
                        class="bg-surface-hover text-muted overflow-x-auto rounded-md p-4 text-xs"
                    ><code>const api = useApi({ baseUrl: 'https://api.example.com' });
await api.get(`/users/${userId}`);</code></pre>
                </div>
            </div>
        </section>

        <!-- POST Request Demo -->
        <section class="space-y-4">
            <h2 class="text-text text-lg font-semibold">POST Request</h2>
            <div class="border-border bg-surface rounded-lg border p-6">
                <div class="space-y-4">
                    <div class="grid max-w-md gap-4">
                        <AppInput
                            v-model="newPost.title"
                            label="Title"
                            placeholder="Post title"
                        />
                        <AppTextarea
                            v-model="newPost.body"
                            label="Body"
                            placeholder="Post content..."
                            :rows="3"
                        />
                    </div>

                    <AppButton
                        variant="primary"
                        :loading="postApi.loading.value"
                        @click="createPost"
                    >
                        Create Post
                    </AppButton>

                    <!-- Status badges -->
                    <div class="flex flex-wrap items-center gap-2">
                        <AppBadge
                            :variant="
                                postApi.loading.value ? 'warning' : 'secondary'
                            "
                        >
                            {{ postApi.loading.value ? 'Sending...' : 'Idle' }}
                        </AppBadge>
                        <AppBadge
                            v-if="postApi.status.value"
                            :variant="
                                postApi.status.value < 400
                                    ? 'success'
                                    : 'danger'
                            "
                        >
                            Status: {{ postApi.status.value }}
                        </AppBadge>
                    </div>

                    <!-- Response -->
                    <div v-if="postApi.data.value" class="space-y-2">
                        <p class="text-text text-sm font-medium">
                            Created (response includes generated ID):
                        </p>
                        <pre
                            class="bg-surface-hover text-muted max-h-48 overflow-auto rounded-md p-4 text-xs"
                        ><code>{{ formatJson(postApi.data.value) }}</code></pre>
                    </div>

                    <pre
                        class="bg-surface-hover text-muted overflow-x-auto rounded-md p-4 text-xs"
                    ><code>await api.post('/posts', { title, body, userId });</code></pre>
                </div>
            </div>
        </section>

        <!-- Error Handling Demo -->
        <section class="space-y-4">
            <h2 class="text-text text-lg font-semibold">Error Handling</h2>
            <div class="border-border bg-surface rounded-lg border p-6">
                <div class="space-y-4">
                    <p class="text-muted text-sm">
                        Request a non-existent resource to see error handling.
                    </p>

                    <AppButton
                        variant="danger"
                        :loading="errorApi.loading.value"
                        @click="triggerError"
                    >
                        Trigger 404 Error
                    </AppButton>

                    <!-- Status badges -->
                    <div class="flex flex-wrap items-center gap-2">
                        <AppBadge
                            :variant="
                                errorApi.loading.value ? 'warning' : 'secondary'
                            "
                        >
                            {{ errorApi.loading.value ? 'Loading...' : 'Idle' }}
                        </AppBadge>
                        <AppBadge
                            v-if="errorApi.status.value"
                            :variant="
                                errorApi.status.value < 400
                                    ? 'success'
                                    : 'danger'
                            "
                        >
                            Status: {{ errorApi.status.value }}
                        </AppBadge>
                        <AppBadge v-if="errorApi.error.value" variant="danger">
                            Error!
                        </AppBadge>
                    </div>

                    <!-- Error display -->
                    <div
                        v-if="errorApi.error.value"
                        class="rounded-md border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950"
                    >
                        <p class="text-danger text-sm font-medium">
                            {{ errorApi.error.value.message }}
                        </p>
                    </div>

                    <pre
                        class="bg-surface-hover text-muted overflow-x-auto rounded-md p-4 text-xs"
                    ><code>try {
    await api.get('/users/99999');
} catch (err) {
    console.error(api.error.value); // Error object
    console.error(api.status.value); // 404
}</code></pre>
                </div>
            </div>
        </section>

        <!-- API Reference -->
        <section class="space-y-4">
            <h2 class="text-text text-lg font-semibold">API Reference</h2>
            <div class="border-border bg-surface rounded-lg border p-6">
                <div class="space-y-6">
                    <div>
                        <h3 class="text-text mb-2 font-medium">Options</h3>
                        <div class="text-muted space-y-1 text-sm">
                            <p>
                                <code class="bg-surface-hover rounded px-1"
                                    >baseUrl</code
                                >
                                - Base URL for all requests
                            </p>
                            <p>
                                <code class="bg-surface-hover rounded px-1"
                                    >headers</code
                                >
                                - Default headers for all requests
                            </p>
                            <p>
                                <code class="bg-surface-hover rounded px-1"
                                    >responseHandler</code
                                >
                                - Custom response parser
                            </p>
                            <p>
                                <code class="bg-surface-hover rounded px-1"
                                    >onError</code
                                >
                                - Global error callback
                            </p>
                        </div>
                    </div>

                    <div>
                        <h3 class="text-text mb-2 font-medium">State</h3>
                        <div class="text-muted space-y-1 text-sm">
                            <p>
                                <code class="bg-surface-hover rounded px-1"
                                    >data</code
                                >
                                - Response data (Ref)
                            </p>
                            <p>
                                <code class="bg-surface-hover rounded px-1"
                                    >error</code
                                >
                                - Error object if failed (Ref)
                            </p>
                            <p>
                                <code class="bg-surface-hover rounded px-1"
                                    >loading</code
                                >
                                - Loading state (Ref)
                            </p>
                            <p>
                                <code class="bg-surface-hover rounded px-1"
                                    >status</code
                                >
                                - HTTP status code (Ref)
                            </p>
                        </div>
                    </div>

                    <div>
                        <h3 class="text-text mb-2 font-medium">Methods</h3>
                        <div class="text-muted space-y-1 text-sm">
                            <p>
                                <code class="bg-surface-hover rounded px-1"
                                    >get(url, options?)</code
                                >
                                - GET request
                            </p>
                            <p>
                                <code class="bg-surface-hover rounded px-1"
                                    >post(url, body?, options?)</code
                                >
                                - POST request
                            </p>
                            <p>
                                <code class="bg-surface-hover rounded px-1"
                                    >put(url, body?, options?)</code
                                >
                                - PUT request
                            </p>
                            <p>
                                <code class="bg-surface-hover rounded px-1"
                                    >patch(url, body?, options?)</code
                                >
                                - PATCH request
                            </p>
                            <p>
                                <code class="bg-surface-hover rounded px-1"
                                    >del(url, options?)</code
                                >
                                - DELETE request
                            </p>
                            <p>
                                <code class="bg-surface-hover rounded px-1"
                                    >reset()</code
                                >
                                - Reset all state
                            </p>
                        </div>
                    </div>

                    <div>
                        <h3 class="text-text mb-2 font-medium">
                            Request Options
                        </h3>
                        <div class="text-muted space-y-1 text-sm">
                            <p>
                                <code class="bg-surface-hover rounded px-1"
                                    >params</code
                                >
                                - URL query parameters
                            </p>
                            <p>
                                <code class="bg-surface-hover rounded px-1"
                                    >headers</code
                                >
                                - Request-specific headers
                            </p>
                            <p>
                                <code class="bg-surface-hover rounded px-1"
                                    >signal</code
                                >
                                - AbortController signal
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>
