<script setup>
import { computed, ref } from "vue";
import { Head, useForm, Link } from "@inertiajs/vue3";
import AppLayout from "@/layouts/AppLayout.vue";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save, X } from "lucide-vue-next";
import * as LucideIcons from 'lucide-vue-next';

const props = defineProps({
    marquee: Object
});

const form = useForm({
    _method: 'PUT',
    text_en: props.marquee.text_en,
    text_bn: props.marquee.text_bn,
    icon: props.marquee.icon || '',
    image_file: null,
    image_url: props.marquee.image?.startsWith?.('http') ? props.marquee.image : '',
    remove_image: false,
    color: props.marquee.color,
    bg_color: props.marquee.bg_color,
    sort_order: props.marquee.sort_order,
});

const breadcrumbs = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Brand Marquees", href: "/brand-marquees" },
    { title: "Edit", href: "#" },
];

const fileInput = ref(null);
const imagePreview = ref(null);
const iconSearch = ref("");

const curatedIconNames = [
    "Shield",
    "ShieldCheck",
    "BadgeCheck",
    "Award",
    "CheckCircle2",
    "Leaf",
    "Package",
    "Sparkles",
    "Star",
    "Truck",
    "HeartHandshake",
    "Globe",
];

const availableIcons = curatedIconNames.filter((name) => LucideIcons[name]);
const filteredIcons = computed(() => {
    const q = iconSearch.value.trim().toLowerCase();
    if (!q) return availableIcons;
    return availableIcons.filter((name) => name.toLowerCase().includes(q));
});

const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    if (path.startsWith('/')) return path;
    return `/storage/${path}`;
};

const existingImage = computed(() => (form.remove_image ? null : getImageUrl(props.marquee.image)));
const resolvedPreview = computed(() => imagePreview.value || getImageUrl(form.image_url) || existingImage.value);

const handleImageChange = (event) => {
    const file = event.target.files?.[0] || null;
    form.image_file = file;
    form.remove_image = false;
    if (imagePreview.value) {
        URL.revokeObjectURL(imagePreview.value);
    }
    imagePreview.value = file ? URL.createObjectURL(file) : null;
};

const clearUploadedImage = () => {
    form.image_file = null;
    if (imagePreview.value) {
        URL.revokeObjectURL(imagePreview.value);
        imagePreview.value = null;
    }
    if (fileInput.value) {
        fileInput.value.value = "";
    }
};

const submit = () => {
    form.post(route("brand-marquees.update", props.marquee.id), {
        forceFormData: true,
    });
};
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head title="Edit Brand Marquee" />

        <div class="max-w-4xl mx-auto p-4 sm:p-2 lg:p-8">
            <Card>
                <CardHeader class="flex flex-row items-center justify-between">
                    <CardTitle class="text-xl font-bold">Edit Brand Marquee</CardTitle>
                    <Button variant="outline" as-child>
                        <Link :href="route('brand-marquees.index')">
                            <ArrowLeft class="mr-2 h-4 w-4" /> Back
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    <form @submit.prevent="submit" class="space-y-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="space-y-2">
                                <Label for="text_en">Text (EN)</Label>
                                <Input id="text_en" v-model="form.text_en" />
                                <div v-if="form.errors.text_en" class="text-red-500 text-xs">{{ form.errors.text_en }}</div>
                            </div>
                            <div class="space-y-2">
                                <Label for="text_bn">Text (BN)</Label>
                                <Input id="text_bn" v-model="form.text_bn" />
                                <div v-if="form.errors.text_bn" class="text-red-500 text-xs">{{ form.errors.text_bn }}</div>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div class="space-y-2">
                                <Label for="icon">Fallback Icon Name</Label>
                                <Input id="icon" v-model="form.icon" placeholder="Shield, BadgeCheck, Leaf" />
                            </div>
                            <div class="space-y-2">
                                <Label for="color">Text/Icon Color</Label>
                                <Input id="color" v-model="form.color" placeholder="#111827 or text-stone-900" />
                            </div>
                            <div class="space-y-2">
                                <Label for="bg_color">BG Color</Label>
                                <Input id="bg_color" v-model="form.bg_color" placeholder="#fef3c7 or bg-amber-100" />
                            </div>
                        </div>

                        <div class="space-y-3">
                            <div class="flex items-center justify-between gap-4">
                                <Label>Icon Picker</Label>
                                <Input v-model="iconSearch" placeholder="Search icons..." class="max-w-xs" />
                            </div>
                            <div class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                <button
                                    v-for="iconName in filteredIcons"
                                    :key="iconName"
                                    type="button"
                                    class="rounded-xl border p-3 bg-white hover:bg-stone-50 transition-all text-center"
                                    :class="form.icon === iconName ? 'border-amber-500 ring-2 ring-amber-200' : 'border-stone-200'"
                                    @click="form.icon = iconName"
                                >
                                    <component :is="LucideIcons[iconName]" class="w-5 h-5 mx-auto mb-2 text-stone-700" />
                                    <span class="block text-[11px] leading-tight text-stone-600">{{ iconName }}</span>
                                </button>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="space-y-2">
                                <Label for="image_file">Replace Badge Image</Label>
                                <div class="flex items-center gap-3">
                                    <Input
                                        id="image_file"
                                        ref="fileInput"
                                        type="file"
                                        accept="image/*"
                                        @change="handleImageChange"
                                    />
                                    <Button v-if="form.image_file" type="button" variant="outline" size="icon" @click="clearUploadedImage">
                                        <X class="h-4 w-4" />
                                    </Button>
                                </div>
                                <p class="text-xs text-muted-foreground">Upload a logo from device or gallery.</p>
                                <div v-if="form.errors.image_file" class="text-red-500 text-xs">{{ form.errors.image_file }}</div>
                            </div>

                            <div class="space-y-2">
                                <Label for="image_url">Badge Image URL</Label>
                                <Input id="image_url" v-model="form.image_url" placeholder="https://example.com/bsti-logo.png" @input="form.remove_image = false" />
                                <div class="flex items-center gap-2 text-sm">
                                    <input id="remove_image" v-model="form.remove_image" type="checkbox" class="rounded border-gray-300" />
                                    <Label for="remove_image" class="font-normal">Remove current image and use icon fallback</Label>
                                </div>
                                <div v-if="form.errors.image_url" class="text-red-500 text-xs">{{ form.errors.image_url }}</div>
                            </div>
                        </div>

                        <div v-if="resolvedPreview" class="space-y-2">
                            <Label>Visual Preview</Label>
                            <div class="w-24 h-24 rounded-xl border bg-white overflow-hidden flex items-center justify-center">
                                <img :src="resolvedPreview" alt="Badge preview" class="w-full h-full object-contain" />
                            </div>
                        </div>

                        <div class="space-y-2">
                            <Label for="sort_order">Sort Order</Label>
                            <Input id="sort_order" type="number" v-model="form.sort_order" />
                        </div>

                        <div class="flex justify-end">
                            <Button type="submit" :disabled="form.processing">
                                <Save class="mr-2 h-4 w-4" /> Update Marquee
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    </AppLayout>
</template>
