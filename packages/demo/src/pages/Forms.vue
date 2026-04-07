<script setup>
import {
    AppButton,
    AppColorInput,
    AppForm,
    AppInput,
    AppModal,
    AppSelect,
    AppTextarea,
} from '@paya-labs/admin-ui';
import { ref } from 'vue';

// Basic form
const basicForm = ref({
    email: '',
    password: '',
});

// Validation form
const validationForm = ref({
    username: '',
    email: 'invalid-email',
    password: '123',
});

const validationErrors = ref({
    username: 'Username is required',
    email: 'Please enter a valid email address',
    password: 'Password must be at least 8 characters',
});

// Inline form
const inlineForm = ref({
    search: '',
    category: '',
});

const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'users', label: 'Users' },
    { value: 'products', label: 'Products' },
    { value: 'orders', label: 'Orders' },
];

// AppForm usage
const appFormData = ref({
    name: '',
    role: '',
    department: '',
});

const roleOptions = [
    { value: 'admin', label: 'Administrator' },
    { value: 'editor', label: 'Editor' },
    { value: 'viewer', label: 'Viewer' },
];

const departmentOptions = [
    { value: 'engineering', label: 'Engineering' },
    { value: 'design', label: 'Design' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'sales', label: 'Sales' },
];

// Color input examples
const colorBasic = ref('#4285f4');
const colorRequired = ref('#d50000');
const colorWithHint = ref('#33b679');
const colorCustomPalette = ref('#2563eb');
const customPalette = [
    '#dc2626',
    '#ea580c',
    '#d97706',
    '#16a34a',
    '#0891b2',
    '#2563eb',
    '#7c3aed',
    '#db2777',
];
const colorNoPalette = ref('#7c3aed');

// Textarea examples
const textareaBasic = ref('');
const textareaWithLimit = ref('This is some initial content for the textarea.');
const textareaBio = ref('');

// Modal form
const modalOpen = ref(false);
const modalForm = ref({
    firstName: '',
    lastName: '',
    email: '',
    country: '',
});

const countryOptions = [
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'de', label: 'Germany' },
    { value: 'fr', label: 'France' },
    { value: 'es', label: 'Spain' },
    { value: 'it', label: 'Italy' },
    { value: 'nl', label: 'Netherlands' },
    { value: 'pt', label: 'Portugal' },
    { value: 'se', label: 'Sweden' },
    { value: 'no', label: 'Norway' },
];

const formSubmitted = ref(false);

const handleAppFormSubmit = (data) => {
    formSubmitted.value = true;
    console.log('Form submitted:', data);
    setTimeout(() => {
        formSubmitted.value = false;
    }, 2000);
};
</script>

<template>
    <div class="space-y-8">
        <h1 class="text-text text-2xl font-bold">Form Patterns</h1>

        <!-- Basic Form Section -->
        <section class="space-y-4">
            <h2 class="text-text text-lg font-semibold">Basic Form</h2>
            <div class="border-border bg-surface rounded-lg border p-6">
                <div class="max-w-md space-y-4">
                    <AppInput
                        v-model="basicForm.email"
                        label="Email"
                        type="email"
                        placeholder="you@example.com"
                    />
                    <AppInput
                        v-model="basicForm.password"
                        label="Password"
                        type="password"
                        placeholder="Enter your password"
                    />
                    <div class="flex gap-3 pt-2">
                        <AppButton variant="primary"> Sign In </AppButton>
                        <AppButton variant="outline"> Cancel </AppButton>
                    </div>
                </div>
            </div>
        </section>

        <!-- Form with Validation Section -->
        <section class="space-y-4">
            <h2 class="text-text text-lg font-semibold">
                Form with Validation
            </h2>
            <div class="border-border bg-surface rounded-lg border p-6">
                <div class="max-w-md space-y-4">
                    <AppInput
                        v-model="validationForm.username"
                        label="Username"
                        placeholder="Enter username"
                        :error="validationErrors.username"
                    />
                    <AppInput
                        v-model="validationForm.email"
                        label="Email"
                        type="email"
                        placeholder="you@example.com"
                        :error="validationErrors.email"
                    />
                    <AppInput
                        v-model="validationForm.password"
                        label="Password"
                        type="password"
                        placeholder="Min 8 characters"
                        :error="validationErrors.password"
                        hint="Password must include uppercase, lowercase, and numbers"
                    />
                    <AppButton variant="primary" disabled>
                        Create Account
                    </AppButton>
                </div>
            </div>
        </section>

        <!-- Inline Form Layout Section -->
        <section class="space-y-4">
            <h2 class="text-text text-lg font-semibold">Inline Form Layout</h2>
            <div class="border-border bg-surface rounded-lg border p-6">
                <div class="flex flex-wrap items-end gap-4">
                    <div class="min-w-[200px] flex-1">
                        <AppInput
                            v-model="inlineForm.search"
                            label="Search"
                            placeholder="Search..."
                        />
                    </div>
                    <div class="min-w-[180px]">
                        <AppSelect
                            v-model="inlineForm.category"
                            label="Category"
                            :options="categoryOptions"
                            placeholder="Select..."
                        />
                    </div>
                    <AppButton variant="primary"> Search </AppButton>
                </div>
            </div>
        </section>

        <!-- Color Input Section -->
        <section class="space-y-4">
            <h2 class="text-text text-lg font-semibold">Color Input</h2>
            <div class="border-border bg-surface rounded-lg border p-6">
                <div class="max-w-md space-y-6">
                    <AppColorInput v-model="colorBasic" label="Brand Color" />
                    <AppColorInput
                        v-model="colorRequired"
                        label="Required Color"
                        required
                    />
                    <AppColorInput
                        v-model="colorWithHint"
                        label="Theme Color"
                        hint="Choose a color for the application theme"
                    />
                    <AppColorInput
                        label="Error State"
                        model-value="#e67c73"
                        error="This color does not meet contrast requirements"
                    />
                    <AppColorInput
                        v-model="colorCustomPalette"
                        label="Custom Palette"
                        :palette="customPalette"
                        hint="Using a custom set of brand colors"
                    />
                    <AppColorInput
                        v-model="colorNoPalette"
                        label="No Palette"
                        :palette="false"
                    />
                    <AppColorInput
                        label="Disabled"
                        model-value="#7986cb"
                        disabled
                    />
                </div>
            </div>
        </section>

        <!-- Textarea Section -->
        <section class="space-y-4">
            <h2 class="text-text text-lg font-semibold">Textarea</h2>
            <div class="border-border bg-surface rounded-lg border p-6">
                <div class="grid max-w-2xl gap-6">
                    <AppTextarea
                        v-model="textareaBasic"
                        label="Basic Textarea"
                        placeholder="Enter your message..."
                        hint="A simple textarea with default settings"
                    />
                    <AppTextarea
                        v-model="textareaWithLimit"
                        label="With Character Limit"
                        placeholder="Write something..."
                        :maxlength="200"
                        :rows="4"
                    />
                    <AppTextarea
                        v-model="textareaBio"
                        label="Bio"
                        placeholder="Tell us about yourself..."
                        :rows="5"
                        resize="none"
                        error="Bio is required"
                        required
                    />
                    <AppTextarea
                        label="Disabled Textarea"
                        model-value="This content cannot be edited."
                        :rows="2"
                        disabled
                    />
                </div>
            </div>
        </section>

        <!-- AppForm Usage Section -->
        <section class="space-y-4">
            <h2 class="text-text text-lg font-semibold">
                AppForm with Submit Handler
            </h2>
            <div class="border-border bg-surface rounded-lg border p-6">
                <div class="max-w-md">
                    <AppForm
                        v-model="appFormData"
                        @submit="handleAppFormSubmit"
                    >
                        <div class="space-y-4">
                            <AppInput
                                v-model="appFormData.name"
                                label="Full Name"
                                placeholder="John Doe"
                            />
                            <AppSelect
                                v-model="appFormData.role"
                                label="Role"
                                :options="roleOptions"
                                placeholder="Select role..."
                            />
                            <AppSelect
                                v-model="appFormData.department"
                                label="Department"
                                :options="departmentOptions"
                                placeholder="Select department..."
                            />
                            <div class="flex items-center gap-4 pt-2">
                                <AppButton type="submit" variant="primary">
                                    Save User
                                </AppButton>
                                <span
                                    v-if="formSubmitted"
                                    class="text-success text-sm"
                                >
                                    Form submitted!
                                </span>
                            </div>
                        </div>
                    </AppForm>
                </div>
            </div>
        </section>

        <!-- Form in Modal Section -->
        <section class="space-y-4">
            <h2 class="text-text text-lg font-semibold">Form in Modal</h2>
            <div class="border-border bg-surface rounded-lg border p-6">
                <AppButton variant="primary" @click="modalOpen = true">
                    Open Form Modal
                </AppButton>

                <AppModal v-model="modalOpen" title="Add Contact" size="md">
                    <div class="space-y-4">
                        <AppInput
                            v-model="modalForm.firstName"
                            label="First Name"
                            placeholder="John"
                        />
                        <AppInput
                            v-model="modalForm.lastName"
                            label="Last Name"
                            placeholder="Doe"
                        />
                        <AppInput
                            v-model="modalForm.email"
                            label="Email"
                            type="email"
                            placeholder="john@example.com"
                        />
                        <AppSelect
                            v-model="modalForm.country"
                            label="Country"
                            :options="countryOptions"
                            placeholder="Select country..."
                        />
                    </div>
                    <template #footer>
                        <AppButton variant="outline" @click="modalOpen = false">
                            Cancel
                        </AppButton>
                        <AppButton variant="primary" @click="modalOpen = false">
                            Save Contact
                        </AppButton>
                    </template>
                </AppModal>
            </div>
        </section>

        <!-- Disabled Form Section -->
        <section class="space-y-4">
            <h2 class="text-text text-lg font-semibold">Disabled State</h2>
            <div class="border-border bg-surface rounded-lg border p-6">
                <div class="max-w-md space-y-4">
                    <AppInput
                        label="Disabled Input"
                        model-value="Cannot edit this"
                        disabled
                    />
                    <AppSelect
                        label="Disabled Select"
                        model-value="option1"
                        :options="[{ value: 'option1', label: 'Option 1' }]"
                        disabled
                    />
                    <AppButton variant="primary" disabled>
                        Disabled Button
                    </AppButton>
                </div>
            </div>
        </section>
    </div>
</template>
