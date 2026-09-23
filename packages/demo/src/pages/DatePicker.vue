<script setup>
import {
    AppCheckbox,
    AppDatePanel,
    AppDatePicker,
    toIsoDate,
} from '@paya-labs/admin-ui';
import { ref } from 'vue';

const basic = ref('');
const bounded = ref('2026-09-15');
const birthDate = ref('');

// Appointment row: times are HH:mm strings, changing the start keeps the duration
const appointment = ref({
    date: '2026-09-23',
    start: '09:30',
    end: '10:30',
    allDay: false,
});
const toMinutes = (hhmm) => {
    const [h, m] = hhmm.split(':').map(Number);
    return h * 60 + m;
};
const toHHMM = (mins) =>
    `${String(Math.floor(mins / 60)).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}`;
const onStartChange = (start) => {
    const duration = Math.max(
        0,
        toMinutes(appointment.value.end) - toMinutes(appointment.value.start),
    );
    appointment.value.start = start;
    // End stays on the same day: the end list stops at 23:45
    appointment.value.end = toHHMM(
        Math.min(toMinutes(start) + duration, 24 * 60 - 15),
    );
};

const invoiceFrom = ref('2026-09-01');
const invoiceTo = ref('2026-09-30');

const reminder = ref('');

const panelValue = ref('2026-09-23');

const today = toIsoDate(new Date());
</script>

<template>
    <div class="space-y-8">
        <div>
            <h1 class="text-text text-2xl font-bold">Date Picker</h1>
            <p class="text-muted mt-1">
                Themed replacement for native date and time inputs. Values are
                plain <code>YYYY-MM-DD</code> and <code>HH:mm</code> strings.
            </p>
        </div>

        <!-- Date fields -->
        <section class="space-y-4">
            <h2 class="text-text text-lg font-semibold">Date fields</h2>
            <div class="border-border bg-surface rounded-lg border p-6">
                <div class="grid max-w-2xl gap-6 md:grid-cols-2">
                    <div>
                        <AppDatePicker
                            v-model="basic"
                            label="Due date"
                            hint="No constraints"
                        />
                        <p class="text-muted mt-2 text-sm">
                            Value: {{ basic || '—' }}
                        </p>
                    </div>
                    <div>
                        <AppDatePicker
                            v-model="bounded"
                            label="Delivery date"
                            min="2026-09-01"
                            max="2026-09-30"
                            required
                            hint="September 2026 only"
                        />
                        <p class="text-muted mt-2 text-sm">
                            Value: {{ bounded || '—' }}
                        </p>
                    </div>
                    <div>
                        <AppDatePicker
                            v-model="birthDate"
                            label="Birth date"
                            placeholder="Not set"
                            :max="today"
                            clearable
                        />
                        <p class="text-muted mt-2 text-sm">
                            Value: {{ birthDate || '—' }}
                        </p>
                    </div>
                    <div>
                        <AppDatePicker
                            model-value="2026-09-23"
                            label="Disabled"
                            disabled
                        />
                    </div>
                </div>
            </div>
        </section>

        <!-- Appointment -->
        <section class="space-y-4">
            <h2 class="text-text text-lg font-semibold">Appointment</h2>
            <div class="border-border bg-surface rounded-lg border p-6">
                <div class="max-w-2xl space-y-4">
                    <AppCheckbox v-model="appointment.allDay" label="All day" />
                    <div class="flex flex-wrap items-center gap-2">
                        <div class="w-56 max-w-full">
                            <AppDatePicker
                                v-model="appointment.date"
                                aria-label="Date"
                            />
                        </div>
                        <template v-if="!appointment.allDay">
                            <div class="w-28">
                                <AppDatePicker
                                    :model-value="appointment.start"
                                    mode="time"
                                    aria-label="Start time"
                                    @update:model-value="onStartChange"
                                />
                            </div>
                            <span class="text-muted">–</span>
                            <div class="w-28">
                                <AppDatePicker
                                    v-model="appointment.end"
                                    mode="time"
                                    aria-label="End time"
                                    :from="appointment.start"
                                />
                            </div>
                        </template>
                    </div>
                    <p class="text-muted text-sm">
                        Value: {{ appointment.date }}
                        <template v-if="!appointment.allDay">
                            {{ appointment.start }} – {{ appointment.end }}
                        </template>
                        <template v-else>(all day)</template>
                    </p>
                </div>
            </div>
        </section>

        <!-- Invoice period -->
        <section class="space-y-4">
            <h2 class="text-text text-lg font-semibold">Invoice period</h2>
            <div class="border-border bg-surface rounded-lg border p-6">
                <div class="flex max-w-2xl flex-wrap items-end gap-3">
                    <div class="w-52 max-w-full">
                        <AppDatePicker
                            v-model="invoiceFrom"
                            label="From"
                            size="sm"
                            :max="invoiceTo"
                        />
                    </div>
                    <div class="w-52 max-w-full">
                        <AppDatePicker
                            v-model="invoiceTo"
                            label="To"
                            size="sm"
                            :min="invoiceFrom"
                        />
                    </div>
                </div>
                <p class="text-muted mt-3 text-sm">
                    Value: {{ invoiceFrom }} → {{ invoiceTo }}
                </p>
            </div>
        </section>

        <!-- Time field -->
        <section class="space-y-4">
            <h2 class="text-text text-lg font-semibold">Time field</h2>
            <div class="border-border bg-surface rounded-lg border p-6">
                <div class="max-w-xs">
                    <AppDatePicker
                        v-model="reminder"
                        mode="time"
                        label="Reminder"
                        :step="30"
                        clearable
                        hint="30 minute step; type 9:30, 930, 14 or 9pm and press Enter"
                    />
                    <p class="text-muted mt-2 text-sm">
                        Value: {{ reminder || '—' }}
                    </p>
                </div>
            </div>
        </section>

        <!-- Standalone panel -->
        <section class="space-y-4">
            <h2 class="text-text text-lg font-semibold">Standalone panel</h2>
            <div class="border-border bg-surface rounded-lg border p-6">
                <AppDatePanel
                    v-model="panelValue"
                    range-start="2026-09-21"
                    range-end="2026-09-28"
                />
                <p class="text-muted mt-3 text-sm">
                    Value: {{ panelValue }} · shaded range 2026-09-21 →
                    2026-09-28 (exclusive)
                </p>
            </div>
        </section>
    </div>
</template>
