<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">{{ t('leads.title') }}</h1>
      <button
        v-if="canCreate"
        @click="$router.push('/dashboard/leads/create')"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors shadow-sm"
      >
        <Plus :size="18" />
        {{ t('leads.addNew') }}
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-white p-4 rounded-lg shadow mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
      <select v-model="filters.status" class="border rounded px-3 py-2" @change="applyFilters">
        <option value="">{{ t('leads.filters.allStatus') }}</option>
        <option value="new">{{ t('leads.status.new') }}</option>
        <option value="contacted">{{ t('leads.status.contacted') }}</option>
        <option value="qualified">{{ t('leads.status.qualified') }}</option>
        <option value="converted">{{ t('leads.status.converted') }}</option>
        <option value="lost">{{ t('leads.status.lost') }}</option>
      </select>

      <select v-model="filters.source" class="border rounded px-3 py-2" @change="applyFilters">
        <option value="">{{ t('leads.filters.allSources') }}</option>
        <option value="website">{{ t('leads.source.website') }}</option>
        <option value="referral">{{ t('leads.source.referral') }}</option>
        <option value="social_media">{{ t('leads.source.socialMedia') }}</option>
        <option value="cold_call">{{ t('leads.source.coldCall') }}</option>
        <option value="other">{{ t('leads.source.other') }}</option>
      </select>

      <select v-model="filters.assigned_to" class="border rounded px-3 py-2" @change="applyFilters">
        <option value="">{{ t('leads.filters.allAgents') }}</option>
        <option v-for="user in users" :key="user.id" :value="user.id">
          {{ user.name }}
        </option>
      </select>

      <input
        v-model="filters.search"
        @input="applyFilters"
        :placeholder="t('leads.filters.search')"
        class="border rounded px-3 py-2"
      />
    </div>

    <!-- Leads Table -->
    <div v-if="loading" class="text-center py-12">
      <p class="text-gray-500">{{ t('common.loading') }}</p>
    </div>

    <div v-else-if="leads.length === 0" class="text-center py-12 bg-white rounded-lg shadow">
      <p class="text-gray-500">{{ t('leads.noLeads') }}</p>
    </div>

    <div v-else class="bg-white rounded-lg shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {{ t('leads.fields.name') }}
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {{ t('leads.fields.email') }}
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {{ t('leads.fields.phone') }}
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {{ t('leads.fields.status') }}
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {{ t('leads.fields.source') }}
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {{ t('leads.fields.assignedTo') }}
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {{ t('common.actions') }}
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="lead in leads" :key="lead.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">{{ lead.name }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-500">{{ lead.email || '-' }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-500">{{ lead.phone || '-' }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="getStatusClass(lead.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                {{ t(`leads.status.${lead.status}`) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-500">{{ lead.source ? t(`leads.source.${lead.source}`) : '-' }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-500">{{ lead.assigned_to_name || '-' }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <div class="flex gap-2">
                <button
                  @click="$router.push(`/dashboard/leads/view/${lead.id}`)"
                  class="text-blue-600 hover:text-blue-900"
                  :title="t('leads.view')"
                >
                  <Eye :size="18" />
                </button>
                <button
                  v-if="canUpdate"
                  @click="$router.push(`/dashboard/leads/edit/${lead.id}`)"
                  class="text-yellow-600 hover:text-yellow-900"
                  :title="t('leads.edit')"
                >
                  <Edit :size="18" />
                </button>
                <button
                  v-if="canDelete"
                  @click="confirmDelete(lead.id)"
                  class="text-red-600 hover:text-red-900"
                  :title="t('leads.delete')"
                >
                  <Trash2 :size="18" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useToast } from '@/composables/useToast';
import { useI18n } from 'vue-i18n';
import axios from '@/api/axios';
import { Plus, Eye, Edit, Trash2 } from 'lucide-vue-next';

const authStore = useAuthStore();
const toast = useToast();
const { t } = useI18n();

const leads = ref([]);
const users = ref([]);
const loading = ref(false);

const filters = ref({
  status: '',
  source: '',
  assigned_to: '',
  search: ''
});

// RBAC permissions
const canCreate = computed(() => authStore.user?.role === 'admin' || authStore.user?.role === 'manager');
const canUpdate = computed(() => authStore.user?.role === 'admin' || authStore.user?.role === 'manager');
const canDelete = computed(() => authStore.user?.role === 'admin');

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

const fetchLeads = async (filterParams = {}) => {
  loading.value = true;
  try {
    const { data } = await axios.get('/leads', { params: filterParams });
    leads.value = data;
  } catch (error) {
    console.error('Error fetching leads:', error);
    toast.error(t('common.error'));
  } finally {
    loading.value = false;
  }
};

const fetchUsers = async () => {
  try {
    const { data } = await axios.get('/auth/users');
    users.value = data;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

const applyFilters = () => {
  const cleanFilters = {};
  Object.keys(filters.value).forEach(key => {
    if (filters.value[key]) cleanFilters[key] = filters.value[key];
  });
  fetchLeads(cleanFilters);
};

const confirmDelete = async (id) => {
  if (confirm(t('leads.confirmDelete'))) {
    try {
      await axios.delete(`/leads/${id}`);
      toast.success(t('leads.deleteSuccess'));
      await fetchLeads();
    } catch (error) {
      toast.error(t('common.error'));
    }
  }
};

onMounted(async () => {
  await fetchUsers();
  await fetchLeads();
});
</script>
