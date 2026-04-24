<script setup>
import { Head, Link, useForm } from '@inertiajs/vue3';
import axios from 'axios';
import { ArrowLeft } from 'lucide-vue-next';
import { ref, watch, onMounted } from 'vue';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/AppLayout.vue';

const props = defineProps({
    shippingCost: Object,
    divisions: Array,
});

const form = useForm({
    division_id: props.shippingCost.division_id,
    district_id: props.shippingCost.district_id,
    thana_id: props.shippingCost.thana_id,
    cost: props.shippingCost.cost,
});

const districts = ref([]);
const thanas = ref([]);

const breadcrumbs = [
    { title: "Dashboard", href: route('dashboard') },
    { title: "Shipping Costs", href: route('admin.shipping.index') },
    { title: "Edit", href: route('admin.shipping.edit', props.shippingCost.id) },
];

const fetchDistricts = async (divisionId) => {
    if (divisionId) {
        try {
            const response = await axios.get(route('api.locations.districts', divisionId));
            districts.value = response.data;
        } catch (error) {
            console.error('Error fetching districts:', error);
        }
    } else {
        districts.value = [];
    }
};

const fetchThanas = async (districtId) => {
    if (districtId) {
        try {
            const response = await axios.get(route('api.locations.thanas', districtId));
            thanas.value = response.data;
        } catch (error) {
            console.error('Error fetching thanas:', error);
        }
    } else {
        thanas.value = [];
    }
};

onMounted(async () => {
    await fetchDistricts(props.shippingCost.division_id);
    await fetchThanas(props.shippingCost.district_id);
});

watch(() => form.division_id, async (newDivisionId) => {
    // Only reset if changed by user, not initial load
    if (newDivisionId !== props.shippingCost.division_id) {
        form.district_id = '';
        form.thana_id = '';
        thanas.value = [];
    }
    await fetchDistricts(newDivisionId);
});

watch(() => form.district_id, async (newDistrictId) => {
    // Only reset if changed by user, not initial load
    if (newDistrictId !== props.shippingCost.district_id) {
        form.thana_id = '';
    }
    await fetchThanas(newDistrictId);
});

const submit = () => {
    form.put(route('admin.shipping.update', props.shippingCost.id));
};
</script>

<template>
    <Head title="Edit Shipping Cost" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="lg:w-full mx-auto p-4 sm:p-2 lg:p-8">
            <div class="mb-4">
                <Button variant="ghost" as-child>
                    <Link :href="route('admin.shipping.index')" class="flex items-center">
                        <ArrowLeft class="mr-2 h-4 w-4" /> Back to List
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle class="text-xl font-bold">Edit Shipping Cost</CardTitle>
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
                                <option v-for="division in props.divisions" :key="division.id" :value="division.id">
                                    {{ division.name }}
                                </option>
                            </select>
                            <div v-if="form.errors.division_id" class="text-red-600 text-sm mt-1">{{ form.errors.division_id }}</div>
                        </div>

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
                                    {{ district.name }}
                                </option>
                            </select>
                            <div v-if="form.errors.district_id" class="text-red-600 text-sm mt-1">{{ form.errors.district_id }}</div>
                        </div>

                        <div class="space-y-2">
                            <Label for="thana_id">Thana <span class="text-red-500">*</span></Label>
                            <select
                                id="thana_id"
                                v-model="form.thana_id"
                                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                required
                            >
                                <option value="" disabled>Select a thana</option>
                                <option v-for="thana in thanas" :key="thana.id" :value="thana.id">
                                    {{ thana.name }}
                                </option>
                            </select>
                            <div v-if="form.errors.thana_id" class="text-red-600 text-sm mt-1">{{ form.errors.thana_id }}</div>
                        </div>

                        <div class="space-y-2">
                            <Label for="cost">Shipping Cost <span class="text-red-500">*</span></Label>
                            <Input
                                id="cost"
                                v-model="form.cost"
                                type="number"
                                placeholder="Enter shipping cost"
                                required
                            />
                            <div v-if="form.errors.cost" class="text-red-600 text-sm mt-1">{{ form.errors.cost }}</div>
                        </div>

                        <div class="flex items-center justify-end space-x-4">
                            <Button variant="outline" as-child>
                                <Link :href="route('admin.shipping.index')">Cancel</Link>
                            </Button>
                            <Button type="submit" :disabled="form.processing">
                                Update Shipping Cost
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    </AppLayout>
</template>
