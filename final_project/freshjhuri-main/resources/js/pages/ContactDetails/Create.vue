<script setup>
import { Head, Link, useForm } from "@inertiajs/vue3";
import { Phone, Mail, MapPin, Image as ImageIcon, MessageCircle } from "lucide-vue-next";
import { ref } from "vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import AppLayout from "@/layouts/AppLayout.vue";

const breadcrumbs = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Contact Details", href: "/contact/details" },
    { title: "Create", href: "/contact/detail/create" },
];

const form = useForm({
    image: null,
    phone: "",
    whats_app: "",
    email: "",
    corporate_office_en: "",
    corporate_office_bn: "",
    local_office_1_en: "",
    local_office_1_bn: "",
    local_office_2_en: "",
    local_office_2_bn: "",
    local_office_3_en: "",
    local_office_3_bn: "",
});

const imagePreview = ref(null);

const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    form.image = file ?? null;
    if (file) {
        imagePreview.value = URL.createObjectURL(file);
    } else {
        imagePreview.value = null;
    }
};

const submit = () => {
    form.post(route("contactdetail.store"), {
        forceFormData: true,
    });
};
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head title="Create Contact Detail" />

        <div class="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-2xl font-bold tracking-tight text-foreground">Create Contact Detail</h1>
                    <p class="text-muted-foreground">
                        Define how customers can reach your organization across different offices.
                    </p>
                </div>
                <Button variant="outline" as-child>
                    <Link :href="route('contact.details')"> Back to list </Link>
                </Button>
            </div>

            <form @submit.prevent="submit" class="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle class="flex items-center gap-2">
                            <ImageIcon class="w-5 h-5 text-primary" />
                            Logo / Image
                        </CardTitle>
                    </CardHeader>
                    <CardContent class="space-y-4">
                        <div class="grid gap-4 md:grid-cols-[1fr,2fr] items-start">
                             <div class="space-y-2">
                                <label class="text-sm font-medium text-muted-foreground">Preview</label>
                                <div
                                    class="h-24 w-24 flex items-center justify-center bg-gray-50 dark:bg-gray-900/50 rounded-md overflow-hidden border border-dashed border-gray-300 dark:border-gray-700"
                                >
                                    <img
                                        v-if="imagePreview"
                                        :src="imagePreview"
                                        alt="Preview"
                                        class="h-full w-full object-cover"
                                    />
                                    <span v-else class="text-xs text-muted-foreground">No Image</span>
                                </div>
                            </div>
                            <div class="space-y-2">
                                <label class="text-sm font-medium text-muted-foreground">Image</label>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    @change="handleImageChange"
                                />
                                <p class="text-xs text-muted-foreground">
                                    Recommended formats: JPG, PNG, WEBP. Max size 2MB.
                                </p>
                                <div v-if="form.errors.image" class="text-sm text-red-600">
                                    {{ form.errors.image }}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle class="flex items-center gap-2">
                            <Phone class="w-5 h-5 text-primary" />
                            Primary Contact Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="space-y-2">
                            <label class="text-sm font-medium text-muted-foreground">Phone</label>
                            <Input v-model="form.phone" type="text" placeholder="+8801XXXXXXXXX" />
                            <div v-if="form.errors.phone" class="text-sm text-red-600">
                                {{ form.errors.phone }}
                            </div>
                        </div>
                        <div class="space-y-2">
                            <label class="text-sm font-medium text-muted-foreground flex items-center gap-1">
                                <MessageCircle class="w-4 h-4" />
                                WhatsApp
                            </label>
                            <Input v-model="form.whats_app" type="text" placeholder="+8801XXXXXXXXX" />
                            <div v-if="form.errors.whats_app" class="text-sm text-red-600">
                                {{ form.errors.whats_app }}
                            </div>
                        </div>
                        <div class="space-y-2 md:col-span-2">
                            <label class="text-sm font-medium text-muted-foreground flex items-center gap-1">
                                <Mail class="w-4 h-4" />
                                Email
                            </label>
                            <Input v-model="form.email" type="email" placeholder="info@example.com" />
                            <div v-if="form.errors.email" class="text-sm text-red-600">
                                {{ form.errors.email }}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle class="flex items-center gap-2">
                            <MapPin class="w-5 h-5 text-primary" />
                            Corporate Office
                        </CardTitle>
                    </CardHeader>
                    <CardContent class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="space-y-2">
                            <label class="text-sm font-medium text-muted-foreground">Address (English)</label>
                            <Textarea
                                v-model="form.corporate_office_en"
                                rows="3"
                                placeholder="Corporate office address in English"
                            />
                            <div v-if="form.errors.corporate_office_en" class="text-sm text-red-600">
                                {{ form.errors.corporate_office_en }}
                            </div>
                        </div>
                        <div class="space-y-2">
                            <label class="text-sm font-medium text-muted-foreground">Address (Bangla)</label>
                            <Textarea
                                v-model="form.corporate_office_bn"
                                rows="3"
                                placeholder="Corporate office address in Bangla"
                            />
                            <div v-if="form.errors.corporate_office_bn" class="text-sm text-red-600">
                                {{ form.errors.corporate_office_bn }}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Local Offices</CardTitle>
                    </CardHeader>
                    <CardContent class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div class="space-y-2">
                            <label class="text-xs font-semibold text-muted-foreground uppercase">
                                Local Office 1 (EN)
                            </label>
                            <Textarea
                                v-model="form.local_office_1_en"
                                rows="2"
                                placeholder="Local office 1 address in English"
                            />
                            <label class="text-xs font-semibold text-muted-foreground uppercase">
                                Local Office 1 (BN)
                            </label>
                            <Textarea
                                v-model="form.local_office_1_bn"
                                rows="2"
                                placeholder="Local office 1 address in Bangla"
                            />
                        </div>
                        <div class="space-y-2">
                            <label class="text-xs font-semibold text-muted-foreground uppercase">
                                Local Office 2 (EN)
                            </label>
                            <Textarea
                                v-model="form.local_office_2_en"
                                rows="2"
                                placeholder="Local office 2 address in English"
                            />
                            <label class="text-xs font-semibold text-muted-foreground uppercase">
                                Local Office 2 (BN)
                            </label>
                            <Textarea
                                v-model="form.local_office_2_bn"
                                rows="2"
                                placeholder="Local office 2 address in Bangla"
                            />
                        </div>
                        <div class="space-y-2">
                            <label class="text-xs font-semibold text-muted-foreground uppercase">
                                Local Office 3 (EN)
                            </label>
                            <Textarea
                                v-model="form.local_office_3_en"
                                rows="2"
                                placeholder="Local office 3 address in English"
                            />
                            <label class="text-xs font-semibold text-muted-foreground uppercase">
                                Local Office 3 (BN)
                            </label>
                            <Textarea
                                v-model="form.local_office_3_bn"
                                rows="2"
                                placeholder="Local office 3 address in Bangla"
                            />
                        </div>
                    </CardContent>
                </Card>

                <div class="flex items-center justify-end gap-3">
                    <Button type="button" variant="outline" as-child>
                        <Link :href="route('contact.details')"> Cancel </Link>
                    </Button>
                    <Button type="submit" :disabled="form.processing">
                        {{ form.processing ? "Saving..." : "Save Contact Detail" }}
                    </Button>
                </div>
            </form>
        </div>
    </AppLayout>
</template>
