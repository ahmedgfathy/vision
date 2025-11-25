<template>
  <div class="bg-white p-6 rounded-lg shadow">
    <h3 class="text-lg font-semibold mb-4">{{ t('properties.gallery.title') }}</h3>
    
    <!-- Upload Section -->
    <div class="mb-6">
      <input
        ref="fileInput"
        type="file"
        multiple
        accept="image/jpeg,image/png,image/gif,image/webp"
        @change="handleFileSelect"
        class="hidden"
      />
      <button
        type="button"
        @click="$refs.fileInput.click()"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors shadow-sm"
      >
        <Upload :size="18" />
        {{ t('properties.gallery.chooseImages') }}
      </button>
      <button
        v-if="selectedFiles.length > 0"
        type="button"
        @click="uploadImages"
        :disabled="uploading"
        class="ml-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 flex items-center gap-2 transition-colors shadow-sm"
      >
        <ImagePlus :size="18" />
        {{ uploading ? t('properties.gallery.uploading') : `${t('properties.gallery.upload')} ${selectedFiles.length}` }}
      </button>
    </div>

    <!-- Selected Files Preview -->
    <div v-if="selectedFiles.length > 0" class="grid grid-cols-4 gap-4 mb-6">
      <div v-for="(file, index) in selectedFiles" :key="index" class="relative">
        <img :src="file.preview" class="w-full h-32 object-cover rounded" />
        <button
          @click="removeSelectedFile(index)"
          class="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
        >
          ×
        </button>
      </div>
    </div>

    <!-- Existing Gallery -->
    <div v-if="gallery.length > 0" class="grid grid-cols-4 gap-4">
      <div v-for="image in gallery" :key="image.id" class="relative group">
        <img
          :src="`http://localhost:3000/${image.file_path}`"
          class="w-full h-32 object-cover rounded"
          :class="{ 'ring-4 ring-gray-400': image.is_primary }"
        />
        <div class="absolute top-1 right-1 space-x-1">
          <button
            v-if="!image.is_primary"
            @click="setPrimary(image.id)"
            class="bg-yellow-500 text-white p-1.5 rounded-lg hover:bg-yellow-600 text-xs shadow-sm transition-colors"
            :title="t('properties.gallery.setPrimary')"
          >
            <Star :size="14" />
          </button>
          <button
            @click="deleteImage(image.id)"
            class="bg-red-500 text-white p-1.5 rounded-lg hover:bg-red-600 shadow-sm transition-colors"
          >
            <X :size="14" />
          </button>
        </div>
        <span v-if="image.is_primary" class="absolute bottom-1 left-1 bg-yellow-500 text-white text-xs px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
          <Star :size="12" fill="white" />
          {{ t('properties.gallery.primary') }}
        </span>
      </div>
    </div>
    <p v-else class="text-gray-500 text-center">{{ t('properties.gallery.noImages') }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { usePropertyStore } from '@/stores/propertyStore';
import { useToast } from '@/composables/useToast';
import { useI18n } from 'vue-i18n';
import { Upload, ImagePlus, Star, X } from 'lucide-vue-next';

const { t } = useI18n();

const props = defineProps({
  propertyId: {
    type: Number,
    required: true
  },
  gallery: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['refresh']);

const propertyStore = usePropertyStore();
const toast = useToast();

const fileInput = ref(null);
const selectedFiles = ref([]);
const uploading = ref(false);

const handleFileSelect = (event) => {
  const files = Array.from(event.target.files);
  
  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = (e) => {
      selectedFiles.value.push({
        file,
        preview: e.target.result
      });
    };
    reader.readAsDataURL(file);
  });

  event.target.value = '';
};

const removeSelectedFile = (index) => {
  selectedFiles.value.splice(index, 1);
};

const uploadImages = async () => {
  uploading.value = true;
  try {
    const files = selectedFiles.value.map(f => f.file);
    await propertyStore.uploadGallery(props.propertyId, files);
    toast.success(t('properties.gallery.uploadSuccess'));
    selectedFiles.value = [];
    emit('refresh');
  } catch (error) {
    toast.error(t('common.error'));
  } finally {
    uploading.value = false;
  }
};

const deleteImage = async (imageId) => {
  if (confirm(t('properties.gallery.confirmDelete'))) {
    try {
      await propertyStore.deleteGalleryImage(props.propertyId, imageId);
      toast.success(t('properties.gallery.deleteSuccess'));
      emit('refresh');
    } catch (error) {
      toast.error(t('common.error'));
    }
  }
};

const setPrimary = async (imageId) => {
  try {
    await propertyStore.setPrimaryImage(props.propertyId, imageId);
    toast.success(t('properties.gallery.setPrimarySuccess'));
    emit('refresh');
  } catch (error) {
    toast.error(t('common.error'));
  }
};
</script>
