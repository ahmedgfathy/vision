<template>
  <div class="bg-white p-6 rounded-lg shadow">
    <h3 class="text-lg font-semibold mb-4">Property Media</h3>
    
    <!-- Upload Section -->
    <div class="mb-6">
      <label class="block text-sm font-medium mb-2">Upload Images/Videos</label>
      <input
        ref="fileInput"
        type="file"
        multiple
        accept="image/jpeg,image/png,image/gif,image/webp,video/mp4,video/mpeg"
        @change="handleFileSelect"
        class="hidden"
      />
      <button
        type="button"
        @click="$refs.fileInput.click()"
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Choose Files
      </button>
      <p class="text-sm text-gray-500 mt-2">
        Supported: JPEG, PNG, GIF, WEBP (images), MP4, MPEG (videos) - Max 5MB per file
      </p>
    </div>

    <!-- Selected Files Preview (before upload) -->
    <div v-if="selectedFiles.length > 0" class="mb-6">
      <h4 class="font-medium mb-2">Selected Files ({{ selectedFiles.length }})</h4>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div v-for="(file, index) in selectedFiles" :key="index" class="relative">
          <div class="aspect-square bg-gray-100 rounded flex items-center justify-center">
            <img
              v-if="file.type.startsWith('image')"
              :src="file.preview"
              class="w-full h-full object-cover rounded"
              :alt="file.name"
            />
            <div v-else class="text-center p-4">
              <svg class="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <p class="text-xs text-gray-500 mt-2">Video</p>
            </div>
          </div>
          <button
            type="button"
            @click="removeSelectedFile(index)"
            class="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      <button
        v-if="propertyId"
        type="button"
        @click="uploadFiles"
        :disabled="uploading"
        class="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
      >
        {{ uploading ? 'Uploading...' : 'Upload Files' }}
      </button>
    </div>

    <!-- Existing Media (already uploaded) -->
    <div v-if="existingMedia && existingMedia.length > 0">
      <h4 class="font-medium mb-2">Uploaded Media ({{ existingMedia.length }})</h4>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div v-for="media in existingMedia" :key="media.id" class="relative">
          <div class="aspect-square bg-gray-100 rounded flex items-center justify-center">
            <img
              v-if="media.file_type === 'image'"
              :src="`http://localhost:3000/${media.file_path}`"
              class="w-full h-full object-cover rounded"
              alt="Property media"
            />
            <div v-else class="text-center p-4">
              <svg class="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <p class="text-xs text-gray-500 mt-2">Video</p>
            </div>
          </div>
          <button
            v-if="canDelete"
            type="button"
            @click="$emit('delete-media', media.id)"
            class="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  propertyId: Number,
  existingMedia: Array,
  canDelete: Boolean
});

const emit = defineEmits(['upload', 'delete-media']);

const fileInput = ref(null);
const selectedFiles = ref([]);
const uploading = ref(false);

const handleFileSelect = (event) => {
  const files = Array.from(event.target.files);
  
  files.forEach(file => {
    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert(`File ${file.name} is too large. Max size is 5MB.`);
      return;
    }

    // Create preview for images
    const fileObj = {
      file,
      name: file.name,
      type: file.type,
      preview: null
    };

    if (file.type.startsWith('image')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        fileObj.preview = e.target.result;
      };
      reader.readAsDataURL(file);
    }

    selectedFiles.value.push(fileObj);
  });

  // Reset input
  event.target.value = '';
};

const removeSelectedFile = (index) => {
  selectedFiles.value.splice(index, 1);
};

const uploadFiles = async () => {
  if (!props.propertyId) {
    alert('Please save the property first before uploading media.');
    return;
  }

  uploading.value = true;
  try {
    const files = selectedFiles.value.map(f => f.file);
    await emit('upload', files);
    selectedFiles.value = [];
  } catch (error) {
    console.error('Upload error:', error);
  } finally {
    uploading.value = false;
  }
};
</script>
