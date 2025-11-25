<template>
  <div class="relative h-48 bg-gray-200 group">
    <div v-if="images && images.length > 0" class="relative h-full">
      <!-- Current Image -->
      <img
        :src="`http://localhost:3000/${images[currentIndex]}`"
        :alt="alt"
        class="w-full h-full object-cover"
        @error="handleImageError"
      />

      <!-- Navigation Arrows (show on hover if multiple images) -->
      <template v-if="images.length > 1">
        <button
          @click.stop="previousImage"
          class="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-black/70"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          @click.stop="nextImage"
          class="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-black/70"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <!-- Image Counter -->
        <div class="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
          {{ currentIndex + 1 }} / {{ images.length }}
        </div>
      </template>
    </div>

    <!-- No Image Placeholder -->
    <div v-else class="h-full flex items-center justify-center">
      <span class="text-gray-400">No Image</span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  images: {
    type: Array,
    default: () => []
  },
  alt: {
    type: String,
    default: 'Property image'
  }
});

const currentIndex = ref(0);
const imageError = ref(false);

const nextImage = () => {
  if (props.images.length > 0) {
    currentIndex.value = (currentIndex.value + 1) % props.images.length;
  }
};

const previousImage = () => {
  if (props.images.length > 0) {
    currentIndex.value = currentIndex.value === 0 ? props.images.length - 1 : currentIndex.value - 1;
  }
};

const handleImageError = () => {
  imageError.value = true;
};
</script>
