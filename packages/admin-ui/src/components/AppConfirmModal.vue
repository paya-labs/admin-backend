<script setup lang="ts">
import AppButton from './AppButton.vue';
import AppModal from './AppModal.vue';

const model = defineModel<boolean>({ default: false });

interface Props {
    title: string;
    confirmLabel?: string;
    cancelLabel?: string;
    danger?: boolean;
    loading?: boolean;
}

withDefaults(defineProps<Props>(), {
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel',
    danger: false,
    loading: false,
});

const emit = defineEmits<{ confirm: [] }>();
</script>

<template>
    <!-- While the action runs, only the action's own outcome closes the modal -->
    <AppModal
        v-model="model"
        :title="title"
        :close-on-backdrop="!loading"
        :close-on-escape="!loading"
    >
        <div class="text-text space-y-3 text-sm">
            <slot />
        </div>
        <template #footer>
            <!-- Phone: stacked full-width 44px buttons, action first, Cancel last -->
            <div
                class="flex justify-end gap-3 max-md:w-full max-md:flex-col-reverse max-md:*:w-full"
            >
                <slot name="cancel">
                    <AppButton
                        variant="secondary"
                        :disabled="loading"
                        @click="model = false"
                    >
                        {{ cancelLabel }}
                    </AppButton>
                </slot>
                <AppButton
                    :variant="danger ? 'danger' : 'primary'"
                    :loading="loading"
                    @click="emit('confirm')"
                >
                    {{ confirmLabel }}
                </AppButton>
            </div>
        </template>
    </AppModal>
</template>
