<script setup lang="ts">
import type { FrequencyOption, ModalSize, NewEventData } from '../types';
import AppButton from './AppButton.vue';
import AppCalendarEventForm from './AppCalendarEventForm.vue';
import AppModal from './AppModal.vue';

interface Props {
    modelValue: boolean;
    eventData: NewEventData;
    frequencyOptions: FrequencyOption[];
    validationError?: string | null;
    size?: ModalSize;
}

withDefaults(defineProps<Props>(), {
    validationError: null,
    size: 'sm',
});

const emit = defineEmits<{
    'update:modelValue': [value: boolean];
    'update:eventData': [value: NewEventData];
    close: [];
    save: [];
}>();

const handleClose = () => {
    emit('update:modelValue', false);
    emit('close');
};

const handleSave = () => {
    emit('save');
};

const handleEventDataUpdate = (value: NewEventData) => {
    emit('update:eventData', value);
};
</script>

<template>
    <AppModal
        :model-value="modelValue"
        title="Add Event"
        :size="size"
        @update:model-value="emit('update:modelValue', $event)"
    >
        <slot :event="eventData" :close="handleClose" :save="handleSave">
            <AppCalendarEventForm
                :model-value="eventData"
                :frequency-options="frequencyOptions"
                :validation-error="validationError"
                @update:model-value="handleEventDataUpdate"
                @submit="handleSave"
            />
        </slot>

        <template #footer>
            <slot name="footer" :close="handleClose" :save="handleSave">
                <AppButton variant="outline" @click="handleClose">
                    Cancel
                </AppButton>
                <AppButton variant="primary" @click="handleSave">
                    Add Event
                </AppButton>
            </slot>
        </template>
    </AppModal>
</template>
