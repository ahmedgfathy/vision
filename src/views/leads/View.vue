<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">{{ t('leads.viewDetails') }}</h1>
      <div class="flex gap-2">
        <button
          v-if="canUpdate"
          @click="$router.push(`/dashboard/leads/edit/${route.params.id}`)"
          class="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 flex items-center gap-2 transition-colors"
        >
          <Edit :size="18" />
          {{ t('leads.edit') }}
        </button>
        <button
          @click="$router.push('/dashboard/leads')"
          class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          {{ t('common.back') }}
        </button>
      </div>
    </div>

    <div v-if="loading" class="text-center py-12">
      <p class="text-gray-500">{{ t('common.loading') }}</p>
    </div>

    <div v-else-if="lead" class="bg-white rounded-lg shadow">
      <!-- Lead Information -->
      <div class="p-6 border-b border-gray-200">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">{{ t('leads.information') }}</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">
              {{ t('leads.fields.name') }}
            </label>
            <p class="text-base text-gray-900">{{ lead.name }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">
              {{ t('leads.fields.email') }}
            </label>
            <p class="text-base text-gray-900">{{ lead.email || '-' }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">
              {{ t('leads.fields.phone') }}
            </label>
            <p class="text-base text-gray-900">{{ lead.phone || '-' }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">
              {{ t('leads.fields.status') }}
            </label>
            <span :class="getStatusClass(lead.status)" class="px-3 py-1 inline-flex text-sm font-semibold rounded-full">
              {{ t(`leads.status.${lead.status}`) }}
            </span>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">
              {{ t('leads.fields.source') }}
            </label>
            <p class="text-base text-gray-900">
              {{ lead.source ? t(`leads.source.${lead.source}`) : '-' }}
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">
              {{ t('leads.fields.assignedTo') }}
            </label>
            <p class="text-base text-gray-900">{{ lead.assigned_to_name || '-' }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">
              {{ t('leads.fields.company') }}
            </label>
            <p class="text-base text-gray-900">{{ lead.company_name || '-' }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">
              {{ t('leads.fields.createdBy') }}
            </label>
            <p class="text-base text-gray-900">{{ lead.created_by_name || '-' }}</p>
          </div>

          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-500 mb-1">
              {{ t('leads.fields.notes') }}
            </label>
            <p class="text-base text-gray-900 whitespace-pre-wrap">{{ lead.notes || '-' }}</p>
          </div>
        </div>
      </div>

      <!-- Timeline -->
      <div class="p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">{{ t('leads.timeline') }}</h2>
        <div class="space-y-3">
          <div class="flex items-center gap-3 text-sm">
            <span class="text-gray-500">{{ t('leads.fields.createdAt') }}:</span>
            <span class="text-gray-900">{{ formatDateTime(lead.created_at) }}</span>
          </div>
          <div v-if="lead.updated_at" class="flex items-center gap-3 text-sm">
            <span class="text-gray-500">{{ t('leads.fields.updatedAt') }}:</span>
            <span class="text-gray-900">{{ formatDateTime(lead.updated_at) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useToast } from '@/composables/useToast';
import { useI18n } from 'vue-i18n';
import axios from '@/api/axios';
import { Edit } from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();
const { t } = useI18n();

const lead = ref(null);
const loading = ref(false);

const canUpdate = computed(() => authStore.user?.role === 'admin' || authStore.user?.role === 'manager');

const getStatusClass = (status) => {
  const statusClasses = {
    new: 'bg-blue-100 text-blue-800',
    contacted: 'bg-yellow-100 text-yellow-800',
    qualified: 'bg-purple-100 text-purple-800',
    converted: 'bg-green-100 text-green-800',
    lost: 'bg-red-100 text-red-800'
  };
  return statusClasses[status] || 'bg-gray-100 text-gray-800';
};

const formatDateTime = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleString();
};

const fetchLead = async () => {
  loading.value = true;
  try {
    const { data } = await axios.get(`/leads/${route.params.id}`);
    lead.value = data;
  } catch (error) {
    console.error('Error fetching lead:', error);
    toast.error(t('common.error'));
    router.push('/dashboard/leads');
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchLead();
});
</script>
