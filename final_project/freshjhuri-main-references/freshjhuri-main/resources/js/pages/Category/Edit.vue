<script setup>
import { Link, Head, useForm } from "@inertiajs/vue3";
import { ArrowLeft, Image as ImageIcon, X } from "lucide-vue-next";
import { ref, onUnmounted } from "vue";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from "@/layouts/AppLayout.vue";

const props = defineProps({
    category: {
        type: Object,
        required: true
    }
});

const breadcrumbs = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Categories", href: "/categories" },
    { title: "Edit", href: `/categories/${props.category.id}/edit` },
];

// Helper function to get full image URL
const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `/storage/${path}`;
};

// Initialize form with existing category data
const form = useForm({
    name_en: props.category.name_en,
    name_bn: props.category.name_bn,
    desc_en: props.category.desc_en || '',
    desc_bn: props.category.desc_bn || '',
    image: null,
    is_featured: Boolean(props.category.is_featured),
    status: Boolean(props.category.status),
    sort_order: props.category.sort_order ?? 0,
    _method: 'PUT'
});

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

const frontendErrorMessage = (message) => {
    const errorMap = {
        IMAGE_PROCESSING_FAILED: 'Could not process the selected image. Please try another image file.',
    };

    return errorMap[message] ?? message;
};

const submit = () => {
    form.post(route('categories.update', props.category.id), {
        preserveScroll: true,
        onSuccess: () => {
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
        <Head :title="`Edit Category: ${category.name_en}`" />

        <div class="lg:w-full mx-auto p-4 sm:p-2 lg:p-8">
            <!-- Back Button -->
            <div class="mb-4">
                <Button variant="ghost" as-child>
                    <Link :href="route('categories.index')" class="flex items-center">
                        <ArrowLeft class="mr-2 h-4 w-4" /> Back to List
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle class="text-xl font-bold">Edit Category</CardTitle>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Editing: {{ category.name_en }}
                    </p>
                </CardHeader>
                <CardContent>
                    <form @submit.prevent="submit" class="space-y-6" enctype="multipart/form-data">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <!-- Name English -->
                            <div class="space-y-2">
                                <Label for="name_en" class="text-sm font-medium">
                                    Name (English) <span class="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="name_en"
                                    v-model="form.name_en"
                                    type="text"
                                    placeholder="Enter name in English"
                                    :class="{ 'border-red-500 focus-visible:ring-red-500': form.errors.name_en }"
                                />
                                <span v-if="form.errors.name_en" class="text-sm text-red-500">{{ form.errors.name_en }}</span>
                            </div>

                            <!-- Sort Order -->
                            <div class="space-y-2">
                                <Label for="sort_order" class="text-sm font-medium">Sort Order (Priority)</Label>
                                <Input
                                    id="sort_order"
                                    v-model="form.sort_order"
                                    type="number"
                                    min="0"
                                    placeholder="Enter sort order (higher = higher priority)"
                                    :class="{ 'border-red-500 focus-visible:ring-red-500': form.errors.sort_order }"
                                />
                                <span v-if="form.errors.sort_order" class="text-sm text-red-500">{{ form.errors.sort_order }}</span>
                            </div>

                            <!-- Name Bangla -->
                            <div class="space-y-2">
                                <Label for="name_bn" class="text-sm font-medium">
                                    Name (Bangla) <span class="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="name_bn"
                                    v-model="form.name_bn"
                                    type="text"
                                    placeholder="বাংলায় নাম লিখুন"
                                    :class="{ 'border-red-500 focus-visible:ring-red-500': form.errors.name_bn }"
                                />
                                <span v-if="form.errors.name_bn" class="text-sm text-red-500">{{ form.errors.name_bn }}</span>
                            </div>

                            <!-- Description English -->
                            <div class="space-y-2 md:col-span-2">
                                <Label for="desc_en" class="text-sm font-medium">Description (English)</Label>
                                <Textarea
                                    id="desc_en"
                                    v-model="form.desc_en"
                                    placeholder="Enter description in English"
                                    rows="4"
                                    class="resize-none"
                                />
                            </div>

                            <!-- Description Bangla -->
                            <div class="space-y-2 md:col-span-2">
                                <Label for="desc_bn" class="text-sm font-medium">Description (Bangla)</Label>
                                <Textarea
                                    id="desc_bn"
                                    v-model="form.desc_bn"
                                    placeholder="বাংলায় বিবরণ লিখুন"
                                    rows="4"
                                    class="resize-none"
                                />
                            </div>

                            <!-- Current Image Section -->
                            <div class="md:col-span-2 space-y-4" v-if="category.image">
                                <Label class="text-sm font-medium">Current Image</Label>
                                <div class="flex flex-wrap gap-4">
                                    <div class="relative group">
                                        <div class="absolute inset-0 bg-black bg-opacity-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <span class="text-white text-xs px-2 py-1 bg-black bg-opacity-50 rounded">Current Image</span>
                                        </div>
                                        <img 
                                            :src="getImageUrl(category.image)" 
                                            alt="Current Category Image" 
                                            class="h-32 w-32 object-cover rounded-lg border-2 border-gray-200 dark:border-gray-700"
                                        />
                                    </div>
                                </div>
                            </div>

                            <!-- Image Upload Section -->
                            <div class="space-y-2">
                                <Label for="image" class="text-sm font-medium">Change Category Image</Label>
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
                                <span v-if="form.errors.image" class="text-sm text-red-500">{{ frontendErrorMessage(form.errors.image) }}</span>
                                
                                <!-- New Image Preview -->
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

                            <!-- Featured Toggle -->
                            <div class="space-y-2">
                                <Label class="text-sm font-medium">Featured</Label>
                                <div class="flex items-center space-x-4 pt-2">
                                    <button
                                        type="button"
                                        @click="form.is_featured = !form.is_featured"
                                        class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                                        :class="form.is_featured ? 'bg-emerald-500' : 'bg-gray-300'"
                                    >
                                        <span
                                            class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                                            :class="form.is_featured ? 'translate-x-6' : 'translate-x-1'"
                                        />
                                    </button>
                                    <div class="flex flex-col">
                                        <span class="text-sm font-medium" :class="form.is_featured ? 'text-emerald-600' : 'text-gray-500'">
                                            {{ form.is_featured ? 'Yes' : 'No' }}
                                        </span>
                                        <span class="text-xs text-gray-400">
                                            Current: {{ category.is_featured ? 'Yes' : 'No' }}
                                        </span>
                                    </div>
                                </div>
                                <span v-if="form.errors.is_featured" class="text-sm text-red-500">{{ form.errors.is_featured }}</span>
                            </div>

                            <!-- Status Toggle - Simple Button Style -->
                            <div class="space-y-2">
                                <Label class="text-sm font-medium">Status</Label>
                                <div class="flex items-center space-x-4 pt-2">
                                    <button
                                        type="button"
                                        @click="form.status = !form.status"
                                        class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                                        :class="form.status ? 'bg-emerald-500' : 'bg-gray-300'"
                                    >
                                        <span
                                            class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                                            :class="form.status ? 'translate-x-6' : 'translate-x-1'"
                                        />
                                    </button>
                                    <div class="flex flex-col">
                                        <span class="text-sm font-medium" :class="form.status ? 'text-emerald-600' : 'text-gray-500'">
                                            {{ form.status ? 'Active' : 'Inactive' }}
                                        </span>
                                        <span class="text-xs text-gray-400">
                                            Current: {{ category.status ? 'Active' : 'Inactive' }}
                                        </span>
                                    </div>
                                </div>
                                <span v-if="form.errors.status" class="text-sm text-red-500">{{ form.errors.status }}</span>
                                <p class="text-xs text-gray-500 mt-1">
                                    Click the toggle to change category status
                                </p>
                            </div>
                        </div>

                        <!-- Form Actions -->
                        <div class="flex justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <Button type="button" variant="outline" as-child>
                                <Link :href="route('categories.index')">Cancel</Link>
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
                                <span v-else>Update Category</span>
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    </AppLayout>
</template>

<style scoped>
input[type="file"]::file-selector-button {
    display: none;
}
</style>
