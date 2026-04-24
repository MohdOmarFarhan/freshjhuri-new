<script setup>
import { Link, router, Head } from "@inertiajs/vue3";
import { SquarePen, Trash, Plus } from "lucide-vue-next";
import { computed, ref } from "vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { confirmDeletion } from "@/helper/sweetAlertHelpers";
import AppLayout from "@/layouts/AppLayout.vue";
import { can } from "@/lib/can";

const props = defineProps({
  productStatuses: {
    type: Object,
    required: true,
  },
});

const breadcrumbs = [
  { title: "Dashboard", href: "/dashboard" },
  { title: "Product Statuses", href: "/product-statuses" },
];

const headers = [
  { text: "Serial", value: "serial", sortable: true },
  { text: "Name (English)", value: "name_en", sortable: true },
  { text: "Name (Bangla)", value: "name_bn", sortable: true },
  { text: "Created At", value: "created_at", sortable: true },
  { text: "Action", value: "action", sortable: false },
];

const searchValue = ref("");
const sortBy = ref("");
const sortType = ref("asc");

const formattedRows = computed(() => {
  const items = props.productStatuses?.data ?? props.productStatuses ?? [];
  return items.map((row, index) => ({
    serial: index + 1,
    id: row.id,
    name_en: row.name_en || "—",
    name_bn: row.name_bn || "—",
    created_at: new Date(row.created_at).toLocaleDateString(),
  }));
});

const filteredRows = computed(() => {
  const q = String(searchValue.value || "").toLowerCase().trim();
  let rows = formattedRows.value;

  if (q) {
    rows = rows.filter((r) => `${r.name_en} ${r.name_bn}`.toLowerCase().includes(q));
  }

  if (sortBy.value) {
    rows = rows.slice().sort((a, b) => {
      const av = a[sortBy.value];
      const bv = b[sortBy.value];
      const cmp = String(av ?? "").localeCompare(String(bv ?? ""));
      return sortType.value === "asc" ? cmp : -cmp;
    });
  }

  return rows;
});

const deleteRow = (id) => {
  confirmDeletion(() => {
    router.delete(route("product-statuses.delete", id));
  });
};
</script>

<template>
  <AppLayout :breadcrumbs="breadcrumbs">
    <Head title="Product Status List" />

    <div class="lg:w-full mx-auto p-4 sm:p-2 lg:p-8">
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle class="text-xl font-bold">Product Statuses</CardTitle>
          <Button v-if="can('PRODUCT_STATUS_CREATE')" as-child>
            <Link :href="route('product-statuses.create')">
              <Plus class="mr-2 h-4 w-4" /> Add Status
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
            <Input v-model="searchValue" type="text" placeholder="Search product statuses..." class="max-w-sm" />
          </div>

          <div class="crud-table-wrap">
            <table class="crud-table">
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
                        {{ sortType === "asc" ? "↑" : "↓" }}
                      </span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody class="crud-table-body">
                <tr v-for="row in filteredRows" :key="row.id" class="crud-row">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{{ row.serial }}</td>
                  <td class="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{{ row.name_en }}</td>
                  <td class="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{{ row.name_bn }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ row.created_at }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex space-x-2">
                      <Button
                        v-if="can('PRODUCT_STATUS_EDIT')"
                        variant="ghost"
                        size="icon"
                        as-child
                        class="text-green-600 hover:text-green-700 hover:bg-green-100 dark:text-green-400 dark:hover:text-green-300 dark:hover:bg-green-900/30"
                      >
                        <Link :href="route('product-statuses.edit', row.id)">
                          <SquarePen class="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        v-if="can('PRODUCT_STATUS_DELETE')"
                        variant="ghost"
                        size="icon"
                        @click="deleteRow(row.id)"
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

