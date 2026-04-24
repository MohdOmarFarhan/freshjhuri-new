<script setup>
import { Head, useForm, Link } from "@inertiajs/vue3";
import AppLayout from "@/layouts/AppLayout.vue";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save } from "lucide-vue-next";

const props = defineProps({
    marquee: Object
});

const form = useForm({
    text_en: props.marquee.text_en,
    text_bn: props.marquee.text_bn,
    icon: props.marquee.icon,
    color: props.marquee.color,
    bg_color: props.marquee.bg_color,
    sort_order: props.marquee.sort_order,
});

const breadcrumbs = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Brand Marquees", href: "/brand-marquees" },
    { title: "Edit", href: "#" },
];

const submit = () => {
    form.put(route("brand-marquees.update", props.marquee.id));
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
                                <Label for="icon">Icon Name (Lucide)</Label>
                                <Input id="icon" v-model="form.icon" />
                            </div>
                            <div class="space-y-2">
                                <Label for="color">Text Color Class</Label>
                                <Input id="color" v-model="form.color" />
                            </div>
                            <div class="space-y-2">
                                <Label for="bg_color">BG Color Class</Label>
                                <Input id="bg_color" v-model="form.bg_color" />
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
