<script setup>
import { Link, router, Head } from "@inertiajs/vue3";
import { useDebounceFn } from "@vueuse/core";
import { Eye, Plus, SquarePen, Trash } from "lucide-vue-next";
import { computed, ref, watch } from "vue";
import { confirmDeletion } from "@/helper/sweetAlertHelpers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import AppLayout from "@/layouts/AppLayout.vue";
import { can } from "@/lib/can";

const props = defineProps({
  services: Object,
  filters: Object,
});

const breadcrumbs = [
  { title: "Dashboard", href: "/dashboard" },
  { title: "Services", href: "/services" },
];

const search = ref(props.filters?.search || "");

watch(
  search,
  useDebounceFn((value) => {
    router.get(
      route("services.index"),
      { search: value },
      { preserveState: true, replace: true }
    );
  }, 300)
);

const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `/storage/${path}`;
};

const rows = computed(() => {
  const items = props.services?.data ?? [];
  return items.map((service, index) => ({
    serial: (props.services?.from || 0) + index,
    ...service,
    image_url: getImageUrl(service.image),
  }));
});

const deleteService = (id) => {
  confirmDeletion(() => {
    router.delete(route("services.destroy", id));
  });
};
</script>

<template>
  <AppLayout :breadcrumbs="breadcrumbs">
    <Head title="Services" />

    <div class="lg:w-full mx-auto p-4 sm:p-2 lg:p-8">
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle class="text-xl font-bold">Services</CardTitle>
          <Button v-if="can('SERVICE_CREATE')" as-child>
            <Link :href="route('services.create')">
              <Plus class="mr-2 h-4 w-4" /> Add Service
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
            <Input v-model="search" type="text" placeholder="Search services..." class="max-w-sm" />
          </div>

          <div class="crud-table-wrap">
            <table class="crud-table">
              <thead class="crud-table-head">
                <tr>
                  <th class="crud-th">
                    Serial
                  </th>
                  <th class="crud-th">
                    Image
                  </th>
                  <th class="crud-th">
                    Title (EN)
                  </th>
                  <th class="crud-th">
                    Title (BN)
                  </th>
                  <th class="crud-th">
                    Status
                  </th>
                  <th class="crud-th">
                    Sort
                  </th>
                  <th class="crud-th">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody class="crud-table-body">
                <tr v-for="service in rows" :key="service.id" class="crud-row">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {{ service.serial }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <img
                      v-if="service.image_url"
                      :src="service.image_url"
                      alt="Service"
                      class="h-10 w-10 rounded object-cover border border-gray-200 dark:border-gray-700"
                    />
                    <Badge v-else variant="secondary" class="text-xs">No Image</Badge>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                    {{ service.title_en || "—" }}
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                    {{ service.title_bn || "—" }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <Badge :variant="service.status ? 'default' : 'secondary'" class="text-xs">
                      {{ service.status ? "Active" : "Inactive" }}
                    </Badge>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {{ service.sort_order ?? 0 }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex space-x-2">
                      <Button
                        v-if="can('SERVICE_SHOW')"
                        variant="ghost"
                        size="icon"
                        as-child
                        class="text-blue-600 hover:text-blue-700 hover:bg-blue-100 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/30"
                      >
                        <Link :href="route('services.show', service.id)">
                          <Eye class="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        v-if="can('SERVICE_EDIT')"
                        variant="ghost"
                        size="icon"
                        as-child
                        class="text-green-600 hover:text-green-700 hover:bg-green-100 dark:text-green-400 dark:hover:text-green-300 dark:hover:bg-green-900/30"
                      >
                        <Link :href="route('services.edit', service.id)">
                          <SquarePen class="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        v-if="can('SERVICE_DELETE')"
                        variant="ghost"
                        size="icon"
                        @click="deleteService(service.id)"
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

          <div v-if="services?.links" class="mt-4 flex justify-between items-center">
            <div class="text-sm text-gray-700 dark:text-gray-300">
              Showing {{ services.from }} to {{ services.to }} of {{ services.total }} entries
            </div>
            <div class="flex gap-2">
              <Button
                v-for="(link, index) in services.links"
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

