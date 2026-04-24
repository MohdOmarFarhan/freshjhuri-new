<script setup>
import { Head, Link, router } from "@inertiajs/vue3";
import { Plus, SquarePen, Trash } from "lucide-vue-next";
import { computed } from "vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { confirmDeletion } from "@/helper/sweetAlertHelpers";
import AppLayout from "@/layouts/AppLayout.vue";
import { can } from "@/lib/can";

const props = defineProps({
  shippingCharts: {
    type: Array,
    default: () => [],
  },
});

const breadcrumbs = [
  { title: "Dashboard", href: route("dashboard") },
  { title: "Shipping Charts", href: route("admin.shipping-charts.index") },
];

const rows = computed(() =>
  (props.shippingCharts || []).map((item, index) => ({
    serial: index + 1,
    ...item,
  }))
);

const deleteRow = (id) => {
  confirmDeletion(() => {
    router.delete(route("admin.shipping-charts.destroy", id));
  });
};
</script>

<template>
  <Head title="Shipping Charts" />

  <AppLayout :breadcrumbs="breadcrumbs">
    <div class="lg:w-full mx-auto p-4 sm:p-2 lg:p-8">
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle class="text-xl font-bold">Shipping Charts</CardTitle>
          <Button v-if="can('SHIPPING_CHART_CREATE')" as-child>
            <Link :href="route('admin.shipping-charts.create')">
              <Plus class="mr-2 h-4 w-4" /> Add Shipping Chart
            </Link>
          </Button>
        </CardHeader>

        <CardContent>
          <div
            v-if="$page.props.flash?.success"
            class="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded dark:bg-green-900/30 dark:border-green-800 dark:text-green-400"
          >
            {{ $page.props.flash.success }}
          </div>

          <div class="crud-table-wrap">
            <table class="crud-table">
              <thead class="crud-table-head">
                <tr>
                  <th class="crud-th">
                    Serial
                  </th>
                  <th class="crud-th">
                    Product Type
                  </th>
                  <th class="crud-th">
                    Condition
                  </th>
                  <th class="crud-th">
                    Product Size
                  </th>
                  <th class="crud-th">
                    Carton Contains
                  </th>
                  <th class="crud-th">
                    Charge
                  </th>
                  <th class="crud-th">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody class="crud-table-body">
                <tr v-for="row in rows" :key="row.id" class="crud-row">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {{ row.serial }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    <Badge variant="secondary">{{ row.product_type }}</Badge>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    <Badge :variant="row.product_condition === 'Number' ? 'default' : 'outline'">
                      {{ row.product_condition }}
                    </Badge>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    <div class="flex flex-col">
                      <span class="text-sm text-gray-900 dark:text-gray-100">
                        {{ row.product_size_en ?? row.product_size ?? "—" }}
                      </span>
                      <span class="text-xs text-gray-500 dark:text-gray-400">
                        {{ row.product_size_bn ?? "—" }}
                      </span>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {{ row.cutton_contain_amount ?? "—" }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 font-semibold">
                    ৳{{ row.shpping_charge_per_cutton }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex space-x-2">
                      <Button
                        v-if="can('SHIPPING_CHART_EDIT')"
                        variant="ghost"
                        size="icon"
                        as-child
                        class="text-green-600 hover:text-green-700 hover:bg-green-100 dark:text-green-400 dark:hover:text-green-300 dark:hover:bg-green-900/30"
                      >
                        <Link :href="route('admin.shipping-charts.edit', row.id)">
                          <SquarePen class="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        v-if="can('SHIPPING_CHART_DELETE')"
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
