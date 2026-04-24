<script setup>
import { Link, Head, router } from "@inertiajs/vue3";
import { SquarePen, Plus, Trash } from "lucide-vue-next";
import { computed, ref } from "vue";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { confirmDeletion } from "@/helper/sweetAlertHelpers";
import AppLayout from "@/layouts/AppLayout.vue";
import { can } from "@/lib/can";

const props = defineProps({
    variants: {
        type: Object,
        required: true
    }
});

const breadcrumbs = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Variants", href: "/variants" },
];

const headers = [
    { text: "Serial", value: "serial", sortable: true },
    { text: "Product", value: "product", sortable: true },
    { text: "SKU", value: "sku", sortable: true },
    { text: "Sizes / Stock / Prices", value: "sizes", sortable: false },
    { text: "Type", value: "product_type", sortable: false },
    { text: "Created At", value: "created_at", sortable: true },
    { text: "Action", value: "action", sortable: false },
];

const searchValue = ref("");
const sortBy = ref("");
const sortType = ref("asc");

const groupedVariants = computed(() => {
    const items = props.variants?.data ?? props.variants ?? [];

    const groups = new Map();

    items.forEach((variant) => {
        const productId = variant.product_id ?? variant.product?.id ?? "unknown";
        const sku = variant.sku ?? "";
        const key = `${productId}-${sku}`;

        if (!groups.has(key)) {
            groups.set(key, {
                product_title: variant.product?.title_en ?? "—",
                sku,
                created_at: variant.created_at,
                combo_variant_id: null,
                variants: [],
            });
        }

        const group = groups.get(key);
        const types = Array.isArray(variant.product_type)
            ? variant.product_type
            : variant.product_type
              ? [variant.product_type]
              : [];
        const isCombo = types.includes('combo');
        if (!group.combo_variant_id && isCombo) {
            group.combo_variant_id = variant.id;
        }
        group.variants.push({
            id: variant.id,
            size_label: variant.size ? `${variant.size.amount_en} ${variant.size.unit_en}` : "—",
            stock: variant.stock,
            price: variant.price,
            discount_price: variant.discount_price,
            product_type: variant.product_type,
        });
    });

    return Array.from(groups.values()).map((group, index) => ({
        serial: index + 1,
        product_title: group.product_title,
        sku: group.sku,
        created_at: group.created_at ? new Date(group.created_at).toLocaleDateString() : "—",
        combo_variant_id: group.combo_variant_id,
        variants: group.variants,
    }));
});

const deleteVariantGroup = (id) => {
    confirmDeletion(() => {
        router.delete(route("variants.group-delete", id));
    });
};

</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head title="Variant List" />

        <div class="lg:w-full mx-auto p-4 sm:p-2 lg:p-8">
            <Card>
                <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle class="text-xl font-bold">Variants</CardTitle>
                    <Button v-if="can('VARIANT_CREATE')" as-child>
                        <Link :href="route('variants.create')">
                            <Plus class="mr-2 h-4 w-4" /> Add Variant
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    <div v-if="$page.props.flash?.message" class="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded dark:bg-green-900/30 dark:border-green-800 dark:text-green-400">
                        {{ $page.props.flash.message }}
                    </div>

                    <div class="mb-4 flex justify-end">
                        <Input
                            v-model="searchValue"
                            type="text"
                            placeholder="Search by product, size or SKU..."
                            class="max-w-sm"
                        />
                    </div>

                    <div class="crud-table-wrap">
                        <table class="crud-table">
                            <thead class="crud-table-head">
                                <tr>
                                    <th v-for="header in headers" :key="header.value"
                                        class="crud-th"
                                        :class="{ 'cursor-pointer hover:text-gray-700 dark:hover:text-gray-300': header.sortable }"
                                        @click="header.sortable && (sortBy = header.value, sortType = sortType === 'asc' ? 'desc' : 'asc')"
                                    >
                                        <div class="flex items-center gap-1">
                                            {{ header.text }}
                                            <span v-if="sortBy === header.value" class="text-emerald-600 dark:text-emerald-400">
                                                {{ sortType === 'asc' ? '↑' : '↓' }}
                                            </span>
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="crud-table-body">
                                <tr
                                    v-for="group in groupedVariants"
                                    :key="`${group.product_title}-${group.sku}`"
                                    class="crud-row"
                                >
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                        {{ group.serial }}
                                    </td>
                                    <td class="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                                        {{ group.product_title }}
                                    </td>
                                    <td class="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                                        {{ group.sku }}
                                    </td>
                                    <td class="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                                        <div
                                            v-for="variant in group.variants"
                                            :key="variant.id"
                                            class="flex flex-wrap items-center gap-2 mb-1 last:mb-0"
                                        >
                                            <Badge variant="outline" class="text-xs px-2 py-1 rounded-full font-medium">
                                                {{ variant.size_label }}
                                            </Badge>
                                            <span class="text-xs text-gray-600 dark:text-gray-300">
                                                Stock: {{ variant.stock }} | Price: {{ variant.price }}
                                                <span v-if="variant.discount_price"> | Disc: {{ variant.discount_price }}</span>
                                            </span>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                                        <div
                                            v-for="variant in group.variants"
                                            :key="variant.id + '-type'"
                                            class="mb-1 last:mb-0"
                                        >
                                            <template v-if="Array.isArray(variant.product_type) && variant.product_type.length">
                                                <Badge
                                                    v-for="type in variant.product_type"
                                                    :key="type"
                                                    variant="secondary"
                                                    class="text-xs px-2 py-1 rounded-full font-medium mr-1 mb-1"
                                                >
                                                    {{ $page.props.product_types?.[type] || type }}
                                                </Badge>
                                            </template>
                                            <template v-else>
                                                <Badge variant="secondary" class="text-xs px-2 py-1 rounded-full font-medium">
                                                    {{ $page.props.product_types?.[variant.product_type] || '—' }}
                                                </Badge>
                                            </template>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {{ group.created_at }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="flex space-x-2">
                                            <Button
                                                v-if="group.combo_variant_id && can('PRODUCT_EDIT')"
                                                variant="outline"
                                                size="sm"
                                                as-child
                                            >
                                                <Link :href="route('combo-products.edit', group.combo_variant_id)">
                                                    Combo Items
                                                </Link>
                                            </Button>
                                            <Button
                                                v-if="can('VARIANT_EDIT')"
                                                variant="ghost"
                                                size="icon"
                                                as-child
                                                class="text-green-600 hover:text-green-700 hover:bg-green-100 dark:text-green-400 dark:hover:text-green-300 dark:hover:bg-green-900/30"
                                            >
                                                <Link :href="route('variants.edit', group.variants[0]?.id)">
                                                    <SquarePen class="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button
                                                v-if="can('VARIANT_DELETE')"
                                                variant="ghost"
                                                size="icon"
                                                @click="deleteVariantGroup(group.variants[0]?.id)"
                                                class="text-red-600 hover:text-red-700 hover:bg-red-100 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/30"
                                            >
                                                <Trash class="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    </AppLayout>
</template>
