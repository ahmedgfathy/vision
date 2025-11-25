<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- More Information Section (First - Most Important) -->
    <MoreInfoSection
      v-model="moreInfo"
      :phases="phases"
      :users="users"
    />

    <!-- Owner Information Section (Second - Key Contact) -->
    <OwnerInfoSection v-model="ownerInfo" />

    <!-- Unit Info Section (Third - Property Details) -->
    <UnitInfoSection
      v-model="formData"
      :types="types"
    />

    <!-- Unit Offer Section (Fourth - Pricing & Status) -->
    <UnitOfferSection
      v-model="formData"
      :areas="areas"
    />

    <!-- Unit License Section (Fifth - Location Details) -->
    <UnitLicenseSection
      v-model="formData"
      :malls="malls"
      :communities="communities"
    />

    <!-- Update Information Section (Sixth - Follow-up) -->
    <UpdateInfoSection v-model="updateInfo" />

    <!-- Location (lat/lng) - Simple for now -->
    <div class="bg-white p-6 rounded-lg shadow">
      <h3 class="text-lg font-semibold mb-4">{{ t('properties.sections.location') }}</h3>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium mb-1">{{ t('properties.fields.latitude') }}</label>
          <input
            v-model="formData.latitude"
            type="number"
            step="any"
            class="w-full border rounded px-3 py-2"
            placeholder="30.0444"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">{{ t('properties.fields.longitude') }}</label>
          <input
            v-model="formData.longitude"
            type="number"
            step="any"
            class="w-full border rounded px-3 py-2"
            placeholder="31.2357"
          />
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex gap-4">
      <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
        {{ isEdit ? t('properties.actions.update') : t('properties.actions.create') }} {{ t('properties.title').slice(0, -1) }}
      </button>
      <button type="button" @click="$emit('cancel')" class="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors shadow-sm">
        {{ t('properties.actions.cancel') }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { usePropertyStore } from '@/stores/propertyStore';
import { useAuthStore } from '@/stores/auth';
import { useI18n } from 'vue-i18n';
import { useToast } from '@/composables/useToast';
import UnitOfferSection from './sections/UnitOfferSection.vue';
import UnitLicenseSection from './sections/UnitLicenseSection.vue';
import UnitInfoSection from './sections/UnitInfoSection.vue';
import OwnerInfoSection from './sections/OwnerInfoSection.vue';
import UpdateInfoSection from './sections/UpdateInfoSection.vue';
import MoreInfoSection from './sections/MoreInfoSection.vue';

const props = defineProps({
  initialData: {
    type: Object,
    default: null
  },
  isEdit: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['submit', 'cancel']);

const propertyStore = usePropertyStore();
const authStore = useAuthStore();
const { t } = useI18n();
const toast = useToast();

const { areas, malls, communities, types, phases } = storeToRefs(propertyStore);

// Mock users list - in real app, fetch from users API
const users = ref([
  { id: authStore.user.id, username: authStore.user.username }
]);

// Main property data
const formData = ref({
  unit_for: '',
  area_id: '',
  unit_license: '',
  mall_id: '',
  community_id: '',
  type_id: '',
  finished: '',
  building: '',
  total_price: '',
  more_units: false,
  unit_no: '',
  description: '',
  latitude: '',
  longitude: '',
  bedrooms: '',
  bathrooms: '',
  parking_spaces: '',
  furnished: false,
  has_pool: false,
  has_gym: false,
  has_security: false,
  has_garden: false,
  has_balcony: false,
  has_elevator: false
});

// Owner info (separate object, will be nested in API call)
const ownerInfo = ref({
  offered_by: '',
  update_state: 'Want Update',
  owner_name: '',
  update_by: '',
  mobile: '',
  last_follow_in: '',
  tel: '',
  call_update: '',
  call_note: '',
  new_feedback: ''
});

// Update info (separate object)
const updateInfo = ref({
  reminder_time: '',
  rent_to: '',
  reminder_date: '',
  repeated_statement: ''
});

// More info (separate object)
const moreInfo = ref({
  property_name: '',
  handler_id: authStore.user.id, // Default to current user
  phase_id: ''
});

// Watch for initialData changes (edit mode)
watch(() => props.initialData, (newVal) => {
  if (newVal) {
    // Populate main form
    Object.keys(formData.value).forEach(key => {
      if (newVal[key] !== undefined) {
        formData.value[key] = newVal[key];
      }
    });

    // Populate owner info
    if (newVal.owner_info) {
      Object.keys(ownerInfo.value).forEach(key => {
        if (newVal.owner_info[key] !== undefined) {
          ownerInfo.value[key] = newVal.owner_info[key];
        }
      });
    }

    // Populate update info
    if (newVal.update_info) {
      Object.keys(updateInfo.value).forEach(key => {
        if (newVal.update_info[key] !== undefined) {
          updateInfo.value[key] = newVal.update_info[key];
        }
      });
    }

    // Populate more info
    if (newVal.more_info) {
      Object.keys(moreInfo.value).forEach(key => {
        if (newVal.more_info[key] !== undefined) {
          moreInfo.value[key] = newVal.more_info[key];
        }
      });
    }
  }
}, { immediate: true });

const handleSubmit = () => {
  // Validate required fields
  if (!formData.value.unit_for) {
    toast.error(t('properties.fields.unitFor') + ' ' + t('common.required'));
    return;
  }
  if (!ownerInfo.value.offered_by || !ownerInfo.value.owner_name || !ownerInfo.value.new_feedback) {
    toast.error(t('validation.ownerInfoRequired'));
    return;
  }
  if (!moreInfo.value.property_name) {
    toast.error(t('validation.propertyNameRequired'));
    return;
  }

  // Helper function to convert empty strings to null for numeric fields
  const cleanNumericField = (value) => {
    if (value === '' || value === null || value === undefined) return null;
    return value;
  };

  // Clean formData - convert empty strings to null for numeric fields
  const cleanedFormData = {
    ...formData.value,
    area_id: cleanNumericField(formData.value.area_id),
    mall_id: cleanNumericField(formData.value.mall_id),
    community_id: cleanNumericField(formData.value.community_id),
    type_id: cleanNumericField(formData.value.type_id),
    total_price: cleanNumericField(formData.value.total_price),
    latitude: cleanNumericField(formData.value.latitude),
    longitude: cleanNumericField(formData.value.longitude),
    bedrooms: cleanNumericField(formData.value.bedrooms),
    bathrooms: cleanNumericField(formData.value.bathrooms),
    parking_spaces: cleanNumericField(formData.value.parking_spaces)
  };

  // Clean owner_info
  const cleanedOwnerInfo = {
    ...ownerInfo.value,
    update_by: cleanNumericField(ownerInfo.value.update_by)
  };

  // Clean update_info
  const cleanedUpdateInfo = {
    ...updateInfo.value
  };

  // Clean more_info
  const cleanedMoreInfo = {
    ...moreInfo.value,
    handler_id: cleanNumericField(moreInfo.value.handler_id) || authStore.user.id,
    phase_id: cleanNumericField(moreInfo.value.phase_id)
  };

  // Combine all sections
  const payload = {
    ...cleanedFormData,
    owner_info: cleanedOwnerInfo,
    update_info: cleanedUpdateInfo,
    more_info: cleanedMoreInfo
  };

  emit('submit', payload);
};

onMounted(async () => {
  await propertyStore.fetchDynamicLists();
});
</script>
