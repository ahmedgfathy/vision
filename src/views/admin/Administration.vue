<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">{{ t('administration.title') }}</h1>
        <p class="text-gray-600 mt-2">{{ t('administration.subtitle') }}</p>
      </div>
    </div>

    <!-- Tabs Navigation -->
    <div class="border-b border-gray-200">
      <nav class="-mb-px flex space-x-8" aria-label="Tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            activeTab === tab.id
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2'
          ]"
        >
          <component :is="tab.icon" :size="18" />
          {{ t(tab.label) }}
        </button>
      </nav>
    </div>

    <!-- Tab Content -->
    <div class="bg-white rounded-lg shadow-sm p-6">
      <!-- Profiles & Permissions Tab -->
      <div v-if="activeTab === 'profiles'">
        <Profiles />
      </div>

      <!-- Dropdown Lists Tab -->
      <div v-else-if="activeTab === 'dropdowns'">
        <AdminSettings />
      </div>

      <!-- Users Management Tab (Placeholder) -->
      <div v-else-if="activeTab === 'users'">
        <div class="text-center py-12">
          <Users :size="48" class="mx-auto text-gray-400 mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">{{ t('administration.tabs.users.title') }}</h3>
          <p class="text-gray-500">{{ t('administration.tabs.users.comingSoon') }}</p>
        </div>
      </div>

      <!-- System Settings Tab (Placeholder) -->
      <div v-else-if="activeTab === 'system'">
        <div class="text-center py-12">
          <Settings :size="48" class="mx-auto text-gray-400 mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">{{ t('administration.tabs.system.title') }}</h3>
          <p class="text-gray-500">{{ t('administration.tabs.system.comingSoon') }}</p>
        </div>
      </div>

      <!-- Audit Logs Tab (Placeholder) -->
      <div v-else-if="activeTab === 'audit'">
        <div class="text-center py-12">
          <FileText :size="48" class="mx-auto text-gray-400 mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">{{ t('administration.tabs.audit.title') }}</h3>
          <p class="text-gray-500">{{ t('administration.tabs.audit.comingSoon') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { Shield, Database, Users, Settings, FileText } from 'lucide-vue-next';
import Profiles from './Profiles.vue';
import AdminSettings from './AdminSettings.vue';

const { t } = useI18n();

const activeTab = ref('profiles');

const tabs = [
  {
    id: 'profiles',
    label: 'administration.tabs.profiles',
    icon: Shield
  },
  {
    id: 'dropdowns',
    label: 'administration.tabs.dropdowns',
    icon: Database
  },
  {
    id: 'users',
    label: 'administration.tabs.users.label',
    icon: Users
  },
  {
    id: 'system',
    label: 'administration.tabs.system.label',
    icon: Settings
  },
  {
    id: 'audit',
    label: 'administration.tabs.audit.label',
    icon: FileText
  }
];
</script>
