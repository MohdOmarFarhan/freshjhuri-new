<script setup>
import { Head, Link, router } from "@inertiajs/vue3";
import { Eye, SquarePen, Trash2, Plus } from "lucide-vue-next";
import { computed, ref } from "vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import AppLayout from "@/layouts/AppLayout.vue";
import { can } from "@/lib/can";

const props = defineProps({
  products: {
    type: Object,
    required: true,
    default: () => ({
      data: [],
      from: 1,
      links: []
    })
  }
});

const searchValue = ref("");
const sortBy = ref("");
const sortType = ref("asc");

const headers = [
  { text: "#", value: "serial", sortable: true },
  { text: "Sort Order", value: "sort_order", sortable: true },
  { text: "Title", value: "title_en", sortable: true },
  { text: "Category", value: "category_name", sortable: true },
  { text: "Free Shipping", value: "is_free_shipping", sortable: true },
  { text: "Status", value: "status", sortable: true },
  { text: "Features", value: "features_count", sortable: true },
  { text: "Actions", value: "action", sortable: false },
];

const items = computed(() => {
  const productsData = props.products?.data ?? [];
  const from = props.products?.from ?? 1;
  
  return productsData.map((p, index) => ({
    serial: from + index,
    id: p.id,
    sort_order: p.sort_order ?? '',
    title_en: p.title_en,
    category_name: p.category?.name_en ?? "-",
    is_free_shipping: p.is_free_shipping ?? false,
    status: p.status ? "active" : "inactive",
    features_count: p.product_features_count ?? 0,
    created_at: p.created_at,
  }));
});

const sortedAndFilteredProducts = computed(() => {
  let rows = [...items.value];

  // Apply search filter
  if (searchValue.value.trim()) {
    const query = searchValue.value.trim().toLowerCase();
    rows = rows.filter((row) => {
      const searchableText = [
        row.title_en,
        row.category_name,
        row.status,
        String(row.features_count),
        String(row.sort_order)
      ].join(" ").toLowerCase();
      
      return searchableText.includes(query);
    });
  }

  // Apply sorting
  if (sortBy.value) {
    rows.sort((a, b) => {
      let aValue = a[sortBy.value];
      let bValue = b[sortBy.value];
      
      // Handle different data types
      if (sortBy.value === 'is_free_shipping') {
        aValue = aValue ? 1 : 0;
        bValue = bValue ? 1 : 0;
      } else if (sortBy.value === 'status') {
        aValue = aValue === 'active' ? 1 : 0;
        bValue = bValue === 'active' ? 1 : 0;
      }
      
      if (aValue === bValue) return 0;
      
      if (sortType.value === "asc") {
        return aValue > bValue ? 1 : -1;
      }
      return aValue < bValue ? 1 : -1;
    });
  }

  return rows;
});

const toggleSort = (column) => {
  if (!column.sortable) return;

  if (sortBy.value === column.value) {
    sortType.value = sortType.value === "asc" ? "desc" : "asc";
  } else {
    sortBy.value = column.value;
    sortType.value = "asc";
  }
};

const deleteProduct = (id) => {
  if (confirm('Are you sure you want to delete this product?')) {
    router.delete(route("products.destroy", id));
  }
};
</script>

<template>
  <AppLayout>
    <Head title="Products" />

    <div class="py-6 px-4 sm:px-6 lg:px-8">
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle class="text-xl font-bold">Products</CardTitle>
          <Button v-if="can('PRODUCT_CREATE')" as-child>
            <Link :href="route('products.create')">
              <Plus class="mr-2 h-4 w-4" /> Add Product
            </Link>
          </Button>
        </CardHeader>

        <CardContent>
          <div class="mb-4 flex justify-end">
            <Input
              v-model="searchValue"
              type="text"
              placeholder="Search products..."
              class="max-w-sm"
            />
          </div>

          <div class="crud-table-wrap overflow-x-auto">
            <table class="crud-table min-w-full table-auto">
              <thead class="crud-table-head">
                <tr>
                  <th
                    v-for="header in headers"
                    :key="header.value"
                    class="crud-th px-2 py-2 text-left font-semibold text-xs"
                    :class="{
                      'cursor-pointer hover:text-gray-700 dark:hover:text-gray-300': header.sortable,
                      'min-w-[60px] w-1/12': header.value === 'serial',
                      'min-w-[100px] w-1/12': header.value === 'sort_order',
                      'min-w-[200px] w-2/12': header.value === 'title_en',
                      'min-w-[120px] w-1/12': header.value === 'category_name',
                      'min-w-[120px] w-1/12': header.value === 'is_free_shipping',
                      'min-w-[100px] w-1/12': header.value === 'status',
                      'min-w-[100px] w-1/12': header.value === 'features_count',
                      'min-w-[120px] w-1/12': header.value === 'action'
                    }"
                    @click="toggleSort(header)"
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
                  v-for="product in sortedAndFilteredProducts"
                  :key="product.id"
                  class="crud-row border-t border-border hover:bg-muted/50"
                >
                  <td class="px-2 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {{ product.serial }}
                  </td>
                  <td class="px-2 py-2 text-sm text-gray-900 dark:text-gray-100">
                    {{ product.sort_order }}
                  </td>
                  <td class="px-2 py-2 text-sm text-gray-900 dark:text-gray-100">
                    {{ product.title_en }}
                  </td>
                  <td class="px-2 py-2 text-sm text-gray-900 dark:text-gray-100">
                    {{ product.category_name }}
                  </td>
                  <td class="px-2 py-2 whitespace-nowrap">
                    <Badge
                      :class="[
                        'text-xs px-2 py-1 rounded-full font-medium',
                        product.is_free_shipping
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                      ]"
                      variant="outline"
                    >
                      {{ product.is_free_shipping ? 'Yes' : 'No' }}
                    </Badge>
                  </td>
                  <td class="px-2 py-2 whitespace-nowrap">
                    <Badge
                      :class="[
                        'text-xs px-2 py-1 rounded-full font-medium',
                        product.status === 'active'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800'
                      ]"
                      variant="outline"
                    >
                      <span class="flex items-center gap-1">
                        <span :class="['w-1.5 h-1.5 rounded-full', product.status === 'active' ? 'bg-emerald-500' : 'bg-red-500']"></span>
                        {{ product.status === 'active' ? 'Active' : 'Inactive' }}
                      </span>
                    </Badge>
                  </td>
                  <td class="px-2 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {{ product.features_count }}
                  </td>
                  <td class="px-2 py-2 whitespace-nowrap">
                    <div class="flex space-x-2">
                      <Button
                        v-if="can('PRODUCT_SHOW')"
                        variant="ghost"
                        size="icon"
                        as-child
                        class="text-blue-600 hover:text-blue-700 hover:bg-blue-100 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/30"
                      >
                        <Link :href="route('products.show', product.id)">
                          <Eye class="h-4 w-4" />
                        </Link>
                      </Button>

                      <Button
                        v-if="can('PRODUCT_EDIT')"
                        variant="ghost"
                        size="icon"
                        as-child
                        class="text-green-600 hover:text-green-700 hover:bg-green-100 dark:text-green-400 dark:hover:text-green-300 dark:hover:bg-green-900/30"
                      >
                        <Link :href="route('products.edit', product.id)">
                          <SquarePen class="h-4 w-4" />
                        </Link>
                      </Button>

                      <Button
                        v-if="can('PRODUCT_DELETE')"
                        variant="ghost"
                        size="icon"
                        class="text-red-600 hover:text-red-700 hover:bg-red-100 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/30"
                        @click="deleteProduct(product.id)"
                      >
                        <Trash2 class="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
                <tr v-if="sortedAndFilteredProducts.length === 0">
                  <td :colspan="headers.length" class="px-2 py-8 text-center text-gray-500 dark:text-gray-400">
                    No products found
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- Pagination -->
          <div v-if="products?.links && products.links.length > 3" class="mt-6 flex justify-center">
            <nav class="inline-flex -space-x-px">
              <template v-for="(link, i) in products.links" :key="i">
                <Link
                  v-if="link.url"
                  :href="link.url"
                  class="px-3 py-2 border border-border text-sm font-medium focus:z-10 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  :class="[
                    link.active
                      ? 'z-10 bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-700'
                      : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-dark-primary dark:text-gray-300 dark:hover:bg-gray-800',
                    i === 0 ? 'rounded-l-lg' : '',
                    i === products.links.length - 1 ? 'rounded-r-lg' : ''
                  ]"
                  v-html="link.label"
                />
                <span
                  v-else
                  class="px-3 py-2 border border-border text-sm font-medium bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600"
                  :class="[
                    i === 0 ? 'rounded-l-lg' : '',
                    i === products.links.length - 1 ? 'rounded-r-lg' : ''
                  ]"
                  v-html="link.label"
                />
              </template>
            </nav>
          </div>
        </CardContent>
      </Card>
    </div>
  </AppLayout>
</template>