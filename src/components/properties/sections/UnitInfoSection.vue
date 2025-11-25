<template>
  <div class="bg-white p-6 rounded-lg shadow">
    <h3 class="text-lg font-semibold mb-4">{{ t('properties.sections.unitInfo') }}</h3>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Type -->
      <div>
        <label class="block text-sm font-medium mb-1">{{ t('properties.fields.type') }}</label>
        <select
          :value="modelValue.type_id"
          @input="updateField('type_id', $event.target.value)"
          class="w-full border rounded px-3 py-2"
        >
          <option value="">{{ t('properties.options.select') }}</option>
          <option v-for="type in types" :key="type.id" :value="type.id">
            {{ type.value }}
          </option>
        </select>
      </div>

      <!-- Finished -->
      <div>
        <label class="block text-sm font-medium mb-1">{{ t('properties.fields.finished') }}</label>
        <select
          :value="modelValue.finished"
          @input="updateField('finished', $event.target.value)"
          class="w-full border rounded px-3 py-2"
        >
          <option value="">{{ t('properties.options.select') }}</option>
          <option value="Semi Finished">{{ t('properties.options.semiFinished') }}</option>
          <option value="Fully Finished">{{ t('properties.options.fullyFinished') }}</option>
          <option value="Furnished">{{ t('properties.options.furnished') }}</option>
          <option value="Concrete">{{ t('properties.options.concrete') }}</option>
        </select>
      </div>

      <!-- Building -->
      <div>
        <label class="block text-sm font-medium mb-1">{{ t('properties.fields.building') }}</label>
        <input
          type="text"
          :value="modelValue.building"
          @input="updateField('building', $event.target.value)"
          class="w-full border rounded px-3 py-2"
        />
      </div>

      <!-- Bedrooms -->
      <div>
        <label class="block text-sm font-medium mb-1">Bedrooms</label>
        <input
          type="number"
          :value="modelValue.bedrooms"
          @input="updateField('bedrooms', $event.target.value)"
          class="w-full border rounded px-3 py-2"
          min="0"
        />
      </div>

      <!-- Bathrooms -->
      <div>
        <label class="block text-sm font-medium mb-1">Bathrooms</label>
        <input
          type="number"
          :value="modelValue.bathrooms"
          @input="updateField('bathrooms', $event.target.value)"
          class="w-full border rounded px-3 py-2"
          min="0"
        />
      </div>

      <!-- Parking Spaces -->
      <div>
        <label class="block text-sm font-medium mb-1">Parking Spaces</label>
        <input
          type="number"
          :value="modelValue.parking_spaces"
          @input="updateField('parking_spaces', $event.target.value)"
          class="w-full border rounded px-3 py-2"
          min="0"
        />
      </div>

      <!-- Total Price -->
      <div>
        <label class="block text-sm font-medium mb-1">{{ t('properties.fields.totalPrice') }}</label>
        <input
          type="number"
          step="0.01"
          :value="modelValue.total_price"
          @input="updateField('total_price', $event.target.value)"
          class="w-full border rounded px-3 py-2"
        />
      </div>

      <!-- Unit No -->
      <div>
        <label class="block text-sm font-medium mb-1">{{ t('properties.fields.unitNo') }}</label>
        <input
          type="text"
          :value="modelValue.unit_no"
          @input="updateField('unit_no', $event.target.value)"
          class="w-full border rounded px-3 py-2"
        />
      </div>

      <!-- More Units Checkbox -->
      <div class="flex items-center pt-6">
        <input
          type="checkbox"
          :checked="modelValue.more_units"
          @change="updateField('more_units', $event.target.checked)"
          class="mr-2"
        />
        <label class="text-sm font-medium">{{ t('properties.fields.moreUnits') }}</label>
      </div>

      <!-- Description -->
      <div class="md:col-span-3">
        <label class="block text-sm font-medium mb-1">{{ t('properties.fields.description') }}</label>
        <textarea
          rows="3"
          :value="modelValue.description"
          @input="updateField('description', $event.target.value)"
          class="w-full border rounded px-3 py-2"
        ></textarea>
      </div>

      <!-- Property Features -->
      <div class="md:col-span-3 mt-4">
        <h4 class="font-semibold mb-3">Property Features</h4>
        <div class="grid grid-cols-2 md:grid-cols-5 gap-3">
          <label class="flex items-center">
            <input
              type="checkbox"
              :checked="modelValue.furnished"
              @change="updateField('furnished', $event.target.checked)"
              class="mr-2"
            />
            <span class="text-sm">Furnished</span>
          </label>
          <label class="flex items-center">
            <input
              type="checkbox"
              :checked="modelValue.has_pool"
              @change="updateField('has_pool', $event.target.checked)"
              class="mr-2"
            />
            <span class="text-sm">Pool</span>
          </label>
          <label class="flex items-center">
            <input
              type="checkbox"
              :checked="modelValue.has_gym"
              @change="updateField('has_gym', $event.target.checked)"
              class="mr-2"
            />
            <span class="text-sm">Gym</span>
          </label>
          <label class="flex items-center">
            <input
              type="checkbox"
              :checked="modelValue.has_security"
              @change="updateField('has_security', $event.target.checked)"
              class="mr-2"
            />
            <span class="text-sm">Security</span>
          </label>
          <label class="flex items-center">
            <input
              type="checkbox"
              :checked="modelValue.has_garden"
              @change="updateField('has_garden', $event.target.checked)"
              class="mr-2"
            />
            <span class="text-sm">Garden</span>
          </label>
          <label class="flex items-center">
            <input
              type="checkbox"
              :checked="modelValue.has_balcony"
              @change="updateField('has_balcony', $event.target.checked)"
              class="mr-2"
            />
            <span class="text-sm">Balcony</span>
          </label>
          <label class="flex items-center">
            <input
              type="checkbox"
              :checked="modelValue.has_elevator"
              @change="updateField('has_elevator', $event.target.checked)"
              class="mr-2"
            />
            <span class="text-sm">Elevator</span>
          </label>
        </div>
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
  types: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['update:modelValue']);

const updateField = (field, value) => {
  emit('update:modelValue', { ...props.modelValue, [field]: value });
};
</script>
