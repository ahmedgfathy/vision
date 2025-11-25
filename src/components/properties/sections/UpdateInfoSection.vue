<template>
  <div class="bg-white p-6 rounded-lg shadow">
    <h3 class="text-lg font-semibold mb-4">Update Information</h3>
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <!-- Reminder Time -->
      <div>
        <label class="block text-sm font-medium mb-1">Reminder Time</label>
        <input
          type="time"
          :value="modelValue.reminder_time"
          @input="updateField('reminder_time', $event.target.value)"
          class="w-full border rounded px-3 py-2"
        />
      </div>

      <!-- Rent To -->
      <div>
        <label class="block text-sm font-medium mb-1">Rent To</label>
        <input
          type="date"
          :value="modelValue.rent_to"
          @input="updateField('rent_to', $event.target.value)"
          class="w-full border rounded px-3 py-2"
        />
      </div>

      <!-- Reminder Date -->
      <div>
        <label class="block text-sm font-medium mb-1">Reminder Date</label>
        <input
          type="date"
          :value="modelValue.reminder_date"
          @input="updateField('reminder_date', $event.target.value)"
          class="w-full border rounded px-3 py-2"
        />
      </div>

      <!-- Repeated Statement -->
      <div>
        <label class="block text-sm font-medium mb-1">Repeated Statement</label>
        <select
          :value="modelValue.repeated_statement"
          @input="updateField('repeated_statement', $event.target.value)"
          class="w-full border rounded px-3 py-2"
        >
          <option value="">Select</option>
          <option value="Repeated">Repeated</option>
          <option value="Not Repeated">Not Repeated</option>
          <option value="Unknown">Unknown</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup>
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
