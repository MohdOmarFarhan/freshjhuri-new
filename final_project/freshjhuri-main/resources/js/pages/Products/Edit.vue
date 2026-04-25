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
  products: Array,
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
  badge_en: props.product.badge_en ?? "",
  badge_bn: props.product.badge_bn ?? "",
  description_en: props.product.description_en ?? "",
  description_bn: props.product.description_bn ?? "",
  origin_story_en: props.product.origin_story_en ?? "",
  origin_story_bn: props.product.origin_story_bn ?? "",
  conservation_en: props.product.conservation_en ?? "",
  conservation_bn: props.product.conservation_bn ?? "",
  status: String(props.product.status),
  is_free_shipping: Boolean(props.product.is_free_shipping),
  is_organic: Boolean(props.product.is_organic),
  is_sugar_free: Boolean(props.product.is_sugar_free),
  is_pre_order: Boolean(props.product.is_pre_order),
  is_top_selling: Boolean(props.product.is_top_selling),
  sort_order: props.product.sort_order ?? '',
  season: props.product.season ?? 'ongoing',
  feature_image: null,
  hover_image: null,
  video_url: props.product.video_url ?? "",
  features: props.product.product_features || [],
  slider_images: [],
  attributes: props.product.attributes || [],
  nutrition_facts: props.product.nutrition_facts || [],
  fbt_relations: (props.product.fbt_relations || []).map((r) => ({
    related_product_id: r.related_product_id,
    discount_percent: r.discount_percent,
    sort_order: r.sort_order,
  })),
  deleted_slider_images: [],
});

const featureImagePreview = ref(null);
const hoverImagePreview = ref(null);
const featureInput = ref(null);
const hoverInput = ref(null);
const existingSliderImages = ref([...(props.product.slider_images || [])]);

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
    form.deleted_slider_images.push(id);
    const idx = existingSliderImages.value.findIndex((x) => x.id === id);
    if (idx >= 0) {
      existingSliderImages.value.splice(idx, 1);
    }
  }
};

const addFeature = () => {
  form.features.push({ feature_en: "", feature_bn: "" });
};
const removeFeature = (index) => {
  form.features.splice(index, 1);
};

const addAttribute = () => {
  form.attributes.push({ key: "", label_en: "", label_bn: "", value_en: "", value_bn: "", sort_order: form.attributes.length + 1 });
};
const removeAttribute = (index) => {
  form.attributes.splice(index, 1);
};

const addNutritionFact = () => {
  form.nutrition_facts.push({ name_en: "", name_bn: "", value: "", unit: "", per_quantity: 100, per_unit: "g", sort_order: form.nutrition_facts.length + 1 });
};
const removeNutritionFact = (index) => {
  form.nutrition_facts.splice(index, 1);
};

const addFbtRelation = () => {
  form.fbt_relations.push({ related_product_id: "", discount_percent: 5, sort_order: form.fbt_relations.length + 1 });
};
const removeFbtRelation = (index) => {
  form.fbt_relations.splice(index, 1);
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

              <div class="space-y-2">
                <Label>Badge (EN)</Label>
                <Input v-model="form.badge_en" placeholder="Best Seller / Imported / Premium" />
              </div>

              <div class="space-y-2">
                <Label>Badge (BN)</Label>
                <Input v-model="form.badge_bn" placeholder="Best Seller / Imported / Premium" />
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
                <Label>Origin Story (EN)</Label>
                <Textarea v-model="form.origin_story_en" rows="4" class="resize-none" />
              </div>

              <div class="space-y-2 md:col-span-2">
                <Label>Origin Story (BN)</Label>
                <Textarea v-model="form.origin_story_bn" rows="4" class="resize-none" />
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

              <div class="space-y-2">
                <Label>Flags</Label>
                <div class="mt-2 grid grid-cols-2 gap-3">
                  <label class="flex items-center gap-2 text-sm">
                    <input type="checkbox" v-model="form.is_organic" class="rounded border-gray-300" />
                    Organic
                  </label>
                  <label class="flex items-center gap-2 text-sm">
                    <input type="checkbox" v-model="form.is_sugar_free" class="rounded border-gray-300" />
                    Sugar Free
                  </label>
                  <label class="flex items-center gap-2 text-sm">
                    <input type="checkbox" v-model="form.is_pre_order" class="rounded border-gray-300" />
                    Pre-order
                  </label>
                  <label class="flex items-center gap-2 text-sm">
                    <input type="checkbox" v-model="form.is_top_selling" class="rounded border-gray-300" />
                    Top selling
                  </label>
                </div>
              </div>

              <div class="space-y-2">
                <Label>Video URL</Label>
                <Input v-model="form.video_url" placeholder="https://youtube.com/..." />
              </div>

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
              <div class="flex justify-between items-center mb-4">
                <h2 class="text-lg font-semibold text-foreground">Attributes</h2>
                <Button type="button" size="sm" @click="addAttribute">Add Attribute</Button>
              </div>
              <div class="space-y-3">
                <div
                  v-for="(row, index) in form.attributes"
                  :key="index"
                  class="grid grid-cols-1 md:grid-cols-6 gap-3 items-center p-3 bg-muted/40 rounded-lg"
                >
                  <Input v-model="row.key" placeholder="key" />
                  <Input v-model="row.label_en" placeholder="Label EN" />
                  <Input v-model="row.label_bn" placeholder="Label BN" />
                  <Input v-model="row.value_en" placeholder="Value EN" />
                  <Input v-model="row.value_bn" placeholder="Value BN" />
                  <div class="flex items-center gap-2">
                    <Input v-model="row.sort_order" type="number" min="0" placeholder="#" class="w-24" />
                    <Button type="button" variant="outline" size="sm" @click="removeAttribute(index)">Remove</Button>
                  </div>
                </div>
              </div>
            </div>

            <div class="border-t border-border pt-6">
              <div class="flex justify-between items-center mb-4">
                <h2 class="text-lg font-semibold text-foreground">Nutrition Facts</h2>
                <Button type="button" size="sm" @click="addNutritionFact">Add Fact</Button>
              </div>
              <div class="space-y-3">
                <div
                  v-for="(row, index) in form.nutrition_facts"
                  :key="index"
                  class="grid grid-cols-1 md:grid-cols-7 gap-3 items-center p-3 bg-muted/40 rounded-lg"
                >
                  <Input v-model="row.name_en" placeholder="Name EN" />
                  <Input v-model="row.name_bn" placeholder="Name BN" />
                  <Input v-model="row.value" placeholder="Value" />
                  <Input v-model="row.unit" placeholder="Unit" />
                  <Input v-model="row.per_quantity" type="number" min="0" placeholder="Per" />
                  <Input v-model="row.per_unit" placeholder="Per unit" />
                  <div class="flex items-center gap-2">
                    <Input v-model="row.sort_order" type="number" min="0" placeholder="#" class="w-24" />
                    <Button type="button" variant="outline" size="sm" @click="removeNutritionFact(index)">Remove</Button>
                  </div>
                </div>
              </div>
            </div>

            <div class="border-t border-border pt-6">
              <div class="flex justify-between items-center mb-4">
                <h2 class="text-lg font-semibold text-foreground">Frequently Bought Together</h2>
                <Button type="button" size="sm" @click="addFbtRelation">Add Item</Button>
              </div>
              <div class="space-y-3">
                <div
                  v-for="(row, index) in form.fbt_relations"
                  :key="index"
                  class="grid grid-cols-1 md:grid-cols-4 gap-3 items-center p-3 bg-muted/40 rounded-lg"
                >
                  <div class="md:col-span-2">
                    <select
                      v-model="row.related_product_id"
                      class="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="">Select product</option>
                      <option v-for="p in products" :key="p.id" :value="p.id">{{ p.title_en }}</option>
                    </select>
                  </div>
                  <Input v-model="row.discount_percent" type="number" step="0.01" min="0" max="99.99" placeholder="Discount %" />
                  <div class="flex items-center gap-2">
                    <Input v-model="row.sort_order" type="number" min="0" placeholder="#" class="w-24" />
                    <Button type="button" variant="outline" size="sm" @click="removeFbtRelation(index)">Remove</Button>
                  </div>
                </div>
              </div>
            </div>

            <div class="border-t border-border pt-6">
              <Label>Slider Images (Append new)</Label>
              <div v-if="existingSliderImages.length" class="flex flex-wrap gap-4 mb-4 mt-3">
                <div
                  v-for="img in existingSliderImages"
                  :key="img.id"
                  class="relative group"
                >
                  <img
                    :src="`/${img.slider_image}`"
                    class="h-24 w-auto rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow object-cover"
                    alt="Slider image preview"
                  />
                  <button type="button" @click="deleteSliderImage(img.id)" class="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 focus:opacity-100" title="Delete image">✕</button>
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
