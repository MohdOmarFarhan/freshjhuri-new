<script setup>
import { Head, Link, useForm } from "@inertiajs/vue3";
import { ArrowLeft } from "lucide-vue-next";
import { computed, watch } from "vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AppLayout from "@/layouts/AppLayout.vue";

const breadcrumbs = [
  { title: "Dashboard", href: route("dashboard") },
  { title: "Shipping Charts", href: route("admin.shipping-charts.index") },
  { title: "Create", href: route("admin.shipping-charts.create") },
];

const form = useForm({
  product_type: "Feed",
  product_condition: "Number",
  product_size_en: "",
  product_size_bn: "",
  cutton_contain_amount: "",
  shpping_charge_per_cutton: "",
});

watch(
  () => form.product_type,
  (type) => {
    if (type === "Medicine" && form.product_condition === "Number") {
      form.product_condition = "Solid";
    }
    if (type === "Feed" || type === "Bag") {
      form.product_condition = "Number";
    }
    if (type !== "Medicine") {
      form.product_size_en = "";
      form.product_size_bn = "";
    }
  },
  { immediate: true }
);

watch(
  () => form.product_condition,
  (cond) => {
    if (cond === "Number") {
      form.product_size_en = "";
      form.product_size_bn = "";
      form.cutton_contain_amount = "";
    }
  },
  { immediate: true }
);

const showProductSize = computed(() => form.product_type === "Medicine");
const showCartonAmount = computed(() => form.product_condition !== "Number");

const submit = () => {
  form.post(route("admin.shipping-charts.store"));
};
</script>

<template>
  <Head title="Create Shipping Chart" />

  <AppLayout :breadcrumbs="breadcrumbs">
    <div class="lg:w-full mx-auto p-4 sm:p-2 lg:p-8">
      <div class="mb-4">
        <Button variant="ghost" as-child>
          <Link :href="route('admin.shipping-charts.index')" class="flex items-center">
            <ArrowLeft class="mr-2 h-4 w-4" /> Back to List
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle class="text-xl font-bold">Create Shipping Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="submit" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <Label for="product_type">Product Type <span class="text-red-500">*</span></Label>
                <select
                  id="product_type"
                  v-model="form.product_type"
                  class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  required
                >
                  <option value="Feed">Feed</option>
                  <option value="Medicine">Medicine</option>
                  <option value="Bag">Bag</option>
                </select>
                <div v-if="form.errors.product_type" class="text-red-600 text-sm mt-1">{{ form.errors.product_type }}</div>
              </div>

              <div class="space-y-2">
                <Label for="product_condition">Condition <span class="text-red-500">*</span></Label>
                <select
                  id="product_condition"
                  v-model="form.product_condition"
                  class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  required
                >
                  <option value="Number">Number</option>
                  <option value="Solid">Solid</option>
                  <option value="Liquid">Liquid</option>
                </select>
                <div v-if="form.errors.product_condition" class="text-red-600 text-sm mt-1">{{ form.errors.product_condition }}</div>
              </div>

              <div v-if="showCartonAmount" class="space-y-2">
                <Label for="cutton_contain_amount">Carton Contain Amount <span class="text-red-500">*</span></Label>
                <Input id="cutton_contain_amount" v-model="form.cutton_contain_amount" type="number" min="0" placeholder="e.g. 10" />
                <div v-if="form.errors.cutton_contain_amount" class="text-red-600 text-sm mt-1">{{ form.errors.cutton_contain_amount }}</div>
              </div>

              <div v-if="showProductSize" class="space-y-2">
                <Label for="product_size_en">Product Size (EN) <span class="text-red-500">*</span></Label>
                <Input id="product_size_en" v-model="form.product_size_en" type="text" placeholder="e.g. 100 mL / 500 mL / 1 L / 100 g / 500 g / 1 kg" />
                <div v-if="form.errors.product_size_en" class="text-red-600 text-sm mt-1">{{ form.errors.product_size_en }}</div>
              </div>

              <div v-if="showProductSize" class="space-y-2">
                <Label for="product_size_bn">Product Size (BN) <span class="text-red-500">*</span></Label>
                <Input id="product_size_bn" v-model="form.product_size_bn" type="text" placeholder="e.g. ১০০ মি.লি. / ৫০০ গ্রাম / ১ লিটার / ১ কেজি" />
                <div v-if="form.errors.product_size_bn" class="text-red-600 text-sm mt-1">{{ form.errors.product_size_bn }}</div>
              </div>

              <div class="space-y-2">
                <Label for="shpping_charge_per_cutton">Shipping Charge <span class="text-red-500">*</span></Label>
                <Input
                  id="shpping_charge_per_cutton"
                  v-model="form.shpping_charge_per_cutton"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="e.g. 120"
                  required
                />
                <div v-if="form.errors.shpping_charge_per_cutton" class="text-red-600 text-sm mt-1">
                  {{ form.errors.shpping_charge_per_cutton }}
                </div>
              </div>
            </div>

            <div class="flex items-center justify-end space-x-4">
              <Button variant="outline" as-child type="button">
                <Link :href="route('admin.shipping-charts.index')">Cancel</Link>
              </Button>
              <Button type="submit" :disabled="form.processing">Create</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  </AppLayout>
</template>
