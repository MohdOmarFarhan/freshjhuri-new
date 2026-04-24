<script setup>
import { Head, Link, useForm } from '@inertiajs/vue3';
import { ArrowLeft } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/AppLayout.vue';

const props = defineProps({
    districts: Array,
});

const form = useForm({
    district_id: '',
    name: '',
    bn_name: '',
});

const breadcrumbs = [
    { title: "Dashboard", href: route('dashboard') },
    { title: "Thanas", href: route('admin.thanas.index') },
    { title: "Create", href: route('admin.thanas.create') },
];

const submit = () => {
    form.post(route('admin.thanas.store'));
};
</script>

<template>
    <Head title="Create Thana" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="lg:w-full mx-auto p-4 sm:p-2 lg:p-8">
            <div class="mb-4">
                <Button variant="ghost" as-child>
                    <Link :href="route('admin.thanas.index')" class="flex items-center">
                        <ArrowLeft class="mr-2 h-4 w-4" /> Back to List
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle class="text-xl font-bold">Create Thana</CardTitle>
                </CardHeader>
                <CardContent>
                    <form @submit.prevent="submit" class="space-y-6">
                        <div class="space-y-2">
                            <Label for="district_id">District <span class="text-red-500">*</span></Label>
                            <select
                                id="district_id"
                                v-model="form.district_id"
                                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                required
                            >
                                <option value="" disabled>Select a district</option>
                                <option v-for="district in districts" :key="district.id" :value="district.id">
                                    {{ district.name }} ({{ district.division?.name }})
                                </option>
                            </select>
                            <div v-if="form.errors.district_id" class="text-red-600 text-sm mt-1">{{ form.errors.district_id }}</div>
                        </div>

                        <div class="space-y-2">
                            <Label for="name">Name <span class="text-red-500">*</span></Label>
                            <Input
                                id="name"
                                v-model="form.name"
                                type="text"
                                placeholder="Enter thana name"
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
                                placeholder="Enter thana name in Bangla"
                            />
                            <div v-if="form.errors.bn_name" class="text-red-600 text-sm mt-1">{{ form.errors.bn_name }}</div>
                        </div>

                        <div class="flex items-center justify-end space-x-4">
                            <Button variant="outline" as-child>
                                <Link :href="route('admin.thanas.index')">Cancel</Link>
                            </Button>
                            <Button type="submit" :disabled="form.processing">
                                Create Thana
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    </AppLayout>
</template>
