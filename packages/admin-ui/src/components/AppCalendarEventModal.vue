<script setup lang="ts">
import { useCalendarHelpers } from '../composables/useCalendarHelpers';
import type { ModalSize, SelectedEvent } from '../types';
import AppButton from './AppButton.vue';
import AppModal from './AppModal.vue';

interface Props {
    modelValue: boolean;
    event: SelectedEvent | null;
    enableDeletion?: boolean;
    size?: ModalSize;
}

withDefaults(defineProps<Props>(), {
    enableDeletion: true,
    size: 'sm',
});

const emit = defineEmits<{
    'update:modelValue': [value: boolean];
    close: [];
    delete: [];
}>();

const { formatEventTime } = useCalendarHelpers();

const handleClose = () => {
    emit('update:modelValue', false);
    emit('close');
};

const handleDelete = () => {
    emit('delete');
};
</script>

<template>
    <AppModal
        v-if="event"
        :key="event.id"
        :model-value="modelValue"
        :title="event.title || 'Event Details'"
        :size="size"
        @update:model-value="emit('update:modelValue', $event)"
    >
        <slot
            :event="event"
            :format-time="formatEventTime"
            :close="handleClose"
            :delete-event="handleDelete"
        >
            <!-- Default content when no slot is provided -->
            <div class="app-calendar-modal-content">
                <div
                    class="app-calendar-modal-color-bar"
                    :style="{ backgroundColor: event.backgroundColor }"
                />

                <div class="app-calendar-modal-details">
                    <div class="app-calendar-modal-row">
                        <svg
                            class="app-calendar-modal-icon"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <rect
                                x="3"
                                y="4"
                                width="18"
                                height="18"
                                rx="2"
                                ry="2"
                            />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        <div>
                            <div class="app-calendar-modal-label">
                                {{ event.allDay ? 'Date' : 'Start' }}
                            </div>
                            <div class="app-calendar-modal-value">
                                {{ formatEventTime(event.start, event.allDay) }}
                            </div>
                        </div>
                    </div>

                    <div
                        v-if="event.end && !event.allDay"
                        class="app-calendar-modal-row"
                    >
                        <svg
                            class="app-calendar-modal-icon"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                        </svg>
                        <div>
                            <div class="app-calendar-modal-label">End</div>
                            <div class="app-calendar-modal-value">
                                {{ formatEventTime(event.end, false) }}
                            </div>
                        </div>
                    </div>

                    <div v-if="event.allDay" class="app-calendar-modal-row">
                        <svg
                            class="app-calendar-modal-icon"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <path d="M12 2v20M2 12h20" />
                        </svg>
                        <div>
                            <div class="app-calendar-modal-label">Type</div>
                            <div class="app-calendar-modal-value">
                                All-day event
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </slot>

        <template #footer>
            <slot
                name="footer"
                :event="event"
                :close="handleClose"
                :delete-event="handleDelete"
            >
                <!-- Default footer with delete button when enabled -->
                <AppButton
                    v-if="enableDeletion"
                    variant="danger"
                    @click="handleDelete"
                >
                    Delete
                </AppButton>
            </slot>
        </template>
    </AppModal>
</template>
