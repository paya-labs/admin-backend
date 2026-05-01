<script setup>
import {
    AppButton,
    AppCheckbox,
    AppColorInput,
    AppCombobox,
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

// Checkbox examples
const checkboxBasic = ref(false);
const checkboxDescribed = ref(true);
const checkboxRequired = ref(false);
const checkboxDisabledChecked = ref(true);

// Long list demo — pre-selected value deep in the list
const longListSelected = ref('item-18');
const longListOptions = Array.from({ length: 30 }, (_, i) => ({
    value: `item-${i + 1}`,
    label: `Option ${i + 1}`,
}));

// AppCombobox examples — mock async backend
const demoUsers = [
    { id: '1', name: 'Ada Lovelace', email: 'ada@example.com', role: 'Admin' },
    { id: '2', name: 'Alan Turing', email: 'alan@example.com', role: 'Editor' },
    {
        id: '3',
        name: 'Grace Hopper',
        email: 'grace@example.com',
        role: 'Admin',
    },
    {
        id: '4',
        name: 'Linus Torvalds',
        email: 'linus@example.com',
        role: 'Editor',
    },
    {
        id: '5',
        name: 'Margaret Hamilton',
        email: 'margaret@example.com',
        role: 'Admin',
    },
    {
        id: '6',
        name: 'Dennis Ritchie',
        email: 'dennis@example.com',
        role: 'Viewer',
    },
    { id: '7', name: 'Ken Thompson', email: 'ken@example.com', role: 'Editor' },
    {
        id: '8',
        name: 'Donald Knuth',
        email: 'donald@example.com',
        role: 'Viewer',
    },
    {
        id: '9',
        name: 'Edsger Dijkstra',
        email: 'edsger@example.com',
        role: 'Admin',
    },
    {
        id: '10',
        name: 'Barbara Liskov',
        email: 'barbara@example.com',
        role: 'Editor',
    },
];

const fakeFetch = async (query) => {
    // Simulate network latency so the loading state is visible
    await new Promise((resolve) => setTimeout(resolve, 250));
    const q = query.toLowerCase();
    return demoUsers.filter(
        (u) =>
            u.name.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q),
    );
};

const navigatePickedUser = ref(null);
const handleUserSelect = (user) => {
    // In a real app: router.push(`/users/${user.id}`)
    navigatePickedUser.value = user;
    setTimeout(() => (navigatePickedUser.value = null), 2500);
};

const selectedAttendees = ref([]);
const formFieldUser = ref(null);

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

        <!-- AppCombobox Section -->
        <section class="space-y-4">
            <h2 class="text-text text-lg font-semibold">
                Combobox (async search)
            </h2>
            <p class="text-muted text-sm">
                Async-fetch combobox. Pass a
                <code class="bg-surface-hover rounded px-1 py-0.5 text-xs"
                    >fetcher: (query) =&gt; Promise&lt;T[]&gt;</code
                >
                — admin-ui stays HTTP-agnostic. Supports single-pick (with
                <code class="bg-surface-hover rounded px-1 py-0.5 text-xs"
                    >clear-on-select</code
                >
                +
                <code class="bg-surface-hover rounded px-1 py-0.5 text-xs"
                    >@select</code
                >
                for navigate-style flows) or multi-pick (with
                <code class="bg-surface-hover rounded px-1 py-0.5 text-xs"
                    >multiple</code
                >
                + v-model array, chips below).
            </p>

            <div class="border-border bg-surface rounded-lg border p-6">
                <div class="max-w-md space-y-2">
                    <label class="text-text mb-1 block text-sm font-medium">
                        Single — navigate on pick
                        <span class="text-muted font-normal"
                            >(use for global search, command palettes)</span
                        >
                    </label>
                    <AppCombobox
                        :fetcher="fakeFetch"
                        :min-chars="1"
                        clear-on-select
                        placeholder="Search users..."
                        @select="handleUserSelect"
                    >
                        <template #item="{ item }">
                            <div class="text-text font-medium">
                                {{ item.name }}
                            </div>
                            <div class="text-muted text-xs">
                                {{ item.email }} · {{ item.role }}
                            </div>
                        </template>
                    </AppCombobox>
                    <p
                        v-if="navigatePickedUser"
                        class="text-primary-600 dark:text-primary-400 mt-2 text-sm"
                    >
                        Would navigate to:
                        <strong>{{ navigatePickedUser.name }}</strong>
                        ({{ navigatePickedUser.email }})
                    </p>
                </div>
            </div>

            <div class="border-border bg-surface rounded-lg border p-6">
                <div class="max-w-md space-y-2">
                    <label class="text-text mb-1 block text-sm font-medium">
                        Multi — v-model array with chips
                        <span class="text-muted font-normal"
                            >(use for tag pickers, attendee lists)</span
                        >
                    </label>
                    <AppCombobox
                        v-model="selectedAttendees"
                        multiple
                        :fetcher="fakeFetch"
                        :min-chars="1"
                        placeholder="Search users..."
                    >
                        <template #item="{ item }">
                            <div class="text-text font-medium">
                                {{ item.name }}
                            </div>
                            <div class="text-muted text-xs">
                                {{ item.email }}
                            </div>
                        </template>
                    </AppCombobox>
                    <p
                        v-if="selectedAttendees.length > 0"
                        class="text-muted mt-2 text-xs"
                    >
                        Selected ({{ selectedAttendees.length }}):
                        {{ selectedAttendees.map((u) => u.id).join(', ') }}
                    </p>
                </div>
            </div>

            <div class="border-border bg-surface rounded-lg border p-6">
                <div class="max-w-md space-y-2">
                    <label class="text-text mb-1 block text-sm font-medium">
                        Single — v-model (form field)
                        <span class="text-muted font-normal"
                            >(use as a typeahead form input)</span
                        >
                    </label>
                    <AppCombobox
                        v-model="formFieldUser"
                        :fetcher="fakeFetch"
                        :min-chars="1"
                        placeholder="Pick a user..."
                    >
                        <template #item="{ item }">
                            <div class="text-text font-medium">
                                {{ item.name }}
                            </div>
                            <div class="text-muted text-xs">
                                {{ item.email }}
                            </div>
                        </template>
                    </AppCombobox>
                    <p v-if="formFieldUser" class="text-muted mt-2 text-xs">
                        Bound value:
                        <code
                            class="bg-surface-hover rounded px-1 py-0.5 text-xs"
                            >{{ formFieldUser.name }}</code
                        >
                    </p>
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

        <!-- Checkbox Section -->
        <section class="space-y-4">
            <h2 class="text-text text-lg font-semibold">Checkbox</h2>
            <div class="border-border bg-surface rounded-lg border p-6">
                <div class="max-w-md space-y-5">
                    <AppCheckbox
                        v-model="checkboxBasic"
                        label="Basic checkbox"
                    />
                    <AppCheckbox
                        v-model="checkboxDescribed"
                        label="Email notifications"
                        description="Receive email updates about your account activity and security alerts."
                    />
                    <AppCheckbox
                        v-model="checkboxRequired"
                        label="Accept terms and conditions"
                        required
                        :error="
                            !checkboxRequired
                                ? 'You must accept the terms to continue'
                                : ''
                        "
                    />
                    <AppCheckbox
                        :model-value="false"
                        label="With hint"
                        hint="This is a helpful hint"
                    />
                    <AppCheckbox
                        :model-value="false"
                        label="Disabled unchecked"
                        disabled
                    />
                    <AppCheckbox
                        v-model="checkboxDisabledChecked"
                        label="Disabled checked"
                        disabled
                    />
                </div>
            </div>
        </section>

        <!-- Long List Scroll Demo -->
        <section class="space-y-4">
            <h2 class="text-text text-lg font-semibold">
                Select — Scroll to Selected
            </h2>
            <p class="text-muted text-sm">
                The dropdown scrolls the pre-selected option (Option 18) to the
                top when opened, so the user immediately sees their selection.
            </p>
            <div class="border-border bg-surface rounded-lg border p-6">
                <div class="max-w-md">
                    <AppSelect
                        v-model="longListSelected"
                        label="Long list (30 items, #18 selected)"
                        :options="longListOptions"
                    />
                </div>
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
