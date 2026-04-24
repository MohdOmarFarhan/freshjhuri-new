<script setup>
import { Head } from "@inertiajs/vue3";
import Vue3EasyDataTable from "vue3-easy-data-table";
import AppLayout from "@/layouts/AppLayout.vue";
import "vue3-easy-data-table/dist/style.css";
import { computed, ref } from "vue";

const props = defineProps({
    permissions: Array,
});

const searchValue = ref("");
const sortBy = ref("");
const sortType = ref("asc");

const headers = [
 
    { text: "Permission Name", value: "name", sortable: true, width: 300 },
    { text: "Created At", value: "created_at", sortable: true },
];

const formattedPermissions = computed(() =>
    props.permissions.map((permission, index) => ({
        serial: index + 1,
        name: permission.name,
        created_at: new Date(permission.created_at).toLocaleDateString(),
    })),
);
</script>

<template>
    <AppLayout>
        <Head title="Permissions" />
        
        <div class="py-6 px-4 sm:px-6 lg:px-8">
            <!-- Header -->
            <div class="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 class="text-2xl font-bold text-gray-800">Permissions</h1>
                    <p class="text-sm text-gray-500">Manage system permissions</p>
                </div>
            </div>

            <!-- Search and Table -->
            <div class="bg-white max-w-5xl mx-auto rounded-lg shadow overflow-hidden">
                <div class="p-4 border-b flex justify-between items-center">
                    <div class="relative max-w-xs w-full">
                        <input
                            v-model="searchValue"
                            type="text"
                            placeholder="Search permissions..."  
                            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div class=" overflow-x-auto">
                    <Vue3EasyDataTable
                        :headers="headers"
                        :items="formattedPermissions"
                        v-model:search-value="searchValue"
                        v-model:sort-by="sortBy"
                        v-model:sort-type="sortType"
                        table-class-name="customize-table"
                        alternating
                        buttons-pagination
                        border-cell
                        :rows-per-page="10"
                        show-index
                        theme-color="#6366f1"
                    >
                        <template #item-name="{ name }">
                            <span class="font-medium text-gray-800">{{ name }}</span>
                        </template>
                    </Vue3EasyDataTable>
                </div>
            </div>
        </div>
    </AppLayout>
</template>

<style>
.customize-table {
    --easy-table-header-font-size: 0.875rem;
    --easy-table-header-height: 3rem;
    --easy-table-header-item-padding: 0 1rem;
    --easy-table-header-background-color: #f9fafb;
    --easy-table-header-font-color: #374151;
    --easy-table-header-border: 1px solid #e5e7eb;
    --easy-table-body-row-height: 3rem;
    --easy-table-body-row-font-size: 0.875rem;
    --easy-table-body-row-font-color: #374151;
    --easy-table-body-row-hover-background-color: #f3f4f6;
    --easy-table-body-item-padding: 0 1rem;
    --easy-table-body-border: 1px solid #e5e7eb;

    --easy-table-footer-height: 3rem;
    --easy-table-footer-font-size: 0.875rem;
    --easy-table-footer-font-color: #374151;
    --easy-table-footer-background-color: #f9fafb;
    --easy-table-footer-border: 1px solid #e5e7eb;

    --easy-table-rows-per-page-selector-width: 80px;
    --easy-table-rows-per-page-selector-option-padding: 5px;
    --easy-table-rows-per-page-selector-z-index: 1;

    min-width: 800px;
}

.customize-table .vue3-easy-data-table__main {
    border-radius: 0;
}

.customize-table .vue3-easy-data-table__header th {
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.025em;
    font-size: 0.75rem;
    color: #6b7280;
}

.customize-table .vue3-easy-data-table__body td {
    vertical-align: middle;
}

.customize-table .vue3-easy-data-table__footer {
    border-top: 1px solid #e5e7eb;
}

/* Pagination styles */
.customize-table .vue3-easy-data-table__rows-per-page-selector {
    border: 1px solid #e5e7eb;
    border-radius: 0.375rem;
    padding: 0.25rem 0.5rem;
}

.customize-table .vue3-easy-data-table__pagination-button {
    border: 1px solid #e5e7eb;
    border-radius: 0.375rem;
    padding: 0.25rem 0.5rem;
    margin: 0 0.25rem;
}

.customize-table .vue3-easy-data-table__pagination-button.active {
    background-color: #6366f1;
    color: white;
    border-color: #6366f1;
}
</style>