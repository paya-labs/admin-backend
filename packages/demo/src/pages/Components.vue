<script setup>
import {
    AppBadge,
    AppButton,
    AppCard,
    AppInput,
    AppModal,
    AppSelect,
    AppTable,
} from '@paya-labs/admin-ui';
import { ref } from 'vue';

const inputValue = ref('');
const selectValue = ref('');
const showModal = ref(false);

const selectOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
];

const tableColumns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'status', label: 'Status' },
];

const tableData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Pending' },
    { id: 3, name: 'Bob Wilson', email: 'bob@example.com', status: 'Inactive' },
];
</script>

<template>
    <div class="space-y-8">
        <h1 class="text-text text-2xl font-bold">
            Component Showcase
        </h1>

        <!-- Buttons Section -->
        <section class="space-y-4">
            <h2 class="text-text text-lg font-semibold">
                Buttons
            </h2>
            <div class="border-border bg-surface rounded-lg border p-6">
                <div class="flex flex-wrap gap-4">
                    <AppButton variant="primary">
                        Primary
                    </AppButton>
                    <AppButton variant="secondary">
                        Secondary
                    </AppButton>
                    <AppButton variant="outline">
                        Outline
                    </AppButton>
                    <AppButton variant="ghost">
                        Ghost
                    </AppButton>
                    <AppButton variant="danger">
                        Danger
                    </AppButton>
                    <AppButton
                        variant="primary"
                        disabled
                    >
                        Disabled
                    </AppButton>
                    <AppButton
                        variant="primary"
                        loading
                    >
                        Loading
                    </AppButton>
                </div>
            </div>
        </section>

        <!-- Badges Section -->
        <section class="space-y-4">
            <h2 class="text-text text-lg font-semibold">
                Badges
            </h2>
            <div class="border-border bg-surface rounded-lg border p-6">
                <div class="flex flex-wrap gap-4">
                    <AppBadge variant="primary">
                        Primary
                    </AppBadge>
                    <AppBadge variant="secondary">
                        Secondary
                    </AppBadge>
                    <AppBadge variant="success">
                        Success
                    </AppBadge>
                    <AppBadge variant="warning">
                        Warning
                    </AppBadge>
                    <AppBadge variant="danger">
                        Danger
                    </AppBadge>
                </div>
            </div>
        </section>

        <!-- Inputs Section -->
        <section class="space-y-4">
            <h2 class="text-text text-lg font-semibold">
                Form Inputs
            </h2>
            <div class="border-border bg-surface rounded-lg border p-6">
                <div class="grid max-w-md gap-4">
                    <AppInput
                        v-model="inputValue"
                        label="Text Input"
                        placeholder="Enter some text..."
                    />
                    <AppInput
                        label="With Error"
                        placeholder="Invalid input"
                        error="This field is required"
                    />
                    <AppSelect
                        v-model="selectValue"
                        label="Select Input"
                        :options="selectOptions"
                        placeholder="Choose an option"
                    />
                </div>
            </div>
        </section>

        <!-- Cards Section -->
        <section class="space-y-4">
            <h2 class="text-text text-lg font-semibold">
                Cards
            </h2>
            <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <AppCard
                    title="Users"
                    value="1,234"
                    trend="+12%"
                    trend-direction="up"
                />
                <AppCard
                    title="Revenue"
                    value="$45,678"
                    trend="-5%"
                    trend-direction="down"
                />
                <AppCard
                    title="Orders"
                    value="89"
                />
                <AppCard
                    title="Visitors"
                    value="12,345"
                />
            </div>
        </section>

        <!-- Table Section -->
        <section class="space-y-4">
            <h2 class="text-text text-lg font-semibold">
                Table
            </h2>
            <div class="border-border bg-surface rounded-lg border p-6">
                <AppTable
                    :columns="tableColumns"
                    :data="tableData"
                />
            </div>
        </section>

        <!-- Modal Section -->
        <section class="space-y-4">
            <h2 class="text-text text-lg font-semibold">
                Modal
            </h2>
            <div class="border-border bg-surface rounded-lg border p-6">
                <AppButton
                    variant="primary"
                    @click="showModal = true"
                >
                    Open Modal
                </AppButton>

                <AppModal
                    v-model="showModal"
                    title="Example Modal"
                    @close="showModal = false"
                >
                    <p class="text-muted">
                        This is an example modal dialog. You can put any content
                        here including forms, tables, or other components.
                    </p>
                    <template #footer>
                        <div class="flex justify-end gap-3">
                            <AppButton
                                variant="outline"
                                @click="showModal = false"
                            >
                                Cancel
                            </AppButton>
                            <AppButton
                                variant="primary"
                                @click="showModal = false"
                            >
                                Confirm
                            </AppButton>
                        </div>
                    </template>
                </AppModal>
            </div>
        </section>
    </div>
</template>
