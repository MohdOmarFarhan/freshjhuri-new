<script setup>
import { Head, Link, router } from '@inertiajs/vue3';
import { Plus, SquarePen, Trash } from 'lucide-vue-next';
import { computed, ref } from 'vue';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/AppLayout.vue';
import { confirmDeletion } from '@/helper/sweetAlertHelpers';
import { can } from '@/lib/can';

const props = defineProps({
  comboVariants: Object,
});

const breadcrumbs = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Combo Products', href: '/combo-products' },
];

const headers = [
  { text: 'Serial', value: 'serial', sortable: true },
  { text: 'Image', value: 'image', sortable: false },
  { text: 'Name (EN)', value: 'title_en', sortable: true },
  { text: 'Name (BN)', value: 'title_bn', sortable: true },
  { text: 'SKU / Size', value: 'variant', sortable: false },
  { text: 'Price', value: 'price', sortable: true },
  { text: 'Discount', value: 'discount_price', sortable: true },
  { text: 'Stock', value: 'stock', sortable: true },
  { text: 'Status', value: 'status', sortable: true },
  { text: 'Action', value: 'action', sortable: false },
];

const searchValue = ref('');
const sortBy = ref('');
const sortType = ref('asc');

const sizeLabel = (variant) => {
  const size = variant?.size;
  if (!size) return '—';
  return `${size.amount_en} ${size.unit_en} / ${size.amount_bn} ${size.unit_bn}`;
};

const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  if (path.startsWith('/')) return path;
  if (path.startsWith('storage/')) return `/${path}`;
  return `/storage/${path}`;
};

const formattedRows = computed(() => {
  const items = props.comboVariants?.data ?? [];
  const startFrom = (props.comboVariants?.from ?? 1) - 1;

  const rows = items.map((variant, index) => ({
    serial: startFrom + index + 1,
    id: variant.id,
    title_en: variant.product?.title_en || '—',
    title_bn: variant.product?.title_bn || '—',
    image_url: variant.product?.feature_image ? getImageUrl(variant.product.feature_image) : null,
    sku: variant.sku || '—',
    size_label: sizeLabel(variant),
    price: variant.price,
    discount_price: variant.discount_price,
    stock: variant.stock,
    status: Boolean(variant.product?.status),
  }));

  const q = String(searchValue.value || '').trim().toLowerCase();
  const filtered = q
    ? rows.filter((r) =>
        `${r.title_en} ${r.title_bn} ${r.sku}`.toLowerCase().includes(q)
      )
    : rows;

  if (!sortBy.value) return filtered;
  const dir = sortType.value === 'asc' ? 1 : -1;

  return [...filtered].sort((a, b) => {
    const key = sortBy.value;
    const av = a[key];
    const bv = b[key];
    if (av == null && bv == null) return 0;
    if (av == null) return -1 * dir;
    if (bv == null) return 1 * dir;

    if (typeof av === 'number' && typeof bv === 'number') {
      return (av - bv) * dir;
    }

    return String(av).localeCompare(String(bv)) * dir;
  });
});

const deleteComboPackage = (variantId) => {
  confirmDeletion(() => {
    router.delete(route('combo-products.destroy', variantId), {
      preserveScroll: true,
    });
  });
};
</script>

<template>
  <AppLayout :breadcrumbs="breadcrumbs">
    <Head title="Combo Products" />

    <div class="lg:w-full mx-auto p-4 sm:p-2 lg:p-8">
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle class="text-xl font-bold">Combo Products</CardTitle>
          <Button v-if="can('PRODUCT_CREATE')" as-child>
            <Link :href="route('combo-products.create')">
              <Plus class="mr-2 h-4 w-4" /> Create Combo Package
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div
            v-if="$page.props.flash?.message"
            class="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded dark:bg-green-900/30 dark:border-green-800 dark:text-green-400"
          >
            {{ $page.props.flash.message }}
          </div>

          <div class="mb-4 flex justify-end">
            <Input v-model="searchValue" type="text" placeholder="Search combo products..." class="max-w-sm" />
          </div>

          <div class="crud-table-wrap overflow-x-auto">
            <table class="crud-table min-w-[1100px]">
              <thead class="crud-table-head">
                <tr>
                  <th
                    v-for="header in headers"
                    :key="header.value"
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
                <tr v-for="row in formattedRows" :key="row.id" class="crud-row">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{{ row.serial }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <img
                      v-if="row.image_url"
                      :src="row.image_url"
                      alt="Combo"
                      class="h-10 w-10 rounded object-cover border border-gray-200 dark:border-gray-700"
                    />
                    <Badge v-else variant="secondary" class="text-xs">No Image</Badge>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{{ row.title_en }}</td>
                  <td class="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{{ row.title_bn }}</td>
                  <td class="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                    <div class="flex flex-col">
                      <span class="font-medium">{{ row.sku }}</span>
                      <span class="text-xs text-gray-500 dark:text-gray-400">{{ row.size_label }}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900 dark:text-gray-100">৳ {{ row.price }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900 dark:text-gray-100">
                    {{ row.discount_price ? `৳ ${row.discount_price}` : '—' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900 dark:text-gray-100">{{ row.stock }}</td>

                  <td class="px-6 py-4 whitespace-nowrap">
                    <Badge
                      :class="[
                        'text-xs px-2 py-1 rounded-full font-medium',
                        row.status
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800'
                      ]"
                      variant="outline"
                    >
                      <span class="flex items-center gap-1">
                        <span :class="['w-1.5 h-1.5 rounded-full', row.status ? 'bg-emerald-500' : 'bg-red-500']"></span>
                        {{ row.status ? 'Active' : 'Inactive' }}
                      </span>
                    </Badge>
                  </td>

                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex space-x-2">
                      <Button
                        v-if="can('PRODUCT_EDIT')"
                        variant="ghost"
                        size="icon"
                        as-child
                        class="text-green-600 hover:text-green-700 hover:bg-green-100 dark:text-green-400 dark:hover:text-green-300 dark:hover:bg-green-900/30"
                      >
                        <Link :href="route('combo-products.edit', row.id)">
                          <SquarePen class="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        v-if="can('PRODUCT_DELETE')"
                        variant="ghost"
                        size="icon"
                        @click="deleteComboPackage(row.id)"
                        class="text-red-600 hover:text-red-700 hover:bg-red-100 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/30"
                      >
                        <Trash class="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
                <tr v-if="!formattedRows.length">
                  <td colspan="10" class="crud-td py-8 text-center text-muted-foreground">No combo products found.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-if="comboVariants?.links" class="mt-4 flex justify-between items-center">
            <div class="text-sm text-gray-700 dark:text-gray-300">
              Showing {{ comboVariants.from }} to {{ comboVariants.to }} of {{ comboVariants.total }} entries
            </div>
            <div class="flex gap-2">
              <Button
                v-for="(link, index) in comboVariants.links"
                :key="index"
                variant="outline"
                size="sm"
                :class="{
                  'bg-emerald-500 text-white hover:bg-emerald-600 border-emerald-500': link.active,
                  'opacity-50 cursor-not-allowed': !link.url
                }"
                :disabled="!link.url"
                @click="link.url && router.get(link.url)"
                v-html="link.label"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </AppLayout>
</template>
