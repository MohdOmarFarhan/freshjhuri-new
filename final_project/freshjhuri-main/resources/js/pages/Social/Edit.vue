<script setup>
import { useForm, Link } from "@inertiajs/vue3";
import { ArrowLeft, Upload } from "lucide-vue-next";
import { ref } from "vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AppLayout from "@/layouts/AppLayout.vue";

const props = defineProps({
  social: Object,
});

const breadcrumbs = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Social", href: "/socials" },
    { title: "Edit", href: `/socials/${props.social.id}/edit` },
];

const form = useForm({
  _method: "PUT",
  name: props.social.name,
  link: props.social.link,
  image: null,
});

const imagePreview = ref(
  props.social.image ? (props.social.image.startsWith('http') ? props.social.image : `/storage/${props.social.image}`) : null
);

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    form.image = file;
    imagePreview.value = URL.createObjectURL(file);
  }
};

const submit = () => {
  form.post(route("social.update", props.social.id), {
    onSuccess: () => {
      // Optional: reset form or show success message
    },
  });
};
</script>

<template>
  <AppLayout :breadcrumbs="breadcrumbs">
    <div class="p-6 max-w-2xl mx-auto">
      <div class="mb-6">
        <Link
          :href="route('social.index')"
          class="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft class="w-4 h-4 mr-2" />
          Back to List
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Social Media</CardTitle>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="submit" class="space-y-6">
            <div class="space-y-2">
              <Label for="name">Name</Label>
              <Input
                id="name"
                v-model="form.name"
                placeholder="e.g. Facebook, Twitter"
                required
              />
              <span v-if="form.errors.name" class="text-red-500 text-sm">{{
                form.errors.name
              }}</span>
            </div>

            <div class="space-y-2">
              <Label for="link">Link</Label>
              <Input
                id="link"
                v-model="form.link"
                placeholder="https://..."
                required
              />
              <span v-if="form.errors.link" class="text-red-500 text-sm">{{
                form.errors.link
              }}</span>
            </div>

            <div class="space-y-2">
              <Label for="image">Icon/Logo</Label>
              <div class="flex items-center gap-4">
                <label
                  for="image"
                  class="w-16 h-16 border rounded-lg flex items-center justify-center overflow-hidden bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <img
                    v-if="imagePreview"
                    :src="imagePreview"
                    alt="Preview"
                    class="w-full h-full object-cover"
                  />
                  <Upload v-else class="w-6 h-6 text-gray-400" />
                </label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  @change="handleImageUpload"
                  class="cursor-pointer"
                />
              </div>
              <span v-if="form.errors.image" class="text-red-500 text-sm">{{
                form.errors.image
              }}</span>
            </div>

            <div class="flex justify-end gap-4">
              <Link :href="route('social.index')">
                <Button variant="outline" type="button">Cancel</Button>
              </Link>
              <Button type="submit" :disabled="form.processing">
                {{ form.processing ? "Updating..." : "Update Social Media" }}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  </AppLayout>
</template>
