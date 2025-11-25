<template>
  <div class="p-6">
    <div class="mb-6 flex justify-between items-center">
      <h1 class="text-2xl font-bold">{{ t('profiles.title') }}</h1>
      <button
        @click="openCreateModal"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
      >
        <Plus :size="20" />
        {{ t('profiles.createProfile') }}
      </button>
    </div>

    <!-- Profiles List -->
    <div class="bg-white rounded-lg shadow">
      <table class="w-full">
        <thead class="bg-gray-50 border-b">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              {{ t('profiles.name') }}
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              {{ t('profiles.description') }}
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              {{ t('profiles.status') }}
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
              {{ t('common.actions') }}
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="profile in profiles" :key="profile.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 text-sm font-medium text-gray-900">
              {{ profile.name }}
            </td>
            <td class="px-6 py-4 text-sm text-gray-500">
              {{ profile.description || '-' }}
            </td>
            <td class="px-6 py-4 text-sm">
              <span
                :class="profile.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                class="px-2 py-1 rounded-full text-xs font-medium"
              >
                {{ profile.is_active ? t('common.active') : t('common.inactive') }}
              </span>
            </td>
            <td class="px-6 py-4 text-sm text-right space-x-2">
              <button
                @click="editPermissions(profile)"
                class="text-blue-600 hover:text-blue-800"
                :title="t('profiles.editPermissions')"
              >
                <Shield :size="18" />
              </button>
              <button
                @click="editProfile(profile)"
                class="text-gray-600 hover:text-gray-800"
                :title="t('common.edit')"
              >
                <Edit :size="18" />
              </button>
              <button
                @click="deleteProfile(profile)"
                class="text-red-600 hover:text-red-800"
                :title="t('common.delete')"
              >
                <Trash2 :size="18" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Create/Edit Profile Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 class="text-xl font-bold mb-4">
          {{ editingProfile ? t('profiles.editProfile') : t('profiles.createProfile') }}
        </h2>
        
        <form @submit.prevent="saveProfile">
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1">
              {{ t('profiles.name') }} *
            </label>
            <input
              v-model="formData.name"
              type="text"
              required
              class="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium mb-1">
              {{ t('profiles.description') }}
            </label>
            <textarea
              v-model="formData.description"
              rows="3"
              class="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>

          <div class="mb-4">
            <label class="flex items-center">
              <input
                v-model="formData.is_active"
                type="checkbox"
                class="mr-2"
              />
              <span class="text-sm font-medium">{{ t('common.active') }}</span>
            </label>
          </div>

          <div class="flex justify-end gap-2">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              {{ t('common.cancel') }}
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {{ t('common.save') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Permissions Modal -->
    <ProfilePermissions
      v-if="showPermissionsModal"
      :profile="selectedProfile"
      @close="showPermissionsModal = false"
      @saved="loadProfiles"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { Plus, Edit, Trash2, Shield } from 'lucide-vue-next';
import axios from '@/api/axios';
import ProfilePermissions from './ProfilePermissions.vue';

const { t } = useI18n();

const profiles = ref([]);
const showModal = ref(false);
const showPermissionsModal = ref(false);
const editingProfile = ref(null);
const selectedProfile = ref(null);

const formData = ref({
  name: '',
  description: '',
  is_active: true
});

onMounted(() => {
  loadProfiles();
});

async function loadProfiles() {
  try {
    const response = await axios.get('/profiles');
    profiles.value = response.data;
  } catch (error) {
    console.error('Failed to load profiles:', error);
  }
}

function openCreateModal() {
  editingProfile.value = null;
  formData.value = {
    name: '',
    description: '',
    is_active: true
  };
  showModal.value = true;
}

function editProfile(profile) {
  editingProfile.value = profile;
  formData.value = {
    name: profile.name,
    description: profile.description,
    is_active: profile.is_active
  };
  showModal.value = true;
}

function editPermissions(profile) {
  selectedProfile.value = profile;
  showPermissionsModal.value = true;
}

async function saveProfile() {
  try {
    if (editingProfile.value) {
      await axios.put(`/profiles/${editingProfile.value.id}`, formData.value);
    } else {
      await axios.post('/profiles', formData.value);
    }
    closeModal();
    loadProfiles();
  } catch (error) {
    console.error('Failed to save profile:', error);
    alert(error.response?.data?.error || 'Failed to save profile');
  }
}

async function deleteProfile(profile) {
  if (!confirm(t('profiles.confirmDelete', { name: profile.name }))) {
    return;
  }

  try {
    await axios.delete(`/profiles/${profile.id}`);
    loadProfiles();
  } catch (error) {
    console.error('Failed to delete profile:', error);
    alert(error.response?.data?.error || 'Failed to delete profile');
  }
}

function closeModal() {
  showModal.value = false;
  editingProfile.value = null;
}
</script>
