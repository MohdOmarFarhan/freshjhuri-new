<script setup>
import { Link, Head, useForm } from "@inertiajs/vue3";
import { ArrowLeft, Image as ImageIcon, X } from "lucide-vue-next";
import { ref } from "vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import AppLayout from "@/layouts/AppLayout.vue";

const breadcrumbs = [
  { title: "Dashboard", href: "/dashboard" },
  { title: "Services", href: "/services" },
  { title: "Create", href: "/services/create" },
];

const form = useForm({
  title_en: "",
  title_bn: "",
  description_en: "",
  description_bn: "",
  benefits_en: "",
  benefits_bn: "",
  image: null,
  video_url: "",
  status: true,
  sort_order: 0,
});

const imagePreview = ref(null);

const handleImageUpload = (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  form.image = file;
  if (imagePreview.value) {
    URL.revokeObjectURL(imagePreview.value);
  }
  imagePreview.value = URL.createObjectURL(file);
};

const removeImage = () => {
  form.image = null;
  if (imagePreview.value) {
    URL.revokeObjectURL(imagePreview.value);
    imagePreview.value = null;
  }
};

const submit = () => {
  form.post(route("services.store"), {
    preserveScroll: true,
    onSuccess: () => {
      if (imagePreview.value) {
        URL.revokeObjectURL(imagePreview.value);
      }
    },
  });
};
</script>

<template>
  <AppLayout :breadcrumbs="breadcrumbs">
    <Head title="Create Service" />

    <div class="lg:w-full mx-auto p-4 sm:p-2 lg:p-8">
      <div class="mb-4">
        <Button variant="ghost" as-child>
          <Link :href="route('services.index')" class="flex items-center">
            <ArrowLeft class="mr-2 h-4 w-4" /> Back to List
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle class="text-xl font-bold">Create New Service</CardTitle>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="submit" class="space-y-6" enctype="multipart/form-data">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <Label for="title_en">Title (English) <span class="text-red-500">*</span></Label>
                <Input
                  id="title_en"
                  v-model="form.title_en"
                  type="text"
                  placeholder="Enter service title in English"
                  :class="{ 'border-red-500 focus-visible:ring-red-500': form.errors.title_en }"
                />
                <span v-if="form.errors.title_en" class="text-sm text-red-500">{{ form.errors.title_en }}</span>
              </div>

              <div class="space-y-2">
                <Label for="title_bn">Title (Bangla) <span class="text-red-500">*</span></Label>
                <Input
                  id="title_bn"
                  v-model="form.title_bn"
                  type="text"
                  placeholder="বাংলায় শিরোনাম লিখুন"
                  :class="{ 'border-red-500 focus-visible:ring-red-500': form.errors.title_bn }"
                />
                <span v-if="form.errors.title_bn" class="text-sm text-red-500">{{ form.errors.title_bn }}</span>
              </div>

              <div class="space-y-2 md:col-span-2">
                <Label for="description_en">Description (English)</Label>
                <Textarea id="description_en" v-model="form.description_en" rows="4" class="resize-none" />
              </div>

              <div class="space-y-2 md:col-span-2">
                <Label for="description_bn">Description (Bangla)</Label>
                <Textarea id="description_bn" v-model="form.description_bn" rows="4" class="resize-none" />
              </div>

              <div class="space-y-2">
                <Label for="benefits_en">Benefits (English) (one per line)</Label>
                <Textarea id="benefits_en" v-model="form.benefits_en" rows="5" class="resize-none" />
              </div>

              <div class="space-y-2">
                <Label for="benefits_bn">Benefits (Bangla) (one per line)</Label>
                <Textarea id="benefits_bn" v-model="form.benefits_bn" rows="5" class="resize-none" />
              </div>

              <div class="space-y-2">
                <Label for="sort_order">Sort Order</Label>
                <Input id="sort_order" v-model="form.sort_order" type="number" min="0" />
              </div>

              <div class="space-y-2 md:col-span-2">
                <Label for="video_url">Video URL (Facebook / YouTube) (optional)</Label>
                <Input
                  id="video_url"
                  v-model="form.video_url"
                  type="url"
                  placeholder="https://www.facebook.com/.../videos/... or https://youtu.be/..."
                  :class="{ 'border-red-500 focus-visible:ring-red-500': form.errors.video_url }"
                />
                <span v-if="form.errors.video_url" class="text-sm text-red-500">{{ form.errors.video_url }}</span>
              </div>

              <div class="space-y-2 flex items-center gap-3 pt-7">
                <Checkbox id="status" v-model:checked="form.status" />
                <Label for="status">Active</Label>
              </div>

              <div class="space-y-2 md:col-span-2">
                <Label>Image</Label>
                <div class="flex items-center gap-4">
                  <Button type="button" variant="outline" @click="$refs.imageInput.click()">
                    <ImageIcon class="mr-2 h-4 w-4" /> Choose Image
                  </Button>
                  <input
                    ref="imageInput"
                    type="file"
                    accept="image/*"
                    class="hidden"
                    @change="handleImageUpload"
                  />
                  <span v-if="form.errors.image" class="text-sm text-red-500">{{ form.errors.image }}</span>
                </div>

                <div v-if="imagePreview" class="relative mt-3 inline-block">
                  <img :src="imagePreview" alt="Preview" class="h-40 w-72 object-cover rounded-xl border border-border" />
                  <button
                    type="button"
                    class="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center"
                    @click="removeImage"
                  >
                    <X class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div class="flex justify-end gap-3">
              <Button variant="outline" as-child type="button">
                <Link :href="route('services.index')">Cancel</Link>
              </Button>
              <Button type="submit" :disabled="form.processing">
                {{ form.processing ? "Creating..." : "Create Service" }}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  </AppLayout>
</template>
