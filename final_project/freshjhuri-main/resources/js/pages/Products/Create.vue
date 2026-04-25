<script setup>
import { Head, Link, useForm } from "@inertiajs/vue3";
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
  categories: Array,
  products: Array,
  errors: Object
});

const breadcrumbs = [
  { title: "Dashboard", href: "/dashboard" },
  { title: "Products", href: "/products" },
  { title: "Create", href: "/products/create" },
];

const form = useForm({
  category_id: "",
  title_en: "",
  title_bn: "",
  short_desc_en: "",
  short_desc_bn: "",
  badge_en: "",
  badge_bn: "",
  description_en: "",
  description_bn: "",
  origin_story_en: "",
  origin_story_bn: "",
  conservation_en: "",
  conservation_bn: "",
  status: "1",
  is_free_shipping: false,
  is_organic: false,
  is_sugar_free: false,
  is_pre_order: false,
  is_top_selling: false,
  sort_order: "",
  season: "ongoing",
  feature_image: null,
  hover_image: null,
  video_url: "",
  features: [],
  slider_images: [],
  attributes: [],
  nutrition_facts: [],
  fbt_relations: [],
});

const fieldError = (path) => (props.errors && props.errors[path]) || "";

const featureImagePreview = ref(null);
const hoverImagePreview = ref(null);
const sliderImagePreviews = ref([]);
const featureInput = ref(null);
const hoverInput = ref(null);
const sliderInput = ref(null);

const submit = () => {
  form.post(route("products.store"), {
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

const onSliderImagesChange = (e) => {
  const target = e.target;
  const files = target.files ? Array.from(target.files) : [];
  form.slider_images = files;
  sliderImagePreviews.value.forEach((url) => URL.revokeObjectURL(url));
  sliderImagePreviews.value = files.map((file) => URL.createObjectURL(file));
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

const removeSliderImage = (index) => {
  const file = form.slider_images[index];
  const url = sliderImagePreviews.value[index];
  if (url) {
    URL.revokeObjectURL(url);
  }
  form.slider_images.splice(index, 1);
  sliderImagePreviews.value.splice(index, 1);
  if (!form.slider_images.length && sliderInput.value) {
    sliderInput.value.value = "";
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
</script>

<template>
  <AppLayout :breadcrumbs="breadcrumbs">
    <Head title="Create Product" />
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
          <CardTitle class="text-xl font-bold">Create Product</CardTitle>
          <p class="text-sm text-muted-foreground mt-1">Create a new product entry</p>
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
                <input
                  ref="featureInput"
                  type="file"
                  accept="image/*"
                  @change="onFeatureImageChange"
                  class="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-accent/10 file:text-accent hover:file:bg-accent/20 transition-all"
                />
                <div v-if="featureImagePreview" class="mt-2 relative inline-block">
                  <img :src="featureImagePreview" class="h-20 w-auto rounded border" />
                  <button
                    type="button"
                    class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2 text-xs"
                    @click="removeFeatureImage"
                  >
                    X
                  </button>
                </div>
              </div>

              <div class="space-y-2">
                <Label>Hover Image</Label>
                <input
                  ref="hoverInput"
                  type="file"
                  accept="image/*"
                  @change="onHoverImageChange"
                  class="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-accent/10 file:text-accent hover:file:bg-accent/20 transition-all"
                />
                <div v-if="hoverImagePreview" class="mt-2 relative inline-block">
                  <img :src="hoverImagePreview" class="h-20 w-auto rounded border" />
                  <button
                    type="button"
                    class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2 text-xs"
                    @click="removeHoverImage"
                  >
                    X
                  </button>
                </div>
              </div>
            </div>

            <div class="border-t border-border pt-6">
              <div class="flex justify-between items-center mb-4">
                <h2 class="text-lg font-semibold text-foreground">Features</h2>
                <Button type="button" size="sm" @click="addFeature">Add Feature</Button>
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
                  <Button type="button" variant="outline" size="sm" @click="removeFeature(index)">Remove</Button>
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
              <Label>Slider Images</Label>
              <input
                ref="sliderInput"
                type="file"
                accept="image/*"
                multiple
                @change="onSliderImagesChange"
                class="w-full mt-2 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-accent/10 file:text-accent hover:file:bg-accent/20 transition-all"
              />
              <div v-if="sliderImagePreviews.length" class="mt-2 flex flex-wrap gap-2">
                <div
                  v-for="(src, index) in sliderImagePreviews"
                  :key="index"
                  class="relative inline-block"
                >
                  <img :src="src" class="h-20 w-auto rounded border" />
                  <button
                    type="button"
                    class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2 text-xs"
                    @click="removeSliderImage(index)"
                  >
                    X
                  </button>
                </div>
              </div>
            </div>

            <div class="flex justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button type="button" variant="outline" as-child>
                <Link :href="route('products.index')">Cancel</Link>
              </Button>
              <Button type="submit" :disabled="form.processing" class="bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700">
                {{ form.processing ? "Creating..." : "Create Product" }}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  </AppLayout>
</template>
