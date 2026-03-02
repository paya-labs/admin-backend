<script setup>
import { AppIcon, AppSelect } from '@paya-labs/admin-ui';
import { ref } from 'vue';

const selectedSize = ref('md');

const sizes = ['sm', 'md', 'lg', 'xl'];

const sizeOptions = sizes.map((size) => ({ value: size, label: size }));

const iconGroups = {
    Navigation: [
        'home',
        'menu',
        'x',
        'chevron-down',
        'chevron-up',
        'chevron-left',
        'chevron-right',
        'arrow-left',
        'arrow-right',
        'arrow-up',
        'arrow-down',
    ],
    Users: ['user', 'users', 'user-circle'],
    Actions: ['cog', 'search', 'bell', 'logout', 'refresh'],
    Content: ['document', 'folder', 'table', 'grid', 'list', 'layers'],
    'Edit & Modify': [
        'edit',
        'pencil',
        'trash',
        'plus',
        'minus',
        'check',
        'x-mark',
    ],
    Status: [
        'check-circle',
        'x-circle',
        'exclamation-circle',
        'information-circle',
        'eye',
        'eye-off',
    ],
    Commerce: ['shopping-cart', 'credit-card', 'currency-dollar'],
    Charts: ['chart-bar', 'chart-pie', 'trending-up', 'trending-down'],
    Communication: ['mail', 'phone', 'globe-alt', 'link'],
    Misc: ['calendar', 'clock', 'star', 'heart', 'download', 'upload'],
};

const copyToClipboard = (iconName) => {
    navigator.clipboard.writeText(`<AppIcon name="${iconName}" />`);
};
</script>

<template>
    <div class="space-y-8">
        <div>
            <h1 class="text-text text-2xl font-bold">Icon Library</h1>
            <p class="text-muted mt-1">
                Heroicons outline set. Click any icon to copy its usage code.
            </p>
        </div>

        <!-- Size Selector -->
        <section class="space-y-4">
            <h2 class="text-text text-lg font-semibold">Sizes</h2>
            <div class="border-border bg-surface rounded-lg border p-6">
                <div class="flex flex-wrap items-end gap-6">
                    <div
                        v-for="size in sizes"
                        :key="size"
                        class="flex flex-col items-center gap-2"
                    >
                        <AppIcon name="home" :size="size" />
                        <span class="text-muted text-xs">
                            {{ size }}
                        </span>
                    </div>
                </div>
                <div class="text-muted mt-4 text-sm">
                    <code class="bg-surface-hover rounded px-2 py-1">
                        &lt;AppIcon name="home" size="lg" /&gt;
                    </code>
                </div>
            </div>
        </section>

        <!-- Color Examples -->
        <section class="space-y-4">
            <h2 class="text-text text-lg font-semibold">Colors</h2>
            <div class="border-border bg-surface rounded-lg border p-6">
                <p class="text-muted mb-4 text-sm">
                    Icons inherit the current text color. Use Tailwind classes
                    to customize.
                </p>
                <div class="flex flex-wrap items-center gap-6">
                    <div class="flex flex-col items-center gap-2">
                        <AppIcon name="heart" size="lg" class="text-danger" />
                        <span class="text-muted text-xs">danger</span>
                    </div>
                    <div class="flex flex-col items-center gap-2">
                        <AppIcon
                            name="check-circle"
                            size="lg"
                            class="text-success"
                        />
                        <span class="text-muted text-xs">success</span>
                    </div>
                    <div class="flex flex-col items-center gap-2">
                        <AppIcon
                            name="exclamation-circle"
                            size="lg"
                            class="text-warning"
                        />
                        <span class="text-muted text-xs">warning</span>
                    </div>
                    <div class="flex flex-col items-center gap-2">
                        <AppIcon
                            name="information-circle"
                            size="lg"
                            class="text-primary-500"
                        />
                        <span class="text-muted text-xs">primary</span>
                    </div>
                    <div class="flex flex-col items-center gap-2">
                        <AppIcon name="cog" size="lg" class="text-muted" />
                        <span class="text-muted text-xs">muted</span>
                    </div>
                </div>
                <div class="text-muted mt-4 text-sm">
                    <code class="bg-surface-hover rounded px-2 py-1">
                        &lt;AppIcon name="heart" class="text-danger" /&gt;
                    </code>
                </div>
            </div>
        </section>

        <!-- Size Filter -->
        <section class="space-y-4">
            <div class="flex items-center justify-between">
                <h2 class="text-text text-lg font-semibold">All Icons</h2>
                <div class="flex items-center gap-2">
                    <span class="text-muted text-sm">Preview size:</span>
                    <AppSelect
                        v-model="selectedSize"
                        :options="sizeOptions"
                        class="w-20"
                    />
                </div>
            </div>

            <!-- Icon Groups -->
            <div
                v-for="(icons, groupName) in iconGroups"
                :key="groupName"
                class="space-y-3"
            >
                <h3 class="text-muted text-sm font-medium">
                    {{ groupName }}
                </h3>
                <div class="border-border bg-surface rounded-lg border p-4">
                    <div
                        class="grid grid-cols-4 gap-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10"
                    >
                        <button
                            v-for="icon in icons"
                            :key="icon"
                            class="group hover:bg-surface-hover flex flex-col items-center gap-2 rounded-md p-3 transition-colors"
                            :title="`Click to copy: <AppIcon name=&quot;${icon}&quot; />`"
                            @click="copyToClipboard(icon)"
                        >
                            <AppIcon
                                :name="icon"
                                :size="selectedSize"
                                class="text-text transition-transform group-hover:scale-110"
                            />
                            <span
                                class="text-muted max-w-full truncate text-xs"
                            >
                                {{ icon }}
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </section>

        <!-- Usage Examples -->
        <section class="space-y-4">
            <h2 class="text-text text-lg font-semibold">Usage Examples</h2>
            <div class="border-border bg-surface rounded-lg border p-6">
                <div class="space-y-4 text-sm">
                    <div>
                        <p class="text-text mb-2 font-medium">Basic usage:</p>
                        <code
                            class="bg-surface-hover text-muted block rounded p-3"
                        >
                            &lt;AppIcon name="home" /&gt;
                        </code>
                    </div>
                    <div>
                        <p class="text-text mb-2 font-medium">With size:</p>
                        <code
                            class="bg-surface-hover text-muted block rounded p-3"
                        >
                            &lt;AppIcon name="users" size="lg" /&gt;
                        </code>
                    </div>
                    <div>
                        <p class="text-text mb-2 font-medium">
                            With custom color:
                        </p>
                        <code
                            class="bg-surface-hover text-muted block rounded p-3"
                        >
                            &lt;AppIcon name="heart" class="text-danger" /&gt;
                        </code>
                    </div>
                    <div>
                        <p class="text-text mb-2 font-medium">Import:</p>
                        <code
                            class="bg-surface-hover text-muted block rounded p-3"
                        >
                            import { AppIcon } from '@paya-labs/admin-ui';
                        </code>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>
