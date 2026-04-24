<script setup>
import { Head, useForm, Link } from "@inertiajs/vue3";
import AppLayout from "@/layouts/AppLayout.vue";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save } from "lucide-vue-next";
import { Checkbox } from '@/components/ui/checkbox';

const props = defineProps({
    categories: Array
});

const form = useForm({
    title_en: "",
    title_bn: "",
    subtitle_en: "",
    subtitle_bn: "",
    type: "featured",
    category_id: null,
    theme_color: "#f59e0b",
    sort_order: 0,
    status: false,
});

const breadcrumbs = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Homepage Sections", href: "/homepage-sections" },
    { title: "Create", href: "#" },
];

const submit = () => {
    form.transform((data) => ({
        ...data,
        status: data.status ? 1 : 0,
    })).post(route("homepage-sections.store"));
};
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head title="Create Homepage Section" />

        <div class="max-w-4xl mx-auto p-4 sm:p-2 lg:p-8">
            <Card>
                <CardHeader class="flex flex-row items-center justify-between">
                    <CardTitle class="text-xl font-bold">Create Homepage Section</CardTitle>
                    <Button variant="outline" as-child>
                        <Link :href="route('homepage-sections.index')">
                            <ArrowLeft class="mr-2 h-4 w-4" /> Back
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    <form @submit.prevent="submit" class="space-y-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="space-y-2">
                                <Label for="title_en">Title (EN)</Label>
                                <Input id="title_en" v-model="form.title_en" required />
                            </div>
                            <div class="space-y-2">
                                <Label for="title_bn">Title (BN)</Label>
                                <Input id="title_bn" v-model="form.title_bn" required />
                            </div>
                            <div class="space-y-2">
                                <Label for="subtitle_en">Subtitle (EN)</Label>
                                <Input id="subtitle_en" v-model="form.subtitle_en" />
                            </div>
                            <div class="space-y-2">
                                <Label for="subtitle_bn">Subtitle (BN)</Label>
                                <Input id="subtitle_bn" v-model="form.subtitle_bn" />
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="space-y-2">
                                <Label for="type">Section Type</Label>
                                <select id="type" v-model="form.type" class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                                    <option value="featured">Featured Products</option>
                                    <option value="best-selling">Top Selling Products</option>
                                    <option value="new-arrival">New Arrivals</option>
                                    <option value="combo">Combo Products</option>
                                    <option value="category">Specific Category</option>
                                </select>
                            </div>
                            
                            <div class="space-y-2" v-if="form.type === 'category'">
                                <Label for="category_id">Select Category</Label>
                                <select id="category_id" v-model="form.category_id" class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                                    <option value="" disabled>Select a category</option>
                                    <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name_en }} ({{ cat.name_bn }})</option>
                                </select>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div class="space-y-2">
                                <Label for="theme_color">Theme Color</Label>
                                <div class="flex items-center gap-2">
                                    <input type="color" id="theme_color" v-model="form.theme_color" class="h-10 w-10 p-1 rounded-md border bg-white" />
                                    <span class="text-sm text-gray-500">{{ form.theme_color }}</span>
                                </div>
                            </div>
                            <div class="space-y-2">
                                <Label for="sort_order">Sort Order</Label>
                                <Input id="sort_order" type="number" v-model="form.sort_order" />
                            </div>
                            <div class="space-y-2 flex items-end pb-2">
                                <div class="flex items-center space-x-2">
                                    <input type="checkbox" id="status" v-model="form.status" class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                                    <Label for="status">Active</Label>
                                </div>
                            </div>
                        </div>

                        <div class="flex justify-end">
                            <Button type="submit" :disabled="form.processing">
                                <Save class="mr-2 h-4 w-4" /> Save Section
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    </AppLayout>
</template>
