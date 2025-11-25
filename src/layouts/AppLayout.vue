<template>
  <div class="min-h-screen bg-gray-50" :dir="currentLocale === 'ar' ? 'rtl' : 'ltr'">
    <!-- Sidebar -->
    <div class="fixed inset-y-0 left-0 w-64 bg-white shadow-sm z-30" :class="currentLocale === 'ar' ? 'right-0 left-auto' : ''">
      <div class="px-4 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 h-[68px] flex items-center gap-3">
        <!-- Logo SVG - Abstract Building/Property Icon -->
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- Building shape -->
          <rect x="4" y="12" width="12" height="20" rx="1" fill="#3b82f6"/>
          <rect x="20" y="6" width="12" height="26" rx="1" fill="#6366f1"/>
          <!-- Windows -->
          <rect x="7" y="15" width="2" height="2" fill="white" opacity="0.8"/>
          <rect x="7" y="19" width="2" height="2" fill="white" opacity="0.8"/>
          <rect x="7" y="23" width="2" height="2" fill="white" opacity="0.8"/>
          <rect x="7" y="27" width="2" height="2" fill="white" opacity="0.8"/>
          <rect x="11" y="15" width="2" height="2" fill="white" opacity="0.8"/>
          <rect x="11" y="19" width="2" height="2" fill="white" opacity="0.8"/>
          <rect x="11" y="23" width="2" height="2" fill="white" opacity="0.8"/>
          <rect x="11" y="27" width="2" height="2" fill="white" opacity="0.8"/>
          <rect x="23" y="10" width="2" height="2" fill="white" opacity="0.8"/>
          <rect x="23" y="14" width="2" height="2" fill="white" opacity="0.8"/>
          <rect x="23" y="18" width="2" height="2" fill="white" opacity="0.8"/>
          <rect x="23" y="22" width="2" height="2" fill="white" opacity="0.8"/>
          <rect x="23" y="26" width="2" height="2" fill="white" opacity="0.8"/>
          <rect x="27" y="10" width="2" height="2" fill="white" opacity="0.8"/>
          <rect x="27" y="14" width="2" height="2" fill="white" opacity="0.8"/>
          <rect x="27" y="18" width="2" height="2" fill="white" opacity="0.8"/>
          <rect x="27" y="22" width="2" height="2" fill="white" opacity="0.8"/>
          <rect x="27" y="26" width="2" height="2" fill="white" opacity="0.8"/>
        </svg>
        <h1 class="text-2xl font-bold text-blue-700">Vision CRM</h1>
      </div>
      <nav class="mt-4 px-2">
        <router-link 
          to="/dashboard" 
          class="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg mb-1 transition-colors"
          :class="{ 'bg-blue-100 text-blue-700 font-medium': $route.path === '/dashboard' }"
        >
          <LayoutDashboard :size="20" />
          {{ t('nav.dashboard') }}
        </router-link>
        
        <router-link 
          v-if="canViewModule('properties')"
          to="/dashboard/properties" 
          class="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg mb-1 transition-colors"
          :class="{ 'bg-blue-100 text-blue-700 font-medium': $route.path.startsWith('/dashboard/properties') }"
        >
          <Building2 :size="20" />
          {{ t('nav.properties') }}
        </router-link>
        
        <router-link 
          v-if="canViewModule('leads')"
          to="/dashboard/leads" 
          class="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg mb-1 transition-colors"
          :class="{ 'bg-blue-100 text-blue-700 font-medium': $route.path.startsWith('/dashboard/leads') }"
        >
          <UserPlus :size="20" />
          {{ t('nav.leads') }}
        </router-link>
        
        <router-link 
          v-if="canViewModule('agents')"
          to="/dashboard/agents" 
          class="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg mb-1 transition-colors"
          :class="{ 'bg-blue-100 text-blue-700 font-medium': $route.path.startsWith('/dashboard/agents') }"
        >
          <Users :size="20" />
          {{ t('nav.agents') }}
        </router-link>
        
        <router-link 
          v-if="canViewModule('companies')"
          to="/dashboard/companies" 
          class="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg mb-1 transition-colors"
          :class="{ 'bg-blue-100 text-blue-700 font-medium': $route.path.startsWith('/dashboard/companies') }"
        >
          <Briefcase :size="20" />
          {{ t('nav.companies') }}
        </router-link>
        
        <router-link 
          v-if="canViewModule('tasks')"
          to="/dashboard/tasks" 
          class="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg mb-1 transition-colors"
          :class="{ 'bg-blue-100 text-blue-700 font-medium': $route.path.startsWith('/dashboard/tasks') }"
        >
          <ListTodo :size="20" />
          {{ t('nav.tasks') }}
        </router-link>

        <!-- Admin Section -->
        <div v-if="authStore.user?.role === 'admin'" class="mt-4 pt-4 border-t border-gray-200">
          <router-link 
            to="/dashboard/admin/settings" 
            class="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg mb-1 transition-colors"
            :class="{ 'bg-blue-100 text-blue-700 font-medium': $route.path.startsWith('/dashboard/admin/settings') }"
          >
            <Settings :size="20" />
            {{ t('nav.settings') }}
          </router-link>
          <router-link 
            to="/dashboard/admin/profiles" 
            class="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg mb-1 transition-colors"
            :class="{ 'bg-blue-100 text-blue-700 font-medium': $route.path.startsWith('/dashboard/admin/profiles') }"
          >
            <Shield :size="20" />
            Profiles & Permissions
          </router-link>
        </div>
      </nav>
    </div>

    <!-- Main Content -->
    <div class="flex-1" :class="currentLocale === 'ar' ? 'mr-64' : 'ml-64'">
      <!-- Top Bar - Now Static -->
      <div class="sticky top-0 bg-white px-6 py-4 flex justify-between items-center shadow-sm z-20">
        <div></div>
        <div class="flex items-center gap-4">
          <!-- Language Switcher -->
          <button
            @click="toggleLanguage"
            class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-blue-50 transition hover:border-blue-300"
            :title="currentLocale === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'"
          >
            <Languages :size="18" class="text-blue-600" />
            <span class="text-sm font-medium text-gray-700">{{ currentLocale === 'ar' ? 'عربي' : 'English' }}</span>
          </button>

          <!-- User Info -->
          <div class="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-lg">
            <User :size="18" class="text-gray-600" />
            <span class="text-sm font-medium text-gray-700">{{ authStore.user?.username }}</span>
            <button @click="handleLogout" class="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 ml-2">
              <LogOut :size="16" />
              {{ t('nav.logout') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Page Content -->
      <main class="p-6 bg-gray-50 min-h-screen">
        <router-view />
      </main>
    </div>
  </div>

  <!-- Toast Notifications -->
  <ToastNotification />
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { usePermissionStore } from '@/stores/permissions';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { computed, onMounted } from 'vue';
import ToastNotification from '@/components/ToastNotification.vue';
import { 
  LayoutDashboard, 
  Building2, 
  UserPlus, 
  Users, 
  Briefcase, 
  ListTodo, 
  Settings, 
  Languages, 
  User, 
  LogOut,
  Shield
} from 'lucide-vue-next';

const authStore = useAuthStore();
const permissionStore = usePermissionStore();
const router = useRouter();
const { t, locale } = useI18n();

const currentLocale = computed(() => locale.value);

// Load permissions when component mounts
onMounted(async () => {
  if (!permissionStore.loaded && authStore.user) {
    await permissionStore.loadPermissions();
  }
});

// Helper to check if module should be visible
const canViewModule = (moduleName) => {
  // Admin can see everything
  if (authStore.user?.role === 'admin') return true;
  // Check permission
  return permissionStore.shouldShowModule(moduleName);
};

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
