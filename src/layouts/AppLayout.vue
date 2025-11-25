<template>
  <div class="min-h-screen bg-gray-50" :dir="currentLocale === 'ar' ? 'rtl' : 'ltr'">
    <!-- Sidebar -->
    <div class="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200" :class="currentLocale === 'ar' ? 'right-0 left-auto border-l border-r-0' : ''">
      <div class="p-4 border-b border-gray-200">
        <h1 class="text-2xl font-bold text-gray-800">Vision CRM</h1>
      </div>
      <nav class="mt-8">
        <router-link to="/dashboard" class="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900" active-class="bg-gray-100 text-gray-900 font-medium">
          {{ t('nav.dashboard') }}
        </router-link>
        <router-link to="/dashboard/properties" class="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900" active-class="bg-gray-100 text-gray-900 font-medium">
          {{ t('nav.properties') }}
        </router-link>
        <router-link to="/dashboard/leads" class="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900" active-class="bg-gray-100 text-gray-900 font-medium">
          {{ t('nav.leads') }}
        </router-link>
        <router-link to="/dashboard/agents" class="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900" active-class="bg-gray-100 text-gray-900 font-medium">
          {{ t('nav.agents') }}
        </router-link>
        <router-link to="/dashboard/companies" class="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900" active-class="bg-gray-100 text-gray-900 font-medium">
          {{ t('nav.companies') }}
        </router-link>
        <router-link to="/dashboard/tasks" class="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900" active-class="bg-gray-100 text-gray-900 font-medium">
          {{ t('nav.tasks') }}
        </router-link>

        <!-- Admin Section -->
        <div v-if="authStore.user?.role === 'admin'" class="mt-4 border-t border-gray-200 pt-4">
          <router-link to="/dashboard/admin/settings" class="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900" active-class="bg-gray-100 text-gray-900 font-medium">
            {{ t('nav.settings') }}
          </router-link>
        </div>
      </nav>
    </div>

    <!-- Main Content -->
    <div class="flex-1" :class="currentLocale === 'ar' ? 'mr-64' : 'ml-64'">
      <!-- Top Bar -->
      <div class="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <div></div>
        <div class="flex items-center gap-4">
          <!-- Language Switcher -->
          <button
            @click="toggleLanguage"
            class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition border border-gray-300"
            :title="currentLocale === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'"
          >
            <span class="text-sm font-medium text-gray-700">{{ currentLocale === 'ar' ? 'عربي' : 'EN' }}</span>
            <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
          </button>

          <!-- User Info -->
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-700">{{ authStore.user?.username }}</span>
            <button @click="handleLogout" class="text-sm text-red-600 hover:text-red-800">
              {{ t('nav.logout') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Page Content -->
      <main class="p-6">
        <router-view />
      </main>
    </div>
  </div>

  <!-- Toast Notifications -->
  <ToastNotification />
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';
import ToastNotification from '@/components/ToastNotification.vue';

const authStore = useAuthStore();
const router = useRouter();
const { t, locale } = useI18n();

const currentLocale = computed(() => locale.value);

const toggleLanguage = () => {
  locale.value = locale.value === 'ar' ? 'en' : 'ar';
  localStorage.setItem('locale', locale.value);
  // Apply RTL/LTR to document
  document.documentElement.setAttribute('dir', locale.value === 'ar' ? 'rtl' : 'ltr');
  document.documentElement.setAttribute('lang', locale.value);
};

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};

// Set initial direction on mount
if (locale.value === 'ar') {
  document.documentElement.setAttribute('dir', 'rtl');
  document.documentElement.setAttribute('lang', 'ar');
}
</script>
