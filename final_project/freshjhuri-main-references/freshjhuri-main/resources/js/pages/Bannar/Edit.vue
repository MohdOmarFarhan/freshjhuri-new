<script setup>
import { Link, Head, useForm } from "@inertiajs/vue3";
import { ArrowLeft, Image as ImageIcon, X } from "lucide-vue-next";
import { ref, computed, onUnmounted } from "vue";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from "@/layouts/AppLayout.vue";

const props = defineProps({
    bannar: {
        type: Object,
        required: true
    },
    categories: {
        type: Array,
        required: true
    }
});

const breadcrumbs = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Bannars", href: "/bannars" },
    { title: "Edit", href: `/bannars/${props.bannar.id}/edit` },
];

// Helper function to get full image URL
const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `/storage/${path}`;
};

const form = useForm({
    title_en: props.bannar.title_en,
    title_bn: props.bannar.title_bn,
    short_desc_en: props.bannar.short_desc_en,
    short_desc_bn: props.bannar.short_desc_bn,
    long_desc_en: props.bannar.long_desc_en,
    long_desc_bn: props.bannar.long_desc_bn,
    category_id: props.bannar.category_id || '',
    image: null,
    _method: 'PUT'
});

// No need for handleCategoryChange, v-model handles it

const imagePreview = ref(null);

const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    form.image = file;
    if (imagePreview.value) {
        URL.revokeObjectURL(imagePreview.value);
    }
    imagePreview.value = URL.createObjectURL(file);
};

const removeImage = () => {
    form.image = null;
    if (imagePreview.value) {
        URL.revokeObjectURL(imagePreview.value);
        imagePreview.value = null;
    }
};

const submit = () => {
    form.post(route('bannars.update', props.bannar.id), {
        preserveScroll: true,
        onSuccess: () => {
            // Clean up previews on success
            if (imagePreview.value) {
                URL.revokeObjectURL(imagePreview.value);
            }
        }
    });
};

// Clean up previews when component is unmounted
onUnmounted(() => {
    if (imagePreview.value) {
        URL.revokeObjectURL(imagePreview.value);
    }
});
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head :title="`Edit Bannar: ${bannar.title_en}`" />

        <div class="lg:w-full mx-auto p-4 sm:p-2 lg:p-8">
            <!-- Back Button -->
            <div class="mb-4">
                <Button variant="ghost" as-child>
                    <Link :href="route('bannars.index')" class="flex items-center">
                        <ArrowLeft class="mr-2 h-4 w-4" /> Back to List
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle class="text-xl font-bold">Edit Bannar</CardTitle>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Editing: {{ bannar.title_en }}
                    </p>
                </CardHeader>
                <CardContent>
                    <form @submit.prevent="submit" class="space-y-6" enctype="multipart/form-data">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <!-- Title English -->
                            <div class="space-y-2">
                                <Label for="title_en" class="text-sm font-medium">
                                    Title (English) <span class="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="title_en"
                                    v-model="form.title_en"
                                    type="text"
                                    placeholder="Enter title in English"
                                    :class="{ 'border-red-500 focus-visible:ring-red-500': form.errors.title_en }"
                                />
                                <span v-if="form.errors.title_en" class="text-sm text-red-500">{{ form.errors.title_en }}</span>
                            </div>

                            <!-- Title Bangla -->
                            <div class="space-y-2">
                                <Label for="title_bn" class="text-sm font-medium">
                                    Title (Bangla) <span class="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="title_bn"
                                    v-model="form.title_bn"
                                    type="text"
                                    placeholder="বাংলায় শিরোনাম লিখুন"
                                    :class="{ 'border-red-500 focus-visible:ring-red-500': form.errors.title_bn }"
                                />
                                <span v-if="form.errors.title_bn" class="text-sm text-red-500">{{ form.errors.title_bn }}</span>
                            </div>

                            <!-- Short Description English -->
                            <div class="space-y-2">
                                <Label for="short_desc_en" class="text-sm font-medium">Short Description (English)</Label>
                                <Textarea
                                    id="short_desc_en"
                                    v-model="form.short_desc_en"
                                    placeholder="Enter short description in English"
                                    rows="3"
                                    class="resize-none"
                                />
                            </div>

                            <!-- Short Description Bangla -->
                            <div class="space-y-2">
                                <Label for="short_desc_bn" class="text-sm font-medium">Short Description (Bangla)</Label>
                                <Textarea
                                    id="short_desc_bn"
                                    v-model="form.short_desc_bn"
                                    placeholder="বাংলায় সংক্ষিপ্ত বিবরণ লিখুন"
                                    rows="3"
                                    class="resize-none"
                                />
                            </div>

                            <!-- Long Description English -->
                            <div class="space-y-2 md:col-span-2">
                                <Label for="long_desc_en" class="text-sm font-medium">Long Description (English)</Label>
                                <Textarea
                                    id="long_desc_en"
                                    v-model="form.long_desc_en"
                                    placeholder="Enter long description in English"
                                    rows="5"
                                    class="resize-none"
                                />
                            </div>

                            <!-- Long Description Bangla -->
                            <div class="space-y-2 md:col-span-2">
                                <Label for="long_desc_bn" class="text-sm font-medium">Long Description (Bangla)</Label>
                                <Textarea
                                    id="long_desc_bn"
                                    v-model="form.long_desc_bn"
                                    placeholder="বাংলায় দীর্ঘ বিবরণ লিখুন"
                                    rows="5"
                                    class="resize-none"
                                />
                            </div>

                            <div class="space-y-2 md:col-span-2">
                                <Label for="category_id" class="text-sm font-medium">Category</Label>
                                <select
                                    id="category_id"
                                    class="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
                                    :class="{ 'border-red-500 focus-visible:ring-red-500': form.errors.category_id }"
                                    v-model="form.category_id"
                                >
                                    <option value="">Select a category</option>
                                    <option v-for="cat in props.categories" :key="cat.id" :value="cat.id">
                                        {{ cat.name_en }}
                                    </option>
                                </select>
                                <span v-if="form.errors.category_id" class="text-sm text-red-500">{{ form.errors.category_id }}</span>
                            </div>

                            <!-- Current Images Section -->
                            <div class="md:col-span-2 space-y-4">
                                <Label class="text-sm font-medium">Current Images</Label>
                                <div class="flex flex-wrap gap-4">
                                    <!-- Current Main Image -->
                                    <div v-if="bannar.image" class="relative group">
                                        <div class="absolute inset-0 bg-black bg-opacity-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <span class="text-white text-xs px-2 py-1 bg-black bg-opacity-50 rounded">Main Image</span>
                                        </div>
                                        <img 
                                            :src="getImageUrl(bannar.image)" 
                                            alt="Current Main Image" 
                                            class="h-32 w-32 object-cover rounded-lg border-2 border-gray-200 dark:border-gray-700"
                                        />
                                    </div>
                                    <div v-if="!bannar.image" class="text-gray-500 dark:text-gray-400">
                                        No images uploaded
                                    </div>
                                </div>
                            </div>

                            <!-- Main Image -->
                            <div class="space-y-2">
                                <Label for="image" class="text-sm font-medium">Change Main Image</Label>
                                <div class="flex items-center space-x-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        @click="$refs.imageInput.click()"
                                        class="w-full"
                                    >
                                        <ImageIcon class="mr-2 h-4 w-4" /> Choose New Image
                                    </Button>
                                    <input
                                        ref="imageInput"
                                        type="file"
                                        accept="image/jpeg,image/png,image/jpg,image/gif,image/webp,image/bmp"
                                        class="hidden"
                                        @change="handleImageUpload"
                                    />
                                </div>
                                <p class="text-sm text-gray-500 dark:text-gray-400">
                                    Leave empty to keep current image. Max size: 2MB (JPG, PNG, GIF, WEBP)
                                </p>
                                
                                <!-- Image Preview -->
                                <div v-if="imagePreview" class="relative mt-2 inline-block">
                                    <img 
                                        :src="imagePreview" 
                                        alt="Preview" 
                                        class="h-32 w-32 object-cover rounded-lg border-2 border-gray-200 dark:border-gray-700"
                                    >
                                    <button
                                        type="button"
                                        @click="removeImage"
                                        class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-lg"
                                    >
                                        <X class="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Form Actions -->
                        <div class="flex justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <Button type="button" variant="outline" as-child>
                                <Link :href="route('bannars.index')">Cancel</Link>
                            </Button>
                            <Button 
                                type="submit" 
                                :disabled="form.processing"
                                class="bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700"
                            >
                                <span v-if="form.processing" class="flex items-center">
                                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Updating...
                                </span>
                                <span v-else>Update Bannar</span>
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    </AppLayout>
</template>

<style scoped>
/* Optional: Add custom styles for file input button */
input[type="file"]::file-selector-button {
    display: none;
}
</style>
