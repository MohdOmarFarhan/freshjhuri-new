<script setup>
import { Link, Head, useForm } from "@inertiajs/vue3";
import { ArrowLeft } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AppLayout from "@/layouts/AppLayout.vue";

const breadcrumbs = [
  { title: "Dashboard", href: "/dashboard" },
  { title: "Product Statuses", href: "/product-statuses" },
  { title: "Create", href: "/product-statuses/create" },
];

const form = useForm({
  name_en: "",
  name_bn: "",
});

const submit = () => {
  form.post(route("product-statuses.store"), {
    preserveScroll: true,
  });
};
</script>

<template>
  <AppLayout :breadcrumbs="breadcrumbs">
    <Head title="Create Product Status" />

    <div class="lg:w-full mx-auto p-4 sm:p-2 lg:p-8">
      <div class="mb-4">
        <Button variant="ghost" as-child>
          <Link :href="route('product-statuses.index')" class="flex items-center">
            <ArrowLeft class="mr-2 h-4 w-4" /> Back to List
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle class="text-xl font-bold">Create New Product Status</CardTitle>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="submit" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <Label for="name_en" class="text-sm font-medium">
                  Name (English) <span class="text-red-500">*</span>
                </Label>
                <Input
                  id="name_en"
                  v-model="form.name_en"
                  type="text"
                  placeholder="e.g. Available"
                  :class="{ 'border-red-500 focus-visible:ring-red-500': form.errors.name_en }"
                />
                <span v-if="form.errors.name_en" class="text-sm text-red-500">{{ form.errors.name_en }}</span>
              </div>

              <div class="space-y-2">
                <Label for="name_bn" class="text-sm font-medium">
                  Name (Bangla) <span class="text-red-500">*</span>
                </Label>
                <Input
                  id="name_bn"
                  v-model="form.name_bn"
                  type="text"
                  placeholder="e.g. উপলব্ধ"
                  :class="{ 'border-red-500 focus-visible:ring-red-500': form.errors.name_bn }"
                />
                <span v-if="form.errors.name_bn" class="text-sm text-red-500">{{ form.errors.name_bn }}</span>
              </div>
            </div>

            <div class="flex justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button type="button" variant="outline" as-child>
                <Link :href="route('product-statuses.index')">Cancel</Link>
              </Button>
              <Button
                type="submit"
                :disabled="form.processing"
                class="bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700"
              >
                <span v-if="form.processing" class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating...
                </span>
                <span v-else>Create Status</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  </AppLayout>
</template>

