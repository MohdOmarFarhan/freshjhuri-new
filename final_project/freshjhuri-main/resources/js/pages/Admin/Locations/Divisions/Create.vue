<script setup>
import { Head, Link, useForm } from '@inertiajs/vue3';
import { ArrowLeft } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/AppLayout.vue';

const form = useForm({
    name: '',
    bn_name: '',
});

const breadcrumbs = [
    { title: "Dashboard", href: route('dashboard') },
    { title: "Divisions", href: route('admin.divisions.index') },
    { title: "Create", href: route('admin.divisions.create') },
];

const submit = () => {
    form.post(route('admin.divisions.store'));
};
</script>

<template>
    <Head title="Create Division" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="lg:w-full mx-auto p-4 sm:p-2 lg:p-8">
            <div class="mb-4">
                <Button variant="ghost" as-child>
                    <Link :href="route('admin.divisions.index')" class="flex items-center">
                        <ArrowLeft class="mr-2 h-4 w-4" /> Back to List
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle class="text-xl font-bold">Create Division</CardTitle>
                </CardHeader>
                <CardContent>
                    <form @submit.prevent="submit" class="space-y-6">
                        <div class="space-y-2">
                            <Label for="name">Name <span class="text-red-500">*</span></Label>
                            <Input
                                id="name"
                                v-model="form.name"
                                type="text"
                                placeholder="Enter division name"
                                required
                            />
                            <div v-if="form.errors.name" class="text-red-600 text-sm mt-1">{{ form.errors.name }}</div>
                        </div>

                        <div class="space-y-2">
                            <Label for="bn_name">Bangla Name (Optional)</Label>
                            <Input
                                id="bn_name"
                                v-model="form.bn_name"
                                type="text"
                                placeholder="Enter division name in Bangla"
                            />
                            <div v-if="form.errors.bn_name" class="text-red-600 text-sm mt-1">{{ form.errors.bn_name }}</div>
                        </div>

                        <div class="flex items-center justify-end space-x-4">
                            <Button variant="outline" as-child>
                                <Link :href="route('admin.divisions.index')">Cancel</Link>
                            </Button>
                            <Button type="submit" :disabled="form.processing">
                                Create Division
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    </AppLayout>
</template>
