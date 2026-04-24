<script setup lang="ts">
import { Head, useForm } from '@inertiajs/vue3';
import {
    Building2,
    MapPin,
    Phone,
    Mail,
    MessageCircle,
    Image as ImageIcon,
    Save,
    Upload,
    ArrowLeft,
    Code
} from 'lucide-vue-next';
import { ref } from 'vue';
import { route } from 'ziggy-js';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';

const props = defineProps({
    commonsetting: {
        type: Object,
        required: true,
    },
});

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Settings', href: '/common-settings' },
    { title: 'Edit', href: `/common-settings/${props.commonsetting.id}/edit` },
];

const form = useForm({
    _method: 'put',
    project_name: props.commonsetting.project_name || '',
    slogan: props.commonsetting.slogan || '',
    est: props.commonsetting.est || '',
    address: props.commonsetting.address || '',
    email: props.commonsetting.email || '',
    phone: props.commonsetting.phone || '',
    whatsapp: props.commonsetting.whatsapp || '',
    hotline: props.commonsetting.hotline || '',
    copyright: props.commonsetting.copyright || '',
    logo_1: null as File | null,
    logo_2: null as File | null,
    developer_logo: null as File | null,
    banner_image: null as File | null,
    facebook_pixel: props.commonsetting.facebook_pixel || '',
});

// PREVIEW REFS (Initialize with existing images)
const logo1Preview = ref<string | null>(props.commonsetting.logo_1 ? `/${props.commonsetting.logo_1}` : null);
const logo2Preview = ref<string | null>(props.commonsetting.logo_2 ? `/${props.commonsetting.logo_2}` : null);
const developerPreview = ref<string | null>(props.commonsetting.developer_logo ? `/${props.commonsetting.developer_logo}` : null);
const bannerPreview = ref<string | null>(props.commonsetting.banner_image ? `/${props.commonsetting.banner_image}` : null);

// FILE INPUT HANDLERS WITH PREVIEW
function onLogo1Change(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files?.length) {
        const file = target.files[0];
        form.logo_1 = file;
        logo1Preview.value = URL.createObjectURL(file);
    }
}

function onLogo2Change(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files?.length) {
        const file = target.files[0];
        form.logo_2 = file;
        logo2Preview.value = URL.createObjectURL(file);
    }
}

function onDeveloperLogoChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files?.length) {
        const file = target.files[0];
        form.developer_logo = file;
        developerPreview.value = URL.createObjectURL(file);
    }
}

function onBannerImageChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files?.length) {
        const file = target.files[0];
        form.banner_image = file;
        bannerPreview.value = URL.createObjectURL(file);
    }
}

const submit = () => {
    form.post(route('common.setting.update', { commonsetting: props.commonsetting.id }), {
        preserveScroll: true,
        forceFormData: true,
    });
};
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head title="Edit Settings" />

        <div class="p-6 space-y-6 max-w-5xl mx-auto">
            <!-- Header -->
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 class="text-2xl font-bold tracking-tight text-foreground">Edit Settings</h1>
                    <p class="text-muted-foreground">Update your application settings and configuration.</p>
                </div>
                <div class="flex gap-2">
                     <Button variant="outline" as-child>
                        <a :href="route('common.settings')">
                            <ArrowLeft class="w-4 h-4 mr-2" />
                            Back
                        </a>
                    </Button>
                    <Button @click="submit" :disabled="form.processing" class="gap-2">
                        <Save class="w-4 h-4" />
                        {{ form.processing ? 'Updating...' : 'Update Settings' }}
                    </Button>
                </div>
            </div>

            <Separator />

            <form @submit.prevent="submit" class="grid grid-cols-1 md:grid-cols-3 gap-6">

                <!-- Left Column: General & Contact -->
                <div class="md:col-span-2 space-y-6">

                    <!-- General Info Card -->
                    <Card>
                        <CardHeader>
                            <CardTitle class="flex items-center gap-2">
                                <Building2 class="w-5 h-5 text-primary" />
                                General Information
                            </CardTitle>
                            <CardDescription>Basic details about the project.</CardDescription>
                        </CardHeader>
                        <CardContent class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div class="sm:col-span-2 space-y-2">
                                <Label for="project_name">Project Name</Label>
                                <Input id="project_name" v-model="form.project_name" placeholder="e.g. Acme Corp" />
                                <p v-if="form.errors.project_name" class="text-sm text-destructive">{{ form.errors.project_name }}</p>
                            </div>

                            <div class="sm:col-span-2 space-y-2">
                                <Label for="slogan">Slogan</Label>
                                <Input id="slogan" v-model="form.slogan" placeholder="e.g. Innovation for Future" />
                            </div>

                            <div class="space-y-2">
                                <Label for="est">Established Year</Label>
                                <Input id="est" v-model="form.est" placeholder="e.g. 2023" />
                            </div>

                            <div class="space-y-2">
                                <Label for="copyright">Copyright Text</Label>
                                <Input id="copyright" v-model="form.copyright" placeholder="e.g. All rights reserved" />
                            </div>
                        </CardContent>
                    </Card>

                    <!-- Contact Info Card -->
                    <Card>
                        <CardHeader>
                            <CardTitle class="flex items-center gap-2">
                                <Phone class="w-5 h-5 text-primary" />
                                Contact Details
                            </CardTitle>
                            <CardDescription>Public contact information.</CardDescription>
                        </CardHeader>
                        <CardContent class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div class="sm:col-span-2 space-y-2">
                                <Label for="address">Address</Label>
                                <div class="relative">
                                    <MapPin class="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input id="address" v-model="form.address" class="pl-9" placeholder="Full office address" />
                                </div>
                            </div>

                            <div class="space-y-2">
                                <Label for="email">Email Address</Label>
                                <div class="relative">
                                    <Mail class="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input id="email" type="email" v-model="form.email" class="pl-9" placeholder="contact@example.com" />
                                </div>
                            </div>

                            <div class="space-y-2">
                                <Label for="phone">Phone Number</Label>
                                <div class="relative">
                                    <Phone class="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input id="phone" v-model="form.phone" class="pl-9" placeholder="+1234567890" />
                                </div>
                            </div>

                            <div class="space-y-2">
                                <Label for="whatsapp">WhatsApp Number</Label>
                                <div class="relative">
                                    <MessageCircle class="absolute left-3 top-2.5 h-4 w-4 text-green-600" />
                                    <Input id="whatsapp" v-model="form.whatsapp" class="pl-9" placeholder="WhatsApp contact number" />
                                </div>
                            </div>

                             <div class="space-y-2">
                                <Label for="hotline">Hotline</Label>
                                <div class="relative">
                                    <Phone class="absolute left-3 top-2.5 h-4 w-4 text-red-500" />
                                    <Input id="hotline" v-model="form.hotline" class="pl-9" placeholder="Emergency hotline" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <!-- Integrations Card -->
                    <Card>
                        <CardHeader>
                            <CardTitle class="flex items-center gap-2">
                                <Code class="w-5 h-5 text-primary" />
                                Scripts & Integrations
                            </CardTitle>
                            <CardDescription>Third-party tracking scripts.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div class="space-y-2">
                                <Label for="facebook_pixel">Facebook Pixel Script</Label>
                                <Textarea
                                    id="facebook_pixel"
                                    v-model="form.facebook_pixel"
                                    rows="5"
                                    placeholder="<!-- Facebook Pixel Code -->..."
                                    class="font-mono text-xs"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <!-- Right Column: Images -->
                <div class="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle class="flex items-center gap-2">
                                <ImageIcon class="w-5 h-5 text-primary" />
                                Brand Images
                            </CardTitle>
                            <CardDescription>Upload logos and banners.</CardDescription>
                        </CardHeader>
                        <CardContent class="space-y-6">

                            <!-- Logo 1 -->
                            <div class="space-y-2">
                                <Label>Primary Logo</Label>
                                <div class="border-2 border-dashed rounded-lg p-4 hover:bg-accent/50 transition-colors text-center cursor-pointer relative group">
                                    <input type="file" @change="onLogo1Change" class="absolute inset-0 opacity-0 cursor-pointer z-50" accept="image/jpeg,image/png,image/jpg,image/gif,image/svg+xml,image/webp,image/bmp" />
                                    <div v-if="!logo1Preview" class="flex flex-col items-center gap-2 py-4">
                                        <Upload class="w-8 h-8 text-muted-foreground" />
                                        <span class="text-xs text-muted-foreground">Click to upload</span>
                                    </div>
                                    <div v-else class="relative h-32 w-full flex items-center justify-center">
                                        <img :src="logo1Preview" class="max-h-full max-w-full object-contain" />
                                        <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                                            <span class="text-white text-xs font-medium">Change Image</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Logo 2 -->
                            <div class="space-y-2">
                                <Label>Secondary Logo</Label>
                                <div class="border-2 border-dashed rounded-lg p-4 hover:bg-accent/50 transition-colors text-center cursor-pointer relative group">
                                    <input type="file" @change="onLogo2Change" class="absolute inset-0 opacity-0 cursor-pointer z-50" accept="image/jpeg,image/png,image/jpg,image/gif,image/svg+xml,image/webp,image/bmp" />
                                    <div v-if="!logo2Preview" class="flex flex-col items-center gap-2 py-4">
                                        <Upload class="w-8 h-8 text-muted-foreground" />
                                        <span class="text-xs text-muted-foreground">Click to upload</span>
                                    </div>
                                    <div v-else class="relative h-32 w-full flex items-center justify-center">
                                        <img :src="logo2Preview" class="max-h-full max-w-full object-contain" />
                                        <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                                            <span class="text-white text-xs font-medium">Change Image</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Developer Logo -->
                            <div class="space-y-2">
                                <Label>Developer Logo</Label>
                                <div class="border-2 border-dashed rounded-lg p-4 hover:bg-accent/50 transition-colors text-center cursor-pointer relative group">
                                    <input type="file" @change="onDeveloperLogoChange" class="absolute inset-0 opacity-0 cursor-pointer z-50" accept="image/jpeg,image/png,image/jpg,image/gif,image/webp,image/bmp" />
                                    <div v-if="!developerPreview" class="flex flex-col items-center gap-2 py-4">
                                        <Upload class="w-8 h-8 text-muted-foreground" />
                                        <span class="text-xs text-muted-foreground">Click to upload</span>
                                    </div>
                                    <div v-else class="relative h-32 w-full flex items-center justify-center">
                                        <img :src="developerPreview" class="max-h-full max-w-full object-contain" />
                                        <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                                            <span class="text-white text-xs font-medium">Change Image</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Banner Image -->
                            <div class="space-y-2">
                                <Label>Banner Image</Label>
                                <div class="border-2 border-dashed rounded-lg p-4 hover:bg-accent/50 transition-colors text-center cursor-pointer relative group">
                                    <input type="file" @change="onBannerImageChange" class="absolute inset-0 opacity-0 cursor-pointer z-50" accept="image/jpeg,image/png,image/jpg,image/gif,image/webp,image/bmp" />
                                    <div v-if="!bannerPreview" class="flex flex-col items-center gap-2 py-4">
                                        <Upload class="w-8 h-8 text-muted-foreground" />
                                        <span class="text-xs text-muted-foreground">Click to upload</span>
                                    </div>
                                    <div v-else class="relative h-32 w-full flex items-center justify-center">
                                        <img :src="bannerPreview" class="max-h-full max-w-full object-cover rounded-md" />
                                        <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                                            <span class="text-white text-xs font-medium">Change Image</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </CardContent>
                    </Card>
                </div>

            </form>
        </div>
    </AppLayout>
</template>
