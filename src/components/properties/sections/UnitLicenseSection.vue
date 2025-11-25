<template>
  <div class="bg-white p-6 rounded-lg shadow">
    <h3 class="text-lg font-semibold mb-4">{{ t('properties.fields.unitLicense') }}</h3>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Unit License -->
      <div>
        <label class="block text-sm font-medium mb-1">{{ t('properties.fields.license') }}</label>
        <select
          :value="modelValue.unit_license"
          @input="updateField('unit_license', $event.target.value)"
          class="w-full border rounded px-3 py-2"
        >
          <option value="">{{ t('properties.options.selectLicense') }}</option>
          <option value="Administrative">{{ t('properties.options.administrative') }}</option>
          <option value="Commercial">{{ t('properties.options.commercial') }}</option>
          <option value="Medical">{{ t('properties.options.medical') }}</option>
          <option value="Factory">{{ t('properties.options.factory') }}</option>
        </select>
      </div>

      <!-- Mall Name -->
      <div>
        <label class="block text-sm font-medium mb-1">{{ t('properties.fields.mallName') }}</label>
        <select
          :value="modelValue.mall_id"
          @input="updateField('mall_id', $event.target.value)"
          class="w-full border rounded px-3 py-2"
        >
          <option value="">{{ t('properties.options.selectMall') }}</option>
          <option v-for="mall in malls" :key="mall.id" :value="mall.id">
            {{ mall.value }}
          </option>
        </select>
      </div>

      <!-- Community Name -->
      <div>
        <label class="block text-sm font-medium mb-1">{{ t('properties.fields.communityName') }}</label>
        <select
          :value="modelValue.community_id"
          @input="updateField('community_id', $event.target.value)"
          class="w-full border rounded px-3 py-2"
        >
          <option value="">{{ t('properties.options.selectCommunity') }}</option>
          <option v-for="community in communities" :key="community.id" :value="community.id">
            {{ community.value }}
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
  malls: {
    type: Array,
    default: () => []
  },
  communities: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['update:modelValue']);

const updateField = (field, value) => {
  emit('update:modelValue', { ...props.modelValue, [field]: value });
};
</script>
