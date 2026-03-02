<script setup>
import { useTheme } from '@paya-labs/admin-ui';

const { mode, toggleTheme } = useTheme();

// Primary color scale - backgrounds
const primaryBgColors = [
    { name: '50', bg: 'bg-primary-50' },
    { name: '100', bg: 'bg-primary-100' },
    { name: '200', bg: 'bg-primary-200' },
    { name: '300', bg: 'bg-primary-300' },
    { name: '400', bg: 'bg-primary-400' },
    { name: '500', bg: 'bg-primary-500' },
    { name: '600', bg: 'bg-primary-600' },
    { name: '700', bg: 'bg-primary-700' },
    { name: '800', bg: 'bg-primary-800' },
    { name: '900', bg: 'bg-primary-900' },
    { name: '950', bg: 'bg-primary-950' },
];

// Primary color scale - text
const primaryTextColors = [
    { name: '500', text: 'text-primary-500' },
    { name: '600', text: 'text-primary-600' },
    { name: '700', text: 'text-primary-700' },
];

// Gray color scale - backgrounds
const grayBgColors = [
    { name: '50', bg: 'bg-gray-50' },
    { name: '100', bg: 'bg-gray-100' },
    { name: '200', bg: 'bg-gray-200' },
    { name: '300', bg: 'bg-gray-300' },
    { name: '400', bg: 'bg-gray-400' },
    { name: '500', bg: 'bg-gray-500' },
    { name: '600', bg: 'bg-gray-600' },
    { name: '700', bg: 'bg-gray-700' },
    { name: '800', bg: 'bg-gray-800' },
    { name: '900', bg: 'bg-gray-900' },
    { name: '950', bg: 'bg-gray-950' },
];

// Gray color scale - text
const grayTextColors = [
    { name: '400', text: 'text-gray-400' },
    { name: '500', text: 'text-gray-500' },
    { name: '600', text: 'text-gray-600' },
    { name: '700', text: 'text-gray-700' },
    { name: '800', text: 'text-gray-800' },
];

// Status colors - backgrounds
const statusBgColors = [
    { name: 'success', bg: 'bg-success' },
    { name: 'warning', bg: 'bg-warning' },
    { name: 'danger', bg: 'bg-danger' },
    { name: 'info', bg: 'bg-info' },
];

// Status colors - text
const statusTextColors = [
    { name: 'success', text: 'text-success' },
    { name: 'warning', text: 'text-warning' },
    { name: 'danger', text: 'text-danger' },
    { name: 'info', text: 'text-info' },
];

// Semantic colors
const semanticColors = [
    {
        name: 'surface',
        bgClass: 'bg-surface',
        desc: 'Cards, modals, dropdowns',
    },
    {
        name: 'surface-hover',
        bgClass: 'bg-surface-hover',
        desc: 'Hover state for surfaces',
    },
    { name: 'body', bgClass: 'bg-body', desc: 'Page background' },
    { name: 'sidebar', bgClass: 'bg-sidebar', desc: 'Sidebar background' },
    { name: 'header', bgClass: 'bg-header', desc: 'Header background' },
];

// Text colors
const textColors = [
    { name: 'text', class: 'text-text', desc: 'Primary text' },
    {
        name: 'text-secondary',
        class: 'text-text-secondary',
        desc: 'Secondary text',
    },
    { name: 'muted', class: 'text-muted', desc: 'Muted/placeholder text' },
];

// Border radius values
const radiusValues = [
    { name: 'sm', class: 'rounded-sm' },
    { name: 'md', class: 'rounded-md' },
    { name: 'lg', class: 'rounded-lg' },
    { name: 'xl', class: 'rounded-xl' },
];

// Copy to clipboard
const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
};
</script>

<template>
    <div class="space-y-8">
        <div>
            <h1 class="text-text text-2xl font-bold">Theme Reference</h1>
            <p class="text-muted mt-1">
                All available theme tokens and how to use them. Click any value
                to copy.
            </p>
        </div>

        <!-- Current Theme -->
        <section class="space-y-4">
            <h2 class="text-text text-lg font-semibold">Current Theme</h2>
            <div class="border-border bg-surface rounded-lg border p-6">
                <div class="flex items-center gap-4">
                    <span class="text-text">Mode:</span>
                    <code
                        class="bg-surface-hover rounded px-2 py-1 font-mono text-sm"
                    >
                        {{ mode }}
                    </code>
                    <button
                        class="text-primary-600 hover:text-primary-700 text-sm underline"
                        @click="toggleTheme"
                    >
                        Toggle theme
                    </button>
                </div>
            </div>
        </section>

        <!-- Primary Background Colors -->
        <section class="space-y-4">
            <div>
                <h2 class="text-text text-lg font-semibold">
                    Primary Background Colors
                </h2>
                <p class="text-muted text-sm">
                    Usage:
                    <code class="bg-surface-hover rounded px-1"
                        >bg-primary-500</code
                    >
                </p>
            </div>
            <div class="border-border bg-surface rounded-lg border p-6">
                <div class="flex flex-wrap gap-3">
                    <button
                        v-for="color in primaryBgColors"
                        :key="color.name"
                        class="group flex flex-col items-center gap-1"
                        :title="`Click to copy: ${color.bg}`"
                        @click="copyToClipboard(color.bg)"
                    >
                        <div
                            :class="[
                                color.bg,
                                'h-12 w-16 rounded-md border border-black/10 transition-transform group-hover:scale-105',
                            ]"
                        ></div>
                        <span class="text-muted text-xs">{{ color.name }}</span>
                    </button>
                </div>
            </div>
        </section>

        <!-- Primary Text Colors -->
        <section class="space-y-4">
            <div>
                <h2 class="text-text text-lg font-semibold">
                    Primary Text Colors
                </h2>
                <p class="text-muted text-sm">
                    Usage:
                    <code class="bg-surface-hover rounded px-1"
                        >text-primary-600</code
                    >
                </p>
            </div>
            <div class="border-border bg-surface rounded-lg border p-6">
                <div class="space-y-3">
                    <button
                        v-for="color in primaryTextColors"
                        :key="color.name"
                        class="hover:bg-surface-hover block w-full rounded-md p-3 text-left transition-colors"
                        @click="copyToClipboard(color.text)"
                    >
                        <p :class="[color.text, 'text-lg font-medium']">
                            The quick brown fox jumps over the lazy dog
                        </p>
                        <code class="text-muted text-xs">{{ color.text }}</code>
                    </button>
                </div>
            </div>
        </section>

        <!-- Gray Background Colors -->
        <section class="space-y-4">
            <div>
                <h2 class="text-text text-lg font-semibold">
                    Gray Background Colors
                </h2>
                <p class="text-muted text-sm">
                    Usage:
                    <code class="bg-surface-hover rounded px-1"
                        >bg-gray-200</code
                    >
                </p>
            </div>
            <div class="border-border bg-surface rounded-lg border p-6">
                <div class="flex flex-wrap gap-3">
                    <button
                        v-for="color in grayBgColors"
                        :key="color.name"
                        class="group flex flex-col items-center gap-1"
                        :title="`Click to copy: ${color.bg}`"
                        @click="copyToClipboard(color.bg)"
                    >
                        <div
                            :class="[
                                color.bg,
                                'h-12 w-16 rounded-md border border-black/10 transition-transform group-hover:scale-105',
                            ]"
                        ></div>
                        <span class="text-muted text-xs">{{ color.name }}</span>
                    </button>
                </div>
            </div>
        </section>

        <!-- Gray Text Colors -->
        <section class="space-y-4">
            <div>
                <h2 class="text-text text-lg font-semibold">
                    Gray Text Colors
                </h2>
                <p class="text-muted text-sm">
                    Usage:
                    <code class="bg-surface-hover rounded px-1"
                        >text-gray-600</code
                    >
                </p>
            </div>
            <div class="border-border bg-surface rounded-lg border p-6">
                <div class="space-y-3">
                    <button
                        v-for="color in grayTextColors"
                        :key="color.name"
                        class="hover:bg-surface-hover block w-full rounded-md p-3 text-left transition-colors"
                        @click="copyToClipboard(color.text)"
                    >
                        <p :class="[color.text, 'text-lg font-medium']">
                            The quick brown fox jumps over the lazy dog
                        </p>
                        <code class="text-muted text-xs">{{ color.text }}</code>
                    </button>
                </div>
            </div>
        </section>

        <!-- Status Background Colors -->
        <section class="space-y-4">
            <div>
                <h2 class="text-text text-lg font-semibold">
                    Status Background Colors
                </h2>
                <p class="text-muted text-sm">
                    Usage:
                    <code class="bg-surface-hover rounded px-1"
                        >bg-success</code
                    >
                </p>
            </div>
            <div class="border-border bg-surface rounded-lg border p-6">
                <div class="flex flex-wrap gap-4">
                    <button
                        v-for="color in statusBgColors"
                        :key="color.name"
                        class="group flex flex-col items-center gap-1"
                        :title="`Click to copy: ${color.bg}`"
                        @click="copyToClipboard(color.bg)"
                    >
                        <div
                            :class="[
                                color.bg,
                                'h-12 w-20 rounded-md border border-black/10 transition-transform group-hover:scale-105',
                            ]"
                        ></div>
                        <span class="text-muted text-xs">{{ color.name }}</span>
                    </button>
                </div>
            </div>
        </section>

        <!-- Status Text Colors -->
        <section class="space-y-4">
            <div>
                <h2 class="text-text text-lg font-semibold">
                    Status Text Colors
                </h2>
                <p class="text-muted text-sm">
                    Usage:
                    <code class="bg-surface-hover rounded px-1"
                        >text-danger</code
                    >
                </p>
            </div>
            <div class="border-border bg-surface rounded-lg border p-6">
                <div class="space-y-3">
                    <button
                        v-for="color in statusTextColors"
                        :key="color.name"
                        class="hover:bg-surface-hover block w-full rounded-md p-3 text-left transition-colors"
                        @click="copyToClipboard(color.text)"
                    >
                        <p :class="[color.text, 'text-lg font-medium']">
                            The quick brown fox jumps over the lazy dog
                        </p>
                        <code class="text-muted text-xs">{{ color.text }}</code>
                    </button>
                </div>
            </div>
        </section>

        <!-- Semantic Colors -->
        <section class="space-y-4">
            <div>
                <h2 class="text-text text-lg font-semibold">Semantic Colors</h2>
                <p class="text-muted text-sm">
                    These automatically adapt to light/dark mode
                </p>
            </div>
            <div class="border-border bg-surface rounded-lg border p-6">
                <div class="space-y-3">
                    <button
                        v-for="color in semanticColors"
                        :key="color.name"
                        class="hover:bg-surface-hover flex w-full items-center gap-4 rounded-md p-2 transition-colors"
                        @click="copyToClipboard(color.bgClass)"
                    >
                        <div
                            :class="[
                                color.bgClass,
                                'border-border h-12 w-24 flex-shrink-0 rounded-md border',
                            ]"
                        ></div>
                        <div class="text-left">
                            <code class="text-text text-sm font-medium">{{
                                color.bgClass
                            }}</code>
                            <p class="text-muted text-xs">
                                {{ color.desc }}
                            </p>
                        </div>
                    </button>
                </div>
            </div>
        </section>

        <!-- Text Colors -->
        <section class="space-y-4">
            <div>
                <h2 class="text-text text-lg font-semibold">Text Colors</h2>
                <p class="text-muted text-sm">
                    Semantic text colors that adapt to theme
                </p>
            </div>
            <div class="border-border bg-surface rounded-lg border p-6">
                <div class="space-y-4">
                    <button
                        v-for="color in textColors"
                        :key="color.name"
                        class="hover:bg-surface-hover block w-full rounded-md p-3 text-left transition-colors"
                        @click="copyToClipboard(color.class)"
                    >
                        <p :class="[color.class, 'text-lg']">
                            The quick brown fox jumps over the lazy dog
                        </p>
                        <div class="mt-1 flex items-center gap-2">
                            <code class="text-muted text-xs">{{
                                color.class
                            }}</code>
                            <span class="text-muted text-xs">-</span>
                            <span class="text-muted text-xs">{{
                                color.desc
                            }}</span>
                        </div>
                    </button>
                </div>
            </div>
        </section>

        <!-- Border Color -->
        <section class="space-y-4">
            <div>
                <h2 class="text-text text-lg font-semibold">Border Color</h2>
                <p class="text-muted text-sm">
                    Usage:
                    <code class="bg-surface-hover rounded px-1"
                        >border-border</code
                    >
                </p>
            </div>
            <div class="border-border bg-surface rounded-lg border p-6">
                <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <button
                        class="border-border hover:bg-surface-hover rounded-md border-2 p-4 transition-colors"
                        @click="copyToClipboard('border-border')"
                    >
                        <code class="text-text text-sm">border-border</code>
                        <p class="text-muted mt-1 text-xs">Default border</p>
                    </button>
                    <button
                        class="border-primary-500 hover:bg-surface-hover rounded-md border-2 p-4 transition-colors"
                        @click="copyToClipboard('border-primary-500')"
                    >
                        <code class="text-text text-sm"
                            >border-primary-500</code
                        >
                        <p class="text-muted mt-1 text-xs">Primary border</p>
                    </button>
                    <button
                        class="border-danger hover:bg-surface-hover rounded-md border-2 p-4 transition-colors"
                        @click="copyToClipboard('border-danger')"
                    >
                        <code class="text-text text-sm">border-danger</code>
                        <p class="text-muted mt-1 text-xs">Error border</p>
                    </button>
                </div>
            </div>
        </section>

        <!-- Border Radius -->
        <section class="space-y-4">
            <div>
                <h2 class="text-text text-lg font-semibold">Border Radius</h2>
                <p class="text-muted text-sm">
                    Usage:
                    <code class="bg-surface-hover rounded px-1"
                        >rounded-lg</code
                    >
                </p>
            </div>
            <div class="border-border bg-surface rounded-lg border p-6">
                <div class="bg-body border-border rounded-lg border p-6">
                    <div class="flex flex-wrap items-center gap-6">
                        <button
                            v-for="radius in radiusValues"
                            :key="radius.name"
                            :class="[
                                radius.class,
                                'bg-surface border-border flex h-20 w-20 flex-col items-center justify-center border shadow-sm transition-transform hover:scale-105',
                            ]"
                            @click="copyToClipboard(radius.class)"
                        >
                            <span class="text-text text-sm font-medium">{{
                                radius.name
                            }}</span>
                        </button>
                    </div>
                </div>
                <div class="text-muted mt-4 text-sm">
                    <p>
                        <code class="bg-surface-hover rounded px-1"
                            >rounded-sm</code
                        >
                        = 6px |
                        <code class="bg-surface-hover rounded px-1"
                            >rounded-md</code
                        >
                        = 8px |
                        <code class="bg-surface-hover rounded px-1"
                            >rounded-lg</code
                        >
                        = 12px |
                        <code class="bg-surface-hover rounded px-1"
                            >rounded-xl</code
                        >
                        = 16px
                    </p>
                </div>
            </div>
        </section>

        <!-- Focus Ring -->
        <section class="space-y-4">
            <div>
                <h2 class="text-text text-lg font-semibold">Focus Ring</h2>
                <p class="text-muted text-sm">
                    Usage:
                    <code class="bg-surface-hover rounded px-1"
                        >focus:ring-focus-ring</code
                    >
                </p>
            </div>
            <div class="border-border bg-surface rounded-lg border p-6">
                <div class="flex flex-wrap gap-4">
                    <input
                        type="text"
                        placeholder="Focus me..."
                        class="border-input-border bg-input-bg text-text focus:ring-focus-ring rounded-md border px-3 py-2 focus:border-transparent focus:ring-2 focus:outline-none"
                    />
                    <button
                        class="bg-primary-600 hover:bg-primary-700 focus:ring-focus-ring rounded-md px-4 py-2 text-white focus:ring-2 focus:ring-offset-2 focus:outline-none"
                    >
                        Focus me
                    </button>
                </div>
            </div>
        </section>

        <!-- Customization Guide -->
        <section class="space-y-4">
            <h2 class="text-text text-lg font-semibold">Customization</h2>
            <div class="border-border bg-surface rounded-lg border p-6">
                <div class="text-muted space-y-4 text-sm">
                    <p>
                        Override theme variables in your
                        <code class="bg-surface-hover rounded px-1"
                            >style.css</code
                        >
                        using the
                        <code class="bg-surface-hover rounded px-1"
                            >@theme</code
                        >
                        directive:
                    </p>
                    <pre
                        class="bg-surface-hover overflow-x-auto rounded-md p-4 text-xs"
                    ><code class="text-text">@import 'tailwindcss';
@import '@paya-labs/admin-ui/styles';

@theme {
    /* Custom primary color */
    --color-primary-500: #8b5cf6;
    --color-primary-600: #7c3aed;

    /* Custom semantic colors */
    --color-surface: #fefefe;
    --color-danger: #dc2626;
}</code></pre>
                    <p>
                        See the CLI template's
                        <code class="bg-surface-hover rounded px-1"
                            >style.css</code
                        >
                        for a full list of customizable variables.
                    </p>
                </div>
            </div>
        </section>
    </div>
</template>
