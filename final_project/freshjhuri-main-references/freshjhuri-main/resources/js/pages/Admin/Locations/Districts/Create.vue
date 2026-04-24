<script setup>
import { Head, Link, useForm } from '@inertiajs/vue3';
import { ArrowLeft } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/AppLayout.vue';

const props = defineProps({
    divisions: Array,
});

const form = useForm({
    division_id: '',
    name: '',
    bn_name: '',
});

const breadcrumbs = [
    { title: "Dashboard", href: route('dashboard') },
    { title: "Districts", href: route('admin.districts.index') },
    { title: "Create", href: route('admin.districts.create') },
];

const submit = () => {
    form.post(route('admin.districts.store'));
};
</script>

<template>
    <Head title="Create District" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="lg:w-full mx-auto p-4 sm:p-2 lg:p-8">
            <div class="mb-4">
                <Button variant="ghost" as-child>
                    <Link :href="route('admin.districts.index')" class="flex items-center">
                        <ArrowLeft class="mr-2 h-4 w-4" /> Back to List
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle class="text-xl font-bold">Create District</CardTitle>
                </CardHeader>
                <CardContent>
                    <form @submit.prevent="submit" class="space-y-6">
                        <div class="space-y-2">
                            <Label for="division_id">Division <span class="text-red-500">*</span></Label>
                            <select
                                id="division_id"
                                v-model="form.division_id"
                                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                required
                            >
                                <option value="" disabled>Select a division</option>
                                <option v-for="division in divisions" :key="division.id" :value="division.id">
                                    {{ division.name }}
                                </option>
                            </select>
                            <div v-if="form.errors.division_id" class="text-red-600 text-sm mt-1">{{ form.errors.division_id }}</div>
                        </div>

                        <div class="space-y-2">
                            <Label for="name">Name <span class="text-red-500">*</span></Label>
                            <Input
                                id="name"
                                v-model="form.name"
                                type="text"
                                placeholder="Enter district name"
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
                                placeholder="Enter district name in Bangla"
                            />
                            <div v-if="form.errors.bn_name" class="text-red-600 text-sm mt-1">{{ form.errors.bn_name }}</div>
                        </div>

                        <div class="flex items-center justify-end space-x-4">
                            <Button variant="outline" as-child>
                                <Link :href="route('admin.districts.index')">Cancel</Link>
                            </Button>
                            <Button type="submit" :disabled="form.processing">
                                Create District
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    </AppLayout>
</template>
