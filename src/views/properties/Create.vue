<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">{{ t('properties.create') }}</h1>
    
    <PropertyForm
      @submit="handleCreate"
      @cancel="$router.push('/dashboard/properties')"
    />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { usePropertyStore } from '@/stores/propertyStore';
import { useToast } from '@/composables/useToast';
import { useI18n } from 'vue-i18n';
import PropertyForm from '@/components/properties/PropertyForm.vue';

const router = useRouter();
const propertyStore = usePropertyStore();
const toast = useToast();
const { t } = useI18n();

const handleCreate = async (data) => {
  try {
    await propertyStore.createProperty(data);
    toast.success(t('properties.createSuccess'));
    router.push('/dashboard/properties');
  } catch (error) {
    toast.error(t('common.error') + ': ' + (error.response?.data?.message || error.message));
  }
};
</script>
