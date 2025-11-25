<template>
  <div class="bg-white p-6 rounded-lg shadow">
    <h3 class="text-lg font-semibold mb-4">Owner Information</h3>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Property Offered By (required) -->
      <div>
        <label class="block text-sm font-medium mb-1">Property Offered By *</label>
        <select
          :value="modelValue.offered_by"
          @input="updateField('offered_by', $event.target.value)"
          required
          class="w-full border rounded px-3 py-2"
        >
          <option value="">Select</option>
          <option value="Owner">Owner</option>
          <option value="Owner Representative">Owner Representative</option>
          <option value="Broker">Broker</option>
          <option value="Guard">Guard</option>
        </select>
      </div>

      <!-- 4 Update -->
      <div>
        <label class="block text-sm font-medium mb-1">Update State</label>
        <select
          :value="modelValue.update_state"
          @input="updateField('update_state', $event.target.value)"
          class="w-full border rounded px-3 py-2"
        >
          <option value="Want Update">Want Update</option>
          <option value="Is Updated">Is Updated</option>
          <option value="Hidden">Hidden</option>
        </select>
      </div>

      <!-- Name (required) -->
      <div>
        <label class="block text-sm font-medium mb-1">Owner Name *</label>
        <input
          type="text"
          :value="modelValue.owner_name"
          @input="updateField('owner_name', $event.target.value)"
          required
          class="w-full border rounded px-3 py-2"
        />
      </div>

      <!-- Mobile No -->
      <div>
        <label class="block text-sm font-medium mb-1">Mobile No</label>
        <input
          type="tel"
          :value="modelValue.mobile"
          @input="updateField('mobile', $event.target.value)"
          class="w-full border rounded px-3 py-2"
        />
      </div>

      <!-- Tel -->
      <div>
        <label class="block text-sm font-medium mb-1">Tel</label>
        <input
          type="tel"
          :value="modelValue.tel"
          @input="updateField('tel', $event.target.value)"
          class="w-full border rounded px-3 py-2"
        />
      </div>

      <!-- Last Follow In -->
      <div>
        <label class="block text-sm font-medium mb-1">Last Follow In</label>
        <input
          type="date"
          :value="modelValue.last_follow_in"
          @input="updateField('last_follow_in', $event.target.value)"
          class="w-full border rounded px-3 py-2"
        />
      </div>

      <!-- Call Update -->
      <div>
        <label class="block text-sm font-medium mb-1">Call Update</label>
        <select
          :value="modelValue.call_update"
          @input="updateField('call_update', $event.target.value)"
          class="w-full border rounded px-3 py-2"
        >
          <option value="">Select</option>
          <option value="Answered">Answered</option>
          <option value="No Answer">No Answer</option>
          <option value="Not Available">Not Available</option>
        </select>
      </div>

      <!-- New Feedback (required) -->
      <div>
        <label class="block text-sm font-medium mb-1">New Feedback *</label>
        <select
          :value="modelValue.new_feedback"
          @input="updateField('new_feedback', $event.target.value)"
          required
          class="w-full border rounded px-3 py-2"
        >
          <option value="">Select</option>
          <option value="Done">Done</option>
          <option value="Under Follow Up">Under Follow Up</option>
          <option value="Unknown">Unknown</option>
          <option value="Need Follow">Need Follow</option>
        </select>
      </div>

      <!-- Note of Call -->
      <div class="md:col-span-3">
        <label class="block text-sm font-medium mb-1">Note of Call</label>
        <textarea
          rows="2"
          :value="modelValue.call_note"
          @input="updateField('call_note', $event.target.value)"
          class="w-full border rounded px-3 py-2"
        ></textarea>
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
