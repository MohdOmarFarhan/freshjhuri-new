<script setup>
import { Head, Link, useForm, router } from "@inertiajs/vue3";
import { ArrowLeft } from "lucide-vue-next";
import { ref } from "vue";
import { route } from "ziggy-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import AppLayout from "@/layouts/AppLayout.vue";

const props = defineProps({
  product: Object,
  categories: Array,
  errors: Object
});

const breadcrumbs = [
  { title: "Dashboard", href: "/dashboard" },
  { title: "Products", href: "/products" },
  { title: "Edit", href: `/products/${props.product.id}/edit` },
];

const form = useForm({
  _method: "PUT",
  category_id: props.product.category_id,
  title_en: props.product.title_en,
  title_bn: props.product.title_bn,
  short_desc_en: props.product.short_desc_en ?? "",
  short_desc_bn: props.product.short_desc_bn ?? "",
  description_en: props.product.description_en ?? "",
  description_bn: props.product.description_bn ?? "",
  conservation_en: props.product.conservation_en ?? "",
  conservation_bn: props.product.conservation_bn ?? "",
  status: String(props.product.status),
  is_free_shipping: Boolean(props.product.is_free_shipping),
  sort_order: props.product.sort_order ?? '',
  season: props.product.season ?? 'ongoing',
  feature_image: null,
  hover_image: null,
  features: props.product.product_features || [],
  slider_images: [],
});

const featureImagePreview = ref(null);
const hoverImagePreview = ref(null);
const featureInput = ref(null);
const hoverInput = ref(null);

const submit = () => {
  form.post(route("products.update", props.product.id), {
    forceFormData: true,
  });
};

const onFeatureImageChange = (e) => {
  const target = e.target;
  const file = target.files && target.files[0] ? target.files[0] : null;
  form.feature_image = file;
  if (featureImagePreview.value) {
    URL.revokeObjectURL(featureImagePreview.value);
  }
  featureImagePreview.value = file ? URL.createObjectURL(file) : null;
};

const onHoverImageChange = (e) => {
  const target = e.target;
  const file = target.files && target.files[0] ? target.files[0] : null;
  form.hover_image = file;
  if (hoverImagePreview.value) {
    URL.revokeObjectURL(hoverImagePreview.value);
  }
  hoverImagePreview.value = file ? URL.createObjectURL(file) : null;
};

const removeFeatureImage = () => {
  form.feature_image = null;
  if (featureImagePreview.value) {
    URL.revokeObjectURL(featureImagePreview.value);
    featureImagePreview.value = null;
  }
  if (featureInput.value) {
    featureInput.value.value = "";
  }
};

const removeHoverImage = () => {
  form.hover_image = null;
  if (hoverImagePreview.value) {
    URL.revokeObjectURL(hoverImagePreview.value);
    hoverImagePreview.value = null;
  }
  if (hoverInput.value) {
    hoverInput.value.value = "";
  }
};

const onSliderImagesChange = (e) => {
  const target = e.target;
  form.slider_images = target.files ? Array.from(target.files) : [];
};

const deleteSliderImage = (id) => {
  if (confirm("Are you sure you want to delete this image?")) {
    router.delete(route("products.slider-image.delete", id), {
      preserveScroll: true,
      onSuccess: () => {
        // Optimistically remove from props or just rely on Inertia
        // Since we are preserving scroll, user stays on page.
      }
    });
  }
};

const addFeature = () => {
  form.features.push({ feature_en: "", feature_bn: "" });
};
const removeFeature = (index) => {
  form.features.splice(index, 1);
};

const fieldError = (path) => (props.errors && props.errors[path]) || "";
</script>

<template>
  <AppLayout :breadcrumbs="breadcrumbs">
    <Head title="Edit Product" />

    <div class="lg:w-full mx-auto p-4 sm:p-2 lg:p-8">
      <div class="mb-4">
        <Button variant="ghost" as-child>
          <Link :href="route('products.index')" class="flex items-center">
            <ArrowLeft class="mr-2 h-4 w-4" /> Back to List
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle class="text-xl font-bold">Edit Product</CardTitle>
          <p class="text-sm text-muted-foreground mt-1">Editing: {{ product.title_en }}</p>
        </CardHeader>

        <CardContent>
          <form @submit.prevent="submit" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <Label>Category <span class="text-red-500">*</span></Label>
                <select
                  v-model="form.category_id"
                  class="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  :class="{ 'border-red-500 focus-visible:ring-red-500': errors?.category_id }"
                >
                  <option value="">Select category</option>
                  <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                    {{ cat.name_en }}
                  </option>
                </select>
                <span v-if="errors?.category_id" class="text-sm text-red-500">{{ errors.category_id }}</span>
              </div>

              <div class="space-y-2">
                <Label>Status <span class="text-red-500">*</span></Label>
                <select
                  v-model="form.status"
                  class="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  :class="{ 'border-red-500 focus-visible:ring-red-500': errors?.status }"
                >
                  <option value="1">Active</option>
                  <option value="0">Inactive</option>
                </select>
                <span v-if="errors?.status" class="text-sm text-red-500">{{ errors.status }}</span>
              </div>



              <div class="space-y-2">
                <Label>Season <span class="text-red-500">*</span></Label>
                <select
                  v-model="form.season"
                  class="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  :class="{ 'border-red-500 focus-visible:ring-red-500': errors?.season }"
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="outofseason">Out of Season</option>
                </select>
                <span v-if="errors?.season" class="text-sm text-red-500">{{ errors.season }}</span>
              </div>

              <div class="space-y-2">
                <Label>Sort Order</Label>
                <Input
                  v-model="form.sort_order"
                  type="number"
                  min="0"
                  placeholder="Sort order (optional)"
                  :class="{ 'border-red-500 focus-visible:ring-red-500': errors?.sort_order }"
                />
                <span v-if="errors?.sort_order" class="text-sm text-red-500">{{ errors.sort_order }}</span>
              </div>

              <div class="space-y-2">
                <Label>Title (EN) <span class="text-red-500">*</span></Label>
                <Input
                  v-model="form.title_en"
                  placeholder="English title"
                  :class="{ 'border-red-500 focus-visible:ring-red-500': errors?.title_en }"
                />
                <span v-if="errors?.title_en" class="text-sm text-red-500">{{ errors.title_en }}</span>
              </div>

              <div class="space-y-2">
                <Label>Title (BN) <span class="text-red-500">*</span></Label>
                <Input
                  v-model="form.title_bn"
                  placeholder="Bangla title"
                  :class="{ 'border-red-500 focus-visible:ring-red-500': errors?.title_bn }"
                />
                <span v-if="errors?.title_bn" class="text-sm text-red-500">{{ errors.title_bn }}</span>
              </div>

              <div class="space-y-2">
                <Label>Short Description (EN)</Label>
                <Textarea v-model="form.short_desc_en" rows="3" class="resize-none" />
              </div>

              <div class="space-y-2">
                <Label>Short Description (BN)</Label>
                <Textarea v-model="form.short_desc_bn" rows="3" class="resize-none" />
              </div>

              <div class="space-y-2 md:col-span-2">
                <Label>Description (EN)</Label>
                <Textarea v-model="form.description_en" rows="4" class="resize-none" />
              </div>

              <div class="space-y-2 md:col-span-2">
                <Label>Description (BN)</Label>
                <Textarea v-model="form.description_bn" rows="4" class="resize-none" />
              </div>

              <div class="space-y-2 md:col-span-2">
                <Label>Conservation (EN)</Label>
                <Textarea v-model="form.conservation_en" rows="4" class="resize-none" />
              </div>

              <div class="space-y-2 md:col-span-2">
                <Label>Conservation (BN)</Label>
                <Textarea v-model="form.conservation_bn" rows="4" class="resize-none" />
              </div>

              <div class="space-y-2">
                <Label>Free Shipping</Label>
                <div class="flex items-center space-x-2 mt-2">
                  <input
                    type="checkbox"
                    v-model="form.is_free_shipping"
                    class="rounded border-gray-300 text-accent focus:ring-accent"
                  />
                  <span class="text-sm text-muted-foreground">Enable Free Shipping</span>
                </div>
                <span v-if="errors?.is_free_shipping" class="text-sm text-red-500">{{ errors.is_free_shipping }}</span>
              </div>

              <div></div>

              <div class="space-y-2">
                <Label>Feature Image</Label>
                <div v-if="product.feature_image && !featureImagePreview" class="mb-2">
                  <img
                    :src="`/${product.feature_image}`"
                    class="h-20 w-auto rounded-lg border border-border shadow-sm"
                    alt="Feature image preview"
                  />
                </div>
                <div v-if="featureImagePreview" class="mb-2 relative inline-block">
                  <img
                    :src="featureImagePreview"
                    class="h-20 w-auto rounded-lg border border-border shadow-sm"
                    alt="New feature image preview"
                  />
                  <button
                    type="button"
                    @click="removeFeatureImage"
                    class="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs font-bold hover:bg-red-600 transition"
                  >
                    ✕
                  </button>
                </div>
                <input
                  ref="featureInput"
                  type="file"
                  accept="image/*"
                  @change="onFeatureImageChange"
                  class="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-accent/10 file:text-accent hover:file:bg-accent/20 transition-all"
                />
              </div>

              <div class="space-y-2">
                <Label>Hover Image</Label>
                <div v-if="product.hover_image && !hoverImagePreview" class="mb-2">
                  <img
                    :src="`/${product.hover_image}`"
                    class="h-20 w-auto rounded-lg border border-border shadow-sm"
                    alt="Hover image preview"
                  />
                </div>
                <div v-if="hoverImagePreview" class="mb-2 relative inline-block">
                  <img
                    :src="hoverImagePreview"
                    class="h-20 w-auto rounded-lg border border-border shadow-sm"
                    alt="New hover image preview"
                  />
                  <button
                    type="button"
                    @click="removeHoverImage"
                    class="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs font-bold hover:bg-red-600 transition"
                  >
                    ✕
                  </button>
                </div>
                <input
                  ref="hoverInput"
                  type="file"
                  accept="image/*"
                  @change="onHoverImageChange"
                  class="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-accent/10 file:text-accent hover:file:bg-accent/20 transition-all"
                />
              </div>
            </div>

            <div class="border-t border-border pt-6">
              <div class="flex justify-between items-center mb-4">
                <h2 class="text-lg font-semibold text-foreground">Features</h2>
                <Button type="button" size="sm" @click="addFeature" class="hover:shadow-md transition-shadow">
                  Add Feature
                </Button>
              </div>
              <div class="space-y-3">
                <div
                  v-for="(row, index) in form.features"
                  :key="index"
                  class="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3 items-center p-3 bg-muted/40 rounded-lg"
                >
                  <div>
                    <Input
                      v-model="row.feature_en"
                      placeholder="Feature EN"
                      :class="fieldError(`features.${index}.feature_en`) ? 'border-red-500 focus-visible:ring-red-500' : ''"
                    />
                    <div class="text-red-500 text-xs mt-1" v-if="fieldError(`features.${index}.feature_en`)">
                      {{ fieldError(`features.${index}.feature_en`) }}
                    </div>
                  </div>
                  <div>
                    <Input
                      v-model="row.feature_bn"
                      placeholder="Feature BN"
                      :class="fieldError(`features.${index}.feature_bn`) ? 'border-red-500 focus-visible:ring-red-500' : ''"
                    />
                    <div class="text-red-500 text-xs mt-1" v-if="fieldError(`features.${index}.feature_bn`)">
                      {{ fieldError(`features.${index}.feature_bn`) }}
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    @click="removeFeature(index)"
                    class="hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </div>

            <div class="border-t border-border pt-6">
              <Label>Slider Images (Append new)</Label>
              <div v-if="product.slider_images?.length" class="flex flex-wrap gap-4 mb-4 mt-3">
                <div
                  v-for="img in product.slider_images"
                  :key="img.id"
                  class="relative group"
                >
                  <img
                    :src="`/${img.slider_image}`"
                    class="h-24 w-auto rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow object-cover"
                    alt="Slider image preview"
                  />
                  <button
                    type="button"
                    @click="deleteSliderImage(img.id)"
                    class="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 focus:opacity-100"
                    title="Delete image"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
              <input
                type="file"
                accept="image/*"
                multiple
                @change="onSliderImagesChange"
                class="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-accent/10 file:text-accent hover:file:bg-accent/20 transition-all"
              />
            </div>

            <div class="flex justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button type="button" variant="outline" as-child>
                <Link :href="route('products.index')">Cancel</Link>
              </Button>

              <Button
                type="submit"
                :disabled="form.processing"
                class="bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700"
              >
                <span v-if="form.processing">Updating...</span>
                <span v-else>Update Product</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  </AppLayout>
</template>
