<script setup>
import {
    AppBadge,
    AppButton,
    AppInput,
    AppModal,
    AppTable,
    AppTextarea,
    useCrud,
    useToast,
} from '@flangofas/admin-ui';
import { onMounted, ref } from 'vue';

const toast = useToast();

const posts = useCrud({
    baseUrl: 'https://jsonplaceholder.typicode.com',
    resource: 'posts',
    pageSize: 5,
    autoRefresh: false, // JSONPlaceholder doesn't persist, so skip auto-refresh
});

// Form state
const showCreateModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const formData = ref({ title: '', body: '', userId: 1 });
const deleteId = ref(null);

// Fetch initial data
onMounted(() => {
    posts.fetchList();
});

// Handlers
const openCreate = () => {
    formData.value = { title: '', body: '', userId: 1 };
    showCreateModal.value = true;
};

const openEdit = async (post) => {
    formData.value = { ...post };
    showEditModal.value = true;
};

const openDelete = (id) => {
    deleteId.value = id;
    showDeleteModal.value = true;
};

const handleCreate = async () => {
    try {
        await posts.create(formData.value);
        showCreateModal.value = false;
        posts.items.value = [
            { ...formData.value, id: Date.now() },
            ...posts.items.value,
        ];
        toast.success('Post created successfully');
    } catch {
        toast.error('Failed to create post');
    }
};

const handleUpdate = async () => {
    try {
        await posts.update(formData.value.id, formData.value);
        showEditModal.value = false;
        posts.items.value = posts.items.value.map((p) =>
            p.id === formData.value.id ? { ...formData.value } : p,
        );
        toast.success('Post updated successfully');
    } catch {
        toast.error('Failed to update post');
    }
};

const handleDelete = async () => {
    try {
        await posts.remove(deleteId.value);
        showDeleteModal.value = false;
        posts.items.value = posts.items.value.filter(
            (p) => p.id !== deleteId.value,
        );
        toast.success('Post deleted successfully');
    } catch {
        toast.error('Failed to delete post');
    }
};

// Pagination handlers
const handlePageChange = (page) => {
    posts.pagination.goToPage(page);
    posts.fetchList();
};

// Table columns and actions
const tableColumns = [
    { key: 'id', label: 'ID', width: '80px' },
    { key: 'title', label: 'Title' },
    { key: 'body', label: 'Body' },
];

const tableActions = [
    { label: 'Edit', variant: 'ghost', handler: openEdit },
    {
        label: 'Delete',
        variant: 'danger',
        handler: (post) => openDelete(post.id),
    },
];
</script>

<template>
    <div class="space-y-8">
        <div>
            <h1 class="text-text text-2xl font-bold">CRUD Operations</h1>
            <p class="text-muted mt-1">
                The
                <code class="bg-surface-hover rounded px-1">useCrud</code>
                composable for complete resource management.
            </p>
        </div>

        <!-- Status Bar -->
        <section class="space-y-4">
            <div class="flex flex-wrap items-center gap-2">
                <AppBadge
                    :variant="posts.listLoading.value ? 'warning' : 'secondary'"
                >
                    {{
                        posts.listLoading.value
                            ? 'Loading list...'
                            : 'List idle'
                    }}
                </AppBadge>
                <AppBadge
                    :variant="posts.saving.value ? 'warning' : 'secondary'"
                >
                    {{ posts.saving.value ? 'Saving...' : 'Save idle' }}
                </AppBadge>
                <AppBadge
                    :variant="posts.deleting.value ? 'danger' : 'secondary'"
                >
                    {{ posts.deleting.value ? 'Deleting...' : 'Delete idle' }}
                </AppBadge>
                <AppBadge v-if="posts.error.value" variant="danger">
                    Error: {{ posts.error.value.message }}
                </AppBadge>
            </div>
        </section>

        <!-- Posts Table -->
        <section class="space-y-4">
            <div class="flex items-center justify-between">
                <h2 class="text-text text-lg font-semibold">Posts</h2>
                <AppButton variant="primary" @click="openCreate">
                    + New Post
                </AppButton>
            </div>

            <AppTable
                :columns="tableColumns"
                :rows="posts.items.value"
                :loading="posts.listLoading.value"
                :actions="tableActions"
                empty-message="No posts found"
            >
                <template #cell-title="{ value }">
                    <span class="line-clamp-1 max-w-xs">{{ value }}</span>
                </template>
                <template #cell-body="{ value }">
                    <span class="text-muted line-clamp-1 max-w-md">{{
                        value
                    }}</span>
                </template>
                <template #footer>
                    <div class="flex items-center justify-between">
                        <div class="text-muted text-sm">
                            Page {{ posts.pagination.page.value }} of
                            {{ posts.pagination.totalPages.value }}
                        </div>
                        <div class="flex gap-1">
                            <AppButton
                                variant="outline"
                                size="sm"
                                :disabled="!posts.pagination.hasPrevPage.value"
                                @click="
                                    handlePageChange(
                                        posts.pagination.page.value - 1,
                                    )
                                "
                            >
                                Previous
                            </AppButton>
                            <AppButton
                                variant="outline"
                                size="sm"
                                :disabled="!posts.pagination.hasNextPage.value"
                                @click="
                                    handlePageChange(
                                        posts.pagination.page.value + 1,
                                    )
                                "
                            >
                                Next
                            </AppButton>
                        </div>
                    </div>
                </template>
            </AppTable>
        </section>

        <!-- Code Example -->
        <section class="space-y-4">
            <h2 class="text-text text-lg font-semibold">Usage</h2>
            <div class="border-border bg-surface rounded-lg border p-6">
                <pre
                    class="bg-surface-hover text-muted overflow-x-auto rounded-md p-4 text-xs"
                ><code>import { useCrud } from '@flangofas/admin-ui';

const posts = useCrud({
    baseUrl: 'https://api.example.com',
    resource: 'posts',
    pageSize: 10,
});

// Fetch list
await posts.fetchList({ status: 'published' });

// CRUD operations
await posts.create({ title: 'New Post', body: '...' });
await posts.update(1, { title: 'Updated' });
await posts.remove(1);

// Access state
posts.items.value      // Current page items
posts.loading.value    // Any operation loading
posts.error.value      // Last error
posts.pagination       // Pagination composable</code></pre>
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
                                - API base URL
                            </p>
                            <p>
                                <code class="bg-surface-hover rounded px-1"
                                    >resource</code
                                >
                                - Resource endpoint name
                            </p>
                            <p>
                                <code class="bg-surface-hover rounded px-1"
                                    >pageSize</code
                                >
                                - Items per page (default: 10)
                            </p>
                            <p>
                                <code class="bg-surface-hover rounded px-1"
                                    >autoRefresh</code
                                >
                                - Refresh list after mutations (default: true)
                            </p>
                        </div>
                    </div>

                    <div>
                        <h3 class="text-text mb-2 font-medium">State</h3>
                        <div class="text-muted space-y-1 text-sm">
                            <p>
                                <code class="bg-surface-hover rounded px-1"
                                    >items</code
                                >
                                - Current page items
                            </p>
                            <p>
                                <code class="bg-surface-hover rounded px-1"
                                    >current</code
                                >
                                - Selected item from fetchOne
                            </p>
                            <p>
                                <code class="bg-surface-hover rounded px-1"
                                    >loading</code
                                >
                                - Any operation loading
                            </p>
                            <p>
                                <code class="bg-surface-hover rounded px-1"
                                    >listLoading</code
                                >
                                /
                                <code class="bg-surface-hover rounded px-1"
                                    >itemLoading</code
                                >
                                /
                                <code class="bg-surface-hover rounded px-1"
                                    >saving</code
                                >
                                /
                                <code class="bg-surface-hover rounded px-1"
                                    >deleting</code
                                >
                            </p>
                            <p>
                                <code class="bg-surface-hover rounded px-1"
                                    >error</code
                                >
                                - Last error
                            </p>
                            <p>
                                <code class="bg-surface-hover rounded px-1"
                                    >pagination</code
                                >
                                - Full usePagination instance
                            </p>
                        </div>
                    </div>

                    <div>
                        <h3 class="text-text mb-2 font-medium">Methods</h3>
                        <div class="text-muted space-y-1 text-sm">
                            <p>
                                <code class="bg-surface-hover rounded px-1"
                                    >fetchList(params?)</code
                                >
                                - Fetch paginated list
                            </p>
                            <p>
                                <code class="bg-surface-hover rounded px-1"
                                    >refresh()</code
                                >
                                - Refresh with last params
                            </p>
                            <p>
                                <code class="bg-surface-hover rounded px-1"
                                    >fetchOne(id)</code
                                >
                                - Fetch single item
                            </p>
                            <p>
                                <code class="bg-surface-hover rounded px-1"
                                    >create(data)</code
                                >
                                - POST new item
                            </p>
                            <p>
                                <code class="bg-surface-hover rounded px-1"
                                    >update(id, data)</code
                                >
                                - PUT existing item
                            </p>
                            <p>
                                <code class="bg-surface-hover rounded px-1"
                                    >remove(id)</code
                                >
                                - DELETE item
                            </p>
                            <p>
                                <code class="bg-surface-hover rounded px-1"
                                    >reset()</code
                                >
                                - Reset all state
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Create Modal -->
        <AppModal v-model="showCreateModal" title="Create Post">
            <div class="space-y-4">
                <AppInput
                    v-model="formData.title"
                    label="Title"
                    placeholder="Post title"
                />
                <AppTextarea
                    v-model="formData.body"
                    label="Body"
                    placeholder="Post content..."
                    :rows="4"
                />
            </div>
            <template #footer>
                <AppButton variant="outline" @click="showCreateModal = false">
                    Cancel
                </AppButton>
                <AppButton
                    variant="primary"
                    :loading="posts.saving.value"
                    @click="handleCreate"
                >
                    Create
                </AppButton>
            </template>
        </AppModal>

        <!-- Edit Modal -->
        <AppModal v-model="showEditModal" title="Edit Post">
            <div class="space-y-4">
                <AppInput
                    v-model="formData.title"
                    label="Title"
                    placeholder="Post title"
                />
                <AppTextarea
                    v-model="formData.body"
                    label="Body"
                    placeholder="Post content..."
                    :rows="4"
                />
            </div>
            <template #footer>
                <AppButton variant="outline" @click="showEditModal = false">
                    Cancel
                </AppButton>
                <AppButton
                    variant="primary"
                    :loading="posts.saving.value"
                    @click="handleUpdate"
                >
                    Save
                </AppButton>
            </template>
        </AppModal>

        <!-- Delete Confirmation Modal -->
        <AppModal v-model="showDeleteModal" title="Delete Post" size="sm">
            <p class="text-muted">
                Are you sure you want to delete this post? This action cannot be
                undone.
            </p>
            <template #footer>
                <AppButton variant="outline" @click="showDeleteModal = false">
                    Cancel
                </AppButton>
                <AppButton
                    variant="danger"
                    :loading="posts.deleting.value"
                    @click="handleDelete"
                >
                    Delete
                </AppButton>
            </template>
        </AppModal>
    </div>
</template>
