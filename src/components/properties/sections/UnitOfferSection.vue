<template>
  <div class="bg-white p-6 rounded-lg shadow">
    <h3 class="text-lg font-semibold mb-4">Unit Offer</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Unit For -->
      <div>
        <label class="block text-sm font-medium mb-1">Unit For *</label>
        <select
          :value="modelValue.unit_for"
          @input="updateField('unit_for', $event.target.value)"
          required
          class="w-full border rounded px-3 py-2"
        >
          <option value="">Select Status</option>
          <option value="For Rent">For Rent</option>
          <option value="For Sale">For Sale</option>
          <option value="Sold Out">Sold Out</option>
          <option value="Recycle">Recycle</option>
        </select>
      </div>

      <!-- Area -->
      <div>
        <label class="block text-sm font-medium mb-1">Area</label>
        <select
          :value="modelValue.area_id"
          @input="updateField('area_id', $event.target.value)"
          class="w-full border rounded px-3 py-2"
        >
          <option value="">Select Area</option>
          <option v-for="area in areas" :key="area.id" :value="area.id">
            {{ area.value }}
          </option>
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
  },
  areas: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['update:modelValue']);

const updateField = (field, value) => {
  emit('update:modelValue', { ...props.modelValue, [field]: value });
};
</script>
