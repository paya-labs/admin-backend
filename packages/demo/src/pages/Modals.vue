<script setup>
import {
    AppButton,
    AppForm,
    AppInput,
    AppModal,
    AppSelect,
} from '@paya-labs/admin-ui';
import { ref } from 'vue';

// Basic modal
const showBasicModal = ref(false);

// Confirmation modal
const showConfirmModal = ref(false);
const confirmLoading = ref(false);

const handleConfirmDelete = () => {
    confirmLoading.value = true;
    setTimeout(() => {
        confirmLoading.value = false;
        showConfirmModal.value = false;
    }, 1500);
};

// Form modal
const showFormModal = ref(false);
const formData = ref({
    name: '',
    email: '',
    role: '',
});

const roleOptions = [
    { value: 'admin', label: 'Administrator' },
    { value: 'editor', label: 'Editor' },
    { value: 'viewer', label: 'Viewer' },
];

const handleFormSubmit = () => {
    console.log('Form submitted:', formData.value);
    showFormModal.value = false;
    formData.value = { name: '', email: '', role: '' };
};

// Size variants
const showSmallModal = ref(false);
const showLargeModal = ref(false);
const showXLModal = ref(false);
const showFullModal = ref(false);

// Scrollable content
const showScrollableModal = ref(false);

// Non-closable modal
const showNonClosableModal = ref(false);
const termsAccepted = ref(false);
</script>

<template>
    <div class="space-y-8">
        <h1 class="text-text text-2xl font-bold">Modal Patterns</h1>

        <!-- Basic Modal -->
        <section class="space-y-4">
            <h2 class="text-text text-lg font-semibold">Basic Modal</h2>
            <div class="border-border bg-surface rounded-lg border p-6">
                <AppButton variant="primary" @click="showBasicModal = true">
                    Open Basic Modal
                </AppButton>

                <AppModal v-model="showBasicModal" title="Basic Modal">
                    <p class="text-muted">
                        This is a basic modal with a title and content. You can
                        close it by clicking the X button, clicking the
                        backdrop, or pressing Escape.
                    </p>
                </AppModal>
            </div>
        </section>

        <!-- Confirmation Dialog -->
        <section class="space-y-4">
            <h2 class="text-text text-lg font-semibold">Confirmation Dialog</h2>
            <div class="border-border bg-surface rounded-lg border p-6">
                <AppButton variant="danger" @click="showConfirmModal = true">
                    Delete Item
                </AppButton>

                <AppModal
                    v-model="showConfirmModal"
                    title="Confirm Delete"
                    size="sm"
                >
                    <p class="text-muted">
                        Are you sure you want to delete this item? This action
                        cannot be undone.
                    </p>
                    <template #footer>
                        <AppButton
                            variant="outline"
                            @click="showConfirmModal = false"
                        >
                            Cancel
                        </AppButton>
                        <AppButton
                            variant="danger"
                            :loading="confirmLoading"
                            @click="handleConfirmDelete"
                        >
                            Delete
                        </AppButton>
                    </template>
                </AppModal>
            </div>
        </section>

        <!-- Form Modal -->
        <section class="space-y-4">
            <h2 class="text-text text-lg font-semibold">Form Modal</h2>
            <div class="border-border bg-surface rounded-lg border p-6">
                <AppButton variant="primary" @click="showFormModal = true">
                    Add New User
                </AppButton>

                <AppModal v-model="showFormModal" title="Add New User">
                    <AppForm v-model="formData" @submit="handleFormSubmit">
                        <div class="space-y-4">
                            <AppInput
                                v-model="formData.name"
                                label="Full Name"
                                placeholder="John Doe"
                            />
                            <AppInput
                                v-model="formData.email"
                                label="Email"
                                type="email"
                                placeholder="john@example.com"
                            />
                            <AppSelect
                                v-model="formData.role"
                                label="Role"
                                :options="roleOptions"
                                placeholder="Select role..."
                            />
                        </div>
                    </AppForm>
                    <template #footer>
                        <AppButton
                            variant="outline"
                            @click="showFormModal = false"
                        >
                            Cancel
                        </AppButton>
                        <AppButton variant="primary" @click="handleFormSubmit">
                            Save User
                        </AppButton>
                    </template>
                </AppModal>
            </div>
        </section>

        <!-- Size Variants -->
        <section class="space-y-4">
            <h2 class="text-text text-lg font-semibold">Size Variants</h2>
            <div class="border-border bg-surface rounded-lg border p-6">
                <div class="flex flex-wrap gap-3">
                    <AppButton variant="outline" @click="showSmallModal = true">
                        Small (sm)
                    </AppButton>
                    <AppButton variant="outline" @click="showBasicModal = true">
                        Medium (md) - Default
                    </AppButton>
                    <AppButton variant="outline" @click="showLargeModal = true">
                        Large (lg)
                    </AppButton>
                    <AppButton variant="outline" @click="showXLModal = true">
                        Extra Large (xl)
                    </AppButton>
                    <AppButton variant="outline" @click="showFullModal = true">
                        Full Screen
                    </AppButton>
                </div>

                <AppModal
                    v-model="showSmallModal"
                    title="Small Modal"
                    size="sm"
                >
                    <p class="text-muted">
                        This is a small modal (max-width: 24rem).
                    </p>
                </AppModal>

                <AppModal
                    v-model="showLargeModal"
                    title="Large Modal"
                    size="lg"
                >
                    <p class="text-muted">
                        This is a large modal (max-width: 32rem). Good for forms
                        with more fields.
                    </p>
                </AppModal>

                <AppModal
                    v-model="showXLModal"
                    title="Extra Large Modal"
                    size="xl"
                >
                    <p class="text-muted">
                        This is an extra large modal (max-width: 36rem). Useful
                        for complex content or data tables.
                    </p>
                </AppModal>

                <AppModal
                    v-model="showFullModal"
                    title="Full Screen Modal"
                    size="full"
                >
                    <p class="text-muted">
                        This is a full screen modal. It takes up the entire
                        viewport. Great for immersive experiences or detailed
                        views.
                    </p>
                    <template #footer>
                        <AppButton
                            variant="outline"
                            @click="showFullModal = false"
                        >
                            Close
                        </AppButton>
                    </template>
                </AppModal>
            </div>
        </section>

        <!-- Scrollable Content -->
        <section class="space-y-4">
            <h2 class="text-text text-lg font-semibold">Scrollable Content</h2>
            <div class="border-border bg-surface rounded-lg border p-6">
                <AppButton
                    variant="outline"
                    @click="showScrollableModal = true"
                >
                    Open Long Content Modal
                </AppButton>

                <AppModal
                    v-model="showScrollableModal"
                    title="Terms of Service"
                    size="lg"
                >
                    <div class="text-muted space-y-4">
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Sed do eiusmod tempor incididunt ut labore et
                            dolore magna aliqua.
                        </p>
                        <p>
                            Ut enim ad minim veniam, quis nostrud exercitation
                            ullamco laboris nisi ut aliquip ex ea commodo
                            consequat. Duis aute irure dolor in reprehenderit in
                            voluptate velit esse cillum dolore eu fugiat nulla
                            pariatur.
                        </p>
                        <p>
                            Excepteur sint occaecat cupidatat non proident, sunt
                            in culpa qui officia deserunt mollit anim id est
                            laborum. Sed ut perspiciatis unde omnis iste natus
                            error sit voluptatem accusantium.
                        </p>
                        <p>
                            Nemo enim ipsam voluptatem quia voluptas sit
                            aspernatur aut odit aut fugit, sed quia consequuntur
                            magni dolores eos qui ratione voluptatem sequi
                            nesciunt.
                        </p>
                        <p>
                            Neque porro quisquam est, qui dolorem ipsum quia
                            dolor sit amet, consectetur, adipisci velit, sed
                            quia non numquam eius modi tempora incidunt ut
                            labore et dolore magnam aliquam quaerat voluptatem.
                        </p>
                        <p>
                            Ut enim ad minima veniam, quis nostrum
                            exercitationem ullam corporis suscipit laboriosam,
                            nisi ut aliquid ex ea commodi consequatur.
                        </p>
                        <p>
                            Quis autem vel eum iure reprehenderit qui in ea
                            voluptate velit esse quam nihil molestiae
                            consequatur, vel illum qui dolorem eum fugiat quo
                            voluptas nulla pariatur.
                        </p>
                    </div>
                    <template #footer>
                        <AppButton
                            variant="primary"
                            @click="showScrollableModal = false"
                        >
                            I Accept
                        </AppButton>
                    </template>
                </AppModal>
            </div>
        </section>

        <!-- Non-Closable Modal -->
        <section class="space-y-4">
            <h2 class="text-text text-lg font-semibold">Non-Closable Modal</h2>
            <div class="border-border bg-surface rounded-lg border p-6">
                <p class="text-muted mb-4 text-sm">
                    This modal can only be closed by accepting the terms.
                </p>
                <AppButton
                    variant="outline"
                    @click="showNonClosableModal = true"
                >
                    Open Required Action Modal
                </AppButton>

                <AppModal
                    v-model="showNonClosableModal"
                    title="Accept Terms"
                    size="sm"
                    :closable="false"
                    :close-on-backdrop="false"
                    :close-on-escape="false"
                >
                    <div class="space-y-4">
                        <p class="text-muted">
                            You must accept the terms to continue using the
                            application.
                        </p>
                        <label class="flex items-center gap-2">
                            <input
                                v-model="termsAccepted"
                                type="checkbox"
                                class="border-border rounded"
                            />
                            <span class="text-text text-sm">
                                I accept the terms and conditions
                            </span>
                        </label>
                    </div>
                    <template #footer>
                        <AppButton
                            variant="primary"
                            :disabled="!termsAccepted"
                            @click="showNonClosableModal = false"
                        >
                            Continue
                        </AppButton>
                    </template>
                </AppModal>
            </div>
        </section>
    </div>
</template>
