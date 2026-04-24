<script setup lang="js">
import { Link, Head, useForm, router } from "@inertiajs/vue3";
import { ArrowLeft, Trash, Plus } from "lucide-vue-next";
import { computed } from "vue";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { confirmDeletion } from "@/helper/sweetAlertHelpers";
import AppLayout from "@/layouts/AppLayout.vue";

const props = defineProps({
    variant: {
        type: Object,
        required: true
    },
    variants: {
        type: Array,
        required: true
    },
    categories: {
        type: Array,
        required: true
    },
    products: {
        type: Array,
        required: true
    },
    sizes: {
        type: Array,
        required: true
    },
    product_types: {
        type: Object,
        required: true
    }
});

const breadcrumbs = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Variants", href: "/variants" },
    { title: "Edit", href: `/variants/${props.variant.id}/edit` },
];

const form = useForm({
    category_id: props.variant.category_id,
    product_id: props.variant.product_id,
    sku: props.variant.sku,
    variants: props.variants.map(variant => ({
        id: variant.id,
        size_id: variant.size_id,
        stock: variant.stock,
        price: variant.price,
        discount_price: variant.discount_price,
            // is_free_shipping removed
        product_type: Array.isArray(variant.product_type) ? variant.product_type : (variant.product_type ? [variant.product_type] : []),
        packagings: (variant.packagings || []).length
            ? (variant.packagings || []).map(p => ({
                packaging_system: p.packaging_system ?? '',
                max_per_package: p.max_per_package ?? 1,
                shipping_charge_per_package: p.shipping_charge_per_package ?? 0,
                is_default: Boolean(p.is_default),
            }))
            : [
                {
                    packaging_system: '',
                    max_per_package: 1,
                    shipping_charge_per_package: 0,
                    is_default: true,
                },
            ],
    })),
    _method: 'PUT',
});

const sizeOptions = computed(() =>
    props.sizes.map(size => ({
        id: size.id,
        label: `${size.amount_en} ${size.unit_en} / ${size.amount_bn} ${size.unit_bn}`,
    })),
);

const filteredProducts = computed(() => {
    if (!form.category_id) {
        return [];
    }

    return props.products.filter(product => product.category_id === Number(form.category_id));
});

const addVariantRow = () => {
    form.variants.push({
        id: null,
        size_id: '',
        stock: 0,
        price: 0,
        discount_price: null,
        product_type: [],
        is_free_shipping: false,
        packagings: [
            {
                packaging_system: '',
                max_per_package: 1,
                shipping_charge_per_package: 0,
                is_default: true,
            },
        ],
    });
};

const removeVariantRow = (index) => {
    if (form.variants.length === 1) {
        return;
    }

    form.variants.splice(index, 1);
};

const errorFor = (index, field) => form.errors[`variants.${index}.${field}`];
const packagingGroupErrorFor = (variantIndex) => form.errors[`variants.${variantIndex}.packagings`];
const packagingErrorFor = (variantIndex, packagingIndex, field) =>
    form.errors[`variants.${variantIndex}.packagings.${packagingIndex}.${field}`];

const addPackagingRow = (variantIndex) => {
    form.variants[variantIndex].packagings.push({
        packaging_system: '',
        max_per_package: 1,
        shipping_charge_per_package: 0,
        is_default: false,
    });
};

const removePackagingRow = (variantIndex, packagingIndex) => {
    if (form.variants[variantIndex].packagings.length === 1) {
        return;
    }
    form.variants[variantIndex].packagings.splice(packagingIndex, 1);
};

const setDefaultPackaging = (variantIndex, packagingIndex) => {
    form.variants[variantIndex].packagings.forEach((p, i) => {
        p.is_default = i === packagingIndex;
    });
};

const deleteVariant = (variantId) => {
    confirmDeletion(() => {
        router.delete(route('variants.delete', variantId));
    });
};

const submit = () => {
    form.post(route('variants.update', props.variant.id), {
        preserveScroll: true,
    });
};
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head :title="`Edit Variant: ${variant.sku}`" />

        <div class="lg:w-full mx-auto p-4 sm:p-2 lg:p-8">
            <div class="mb-4">
                <Button variant="ghost" as-child>
                    <Link :href="route('variants.index')" class="flex items-center">
                        <ArrowLeft class="mr-2 h-4 w-4" /> Back to List
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle class="text-xl font-bold">Edit Variant</CardTitle>
                </CardHeader>
                <CardContent>
                    <form @submit.prevent="submit" class="space-y-6">
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div class="space-y-2">
                                <Label for="category_id" class="text-sm font-medium">
                                    Category <span class="text-red-500">*</span>
                                </Label>
                                <select
                                    id="category_id"
                                    v-model="form.category_id"
                                    :class="[
                                        'w-full rounded-md border px-3 py-2 text-sm bg-background',
                                        form.errors.category_id ? 'border-red-500 focus-visible:ring-red-500' : 'border-input'
                                    ]"
                                >
                                    <option value="">Select category</option>
                                    <option
                                        v-for="category in categories"
                                        :key="category.id"
                                        :value="category.id"
                                    >
                                        {{ category.name_en }}
                                    </option>
                                </select>
                                <span v-if="form.errors.category_id" class="text-sm text-red-500">{{ form.errors.category_id }}</span>
                            </div>

                            <div class="space-y-2">
                                <Label for="product_id" class="text-sm font-medium">
                                    Product <span class="text-red-500">*</span>
                                </Label>
                                <select
                                    id="product_id"
                                    v-model="form.product_id"
                                    :class="[
                                        'w-full rounded-md border px-3 py-2 text-sm bg-background',
                                        form.errors.product_id ? 'border-red-500 focus-visible:ring-red-500' : 'border-input'
                                    ]"
                                >
                                    <option value="">Select product</option>
                                    <option
                                        v-for="product in filteredProducts"
                                        :key="product.id"
                                        :value="product.id"
                                    >
                                        {{ product.title_en }}
                                    </option>
                                </select>
                                <span v-if="form.errors.product_id" class="text-sm text-red-500">{{ form.errors.product_id }}</span>
                            </div>

                            <div class="space-y-2">
                                <Label for="sku" class="text-sm font-medium">
                                    SKU <span class="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="sku"
                                    v-model="form.sku"
                                    type="text"
                                    placeholder="Enter unique SKU"
                                    :class="{ 'border-red-500 focus-visible:ring-red-500': form.errors.sku }"
                                />
                                <span v-if="form.errors.sku" class="text-sm text-red-500">{{ form.errors.sku }}</span>
                            </div>

                            <div class="space-y-4 md:col-span-3">
                                <div class="flex items-center justify-between">
                                    <span class="text-sm font-medium">Variant sizes</span>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        @click="addVariantRow"
                                    >
                                        Add size
                                    </Button>
                                </div>

                                <div
                                    v-for="(variantRow, index) in form.variants"
                                    :key="variantRow.id ?? index"
                                    class="border border-gray-200 dark:border-gray-700 rounded-md p-4 flex flex-col lg:flex-row gap-6"
                                >
                                    <div class="flex-1 min-w-0">
                                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4 items-end">
                                            <div class="space-y-2">
                                        <Label :for="`size_id_${index}`" class="text-sm font-medium">
                                            Size <span class="text-red-500">*</span>
                                        </Label>
                                        <select
                                            :id="`size_id_${index}`"
                                            v-model="variantRow.size_id"
                                            :class="[
                                                'w-full rounded-md border px-3 py-2 text-sm bg-background',
                                                errorFor(index, 'size_id') ? 'border-red-500 focus-visible:ring-red-500' : 'border-input'
                                            ]"
                                        >
                                            <option value="">Select size</option>
                                            <option
                                                v-for="size in sizeOptions"
                                                :key="size.id"
                                                :value="size.id"
                                            >
                                                {{ size.label }}
                                            </option>
                                        </select>
                                        <span v-if="errorFor(index, 'size_id')" class="text-sm text-red-500">
                                            {{ errorFor(index, 'size_id') }}
                                        </span>
                                            </div>

                                            <div class="space-y-2">
                                        <Label :for="`stock_${index}`" class="text-sm font-medium">
                                            Stock <span class="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            :id="`stock_${index}`"
                                            v-model="variantRow.stock"
                                            type="number"
                                            min="0"
                                            step="1"
                                            placeholder="Stock"
                                            :class="{ 'border-red-500 focus-visible:ring-red-500': errorFor(index, 'stock') }"
                                        />
                                        <span v-if="errorFor(index, 'stock')" class="text-sm text-red-500">
                                            {{ errorFor(index, 'stock') }}
                                        </span>
                                            </div>

                                            <div class="space-y-2">
                                        <Label :for="`price_${index}`" class="text-sm font-medium">
                                            Price <span class="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            :id="`price_${index}`"
                                            v-model="variantRow.price"
                                            type="number"
                                            min="0"
                                            step="1"
                                            placeholder="Price"
                                            :class="{ 'border-red-500 focus-visible:ring-red-500': errorFor(index, 'price') }"
                                        />
                                        <span v-if="errorFor(index, 'price')" class="text-sm text-red-500">
                                            {{ errorFor(index, 'price') }}
                                        </span>
                                            </div>



                                            <div class="space-y-2">
                                        <Label :for="`discount_price_${index}`" class="text-sm font-medium">
                                            Discount
                                        </Label>
                                        <Input
                                            :id="`discount_price_${index}`"
                                            v-model="variantRow.discount_price"
                                            type="number"
                                            min="0"
                                            step="1"
                                            placeholder="Discount"
                                            :class="{ 'border-red-500 focus-visible:ring-red-500': errorFor(index, 'discount_price') }"
                                        />
                                        <span v-if="errorFor(index, 'discount_price')" class="text-sm text-red-500">
                                            {{ errorFor(index, 'discount_price') }}
                                        </span>
                                            </div>
                                            <div class="space-y-2">
                                        <Label :for="`product_type_${index}`" class="text-sm font-medium">
                                            Type
                                        </Label>
                                        <div class="relative" style="min-width: 220px; max-width: 340px; width: 100%;">
                                            <button type="button"
                                                @click="variantRow._showTypeDropdown = !variantRow._showTypeDropdown"
                                                class="w-full rounded-md border px-3 py-2 text-sm bg-background text-left flex items-center justify-between"
                                                :class="errorFor(index, 'product_type') ? 'border-red-500 focus-visible:ring-red-500' : 'border-input'"
                                            >
                                                <span>
                                                    <span v-if="variantRow.product_type.length">
                                                        {{ variantRow.product_type.map(val => props.product_types[val]).join(', ') }}
                                                    </span>
                                                    <span v-else class="text-gray-400">Select type(s)</span>
                                                </span>
                                                <svg class="ml-2 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
                                            </button>
                                            <div v-if="variantRow._showTypeDropdown" class="absolute z-10 bg-white border rounded shadow mt-1 max-h-48 overflow-auto" style="min-width: 220px; max-width: 340px; width: 100%;">
                                                <div v-for="(label, value) in props.product_types" :key="value" class="px-3 py-2 hover:bg-gray-100 flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        :id="`type_${index}_${value}`"
                                                        :value="value"
                                                        v-model="variantRow.product_type"
                                                        class="mr-2"
                                                    />
                                                    <label :for="`type_${index}_${value}`">{{ label }}</label>
                                                </div>
                                            </div>
                                        </div>
                                        <span v-if="errorFor(index, 'product_type')" class="text-sm text-red-500">
                                            {{ errorFor(index, 'product_type') }}
                                        </span>
                                        <Button
                                            v-if="Array.isArray(variantRow.product_type) && variantRow.product_type.includes('combo') && variantRow.id"
                                            variant="outline"
                                            size="sm"
                                            class="mt-2"
                                            as-child
                                        >
                                            <Link :href="route('combo-products.edit', variantRow.id)">Configure combo items</Link>
                                        </Button>
                                            </div>

                                            <div class="flex justify-end">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    @click="variantRow.id ? deleteVariant(variantRow.id) : removeVariantRow(index)"
                                                    class="text-red-600 hover:text-red-700 hover:bg-red-100 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/30"
                                                >
                                                    <Trash class="h-4 w-4" />
                                                </Button>
                                            </div>
                                    </div>

                                    <div class="space-y-3 flex-1 min-w-0">
                                        <div class="flex items-center justify-between">
                                            <span class="text-sm font-medium">Packaging Systems</span>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                @click="addPackagingRow(index)"
                                            >
                                                <Plus class="mr-1 h-4 w-4" /> Add packaging
                                            </Button>
                                        </div>

                                        <div
                                            v-if="packagingGroupErrorFor(index)"
                                            class="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-300"
                                        >
                                            {{ packagingGroupErrorFor(index) }}
                                        </div>

                                        <div
                                            v-for="(packRow, pIndex) in variantRow.packagings"
                                            :key="pIndex"
                                            class="grid grid-cols-1 md:grid-cols-10 xl:grid-cols-12 gap-4 border border-gray-200 dark:border-gray-700 rounded-md p-4 items-end"
                                        >
                                            <div class="space-y-2 md:col-span-3 xl:col-span-4">
                                                <Label :for="`packaging_system_${index}_${pIndex}`" class="text-sm font-medium">
                                                    Packaging <span class="text-red-500">*</span>
                                                </Label>
                                                <select
                                                    :id="`packaging_system_${index}_${pIndex}`"
                                                    v-model="packRow.packaging_system"
                                                    :class="[
                                                        'w-full rounded-md border px-3 py-2 text-sm bg-background',
                                                        packagingErrorFor(index, pIndex, 'packaging_system') ? 'border-red-500 focus-visible:ring-red-500' : 'border-input'
                                                    ]"
                                                >
                                                    <option value="">Select packaging</option>
                                                    <option value="box">Box</option>
                                                    <option value="bag">Bag</option>
                                                    <option value="cutton">Cutton</option>
                                                    <option value="others">Others</option>
                                                </select>
                                                <span v-if="packagingErrorFor(index, pIndex, 'packaging_system')" class="text-sm text-red-500">
                                                    {{ packagingErrorFor(index, pIndex, 'packaging_system') }}
                                                </span>
                                            </div>

                                            <div class="space-y-2 md:col-span-3 xl:col-span-3">
                                                <Label :for="`max_per_package_${index}_${pIndex}`" class="text-sm font-medium">
                                                    Max per Package <span class="text-red-500">*</span>
                                                </Label>
                                                <Input
                                                    :id="`max_per_package_${index}_${pIndex}`"
                                                    v-model="packRow.max_per_package"
                                                    type="number"
                                                    min="1"
                                                    step="1"
                                                    placeholder="e.g. 12"
                                                    :class="{ 'border-red-500 focus-visible:ring-red-500': packagingErrorFor(index, pIndex, 'max_per_package') }"
                                                />
                                                <span v-if="packagingErrorFor(index, pIndex, 'max_per_package')" class="text-sm text-red-500">
                                                    {{ packagingErrorFor(index, pIndex, 'max_per_package') }}
                                                </span>
                                            </div>

                                            <div class="space-y-2 md:col-span-3 xl:col-span-3">
                                                <Label :for="`shipping_charge_per_package_${index}_${pIndex}`" class="text-sm font-medium">
                                                    Shipping Charge / Package <span class="text-red-500">*</span>
                                                </Label>
                                                <Input
                                                    :id="`shipping_charge_per_package_${index}_${pIndex}`"
                                                    v-model="packRow.shipping_charge_per_package"
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    placeholder="e.g. 120"
                                                    :class="{ 'border-red-500 focus-visible:ring-red-500': packagingErrorFor(index, pIndex, 'shipping_charge_per_package') }"
                                                />
                                                <span v-if="packagingErrorFor(index, pIndex, 'shipping_charge_per_package')" class="text-sm text-red-500">
                                                    {{ packagingErrorFor(index, pIndex, 'shipping_charge_per_package') }}
                                                </span>
                                            </div>

                                            <div class="md:col-span-1 xl:col-span-2 flex items-center justify-between gap-3">
                                                <div class="flex items-center gap-2">
                                                    <input
                                                        type="radio"
                                                        :name="`default_packaging_${index}`"
                                                        :checked="Boolean(packRow.is_default)"
                                                        class="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                                                        @change="setDefaultPackaging(index, pIndex)"
                                                    >
                                                    <Label class="text-sm font-medium cursor-pointer" @click="setDefaultPackaging(index, pIndex)">
                                                        Default
                                                    </Label>
                                                </div>

                                                <Button
                                                    v-if="variantRow.packagings.length > 1"
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    @click="removePackagingRow(index, pIndex)"
                                                    class="text-red-600 hover:text-red-700 hover:bg-red-100 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/30"
                                                >
                                                    <Trash class="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                               </div>
                               </div>

                        <div class="flex justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <Button type="button" variant="outline" as-child>
                                <Link :href="route('variants.index')">Cancel</Link>
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
                                <span v-else>Update Variant</span>
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    </AppLayout>
</template>
