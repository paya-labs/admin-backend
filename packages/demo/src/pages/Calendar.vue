<script setup>
import { AppButton, AppCalendar, AppInput } from '@paya-labs/admin-ui';
import events from './calendar-events.json';

function onEventClick(info) {
    console.log('Event clicked:', info.event.title);
}

function onDateClick(info) {
    console.log('Date clicked:', info.dateStr);
}

function onDeleteEvent(payload) {
    console.log('Event deleted:', payload.event.title);
}
</script>

<template>
    <div class="space-y-12">
        <div>
            <h1 class="text-text text-2xl font-bold">
                Calendar Component Demo
            </h1>
            <p class="text-muted mt-1">
                This page showcases various configurations of the AppCalendar
                component.
            </p>
        </div>

        <!-- Section: Default Calendar -->
        <section class="space-y-4">
            <div>
                <h2 class="text-text text-lg font-semibold">
                    Default Calendar
                </h2>
                <p class="text-muted text-sm">
                    Basic usage with all default settings.
                </p>
            </div>
            <AppCalendar
                :events="events"
                height="600px"
                @event-click="onEventClick"
                @date-click="onDateClick"
            />
            <details class="border-border bg-surface-hover rounded-lg border">
                <summary
                    class="text-text cursor-pointer px-4 py-2 text-sm font-medium"
                >
                    View Code
                </summary>
                <pre
                    class="overflow-x-auto bg-gray-900 p-4 text-sm text-gray-100"
                >
                  <code v-pre>
                    &lt;AppCalendar
                      :events="events"
                      height="600px"
                      @event-click="onEventClick"
                      @date-click="onDateClick"
                    /&gt;
                  </code>
                </pre>
            </details>
        </section>

        <!-- Section: Single View (Month Only) -->
        <section class="space-y-4">
            <div>
                <h2 class="text-text text-lg font-semibold">
                    Single View (Month Only)
                </h2>
                <p class="text-muted text-sm">
                    Simplified toolbar with only month view available.
                </p>
            </div>
            <AppCalendar
                :events="events"
                height="500px"
                initial-view="dayGridMonth"
                :header-toolbar="{
                    left: 'prev,next today',
                    center: 'title',
                    right: '',
                }"
            />
            <details class="border-border bg-surface-hover rounded-lg border">
                <summary
                    class="text-text cursor-pointer px-4 py-2 text-sm font-medium"
                >
                    View Code
                </summary>
                <pre
                    class="overflow-x-auto bg-gray-900 p-4 text-sm text-gray-100"
                >
                  <code v-pre>
                    &lt;AppCalendar
                        :events="events"
                        height="500px"
                        initial-view="dayGridMonth"
                        :header-toolbar="{
                            left: 'prev,next today',
                            center: 'title',
                            right: '',
                        }"
                    /&gt;
                  </code>
                </pre>
            </details>
        </section>

        <!-- Section: Week + Day Views -->
        <section class="space-y-4">
            <div>
                <h2 class="text-text text-lg font-semibold">
                    Week + Day Views Only
                </h2>
                <p class="text-muted text-sm">
                    Scheduling-focused calendar with only week and day views.
                </p>
            </div>
            <AppCalendar
                :events="events"
                height="600px"
                initial-view="timeGridWeek"
                :header-toolbar="{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'timeGridWeek,timeGridDay',
                }"
            />
            <details class="border-border bg-surface-hover rounded-lg border">
                <summary
                    class="text-text cursor-pointer px-4 py-2 text-sm font-medium"
                >
                    View Code
                </summary>
                <pre
                    class="overflow-x-auto bg-gray-900 p-4 text-sm text-gray-100"
                >
                  <code v-pre>
                    &lt;AppCalendar
                        :events="events"
                        height="600px"
                        initial-view="timeGridWeek"
                        :header-toolbar="{
                            left: 'prev,next today',
                            center: 'title',
                            right: 'timeGridWeek,timeGridDay',
                        }"
                    /&gt;
                  </code>
                </pre>
            </details>
        </section>

        <!-- Section: Business Hours Display -->
        <section class="space-y-4">
            <div>
                <h2 class="text-text text-lg font-semibold">
                    Business Hours Display
                </h2>
                <p class="text-muted text-sm">
                    Showing business hours (9 AM - 5 PM, Mon-Fri) with hatched
                    non-business times.
                </p>
            </div>
            <AppCalendar
                :events="events"
                height="600px"
                initial-view="timeGridWeek"
                :business-hours="{
                    daysOfWeek: [1, 2, 3, 4, 5],
                    startTime: '09:00',
                    endTime: '17:00',
                }"
                slot-min-time="08:00:00"
                slot-max-time="18:00:00"
                slot-duration="00:30:00"
            />
            <details class="border-border bg-surface-hover rounded-lg border">
                <summary
                    class="text-text cursor-pointer px-4 py-2 text-sm font-medium"
                >
                    View Code
                </summary>
                <pre
                    class="overflow-x-auto bg-gray-900 p-4 text-sm text-gray-100"
                >
                  <code v-pre>
                    &lt;AppCalendar
                        :events="events"
                        height="600px"
                        initial-view="timeGridWeek"
                        :business-hours="{
                            daysOfWeek: [1, 2, 3, 4, 5],
                            startTime: '09:00',
                            endTime: '17:00',
                        }"
                        slot-min-time="08:00:00"
                        slot-max-time="18:00:00"
                        slot-duration="00:30:00"
                    /&gt;
                  </code>
                </pre>
            </details>
        </section>

        <!-- Section: Weekdays Only -->
        <section class="space-y-4">
            <div>
                <h2 class="text-text text-lg font-semibold">Weekdays Only</h2>
                <p class="text-muted text-sm">
                    Calendar with weekends hidden using :weekends="false".
                </p>
            </div>
            <AppCalendar
                :events="events"
                height="600px"
                initial-view="timeGridWeek"
                :weekends="false"
            />
            <details class="border-border bg-surface-hover rounded-lg border">
                <summary
                    class="text-text cursor-pointer px-4 py-2 text-sm font-medium"
                >
                    View Code
                </summary>
                <pre
                    class="overflow-x-auto bg-gray-900 p-4 text-sm text-gray-100"
                >
                  <code v-pre>
                    &lt;AppCalendar
                        :events="events"
                        height="600px"
                        initial-view="timeGridWeek"
                        :weekends="false"
                    /&gt;
                  </code>
                </pre>
            </details>
        </section>

        <!-- Section: Selection Constrained to Business Hours -->
        <section class="space-y-4">
            <div>
                <h2 class="text-text text-lg font-semibold">
                    Selection Constrained to Business Hours
                </h2>
                <p class="text-muted text-sm">
                    Users can only create events within business hours (9AM-5PM,
                    Mon-Fri). Clicking outside business hours is blocked.
                </p>
            </div>
            <AppCalendar
                :events="events"
                height="600px"
                initial-view="timeGridWeek"
                :business-hours="{
                    daysOfWeek: [1, 2, 3, 4, 5],
                    startTime: '09:00',
                    endTime: '17:00',
                }"
                select-constraint="businessHours"
                slot-min-time="08:00:00"
                slot-max-time="18:00:00"
                slot-duration="00:30:00"
            />
            <details class="border-border bg-surface-hover rounded-lg border">
                <summary
                    class="text-text cursor-pointer px-4 py-2 text-sm font-medium"
                >
                    View Code
                </summary>
                <pre
                    class="overflow-x-auto bg-gray-900 p-4 text-sm text-gray-100"
                >
                  <code v-pre>
                    &lt;AppCalendar
                        :events="events"
                        height="600px"
                        initial-view="timeGridWeek"
                        :business-hours="{
                            daysOfWeek: [1, 2, 3, 4, 5],
                            startTime: '09:00',
                            endTime: '17:00',
                        }"
                        select-constraint="businessHours"
                        slot-min-time="08:00:00"
                        slot-max-time="18:00:00"
                        slot-duration="00:30:00"
                    /&gt;
                  </code>
                </pre>
            </details>
        </section>

        <!-- Section: Read-Only Calendar -->
        <section class="space-y-4">
            <div>
                <h2 class="text-text text-lg font-semibold">
                    Read-Only Calendar
                </h2>
                <p class="text-muted text-sm">
                    Non-editable calendar with :editable="false". Events cannot
                    be dragged, resized, or created.
                </p>
            </div>
            <AppCalendar
                :events="events"
                height="500px"
                :editable="false"
                :enable-create-event-modal="false"
                :enable-event-deletion="false"
            />
            <details class="border-border bg-surface-hover rounded-lg border">
                <summary
                    class="text-text cursor-pointer px-4 py-2 text-sm font-medium"
                >
                    View Code
                </summary>
                <pre
                    class="overflow-x-auto bg-gray-900 p-4 text-sm text-gray-100"
                >
                  <code v-pre>
                    &lt;AppCalendar
                        :events="events"
                        height="500px"
                        :editable="false"
                        :enable-create-event-modal="false"
                        :enable-event-deletion="false"
                    /&gt;
                  </code>
                </pre>
            </details>
        </section>

        <!-- Section: Custom Event Details Modal -->
        <section class="space-y-4">
            <div>
                <h2 class="text-text text-lg font-semibold">
                    Custom Event Details Modal
                </h2>
                <p class="text-muted text-sm">
                    Using #event-modal slot with completely custom layout and
                    controls.
                </p>
            </div>
            <AppCalendar :events="events" height="500px">
                <template
                    #event-modal="{ event, formatTime, close, deleteEvent }"
                >
                    <div v-if="event" class="space-y-4">
                        <div class="flex items-center gap-3">
                            <div
                                class="h-4 w-4 rounded-full"
                                :style="{
                                    backgroundColor: event?.backgroundColor,
                                }"
                            ></div>
                            <span
                                class="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600"
                            >
                                {{ event?.allDay ? 'All Day' : 'Timed Event' }}
                            </span>
                        </div>
                        <div class="space-y-2">
                            <p class="text-muted text-sm">
                                <span class="text-text font-medium">When:</span>
                                {{ formatTime(event?.start, event?.allDay) }}
                            </p>
                            <p
                                v-if="event?.end && !event?.allDay"
                                class="text-muted text-sm"
                            >
                                <span class="text-text font-medium"
                                    >Until:</span
                                >
                                {{ formatTime(event?.end, false) }}
                            </p>
                        </div>
                        <div
                            class="border-border flex justify-end gap-2 border-t pt-4"
                        >
                            <AppButton
                                variant="outline"
                                size="sm"
                                @click="close"
                            >
                                Close
                            </AppButton>
                            <AppButton
                                variant="danger"
                                size="sm"
                                @click="deleteEvent"
                            >
                                Delete
                            </AppButton>
                        </div>
                    </div>
                </template>
            </AppCalendar>
            <details class="border-border bg-surface-hover rounded-lg border">
                <summary
                    class="text-text cursor-pointer px-4 py-2 text-sm font-medium"
                >
                    View Code
                </summary>
                <pre
                    class="overflow-x-auto bg-gray-900 p-4 text-sm text-gray-100"
                >
                  <code v-pre>
                    &lt;AppCalendar :events="events" height="500px"&gt;
                        &lt;template #event-modal="{ event, formatTime, close, deleteEvent }"&gt;
                            &lt;div v-if="event" class="space-y-4"&gt;
                                &lt;!-- Custom badge --&gt;
                                &lt;div class="flex items-center gap-3"&gt;
                                    &lt;div class="h-4 w-4 rounded-full" :style="{ backgroundColor: event.backgroundColor }" /&gt;
                                    &lt;span class="rounded-full bg-gray-100 px-2 py-0.5 text-xs"&gt;
                                        {{ event.allDay ? 'All Day' : 'Timed Event' }}
                                    &lt;/span&gt;
                                &lt;/div&gt;
                                &lt;!-- Event details --&gt;
                                &lt;div class="space-y-2"&gt;
                                    &lt;p&gt;When: {{ formatTime(event.start, event.allDay) }}&lt;/p&gt;
                                    &lt;p v-if="event.end && !event.allDay"&gt;
                                        Until: {{ formatTime(event.end, false) }}
                                    &lt;/p&gt;
                                &lt;/div&gt;
                                &lt;!-- Custom footer inside the slot --&gt;
                                &lt;div class="flex justify-end gap-2 border-t pt-4"&gt;
                                    &lt;AppButton variant="outline" size="sm" @click="close"&gt;Close&lt;/AppButton&gt;
                                    &lt;AppButton variant="danger" size="sm" @click="deleteEvent"&gt;Delete&lt;/AppButton&gt;
                                &lt;/div&gt;
                            &lt;/div&gt;
                        &lt;/template&gt;
                    &lt;/AppCalendar&gt;
                  </code>
                </pre>
            </details>
        </section>

        <!-- Section: Custom Create Event Modal -->
        <section class="space-y-4">
            <div>
                <h2 class="text-text text-lg font-semibold">
                    Custom Create Event Modal
                </h2>
                <p class="text-muted text-sm">
                    Using #add-event-modal slot with simplified form and custom
                    styling.
                </p>
            </div>
            <AppCalendar :events="events" height="500px">
                <template #add-event-modal="{ event, close, save }">
                    <div class="space-y-4">
                        <AppInput
                            v-model="event.title"
                            label="Event Name"
                            placeholder="What's happening?"
                        />
                        <div
                            class="text-muted rounded-md bg-gray-50 p-3 text-sm"
                        >
                            {{ event.start?.toLocaleString() }}
                        </div>
                        <div
                            class="border-border flex justify-end gap-2 border-t pt-4"
                        >
                            <AppButton variant="outline" @click="close">
                                Cancel
                            </AppButton>
                            <AppButton variant="primary" @click="save">
                                Create Event
                            </AppButton>
                        </div>
                    </div>
                </template>
            </AppCalendar>
            <details class="border-border bg-surface-hover rounded-lg border">
                <summary
                    class="text-text cursor-pointer px-4 py-2 text-sm font-medium"
                >
                    View Code
                </summary>
                <pre
                    class="overflow-x-auto bg-gray-900 p-4 text-sm text-gray-100"
                >
                  <code v-pre>
                    &lt;AppCalendar :events="events" height="500px"&gt;
                        &lt;template #add-event-modal="{ event, close, save }"&gt;
                            &lt;div class="space-y-4"&gt;
                                &lt;AppInput
                                    v-model="event.title"
                                    label="Event Name"
                                    placeholder="What's happening?"
                                /&gt;
                                &lt;div class="rounded-md bg-gray-50 p-3 text-sm"&gt;
                                    {{ event.start?.toLocaleString() }}
                                &lt;/div&gt;
                                &lt;!-- Custom footer inside the slot --&gt;
                                &lt;div class="flex justify-end gap-2 border-t pt-4"&gt;
                                    &lt;AppButton variant="outline" @click="close"&gt;Cancel&lt;/AppButton&gt;
                                    &lt;AppButton variant="primary" @click="save"&gt;Create Event&lt;/AppButton&gt;
                                &lt;/div&gt;
                            &lt;/div&gt;
                        &lt;/template&gt;
                    &lt;/AppCalendar&gt;
                  </code>
                </pre>
            </details>
        </section>

        <!-- Section: Event Deletion -->
        <section class="space-y-4">
            <div>
                <h2 class="text-text text-lg font-semibold">Event Deletion</h2>
                <p class="text-muted text-sm">
                    Click on an event to see the delete button. The
                    @delete-event emit is fired when deleting.
                </p>
            </div>
            <AppCalendar
                :events="events"
                height="500px"
                :enable-event-deletion="true"
                @delete-event="onDeleteEvent"
            />
            <details class="border-border bg-surface-hover rounded-lg border">
                <summary
                    class="text-text cursor-pointer px-4 py-2 text-sm font-medium"
                >
                    View Code
                </summary>
                <pre
                    class="overflow-x-auto bg-gray-900 p-4 text-sm text-gray-100"
                >
                  <code v-pre>
                    &lt;AppCalendar
                      :events="events"
                      height="500px"
                      :enable-event-deletion="true"
                      @delete-event="onDeleteEvent"
                    /&gt;

                    // Event handler
                    function onDeleteEvent(payload) {
                        console.log('Event deleted:', payload.event.title);
                    }
                  </code>
                </pre>
            </details>
        </section>

        <!-- Section: Custom Time Slots (30 min) with Larger Cells -->
        <section class="space-y-4">
            <div>
                <h2 class="text-text text-lg font-semibold">
                    Custom Time Slots with Larger Cells
                </h2>
                <p class="text-muted text-sm">
                    Using slotDuration="00:30:00" and slotHeight="3rem" for
                    larger, more readable time slots.
                </p>
            </div>
            <AppCalendar
                :events="events"
                height="600px"
                initial-view="timeGridWeek"
                slot-duration="00:30:00"
                slot-height="3rem"
                slot-min-time="06:00:00"
                slot-max-time="22:00:00"
            />
            <details class="border-border bg-surface-hover rounded-lg border">
                <summary
                    class="text-text cursor-pointer px-4 py-2 text-sm font-medium"
                >
                    View Code
                </summary>
                <pre
                    class="overflow-x-auto bg-gray-900 p-4 text-sm text-gray-100"
                >
                  <code v-pre>
                    &lt;AppCalendar
                        :events="events"
                        height="600px"
                        initial-view="timeGridWeek"
                        slot-duration="00:30:00"
                        slot-height="3rem"
                        slot-min-time="06:00:00"
                        slot-max-time="22:00:00"
                    /&gt;
                  </code>
                </pre>
            </details>
        </section>
    </div>
</template>
