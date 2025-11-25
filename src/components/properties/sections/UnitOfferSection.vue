<template>
  <div class="bg-white p-6 rounded-lg shadow">
    <h3 class="text-lg font-semibold mb-4">{{ t('properties.fields.unitOffer') }}</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Unit For -->
      <div>
        <label class="block text-sm font-medium mb-1">{{ t('properties.fields.unitFor') }} *</label>
        <select
          :value="modelValue.unit_for"
          @input="updateField('unit_for', $event.target.value)"
          required
          class="w-full border rounded px-3 py-2"
        >
          <option value="">{{ t('properties.options.selectStatus') }}</option>
          <option value="For Rent">{{ t('properties.options.forRent') }}</option>
          <option value="For Sale">{{ t('properties.options.forSale') }}</option>
          <option value="Sold Out">{{ t('properties.options.soldOut') }}</option>
          <option value="Recycle">{{ t('properties.options.recycle') }}</option>
        </select>
      </div>

      <!-- Area -->
      <div>
        <label class="block text-sm font-medium mb-1">{{ t('properties.fields.area') }}</label>
        <select
          :value="modelValue.area_id"
          @input="updateField('area_id', $event.target.value)"
          class="w-full border rounded px-3 py-2"
        >
          <option value="">{{ t('properties.options.selectArea') }}</option>
          <option v-for="area in areas" :key="area.id" :value="area.id">
            {{ area.value }}
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
