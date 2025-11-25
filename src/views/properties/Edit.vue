<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">{{ t('properties.edit') }}</h1>
    
    <div v-if="loading" class="text-center py-12">
      <p class="text-gray-500">{{ t('common.loading') }}</p>
    </div>

    <PropertyForm
      v-else-if="currentProperty"
      :is-edit="true"
      :initial-data="currentProperty"
      @submit="handleUpdate"
      @cancel="$router.push('/dashboard/properties')"
    />

    <!-- Gallery Management (after property is saved) -->
    <div v-if="currentProperty" class="mt-6">
      <PropertyGalleryManager
        :property-id="currentProperty.id"
        :gallery="currentProperty.gallery || []"
        @refresh="refreshProperty"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePropertyStore } from '@/stores/propertyStore';
import { useToast } from '@/composables/useToast';
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';
import PropertyForm from '@/components/properties/PropertyForm.vue';
import PropertyGalleryManager from '@/components/properties/PropertyGalleryManager.vue';

const route = useRoute();
const router = useRouter();
const propertyStore = usePropertyStore();
const toast = useToast();
const { t } = useI18n();

const { currentProperty, loading } = storeToRefs(propertyStore);

const handleUpdate = async (data) => {
  try {
    await propertyStore.updateProperty(route.params.id, data);
    toast.success(t('properties.updateSuccess'));
    router.push('/dashboard/properties');
  } catch (error) {
    toast.error(t('common.error') + ': ' + (error.response?.data?.message || error.message));
  }
};

const refreshProperty = async () => {
  await propertyStore.fetchProperty(route.params.id);
};

onMounted(async () => {
  await propertyStore.fetchProperty(route.params.id);
});
</script>
