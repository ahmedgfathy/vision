<template>
  <div class="bg-white p-6 rounded-lg shadow">
    <h3 class="text-lg font-semibold mb-4">{{ t('properties.sections.moreInfo') }}</h3>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Property Name / Compound Name (required) -->
      <div>
        <label class="block text-sm font-medium mb-1">
          {{ t('properties.fields.propertyName') }} *
        </label>
        <input
          type="text"
          :value="modelValue.property_name"
          @input="updateField('property_name', $event.target.value)"
          required
          class="w-full border rounded px-3 py-2"
          :placeholder="$i18n.locale === 'ar' ? 'مثال: بالم هيلز, نيو جيزة' : 'e.g., Palm Hills, New Giza'"
        />
      </div>

      <!-- Handler -->
      <div>
        <label class="block text-sm font-medium mb-1">{{ t('properties.fields.handler') }}</label>
        <select
          :value="modelValue.handler_id"
          @input="updateField('handler_id', $event.target.value)"
          class="w-full border rounded px-3 py-2"
        >
          <option value="">{{ t('properties.options.select') }}</option>
          <option v-for="user in users" :key="user.id" :value="user.id">
            {{ user.username }}
          </option>
        </select>
      </div>

      <!-- Phase -->
      <div>
        <label class="block text-sm font-medium mb-1">{{ t('properties.fields.phase') }}</label>
        <select
          :value="modelValue.phase_id"
          @input="updateField('phase_id', $event.target.value)"
          class="w-full border rounded px-3 py-2"
        >
          <option value="">{{ t('properties.options.select') }}</option>
          <option v-for="phase in phases" :key="phase.id" :value="phase.id">
            {{ phase.value }}
          </option>
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
  },
  phases: {
    type: Array,
    default: () => []
  },
  users: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['update:modelValue']);

const updateField = (field, value) => {
  emit('update:modelValue', { ...props.modelValue, [field]: value });
};
</script>
