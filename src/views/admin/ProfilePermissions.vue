<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
    <div class="bg-white rounded-lg p-6 w-full max-w-6xl m-4 max-h-[90vh] overflow-y-auto">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold">
          {{ t('profiles.permissionsFor') }}: {{ profile.name }}
        </h2>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
          <X :size="24" />
        </button>
      </div>

      <!-- Tabs -->
      <div class="border-b mb-6">
        <nav class="-mb-px flex space-x-8">
          <button
            @click="activeTab = 'modules'"
            :class="activeTab === 'modules' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
            class="py-4 px-1 border-b-2 font-medium"
          >
            {{ t('profiles.modulePermissions') }}
          </button>
          <button
            @click="activeTab = 'fields'"
            :class="activeTab === 'fields' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
            class="py-4 px-1 border-b-2 font-medium"
          >
            {{ t('profiles.fieldPermissions') }}
          </button>
        </nav>
      </div>

      <!-- Module Permissions Tab -->
      <div v-if="activeTab === 'modules'" class="space-y-4">
        <div class="overflow-x-auto">
          <table class="w-full border">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-2 text-left border">{{ t('profiles.module') }}</th>
                <th class="px-4 py-2 text-center border">{{ t('profiles.view') }}</th>
                <th class="px-4 py-2 text-center border">{{ t('profiles.create') }}</th>
                <th class="px-4 py-2 text-center border">{{ t('profiles.edit') }}</th>
                <th class="px-4 py-2 text-center border">{{ t('profiles.delete') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="module in availableModules" :key="module" class="hover:bg-gray-50">
                <td class="px-4 py-2 border font-medium">{{ t(`profiles.modules.${module}`) || formatModuleName(module) }}</td>
                <td class="px-4 py-2 border text-center">
                  <input
                    type="checkbox"
                    v-model="modulePermissions[module].permission_view"
                    class="w-4 h-4"
                  />
                </td>
                <td class="px-4 py-2 border text-center">
                  <input
                    type="checkbox"
                    v-model="modulePermissions[module].permission_create"
                    :disabled="!modulePermissions[module].permission_view"
                    class="w-4 h-4"
                  />
                </td>
                <td class="px-4 py-2 border text-center">
                  <input
                    type="checkbox"
                    v-model="modulePermissions[module].permission_edit"
                    :disabled="!modulePermissions[module].permission_view"
                    class="w-4 h-4"
                  />
                </td>
                <td class="px-4 py-2 border text-center">
                  <input
                    type="checkbox"
                    v-model="modulePermissions[module].permission_delete"
                    :disabled="!modulePermissions[module].permission_view"
                    class="w-4 h-4"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Field Permissions Tab -->
      <div v-if="activeTab === 'fields'" class="space-y-6">
        <div v-for="module in Object.keys(moduleFields)" :key="module" class="border rounded-lg p-4">
          <h3 class="font-bold text-lg mb-4">{{ t(`profiles.modules.${module}`) || formatModuleName(module) }}</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <div
              v-for="field in moduleFields[module]"
              :key="`${module}_${field}`"
              class="border rounded p-3"
            >
              <div class="font-medium text-sm mb-2">{{ t(`profiles.fields.${field}`) || formatFieldName(field) }}</div>
              <div class="flex gap-4">
                <label class="flex items-center text-sm">
                  <input
                    type="checkbox"
                    v-model="fieldPermissions[module][field].can_view"
                    class="mr-1"
                  />
                  {{ t('profiles.view') }}
                </label>
                <label class="flex items-center text-sm">
                  <input
                    type="checkbox"
                    v-model="fieldPermissions[module][field].can_edit"
                    :disabled="!fieldPermissions[module][field].can_view"
                    class="mr-1"
                  />
                  {{ t('profiles.edit') }}
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Save Button -->
      <div class="mt-6 flex justify-end gap-2">
        <button
          @click="$emit('close')"
          class="px-4 py-2 border rounded-lg hover:bg-gray-50"
        >
          {{ t('common.cancel') }}
        </button>
        <button
          @click="savePermissions"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {{ t('common.save') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { X } from 'lucide-vue-next';
import axios from '@/api/axios';

const { t } = useI18n();

const props = defineProps({
  profile: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close', 'saved']);

const activeTab = ref('modules');
const availableModules = ref([]);
const moduleFields = ref({});
const modulePermissions = reactive({});
const fieldPermissions = reactive({});

onMounted(async () => {
  await loadAvailableModulesAndFields();
  await loadProfilePermissions();
});

async function loadAvailableModulesAndFields() {
  try {
    const response = await axios.get('/profiles/modules-fields');
    availableModules.value = response.data.modules;
    moduleFields.value = response.data.fields;

    // Initialize permissions objects
    availableModules.value.forEach(module => {
      modulePermissions[module] = {
        permission_view: false,
        permission_create: false,
        permission_edit: false,
        permission_delete: false
      };
    });

    Object.keys(moduleFields.value).forEach(module => {
      fieldPermissions[module] = {};
      moduleFields.value[module].forEach(field => {
        fieldPermissions[module][field] = {
          can_view: false,
          can_edit: false
        };
      });
    });
  } catch (error) {
    console.error('Failed to load modules and fields:', error);
  }
}

async function loadProfilePermissions() {
  try {
    const response = await axios.get(`/profiles/${props.profile.id}`);
    const profile = response.data;

    // Load module permissions
    if (profile.modules) {
      profile.modules.forEach(m => {
        if (modulePermissions[m.module_name]) {
          // Update each property individually to maintain reactivity
          modulePermissions[m.module_name].permission_view = Boolean(m.permission_view);
          modulePermissions[m.module_name].permission_create = Boolean(m.permission_create);
          modulePermissions[m.module_name].permission_edit = Boolean(m.permission_edit);
          modulePermissions[m.module_name].permission_delete = Boolean(m.permission_delete);
        }
      });
    }

    // Load field permissions
    if (profile.fields) {
      profile.fields.forEach(f => {
        if (fieldPermissions[f.module_name] && fieldPermissions[f.module_name][f.field_name]) {
          // Update each property individually to maintain reactivity
          fieldPermissions[f.module_name][f.field_name].can_view = Boolean(f.can_view);
          fieldPermissions[f.module_name][f.field_name].can_edit = Boolean(f.can_edit);
        }
      });
    }
  } catch (error) {
    console.error('Failed to load profile permissions:', error);
  }
}

async function savePermissions() {
  try {
    // Save module permissions - only send modules with at least one permission
    const modules = Object.keys(modulePermissions)
      .filter(moduleName => {
        const perms = modulePermissions[moduleName];
        return perms.permission_view || perms.permission_create || perms.permission_edit || perms.permission_delete;
      })
      .map(moduleName => ({
        module_name: moduleName,
        permission_view: modulePermissions[moduleName].permission_view,
        permission_create: modulePermissions[moduleName].permission_create,
        permission_edit: modulePermissions[moduleName].permission_edit,
        permission_delete: modulePermissions[moduleName].permission_delete
      }));

    await axios.post(`/profiles/${props.profile.id}/modules`, { modules });

    // Save field permissions - only send fields with at least one permission
    const fields = [];
    Object.keys(fieldPermissions).forEach(moduleName => {
      Object.keys(fieldPermissions[moduleName]).forEach(fieldName => {
        const perms = fieldPermissions[moduleName][fieldName];
        if (perms.can_view || perms.can_edit) {
          fields.push({
            module_name: moduleName,
            field_name: fieldName,
            can_view: perms.can_view,
            can_edit: perms.can_edit
          });
        }
      });
    });

    await axios.post(`/profiles/${props.profile.id}/fields`, { fields });

    alert(t('profiles.permissionsSaved'));
    emit('saved');
    emit('close');
  } catch (error) {
    console.error('Failed to save permissions:', error);
    alert(t('common.error') + ': ' + (error.response?.data?.error || 'Failed to save permissions'));
  }
}

function formatModuleName(module) {
  // Try to get translation first, fallback to formatted string
  const translationKey = `profiles.modules.${module}`;
  const translated = t(translationKey);
  // If translation exists (not the same as key), use it
  if (translated !== translationKey) {
    return translated;
  }
  // Otherwise format the module name
  return module.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function formatFieldName(field) {
  // Try to get translation first, fallback to formatted string
  const translationKey = `profiles.fields.${field}`;
  const translated = t(translationKey);
  // If translation exists (not the same as key), use it
  if (translated !== translationKey) {
    return translated;
  }
  // Otherwise format the field name
  return field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}
</script>
