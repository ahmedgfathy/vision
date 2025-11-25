<template>
  <div class="bg-white p-6 rounded-lg shadow">
    <h3 class="text-lg font-semibold mb-4">{{ t('properties.fields.ownerInformation') }}</h3>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Property Offered By (required) -->
      <div>
        <label class="block text-sm font-medium mb-1">{{ t('properties.fields.propertyOfferedBy') }} *</label>
        <select
          :value="modelValue.offered_by"
          @input="updateField('offered_by', $event.target.value)"
          required
          class="w-full border rounded px-3 py-2"
        >
          <option value="">{{ t('properties.options.select') }}</option>
          <option value="Owner">{{ t('properties.options.owner') }}</option>
          <option value="Owner Representative">{{ t('properties.options.ownerRepresentative') }}</option>
          <option value="Broker">{{ t('properties.options.broker') }}</option>
          <option value="Guard">{{ t('properties.options.guard') }}</option>
        </select>
      </div>

      <!-- 4 Update -->
      <div>
        <label class="block text-sm font-medium mb-1">{{ t('properties.fields.updateState') }}</label>
        <select
          :value="modelValue.update_state"
          @input="updateField('update_state', $event.target.value)"
          class="w-full border rounded px-3 py-2"
        >
          <option value="Want Update">{{ t('properties.options.wantUpdate') }}</option>
          <option value="Is Updated">{{ t('properties.options.isUpdated') }}</option>
          <option value="Hidden">{{ t('properties.options.hidden') }}</option>
        </select>
      </div>

      <!-- Name (required) -->
      <div>
        <label class="block text-sm font-medium mb-1">{{ t('properties.fields.ownerName') }} *</label>
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
        <label class="block text-sm font-medium mb-1">{{ t('properties.fields.mobile') }}</label>
        <input
          type="tel"
          :value="modelValue.mobile"
          @input="updateField('mobile', $event.target.value)"
          class="w-full border rounded px-3 py-2"
        />
      </div>

      <!-- Tel -->
      <div>
        <label class="block text-sm font-medium mb-1">{{ t('properties.fields.tel') }}</label>
        <input
          type="tel"
          :value="modelValue.tel"
          @input="updateField('tel', $event.target.value)"
          class="w-full border rounded px-3 py-2"
        />
      </div>

      <!-- Last Follow In -->
      <div>
        <label class="block text-sm font-medium mb-1">{{ t('properties.fields.lastFollowIn') }}</label>
        <input
          type="date"
          :value="modelValue.last_follow_in"
          @input="updateField('last_follow_in', $event.target.value)"
          class="w-full border rounded px-3 py-2"
        />
      </div>

      <!-- Call Update -->
      <div>
        <label class="block text-sm font-medium mb-1">{{ t('properties.fields.callUpdate') }}</label>
        <select
          :value="modelValue.call_update"
          @input="updateField('call_update', $event.target.value)"
          class="w-full border rounded px-3 py-2"
        >
          <option value="">{{ t('properties.options.select') }}</option>
          <option value="Answered">{{ t('properties.options.answered') }}</option>
          <option value="No Answer">{{ t('properties.options.noAnswer') }}</option>
          <option value="Not Available">{{ t('properties.options.notAvailable') }}</option>
        </select>
      </div>

      <!-- New Feedback (required) -->
      <div>
        <label class="block text-sm font-medium mb-1">{{ t('properties.fields.newFeedback') }} *</label>
        <select
          :value="modelValue.new_feedback"
          @input="updateField('new_feedback', $event.target.value)"
          required
          class="w-full border rounded px-3 py-2"
        >
          <option value="">{{ t('properties.options.select') }}</option>
          <option value="Done">{{ t('properties.options.done') }}</option>
          <option value="Under Follow Up">{{ t('properties.options.underFollowUp') }}</option>
          <option value="Unknown">{{ t('properties.options.unknown') }}</option>
          <option value="Need Follow">{{ t('properties.options.needFollow') }}</option>
        </select>
      </div>

      <!-- Note of Call -->
      <div class="md:col-span-3">
        <label class="block text-sm font-medium mb-1">{{ t('properties.fields.callNote') }}</label>
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
