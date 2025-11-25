<template>
  <div class="p-6">
    <div v-if="loading" class="text-center py-12">
      <p class="text-gray-500">Loading property...</p>
    </div>
    
    <div v-else-if="currentProperty" class="max-w-4xl">
      <div class="flex justify-between items-start mb-6">
        <div>
          <h1 class="text-3xl font-bold">{{ currentProperty.title }}</h1>
          <p class="text-gray-600">Ref: {{ currentProperty.reference_number }}</p>
        </div>
        <div class="flex gap-2">
          <button
            v-if="canUpdate"
            @click="$router.push(`/dashboard/properties/edit/${currentProperty.id}`)"
            class="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
          >
            Edit
          </button>
          <button
            @click="$router.push('/dashboard/properties')"
            class="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Back
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div class="bg-white p-6 rounded-lg shadow">
          <h3 class="text-lg font-semibold mb-2">Price</h3>
          <p class="text-3xl font-bold text-indigo-600">${{ formatPrice(currentProperty.price) }}</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow">
          <h3 class="text-lg font-semibold mb-2">Area</h3>
          <p class="text-3xl font-bold">{{ currentProperty.area }} m²</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow">
          <h3 class="text-lg font-semibold mb-2">Status</h3>
          <p class="text-lg"><span class="bg-green-100 text-green-800 px-3 py-1 rounded">{{ currentProperty.status_name }}</span></p>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow mb-6">
        <h3 class="text-lg font-semibold mb-4">Details</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div><span class="font-medium">Type:</span> {{ currentProperty.type_name }}</div>
          <div><span class="font-medium">Listing:</span> {{ currentProperty.listing_type_name }}</div>
          <div><span class="font-medium">Bedrooms:</span> {{ currentProperty.bedrooms || 'N/A' }}</div>
          <div><span class="font-medium">Bathrooms:</span> {{ currentProperty.bathrooms || 'N/A' }}</div>
          <div><span class="font-medium">Parking:</span> {{ currentProperty.parking_spaces || 'N/A' }}</div>
          <div><span class="font-medium">Year Built:</span> {{ currentProperty.year_built || 'N/A' }}</div>
          <div><span class="font-medium">Floor:</span> {{ currentProperty.floor_number || 'N/A' }}</div>
          <div><span class="font-medium">Total Floors:</span> {{ currentProperty.total_floors || 'N/A' }}</div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow mb-6" v-if="hasFeatures">
        <h3 class="text-lg font-semibold mb-4">Features</h3>
        <div class="flex flex-wrap gap-2">
          <span v-if="currentProperty.furnished" class="bg-blue-100 text-blue-800 px-3 py-1 rounded">Furnished</span>
          <span v-if="currentProperty.has_pool" class="bg-blue-100 text-blue-800 px-3 py-1 rounded">Pool</span>
          <span v-if="currentProperty.has_gym" class="bg-blue-100 text-blue-800 px-3 py-1 rounded">Gym</span>
          <span v-if="currentProperty.has_security" class="bg-blue-100 text-blue-800 px-3 py-1 rounded">Security</span>
          <span v-if="currentProperty.has_parking" class="bg-blue-100 text-blue-800 px-3 py-1 rounded">Parking</span>
          <span v-if="currentProperty.has_garden" class="bg-blue-100 text-blue-800 px-3 py-1 rounded">Garden</span>
          <span v-if="currentProperty.has_balcony" class="bg-blue-100 text-blue-800 px-3 py-1 rounded">Balcony</span>
          <span v-if="currentProperty.has_elevator" class="bg-blue-100 text-blue-800 px-3 py-1 rounded">Elevator</span>
          <span v-if="currentProperty.has_ac" class="bg-blue-100 text-blue-800 px-3 py-1 rounded">A/C</span>
          <span v-if="currentProperty.has_heating" class="bg-blue-100 text-blue-800 px-3 py-1 rounded">Heating</span>
          <span v-if="currentProperty.has_internet" class="bg-blue-100 text-blue-800 px-3 py-1 rounded">Internet</span>
          <span v-if="currentProperty.pets_allowed" class="bg-blue-100 text-blue-800 px-3 py-1 rounded">Pets Allowed</span>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow mb-6" v-if="currentProperty.description">
        <h3 class="text-lg font-semibold mb-4">Description</h3>
        <p class="text-gray-700">{{ currentProperty.description }}</p>
      </div>

      <div class="bg-white p-6 rounded-lg shadow mb-6">
        <h3 class="text-lg font-semibold mb-4">Location</h3>
        <p class="text-gray-700">{{ currentProperty.address }}</p>
        <p class="text-gray-600">{{ currentProperty.city }}</p>
      </div>

      <div class="bg-white p-6 rounded-lg shadow" v-if="currentProperty.notes">
        <h3 class="text-lg font-semibold mb-4">Notes</h3>
        <p class="text-gray-700">{{ currentProperty.notes }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { usePropertyStore } from '@/stores/propertyStore';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';

const route = useRoute();
const propertyStore = usePropertyStore();
const authStore = useAuthStore();

const { currentProperty, loading } = storeToRefs(propertyStore);

const canUpdate = computed(() => authStore.user?.role === 'admin' || authStore.user?.role === 'manager');

const hasFeatures = computed(() => {
  if (!currentProperty.value) return false;
  return currentProperty.value.furnished || currentProperty.value.has_pool || 
         currentProperty.value.has_gym || currentProperty.value.has_security ||
         currentProperty.value.has_parking || currentProperty.value.has_garden ||
         currentProperty.value.has_balcony || currentProperty.value.has_elevator ||
         currentProperty.value.has_ac || currentProperty.value.has_heating ||
         currentProperty.value.has_internet || currentProperty.value.pets_allowed;
});

const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US').format(price);
};

onMounted(async () => {
  await propertyStore.fetchProperty(route.params.id);
});
</script>
