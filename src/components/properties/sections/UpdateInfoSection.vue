<template>
  <div class="bg-white p-6 rounded-lg shadow">
    <h3 class="text-lg font-semibold mb-4">{{ t('properties.fields.updateInformation') }}</h3>
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <!-- Reminder Time -->
      <div>
        <label class="block text-sm font-medium mb-1">{{ t('properties.fields.reminderTime') }}</label>
        <input
          type="time"
          :value="modelValue.reminder_time"
          @input="updateField('reminder_time', $event.target.value)"
          class="w-full border rounded px-3 py-2"
        />
      </div>

      <!-- Rent To -->
      <div>
        <label class="block text-sm font-medium mb-1">{{ t('properties.fields.rentTo') }}</label>
        <input
          type="date"
          :value="modelValue.rent_to"
          @input="updateField('rent_to', $event.target.value)"
          class="w-full border rounded px-3 py-2"
        />
      </div>

      <!-- Reminder Date -->
      <div>
        <label class="block text-sm font-medium mb-1">{{ t('properties.fields.reminderDate') }}</label>
        <input
          type="date"
          :value="modelValue.reminder_date"
          @input="updateField('reminder_date', $event.target.value)"
          class="w-full border rounded px-3 py-2"
        />
      </div>

      <!-- Repeated Statement -->
      <div>
        <label class="block text-sm font-medium mb-1">{{ t('properties.fields.repeatedStatement') }}</label>
        <select
          :value="modelValue.repeated_statement"
          @input="updateField('repeated_statement', $event.target.value)"
          class="w-full border rounded px-3 py-2"
        >
          <option value="">{{ t('properties.options.select') }}</option>
          <option value="Repeated">{{ t('properties.options.repeated') }}</option>
          <option value="Not Repeated">{{ t('properties.options.notRepeated') }}</option>
          <option value="Unknown">{{ t('properties.options.unknown') }}</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['update:modelValue']);

const updateField = (field, value) => {
  emit('update:modelValue', { ...props.modelValue, [field]: value });
};
</script>
