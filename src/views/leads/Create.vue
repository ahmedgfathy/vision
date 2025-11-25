<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">{{ t('leads.create') }}</h1>
    
    <div class="bg-white rounded-lg shadow p-6">
      <form @submit.prevent="handleSubmit">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ t('leads.fields.name') }} <span class="text-red-500">*</span>
            </label>
            <input
              v-model="formData.name"
              type="text"
              required
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ t('leads.fields.email') }}
            </label>
            <input
              v-model="formData.email"
              type="email"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <!-- Phone -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ t('leads.fields.phone') }}
            </label>
            <input
              v-model="formData.phone"
              type="tel"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <!-- Status -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ t('leads.fields.status') }}
            </label>
            <select
              v-model="formData.status"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="new">{{ t('leads.status.new') }}</option>
              <option value="contacted">{{ t('leads.status.contacted') }}</option>
              <option value="qualified">{{ t('leads.status.qualified') }}</option>
              <option value="converted">{{ t('leads.status.converted') }}</option>
              <option value="lost">{{ t('leads.status.lost') }}</option>
            </select>
          </div>

          <!-- Source -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ t('leads.fields.source') }}
            </label>
            <select
              v-model="formData.source"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">{{ t('common.select') }}</option>
              <option value="website">{{ t('leads.source.website') }}</option>
              <option value="referral">{{ t('leads.source.referral') }}</option>
              <option value="social_media">{{ t('leads.source.socialMedia') }}</option>
              <option value="cold_call">{{ t('leads.source.coldCall') }}</option>
              <option value="other">{{ t('leads.source.other') }}</option>
            </select>
          </div>

          <!-- Assigned To -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ t('leads.fields.assignedTo') }}
            </label>
            <select
              v-model="formData.assigned_to"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">{{ t('common.select') }}</option>
              <option v-for="user in users" :key="user.id" :value="user.id">
                {{ user.name }}
              </option>
            </select>
          </div>

          <!-- Company -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ t('leads.fields.company') }}
            </label>
            <select
              v-model="formData.company_id"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">{{ t('common.select') }}</option>
              <option v-for="company in companies" :key="company.id" :value="company.id">
                {{ company.name }}
              </option>
            </select>
          </div>

          <!-- Notes -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ t('leads.fields.notes') }}
            </label>
            <textarea
              v-model="formData.notes"
              rows="4"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            ></textarea>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="flex justify-end gap-4 mt-6">
          <button
            type="button"
            @click="$router.push('/dashboard/leads')"
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {{ t('common.cancel') }}
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {{ t('leads.create') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from '@/composables/useToast';
import { useI18n } from 'vue-i18n';
import axios from '@/api/axios';

const router = useRouter();
const toast = useToast();
const { t } = useI18n();

const formData = ref({
  name: '',
  email: '',
  phone: '',
  status: 'new',
  source: '',
  company_id: '',
  assigned_to: '',
  notes: ''
});

const users = ref([]);
const companies = ref([]);

const fetchUsers = async () => {
  try {
    const { data } = await axios.get('/auth/users');
    users.value = data;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

const fetchCompanies = async () => {
  try {
    const { data } = await axios.get('/companies');
    companies.value = data;
  } catch (error) {
    console.error('Error fetching companies:', error);
  }
};

const handleSubmit = async () => {
  try {
    await axios.post('/leads', formData.value);
    toast.success(t('leads.createSuccess'));
    router.push('/dashboard/leads');
  } catch (error) {
    toast.error(t('common.error') + ': ' + (error.response?.data?.message || error.message));
  }
};

onMounted(async () => {
  await fetchUsers();
  await fetchCompanies();
});
</script>
