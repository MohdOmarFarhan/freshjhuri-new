<script setup lang="ts">
import { Head, Link, router } from '@inertiajs/vue3';
import { 
    Building2, 
    MapPin, 
    Phone, 
    Mail, 
    MessageCircle, 
    Calendar, 
    Globe, 
    Code, 
    Image as ImageIcon,
    Pencil,
    Trash2,
    Plus,
    Facebook
} from 'lucide-vue-next';
import { route } from 'ziggy-js';
import { Button } from "@/components/ui/button"
import { 
    Card, 
    CardContent, 
    CardHeader, 
    CardTitle, 
    CardDescription,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { confirmDeletion } from '@/helper/sweetAlertHelpers';
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';

defineProps({
    commonsettings: Object,
});

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Settings',
        href: '/common-settings',
    },
];

const deleteSetting = (id: number) => {
    confirmDeletion(() => {
        router.delete(route('common.setting.delete', { commonsetting: id }));
    });
};

const getImageUrl = (path?: string | null) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    if (path.startsWith('/')) return path;
    if (path.startsWith('storage/')) return `/${path}`;
    return `/storage/${path}`;
};
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head title="Common Settings" />
     
        <div class="p-6 space-y-6 max-w-7xl mx-auto">
            
            <!-- Page Header -->
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 class="text-2xl font-bold tracking-tight text-foreground">Common Settings</h1>
                    <p class="text-muted-foreground">Manage your application's global configuration and assets.</p>
                </div>
                <Link :href="route('common.setting.create')" v-if="!commonsettings">
                    <Button class="gap-2 shadow-sm">
                        <Plus class="w-4 h-4" />
                        Create Settings
                    </Button>
                </Link>
                <div v-else class="flex gap-2">
                    <Link :href="route('common.setting.edit', { commonsetting: commonsettings.id })">
                        <Button variant="outline" class="gap-2">
                            <Pencil class="w-4 h-4" />
                            Edit
                        </Button>
                    </Link>
                    <Button variant="destructive" class="gap-2" @click="deleteSetting(commonsettings.id)">
                        <Trash2 class="w-4 h-4" />
                        Delete
                    </Button>
                </div>
            </div>

            <Separator />

            <!-- Empty State -->
            <div v-if="!commonsettings" class="flex flex-col items-center justify-center py-12 text-center space-y-4">
                <div class="bg-muted p-4 rounded-full">
                    <Building2 class="w-12 h-12 text-muted-foreground" />
                </div>
                <h3 class="text-lg font-semibold">No Settings Found</h3>
                <p class="text-muted-foreground max-w-sm">
                    You haven't configured the common settings yet. Create one to get started.
                </p>
                <Link :href="route('common.setting.create')">
                    <Button>Create Settings</Button>
                </Link>
            </div>

            <!-- Content Grid -->
            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                <!-- General Information -->
                <Card class="md:col-span-2 lg:col-span-2 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <CardHeader>
                        <CardTitle class="flex items-center gap-2">
                            <Building2 class="w-5 h-5 text-primary" />
                            General Information
                        </CardTitle>
                        <CardDescription>Basic details about your project/company</CardDescription>
                    </CardHeader>
                    <CardContent class="space-y-6">
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div class="space-y-1">
                                <label class="text-sm font-medium text-muted-foreground">Project Name</label>
                                <p class="text-lg font-semibold">{{ commonsettings.project_name }}</p>
                            </div>
                            <div class="space-y-1">
                                <label class="text-sm font-medium text-muted-foreground">Slogan</label>
                                <p class="text-base italic text-foreground/80">"{{ commonsettings.slogan }}"</p>
                            </div>
                            <div class="space-y-1">
                                <label class="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                    <Calendar class="w-4 h-4" /> Established
                                </label>
                                <p class="text-base">{{ commonsettings.est }}</p>
                            </div>
                            <div class="space-y-1">
                                <label class="text-sm font-medium text-muted-foreground">Copyright Text</label>
                                <p class="text-base">{{ commonsettings.copyright }}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <!-- Contact Details -->
                <Card class="shadow-sm hover:shadow-md transition-shadow duration-300">
                    <CardHeader>
                        <CardTitle class="flex items-center gap-2">
                            <Phone class="w-5 h-5 text-primary" />
                            Contact Details
                        </CardTitle>
                        <CardDescription>How customers can reach you</CardDescription>
                    </CardHeader>
                    <CardContent class="space-y-4">
                        <div class="flex items-start gap-3">
                            <MapPin class="w-5 h-5 text-muted-foreground mt-0.5" />
                            <div>
                                <label class="text-xs font-medium text-muted-foreground block uppercase">Address</label>
                                <span class="text-sm">{{ commonsettings.address }}</span>
                            </div>
                        </div>
                        <Separator />
                        <div class="flex items-center gap-3">
                            <Mail class="w-5 h-5 text-muted-foreground" />
                            <div>
                                <label class="text-xs font-medium text-muted-foreground block uppercase">Email</label>
                                <a :href="`mailto:${commonsettings.email}`" class="text-sm hover:underline text-primary">{{ commonsettings.email }}</a>
                            </div>
                        </div>
                        <Separator />
                        <div class="flex items-center gap-3">
                            <Phone class="w-5 h-5 text-muted-foreground" />
                            <div>
                                <label class="text-xs font-medium text-muted-foreground block uppercase">Phone</label>
                                <a :href="`tel:${commonsettings.phone}`" class="text-sm hover:underline text-primary">{{ commonsettings.phone }}</a>
                            </div>
                        </div>
                        <Separator />
                        <div class="flex items-center gap-3">
                            <MessageCircle class="w-5 h-5 text-green-600" />
                            <div>
                                <label class="text-xs font-medium text-muted-foreground block uppercase">WhatsApp</label>
                                <a :href="`https://wa.me/${commonsettings.whatsapp}`" target="_blank" class="text-sm hover:underline text-primary">{{ commonsettings.whatsapp }}</a>
                            </div>
                        </div>
                        <Separator />
                        <div class="flex items-center gap-3">
                            <Phone class="w-5 h-5 text-red-500" />
                            <div>
                                <label class="text-xs font-medium text-muted-foreground block uppercase">Hotline</label>
                                <a :href="`tel:${commonsettings.hotline}`" class="text-sm hover:underline text-primary">{{ commonsettings.hotline }}</a>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <!-- Brand Assets -->
                <Card class="md:col-span-2 lg:col-span-3 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <CardHeader>
                        <CardTitle class="flex items-center gap-2">
                            <ImageIcon class="w-5 h-5 text-primary" />
                            Brand Assets
                        </CardTitle>
                        <CardDescription>Logos and banner images used across the site</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div class="flex flex-col items-center gap-3 p-4 border rounded-lg bg-card/50 hover:bg-card transition-colors">
                                <span class="text-sm font-medium text-muted-foreground">Primary Logo</span>
                                <div class="h-24 w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900/50 rounded-md overflow-hidden">
                                    <img :src="getImageUrl(commonsettings.logo_1)" alt="Logo 1" class="max-h-full max-w-full object-contain" />
                                </div>
                            </div>
                            <div class="flex flex-col items-center gap-3 p-4 border rounded-lg bg-card/50 hover:bg-card transition-colors">
                                <span class="text-sm font-medium text-muted-foreground">Secondary Logo</span>
                                <div class="h-24 w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900/50 rounded-md overflow-hidden">
                                    <img :src="getImageUrl(commonsettings.logo_2)" alt="Logo 2" class="max-h-full max-w-full object-contain" />
                                </div>
                            </div>
                            <div class="flex flex-col items-center gap-3 p-4 border rounded-lg bg-card/50 hover:bg-card transition-colors">
                                <span class="text-sm font-medium text-muted-foreground">Developer Logo</span>
                                <div class="h-24 w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900/50 rounded-md overflow-hidden">
                                    <img :src="getImageUrl(commonsettings.developer_logo)" alt="Developer Logo" class="max-h-full max-w-full object-contain" />
                                </div>
                            </div>
                            <div class="flex flex-col items-center gap-3 p-4 border rounded-lg bg-card/50 hover:bg-card transition-colors">
                                <span class="text-sm font-medium text-muted-foreground">Banner Image</span>
                                <div class="h-24 w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900/50 rounded-md overflow-hidden group relative">
                                    <img :src="getImageUrl(commonsettings.banner_image)" alt="Banner" class="max-h-full max-w-full object-cover" />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <!-- Integrations -->
                <Card class="md:col-span-2 lg:col-span-3 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <CardHeader>
                        <CardTitle class="flex items-center gap-2">
                            <Code class="w-5 h-5 text-primary" />
                            Integrations & Scripts
                        </CardTitle>
                        <CardDescription>External scripts and tracking codes</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div class="space-y-2">
                            <label class="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <Facebook class="w-4 h-4 text-blue-600" /> Facebook Pixel
                            </label>
                            <div class="relative rounded-md bg-muted p-4 font-mono text-xs overflow-x-auto max-h-32">
                                {{ commonsettings.facebook_pixel || 'Not configured' }}
                            </div>
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    </AppLayout>
</template>
