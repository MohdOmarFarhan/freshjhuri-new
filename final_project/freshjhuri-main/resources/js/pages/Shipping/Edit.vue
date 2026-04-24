<script setup>
import { Head, useForm, Link } from '@inertiajs/vue3';
import { Loader2, ArrowLeft } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from "@/layouts/AppLayout.vue";

const props = defineProps({
    thana: {
        type: Object,
        required: true
    }
});

const form = useForm({
    shipping_cost: props.thana.shipping_cost,
});

const breadcrumbs = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Shipping Management", href: route('admin.shipping.index') },
    { title: "Edit", href: "#" },
];

const submit = () => {
    form.put(route('admin.shipping.update', props.thana.id));
};
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head title="Edit Shipping Cost" />

        <div class="lg:w-1/2 mx-auto p-4 sm:p-2 lg:p-8">
            <Card>
                <CardHeader>
                    <div class="flex items-center gap-4">
                        <Button variant="outline" size="icon" as-child>
                            <Link :href="route('admin.shipping.index')">
                                <ArrowLeft class="h-4 w-4" />
                            </Link>
                        </Button>
                        <CardTitle>Edit Shipping Cost</CardTitle>
                    </div>
                </CardHeader>
                <CardContent class="space-y-4">
                    <div class="grid grid-cols-1 gap-4 p-4 border rounded-md crud-table-head">
                        <div>
                            <span class="font-medium text-gray-500">Division:</span>
                            <span class="ml-2 font-semibold">{{ thana.district?.division?.name }}</span>
                        </div>
                        <div>
                            <span class="font-medium text-gray-500">District:</span>
                            <span class="ml-2 font-semibold">{{ thana.district?.name }}</span>
                        </div>
                        <div>
                            <span class="font-medium text-gray-500">Thana:</span>
                            <span class="ml-2 font-semibold">{{ thana.name }}</span>
                        </div>
                    </div>

                    <div class="space-y-2">
                        <Label for="shipping_cost">Shipping Cost (BDT)</Label>
                        <Input 
                            id="shipping_cost" 
                            type="number" 
                            v-model="form.shipping_cost" 
                            min="0"
                            placeholder="Enter shipping cost" 
                        />
                        <span v-if="form.errors.shipping_cost" class="text-xs text-red-500">{{ form.errors.shipping_cost }}</span>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button class="w-full" :disabled="form.processing" @click="submit">
                        <Loader2 v-if="form.processing" class="w-4 h-4 mr-2 animate-spin" />
                        {{ form.processing ? 'Saving...' : 'Save Changes' }}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    </AppLayout>
</template>
