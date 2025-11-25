<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">{{ t('properties.title') }}</h1>
      <button
        v-if="canCreate"
        @click="$router.push('/dashboard/properties/create')"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors shadow-sm"
      >
        <Plus :size="18" />
        {{ t('properties.addNew') }}
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-white p-4 rounded-lg shadow mb-6 grid grid-cols-1 md:grid-cols-5 gap-4">
      <select v-model="filters.unit_for" class="border rounded px-3 py-2" @change="applyFilters">
        <option value="">{{ t('properties.filters.allStatus') }}</option>
        <option value="For Rent">{{ t('properties.options.forRent') }}</option>
        <option value="For Sale">{{ t('properties.options.forSale') }}</option>
        <option value="Sold Out">{{ t('properties.options.soldOut') }}</option>
        <option value="Recycle">{{ t('properties.options.recycle') }}</option>
      </select>

      <select v-model="filters.area_id" class="border rounded px-3 py-2" @change="applyFilters">
        <option value="">{{ t('properties.filters.allAreas') }}</option>
        <option v-for="area in areas" :key="area.id" :value="area.id">
          {{ area.value }}
        </option>
      </select>

      <select v-model="filters.type_id" class="border rounded px-3 py-2" @change="applyFilters">
        <option value="">{{ t('properties.filters.allTypes') }}</option>
        <option v-for="type in types" :key="type.id" :value="type.id">
          {{ type.value }}
        </option>
      </select>

      <select v-model="filters.unit_license" class="border rounded px-3 py-2" @change="applyFilters">
        <option value="">{{ t('properties.filters.allLicenses') }}</option>
        <option value="Administrative">{{ t('properties.options.administrative') }}</option>
        <option value="Commercial">{{ t('properties.options.commercial') }}</option>
        <option value="Medical">{{ t('properties.options.medical') }}</option>
        <option value="Factory">{{ t('properties.options.factory') }}</option>
      </select>

      <input
        v-model="filters.search"
        @input="applyFilters"
        :placeholder="t('properties.filters.search')"
        class="border rounded px-3 py-2"
      />
    </div>

    <!-- Properties Grid -->
    <div v-if="loading" class="text-center py-12">
      <p class="text-gray-500">{{ t('common.loading') }}</p>
    </div>

    <div v-else-if="properties.length === 0" class="text-center py-12">
      <p class="text-gray-500">{{ t('properties.noProperties') }}</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="property in properties" :key="property.id" class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
        <PropertyImageCarousel
          :images="property.gallery?.map(g => g.file_path) || []"
          :alt="property.property_name"
        />
        <div class="p-4">
          <h3 class="font-semibold text-lg mb-1">{{ property.property_name }}</h3>
          <p class="text-sm text-gray-600 mb-2">{{ property.owner_name }}</p>
          <div class="flex items-center justify-between mb-2">
            <span class="text-xl font-bold text-gray-900">
              ${{ formatPrice(property.total_price) }}
            </span>
            <span class="text-sm bg-gray-100 text-gray-800 px-2 py-1 rounded">
              {{ translateEnum(property.unit_for) }}
            </span>
          </div>
          <p class="text-sm text-gray-600 mb-2">
            <span class="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">{{ property.type_name }}</span>
            <span v-if="property.area_name" class="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs ml-2">{{ property.area_name }}</span>
          </p>
          <p v-if="property.building" class="text-sm text-gray-500 mb-4">{{ property.building }} {{ property.unit_no }}</p>
          
          <div class="flex gap-2">
            <button
              @click="$router.push(`/dashboard/properties/view/${property.id}`)"
              class="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700 flex items-center justify-center gap-1 transition-colors"
            >
              <Eye :size="16" />
              {{ t('properties.view') }}
            </button>
            <button
              v-if="canUpdate"
              @click="$router.push(`/dashboard/properties/edit/${property.id}`)"
              class="flex-1 bg-yellow-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-yellow-600 flex items-center justify-center gap-1 transition-colors"
            >
              <Edit :size="16" />
              {{ t('properties.edit') }}
            </button>
            <button
              v-if="canDelete"
              @click="confirmDelete(property.id)"
              class="flex-1 bg-red-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-red-600 flex items-center justify-center gap-1 transition-colors"
            >
              <Trash2 :size="16" />
              {{ t('properties.delete') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { usePropertyStore } from '@/stores/propertyStore';
import { useAuthStore } from '@/stores/auth';
import { useToast } from '@/composables/useToast';
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';
import PropertyImageCarousel from '@/components/properties/PropertyImageCarousel.vue';
import { Plus, Eye, Edit, Trash2 } from 'lucide-vue-next';

const propertyStore = usePropertyStore();
const authStore = useAuthStore();
const toast = useToast();
const { t } = useI18n();

const { properties, loading, areas, types } = storeToRefs(propertyStore);

const filters = ref({
  unit_for: '',
  area_id: '',
  type_id: '',
  unit_license: '',
  search: ''
});

// RBAC permissions
const canCreate = computed(() => authStore.user?.role === 'admin' || authStore.user?.role === 'manager');
const canUpdate = computed(() => authStore.user?.role === 'admin' || authStore.user?.role === 'manager');
const canDelete = computed(() => authStore.user?.role === 'admin');

const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US').format(price);
};

const translateEnum = (value) => {
  const enumMap = {
    'For Rent': t('properties.options.forRent'),
    'For Sale': t('properties.options.forSale'),
    'Sold Out': t('properties.options.soldOut'),
    'Recycle': t('properties.options.recycle')
  };
  return enumMap[value] || value;
};

const applyFilters = () => {
  const cleanFilters = {};
  Object.keys(filters.value).forEach(key => {
    if (filters.value[key]) cleanFilters[key] = filters.value[key];
  });
  propertyStore.fetchProperties(cleanFilters);
};

const confirmDelete = async (id) => {
  if (confirm(t('properties.confirmDelete'))) {
    try {
      await propertyStore.deleteProperty(id);
      toast.success(t('properties.deleteSuccess'));
    } catch (error) {
      toast.error(t('common.error'));
    }
  }
};

onMounted(async () => {
  await propertyStore.fetchDynamicLists();
  await propertyStore.fetchProperties();
});
</script>
