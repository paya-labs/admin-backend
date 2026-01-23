<script setup lang="ts">
interface FormField {
    name: string;
    label?: string;
    type?: string;
    required?: boolean;
    placeholder?: string;
}

interface Props {
    fields?: FormField[];
    modelValue?: Record<string, unknown>;
}

const props = withDefaults(defineProps<Props>(), {
    fields: () => [],
    modelValue: () => ({}),
});

const emit = defineEmits<{
    'update:modelValue': [value: Record<string, unknown>];
    submit: [value: Record<string, unknown>];
}>();

const handleSubmit = (event: Event): void => {
    event.preventDefault();
    emit('submit', props.modelValue);
};
</script>

<template>
    <form class="space-y-4" @submit="handleSubmit">
        <slot :fields="fields" :model="modelValue">
            <p class="text-text-muted">
                Form component placeholder. Override this slot to build your
                form.
            </p>
        </slot>
    </form>
</template>
