<script setup>
import { Head, Link, useForm } from '@inertiajs/vue3';
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import AppLayout from '@/layouts/AppLayout.vue';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const props = defineProps({
  categories: Array,
  availableVariants: Array,
  packagingSystems: Array,
});

const breadcrumbs = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Combo Products', href: '/combo-products' },
  { title: 'Create', href: '/combo-products/create' },
];

const packagingSystemOptions = computed(() => props.packagingSystems || []);
const defaultPackagingSystem = computed(() => packagingSystemOptions.value[0]?.value || '');

const variantLabel = (variant) => {
  const product = variant?.product;
  const size = variant?.size;
  const title = product?.title_en || '—';
  const sizeText = size ? `${size.amount_en} ${size.unit_en}` : '';
  const sku = variant?.sku ? ` (${variant.sku})` : '';
  return `${title}${sku}${sizeText ? ' - ' + sizeText : ''}`;
};

const form = useForm({
  category_id: '',
  title_en: '',
  title_bn: '',
  short_desc_en: '',
  short_desc_bn: '',
  conservation_en: '',
  conservation_bn: '',
  status: true,
  feature_image: null,
  slider_images: [],

  sku: '',
  stock: 0,
  price: 0,
  discount_price: null,

  packagings: [
    {
      packaging_system: defaultPackagingSystem.value,
      max_per_package: 1,
      shipping_charge_per_package: 0,
      is_default: true,
    },
  ],

  items: [{ included_variant_id: '', qty: 1 }],
});

const packagingGroupErrorFor = () => form.errors.packagings;
const packagingErrorFor = (packagingIndex, field) =>
  form.errors[`packagings.${packagingIndex}.${field}`];

const addPackagingRow = () => {
  form.packagings.push({
    packaging_system: defaultPackagingSystem.value,
    max_per_package: 1,
    shipping_charge_per_package: 0,
    is_default: false,
  });
};

const removePackagingRow = (packagingIndex) => {
  if (form.packagings.length === 1) return;
  form.packagings.splice(packagingIndex, 1);
  if (!form.packagings.some((p) => p.is_default)) {
    form.packagings[0].is_default = true;
  }
};

const setDefaultPackaging = (packagingIndex) => {
  form.packagings.forEach((p, i) => {
    p.is_default = i === packagingIndex;
  });
};

const addItemRow = () => {
  form.items.push({ included_variant_id: '', qty: 1 });
};

const removeItemRow = (index) => {
  if (form.items.length === 1) return;
  form.items.splice(index, 1);
};

const submit = () => {
  form.post(route('combo-products.store'), {
    forceFormData: true,
    preserveScroll: true,
  });
};

const featureImagePreview = ref(null);
const sliderImagePreviews = ref([]);
const sliderInput = ref(null);

watch(
  () => form.feature_image,
  (file) => {
    if (featureImagePreview.value) {
      URL.revokeObjectURL(featureImagePreview.value);
      featureImagePreview.value = null;
    }
    if (file instanceof File) {
      featureImagePreview.value = URL.createObjectURL(file);
    }
  }
);

const onSliderImagesChange = (e) => {
  const target = e.target;
  const files = target.files ? Array.from(target.files) : [];
  form.slider_images = files;
  sliderImagePreviews.value.forEach((url) => URL.revokeObjectURL(url));
  sliderImagePreviews.value = files.map((file) => URL.createObjectURL(file));
};

const removeSliderImage = (index) => {
  const url = sliderImagePreviews.value[index];
  if (url) {
    URL.revokeObjectURL(url);
  }
  form.slider_images.splice(index, 1);
  sliderImagePreviews.value.splice(index, 1);
  if (!form.slider_images.length && sliderInput.value) {
    sliderInput.value.value = '';
  }
};

onBeforeUnmount(() => {
  if (featureImagePreview.value) {
    URL.revokeObjectURL(featureImagePreview.value);
  }
  sliderImagePreviews.value.forEach((url) => URL.revokeObjectURL(url));
});
</script>

<template>
  <AppLayout :breadcrumbs="breadcrumbs">
    <Head title="Create Combo Package" />

    <div class="lg:w-full mx-auto p-4 sm:p-2 lg:p-8 space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-lg font-semibold">Create Combo Package</h1>
        <Button variant="outline" as-child>
          <Link :href="route('combo-products.index')">Back</Link>
        </Button>
      </div>

      <form class="space-y-6" @submit.prevent="submit">
        <Card>
          <CardHeader>
            <CardTitle class="text-base font-semibold">Combo Info</CardTitle>
          </CardHeader>
          <CardContent class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div class="space-y-2">
              <Label for="category_id">Category (Optional)</Label>
              <select
                id="category_id"
                v-model="form.category_id"
                class="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Auto (detect from included variants)</option>
                <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name_en }}</option>
              </select>
              <p v-if="form.errors.category_id" class="text-xs text-red-500">{{ form.errors.category_id }}</p>
            </div>

            <div class="space-y-2">
              <Label for="status">Status</Label>
              <select id="status" v-model="form.status" class="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option :value="true">Active</option>
                <option :value="false">Inactive</option>
              </select>
              <p v-if="form.errors.status" class="text-xs text-red-500">{{ form.errors.status }}</p>
            </div>

            <div class="space-y-2">
              <Label for="title_en">Title (English)</Label>
              <Input id="title_en" v-model="form.title_en" type="text" />
              <p v-if="form.errors.title_en" class="text-xs text-red-500">{{ form.errors.title_en }}</p>
            </div>

            <div class="space-y-2">
              <Label for="title_bn">Title (Bangla)</Label>
              <Input id="title_bn" v-model="form.title_bn" type="text" />
              <p v-if="form.errors.title_bn" class="text-xs text-red-500">{{ form.errors.title_bn }}</p>
            </div>

            <div class="space-y-2 md:col-span-2">
              <Label for="short_desc_en">Short Description (English)</Label>
              <Textarea id="short_desc_en" v-model="form.short_desc_en" rows="3" class="resize-none" />
              <p v-if="form.errors.short_desc_en" class="text-xs text-red-500">{{ form.errors.short_desc_en }}</p>
            </div>

            <div class="space-y-2 md:col-span-2">
              <Label for="short_desc_bn">Short Description (Bangla)</Label>
              <Textarea id="short_desc_bn" v-model="form.short_desc_bn" rows="3" class="resize-none" />
              <p v-if="form.errors.short_desc_bn" class="text-xs text-red-500">{{ form.errors.short_desc_bn }}</p>
            </div>

            <div class="space-y-2 md:col-span-2">
              <Label for="conservation_en">Conservation (English)</Label>
              <Textarea id="conservation_en" v-model="form.conservation_en" rows="3" class="resize-none" />
              <p v-if="form.errors.conservation_en" class="text-xs text-red-500">{{ form.errors.conservation_en }}</p>
            </div>

            <div class="space-y-2 md:col-span-2">
              <Label for="conservation_bn">Conservation (Bangla)</Label>
              <Textarea id="conservation_bn" v-model="form.conservation_bn" rows="3" class="resize-none" />
              <p v-if="form.errors.conservation_bn" class="text-xs text-red-500">{{ form.errors.conservation_bn }}</p>
            </div>

            <div class="space-y-2 md:col-span-2">
              <Label for="feature_image">Feature Image</Label>
              <Input id="feature_image" type="file" accept="image/*" @change="(e) => (form.feature_image = e.target.files?.[0] || null)" />
              <p v-if="form.errors.feature_image" class="text-xs text-red-500">{{ form.errors.feature_image }}</p>
              <div v-if="featureImagePreview" class="pt-2">
                <img :src="featureImagePreview" alt="Feature" class="h-24 w-24 rounded-md border border-border object-cover" />
              </div>
            </div>

            <div class="space-y-2 md:col-span-2">
              <Label>Slider Images</Label>
              <input
                ref="sliderInput"
                type="file"
                accept="image/*"
                multiple
                @change="onSliderImagesChange"
                class="w-full mt-2 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-accent/10 file:text-accent hover:file:bg-accent/20 transition-all"
              />
              <p v-if="form.errors.slider_images" class="text-xs text-red-500">{{ form.errors.slider_images }}</p>
              <div v-if="sliderImagePreviews.length" class="mt-2 flex flex-wrap gap-2">
                <div v-for="(src, index) in sliderImagePreviews" :key="index" class="relative inline-block">
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle class="text-base font-semibold">Pricing & Shipping</CardTitle>
          </CardHeader>
          <CardContent class="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div class="space-y-2">
              <Label for="sku">SKU</Label>
              <Input id="sku" v-model="form.sku" type="text" />
              <p v-if="form.errors.sku" class="text-xs text-red-500">{{ form.errors.sku }}</p>
            </div>

            <div class="space-y-2">
              <Label for="stock">Stock</Label>
              <Input id="stock" v-model.number="form.stock" type="number" min="0" />
              <p v-if="form.errors.stock" class="text-xs text-red-500">{{ form.errors.stock }}</p>
            </div>

            <div class="space-y-2">
              <Label for="price">Price</Label>
              <Input id="price" v-model.number="form.price" type="number" min="0" />
              <p v-if="form.errors.price" class="text-xs text-red-500">{{ form.errors.price }}</p>
            </div>

            <div class="space-y-2">
              <Label for="discount_price">Discount Price</Label>
              <Input id="discount_price" v-model.number="form.discount_price" type="number" min="0" />
              <p v-if="form.errors.discount_price" class="text-xs text-red-500">{{ form.errors.discount_price }}</p>
            </div>

            <div class="md:col-span-3 space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium">Packaging Systems</span>
                <Button type="button" variant="outline" size="sm" @click="addPackagingRow">Add packaging</Button>
              </div>

              <div
                v-if="packagingGroupErrorFor()"
                class="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-300"
              >
                {{ packagingGroupErrorFor() }}
              </div>

              <div
                v-for="(packRow, pIndex) in form.packagings"
                :key="pIndex"
                class="grid grid-cols-1 md:grid-cols-10 xl:grid-cols-12 gap-4 border border-gray-200 dark:border-gray-700 rounded-md p-4 items-end"
              >
                <div class="space-y-2 md:col-span-3 xl:col-span-4">
                  <Label :for="`packaging_system_${pIndex}`" class="text-sm font-medium">
                    Packaging <span class="text-red-500">*</span>
                  </Label>
                  <select
                    :id="`packaging_system_${pIndex}`"
                    v-model="packRow.packaging_system"
                    :class="[
                      'w-full rounded-md border px-3 py-2 text-sm bg-background',
                      packagingErrorFor(pIndex, 'packaging_system') ? 'border-red-500 focus-visible:ring-red-500' : 'border-input',
                    ]"
                  >
                    <option value="" hidden>Select packaging</option>
                    <option v-for="item in packagingSystemOptions" :key="item.value" :value="item.value">
                      {{ item.label }}
                    </option>
                  </select>
                  <span v-if="packagingErrorFor(pIndex, 'packaging_system')" class="text-sm text-red-500">
                    {{ packagingErrorFor(pIndex, 'packaging_system') }}
                  </span>
                </div>

                <div class="space-y-2 md:col-span-3 xl:col-span-3">
                  <Label :for="`max_per_package_${pIndex}`" class="text-sm font-medium">
                    Max per Package <span class="text-red-500">*</span>
                  </Label>
                  <Input
                    :id="`max_per_package_${pIndex}`"
                    v-model.number="packRow.max_per_package"
                    type="number"
                    min="1"
                    step="1"
                    placeholder="e.g. 12"
                    :class="{ 'border-red-500 focus-visible:ring-red-500': packagingErrorFor(pIndex, 'max_per_package') }"
                  />
                  <span v-if="packagingErrorFor(pIndex, 'max_per_package')" class="text-sm text-red-500">
                    {{ packagingErrorFor(pIndex, 'max_per_package') }}
                  </span>
                </div>

                <div class="space-y-2 md:col-span-3 xl:col-span-3">
                  <Label :for="`shipping_charge_per_package_${pIndex}`" class="text-sm font-medium">
                    Shipping Charge / Package <span class="text-red-500">*</span>
                  </Label>
                  <Input
                    :id="`shipping_charge_per_package_${pIndex}`"
                    v-model.number="packRow.shipping_charge_per_package"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="e.g. 120"
                    :class="{ 'border-red-500 focus-visible:ring-red-500': packagingErrorFor(pIndex, 'shipping_charge_per_package') }"
                  />
                  <span v-if="packagingErrorFor(pIndex, 'shipping_charge_per_package')" class="text-sm text-red-500">
                    {{ packagingErrorFor(pIndex, 'shipping_charge_per_package') }}
                  </span>
                </div>

                <div class="md:col-span-1 xl:col-span-2 flex items-center justify-between gap-3">
                  <div class="flex items-center gap-2">
                    <input
                      type="radio"
                      name="default_packaging_combo_create"
                      :checked="Boolean(packRow.is_default)"
                      class="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                      @change="setDefaultPackaging(pIndex)"
                    >
                    <Label class="text-sm font-medium cursor-pointer" @click="setDefaultPackaging(pIndex)">
                      Default
                    </Label>
                  </div>

                  <Button
                    v-if="form.packagings.length > 1"
                    type="button"
                    variant="ghost"
                    size="icon"
                    @click="removePackagingRow(pIndex)"
                    class="text-red-600 hover:text-red-700 hover:bg-red-100 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/30"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle class="text-base font-semibold">Included Variants</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <div v-for="(row, index) in form.items" :key="index" class="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
              <div class="md:col-span-8 space-y-2">
                <Label>Included Variant</Label>
                <select v-model="row.included_variant_id" class="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option value="" hidden>Select variant</option>
                  <option v-for="v in availableVariants" :key="v.id" :value="v.id">
                    {{ variantLabel(v) }}
                  </option>
                </select>
                <p v-if="form.errors[`items.${index}.included_variant_id`]" class="text-xs text-red-500">
                  {{ form.errors[`items.${index}.included_variant_id`] }}
                </p>
              </div>

              <div class="md:col-span-2 space-y-2">
                <Label>Qty</Label>
                <Input v-model.number="row.qty" type="number" min="1" />
                <p v-if="form.errors[`items.${index}.qty`]" class="text-xs text-red-500">
                  {{ form.errors[`items.${index}.qty`] }}
                </p>
              </div>

              <div class="md:col-span-2 flex items-center gap-2">
                <Button type="button" variant="outline" @click="addItemRow">Add</Button>
                <Button type="button" variant="destructive" @click="removeItemRow(index)">Remove</Button>
              </div>
            </div>

            <div class="flex justify-end pt-2">
              <Button type="submit" :disabled="form.processing">Create Combo Package</Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  </AppLayout>
</template>
