<script setup>
import { Head, Link, router } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { ref } from 'vue';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash } from 'lucide-vue-next';
import Vue3EasyDataTable from "vue3-easy-data-table";
import "vue3-easy-data-table/dist/style.css";
import Swal from 'sweetalert2';

const props = defineProps({
    districts: Array,
});

const searchValue = ref("");
const sortBy = ref("id");
const sortType = ref("asc");

const headers = [
    { text: "ID", value: "id", sortable: true },
    { text: "Division", value: "division.name", sortable: true },
    { text: "Name", value: "name", sortable: true },
    { text: "BN Name", value: "bn_name", sortable: true },
    { text: "Actions", value: "action", sortable: false },
];

const breadcrumbs = [
    { title: "Dashboard", href: route('dashboard') },
    { title: "Districts", href: route('admin.districts.index') },
];

const deleteDistrict = (id) => {
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            router.delete(route('admin.districts.destroy', id), {
                onSuccess: () => {
                    Swal.fire("Deleted!", "District has been deleted.", "success");
                }
            });
        }
    });
};
</script>

<template>
    <Head title="Districts" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="lg:w-full mx-auto p-4 sm:p-2 lg:p-8">
            <Card>
                <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle class="text-xl font-bold">Districts</CardTitle>
                    <Button as-child>
                        <Link :href="route('admin.districts.create')">
                            <Plus class="mr-2 h-4 w-4" /> Create District
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    <!-- Success Message -->
                    <div v-if="$page.props.flash?.success" class="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded dark:bg-green-900/30 dark:border-green-800 dark:text-green-400">
                        {{ $page.props.flash.success }}
                    </div>

                    <div class="mb-4 flex justify-end">
                        <div class="relative max-w-sm w-full">
                            <input
                                v-model="searchValue"
                                type="text"
                                placeholder="Search districts..."
                                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <Vue3EasyDataTable
                        :headers="headers"
                        :items="districts"
                        v-model:search-value="searchValue"
                        v-model:sort-by="sortBy"
                        v-model:sort-type="sortType"
                        table-class-name="customize-table"
                        alternating
                        buttons-pagination
                        border-cell
                    >
                        <template #item-action="item">
                            <div class="flex space-x-2 justify-end">
                                <Link
                                    :href="route('admin.districts.edit', item.id)"
                                    class="text-indigo-600 hover:text-indigo-900 hover:underline"
                                    title="Edit"
                                >
                                    <Pencil class="w-4 h-4" />
                                </Link>
                                <button
                                    @click="deleteDistrict(item.id)"
                                    class="text-red-600 hover:text-red-900 hover:underline"
                                    title="Delete"
                                >
                                    <Trash class="w-4 h-4" />
                                </button>
                            </div>
                        </template>
                    </Vue3EasyDataTable>
                </CardContent>
            </Card>
        </div>
    </AppLayout>
</template>
