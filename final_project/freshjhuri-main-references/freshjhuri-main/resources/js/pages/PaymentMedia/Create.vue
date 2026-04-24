<script setup>
import { Head, Link, useForm } from "@inertiajs/vue3";
import { ref } from "vue";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from "@/layouts/AppLayout.vue";

const breadcrumbs = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Payment Media", href: "/payment-medias" },
    { title: "Create", href: "/payment-media/create" },
];

const form = useForm({
    name: '',
    pay_number: '',
    icon: null,
});

const imagePreview = ref(null);

const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
        form.icon = file;
        imagePreview.value = URL.createObjectURL(file);
    }
};

const submit = () => {
    form.post(route('payment.media.store'), {
        preserveScroll: true,
        onSuccess: () => {
            form.reset();
            imagePreview.value = null;
        }
    });
};
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head title="Create Payment Media" />

        <div class="lg:w-full mx-auto p-4 sm:p-2 lg:p-8">
            <Card class="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle class="text-xl font-bold">Create Payment Media</CardTitle>
                </CardHeader>
                <CardContent>
                    <form @submit.prevent="submit" class="space-y-6">
                        <!-- Name -->
                        <div class="space-y-2">
                            <Label for="name">Name</Label>
                            <Input 
                                id="name" 
                                v-model="form.name" 
                                placeholder="Enter payment media name"
                                :class="{ 'border-red-500': form.errors.name }"
                            />
                            <p v-if="form.errors.name" class="text-sm text-red-500">{{ form.errors.name }}</p>
                        </div>

                        <!-- Pay Number -->
                        <div class="space-y-2">
                            <Label for="pay_number">Pay Number</Label>
                            <Input 
                                id="pay_number" 
                                v-model="form.pay_number" 
                                placeholder="Enter pay number"
                                :class="{ 'border-red-500': form.errors.pay_number }"
                            />
                            <p v-if="form.errors.pay_number" class="text-sm text-red-500">{{ form.errors.pay_number }}</p>
                        </div>

                        <!-- Icon -->
                        <div class="space-y-2">
                            <Label for="icon">Icon</Label>
                            <div class="flex items-center gap-4">
                                <div v-if="imagePreview" class="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                                    <img :src="imagePreview" alt="Preview" class="w-full h-full object-cover" />
                                </div>
                                <Input 
                                    id="icon" 
                                    type="file" 
                                    accept="image/*"
                                    @change="handleImageChange"
                                    class="cursor-pointer"
                                    :class="{ 'border-red-500': form.errors.icon }"
                                />
                            </div>
                            <p v-if="form.errors.icon" class="text-sm text-red-500">{{ form.errors.icon }}</p>
                        </div>

                        <!-- Actions -->
                        <div class="flex justify-end gap-4 pt-4">
                            <Button variant="outline" type="button" as-child>
                                <Link :href="route('payment.medias')">Cancel</Link>
                            </Button>
                            <Button type="submit" :disabled="form.processing">
                                {{ form.processing ? 'Creating...' : 'Create Payment Media' }}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    </AppLayout>
</template>
