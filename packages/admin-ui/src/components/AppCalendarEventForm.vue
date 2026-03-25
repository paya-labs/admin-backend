<script setup lang="ts">
import { computed } from 'vue';
import { useCalendarHelpers } from '../composables/useCalendarHelpers';
import type { EventColor, FrequencyOption, NewEventData } from '../types';
import AppColorPicker from './AppColorPicker.vue';

interface Props {
    modelValue: NewEventData;
    frequencyOptions: FrequencyOption[];
    eventColors: EventColor[];
    validationError?: string | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
    'update:modelValue': [value: NewEventData];
    submit: [];
}>();

const { formatDateForInput, formatDateOnlyForInput, parseDateFromInput } =
    useCalendarHelpers();

// Two-way binding helpers
const title = computed({
    get: () => props.modelValue.title,
    set: (value: string) =>
        emit('update:modelValue', { ...props.modelValue, title: value }),
});

const allDay = computed({
    get: () => props.modelValue.allDay,
    set: (value: boolean) =>
        emit('update:modelValue', { ...props.modelValue, allDay: value }),
});

const frequency = computed({
    get: () => props.modelValue.frequency,
    set: (value: NewEventData['frequency']) =>
        emit('update:modelValue', { ...props.modelValue, frequency: value }),
});

const backgroundColor = computed({
    get: () => props.modelValue.backgroundColor,
    set: (value: string) =>
        emit('update:modelValue', {
            ...props.modelValue,
            backgroundColor: value,
        }),
});

const handleStartChange = (value: string) => {
    const date = parseDateFromInput(value);
    emit('update:modelValue', { ...props.modelValue, start: date });
};

const handleEndChange = (value: string) => {
    const date = parseDateFromInput(value);
    emit('update:modelValue', { ...props.modelValue, end: date });
};

const handleSubmit = () => {
    emit('submit');
};
</script>

<template>
    <div class="app-calendar-modal-content">
        <!-- Validation error -->
        <div
            v-if="validationError"
            class="app-calendar-validation-error"
            role="alert"
        >
            {{ validationError }}
        </div>

        <div class="app-calendar-add-form">
            <label>
                <span class="app-calendar-modal-label">Title</span>
                <input
                    v-model="title"
                    type="text"
                    class="app-calendar-input"
                    placeholder="Event title"
                    @keydown.enter="handleSubmit"
                />
            </label>

            <label class="app-calendar-checkbox">
                <input v-model="allDay" type="checkbox" />
                <span>All-day event</span>
            </label>

            <!-- Date inputs for all-day events -->
            <template v-if="modelValue.allDay">
                <label>
                    <span class="app-calendar-modal-label">Date</span>
                    <input
                        type="date"
                        class="app-calendar-input"
                        :value="formatDateOnlyForInput(modelValue.start)"
                        @input="
                            handleStartChange(
                                ($event.target as HTMLInputElement).value,
                            )
                        "
                    />
                </label>
            </template>

            <!-- Datetime inputs for timed events -->
            <template v-else>
                <label>
                    <span class="app-calendar-modal-label">Start</span>
                    <input
                        type="datetime-local"
                        class="app-calendar-input"
                        :value="formatDateForInput(modelValue.start)"
                        @input="
                            handleStartChange(
                                ($event.target as HTMLInputElement).value,
                            )
                        "
                    />
                </label>

                <label>
                    <span class="app-calendar-modal-label">End</span>
                    <input
                        type="datetime-local"
                        class="app-calendar-input"
                        :value="formatDateForInput(modelValue.end)"
                        @input="
                            handleEndChange(
                                ($event.target as HTMLInputElement).value,
                            )
                        "
                    />
                </label>
            </template>

            <label>
                <span class="app-calendar-modal-label">Repeat</span>
                <select
                    v-model="frequency"
                    class="app-calendar-input app-calendar-select"
                >
                    <option
                        v-for="opt in frequencyOptions"
                        :key="opt.value"
                        :value="opt.value"
                    >
                        {{ opt.label }}
                    </option>
                </select>
            </label>

            <AppColorPicker
                v-model="backgroundColor"
                :colors="eventColors"
                label="Color"
            />
        </div>
    </div>
</template>
