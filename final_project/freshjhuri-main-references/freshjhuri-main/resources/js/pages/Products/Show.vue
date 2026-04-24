<script setup>
import { Head, Link } from "@inertiajs/vue3";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import AppLayout from "@/layouts/AppLayout.vue";
import { can } from "@/lib/can";

const { product } = defineProps({
  product: Object,
});

const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `/${path}`;
};

// Reusable section class for consistent styling
const sectionClass = "border border-border rounded-lg p-4 hover:shadow-sm transition-shadow";
const labelClass = "text-xs font-semibold text-muted-foreground mb-1";
</script>

<template>
  <AppLayout>
    <Head :title="product.title_en" />

    <!-- Breadcrumb navigation - matching edit.vue style -->
    <nav class="bg-gray-100 dark:bg-gray-900 px-4 py-3 rounded-md shadow-sm mb-6">
      <ol class="flex items-center space-x-2 text-sm">
        <li><span class="text-accent-primary">Products</span></li>
        <li>
          <Link :href="route('products.index')" class="text-accent-primary hover:underline transition-colors">
            /Index
          </Link>
        </li>
        <li><span class="text-accent-primary">/</span></li>
        <li><span class="text-accent-secondary font-semibold">Details</span></li>
      </ol>
    </nav>

    <!-- Main container - matching edit.vue styling -->
    <div class="mt-4 max-w-6xl mx-auto bg-white dark:bg-dark-primary border border-border rounded-xl shadow-lg p-6 sm:p-8">
      <!-- Header section with title and actions -->
      <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold text-foreground">
            {{ product.title_en }}
          </h1>
          <div v-if="product.sort_order !== undefined && product.sort_order !== null" class="text-xs text-muted-foreground mt-1">
            <span class="font-semibold">Sort Order:</span> {{ product.sort_order }}
          </div>
          <div v-if="product.season" class="text-xs text-muted-foreground mt-1">
            <span class="font-semibold">Season:</span> {{ product.season.charAt(0).toUpperCase() + product.season.slice(1) }}
          </div>
          <p class="text-sm text-muted-foreground mt-1">
            {{ product.title_bn }}
          </p>
          <div class="mt-3 flex flex-wrap gap-2">
            <Badge variant="outline" class="hover:shadow-sm transition-shadow">
              {{ product.category ? product.category.name_en : "No category" }}
            </Badge>
            <Badge variant="outline" class="hover:shadow-sm transition-shadow">
              {{ product.product_status ? product.product_status.name_en : "No product status" }}
            </Badge>
            <Badge variant="outline" class="hover:shadow-sm transition-shadow">
              {{ product.product_type || "featured" }}
            </Badge>
            <Badge 
              :variant="product.status ? 'default' : 'outline'"
              class="hover:shadow-sm transition-shadow"
            >
              {{ product.status ? "Active" : "Inactive" }}
            </Badge>
          </div>
        </div>

        <!-- Action buttons - matching edit.vue button styling -->
        <div class="flex flex-col gap-2 w-full sm:w-auto sm:flex-row sm:justify-end">
          <Button 
            as-child 
            variant="outline" 
            size="sm" 
            class="w-full sm:w-auto hover:shadow-md transition-shadow"
          >
            <Link :href="route('products.index')">
              Back
            </Link>
          </Button>
          <Button
            v-if="can('PRODUCT_EDIT')"
            as-child
            size="sm"
            class="w-full sm:w-auto hover:shadow-lg transition-all duration-200"
          >
            <Link :href="route('products.edit', product.id)">
              Edit Product
            </Link>
          </Button>
        </div>
      </div>

      <!-- Main content grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left column: Descriptions -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Short descriptions grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2 p-3 crud-table-head/30 rounded-lg">
              <h2 :class="labelClass">Short Description (EN)</h2>
              <p class="text-sm text-foreground whitespace-pre-line wrap-break-word">
                {{ product.short_desc_en || "No description" }}
              </p>
            </div>
            <div class="space-y-2 p-3 crud-table-head/30 rounded-lg">
              <h2 :class="labelClass">Short Description (BN)</h2>
              <p class="text-sm text-foreground whitespace-pre-line wrap-break-word">
                {{ product.short_desc_bn || "কোনো বর্ণনা নেই" }}
              </p>
            </div>
          </div>

          <!-- Full descriptions grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2 p-3 crud-table-head/30 rounded-lg">
              <h2 :class="labelClass">Description (EN)</h2>
              <p class="text-sm text-foreground whitespace-pre-line wrap-break-word">
                {{ product.description_en || "No description" }}
              </p>
            </div>
            <div class="space-y-2 p-3 crud-table-head/30 rounded-lg">
              <h2 :class="labelClass">Description (BN)</h2>
              <p class="text-sm text-foreground whitespace-pre-line wrap-break-word">
                {{ product.description_bn || "কোনো বর্ণনা নেই" }}
              </p>
            </div>
          </div>

          <!-- Conservation grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2 p-3 crud-table-head/30 rounded-lg">
              <h2 :class="labelClass">Conservation (EN)</h2>
              <p class="text-sm text-foreground whitespace-pre-line wrap-break-word">
                {{ product.conservation_en || "No conservation information" }}
              </p>
            </div>
            <div class="space-y-2 p-3 crud-table-head/30 rounded-lg">
              <h2 :class="labelClass">Conservation (BN)</h2>
              <p class="text-sm text-foreground whitespace-pre-line wrap-break-word">
                {{ product.conservation_bn || "কোনো সংরক্ষণ তথ্য নেই" }}
              </p>
            </div>
          </div>
        </div>

        <!-- Right column: Images -->
        <div class="space-y-4">
          <!-- Feature Image -->
          <div :class="sectionClass">
            <p :class="labelClass">Feature Image</p>
            <div v-if="getImageUrl(product.feature_image)" class="mt-2">
              <img
                :src="getImageUrl(product.feature_image)"
                alt="Feature"
                class="w-full h-40 object-cover rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow"
              />
            </div>
            <p v-else class="text-xs text-muted-foreground mt-2">
              No feature image
            </p>
          </div>

          <!-- Hover Image -->
          <div :class="sectionClass">
            <p :class="labelClass">Hover Image</p>
            <div v-if="getImageUrl(product.hover_image)" class="mt-2">
              <img
                :src="getImageUrl(product.hover_image)"
                alt="Hover"
                class="w-full h-40 object-cover rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow"
              />
            </div>
            <p v-else class="text-xs text-muted-foreground mt-2">
              No hover image
            </p>
          </div>

          <!-- Slider Images -->
          <div :class="sectionClass">
            <p :class="labelClass">Slider Images</p>
            <div
              v-if="product.slider_images && product.slider_images.length"
              class="flex flex-wrap gap-2 mt-2"
            >
              <img
                v-for="img in product.slider_images"
                :key="img.id"
                :src="getImageUrl(img.slider_image)"
                class="h-16 w-16 object-cover rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow"
                alt="Slider image"
              />
            </div>
            <p v-else class="text-xs text-muted-foreground mt-2">
              No slider images
            </p>
          </div>
        </div>
      </div>

      <!-- Features Grid -->
      <div class="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Features -->
        <div
          v-if="product.product_features && product.product_features.length"
          :class="sectionClass"
        >
          <h2 class="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
            <span class="w-1 h-4 bg-accent rounded-full"></span>
            Features
          </h2>
          <ul class="space-y-2 text-sm text-foreground">
            <li 
              v-for="f in product.product_features" 
              :key="f.id"
              class="flex items-start gap-2 p-2 crud-table-head/30 rounded hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors"
            >
              <span class="text-accent mt-1">•</span>
              <span>{{ f.feature_en }} <span v-if="f.feature_bn" class="text-muted-foreground">/ {{ f.feature_bn }}</span></span>
            </li>
          </ul>
        </div>

      </div>

      <!-- Empty state if no data in any section -->
      <div 
        v-if="!product.product_features?.length"
        class="mt-6 text-center py-8 border border-dashed border-border rounded-lg"
      >
        <p class="text-muted-foreground">No additional information available</p>
      </div>
    </div>
  </AppLayout>
</template>
