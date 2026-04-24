<script setup>
import { Link, router } from "@inertiajs/vue3";
import { Head } from "@inertiajs/vue3";
import { confirmDeletion } from "../../../js/helper/sweetAlertHelpers";
import AppLayout from "@/layouts/AppLayout.vue";
import Vue3EasyDataTable from "vue3-easy-data-table";
import "vue3-easy-data-table/dist/style.css";
import { Eye, SquarePen, Trash} from 'lucide-vue-next';
import { computed, ref } from "vue";
import { Button } from "@/components/ui/button";
import { can } from "@/lib/can";


const props = defineProps({
    roles: Array,
});

const searchValue = ref("");
const sortBy = ref("");
const sortType = ref("asc");

const deleteRole = (id) => {
    confirmDeletion(() => {
        router.delete(route("roles.destroy", id));  
    });
};

const headers = [
    { text: "#", value: "serial", width: 80 },
    { text: "Name", value: "name", sortable: true },
    { text: "Permissions", value: "permissions", sortable: true, width: 800 },
    { text: "Actions", value: "action", sortable: false, width: 180 },
];

const formattedRoles = computed(() =>
    props.roles.map((role, index) => ({
        serial: index + 1,
        name: role.name,
        permissions: role.permissions,
        id: role.id,
    })),
);
</script>

<template>
    <AppLayout>
        <Head title="Roles" />
        
        <div class="py-6 px-4 sm:px-6 lg:px-8">
            <!-- Header -->
            <div class="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 class="text-2xl font-bold text-foreground">Roles</h1>
                    <p class="text-sm text-muted-foreground">Manage all system roles</p>
                </div>
                <Button as-child>
                    <Link :href="route('roles.create')">
                        Add New Role
                    </Link>
                </Button>
            </div>

            <!-- Search and Table -->
            <div class="bg-white rounded-lg shadow">
                <div class="p-4 border-b">
                    <div class="relative max-w-xs">
                        <input
                            v-model="searchValue"
                            type="text"
                            placeholder="Search roles..."  
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
                    :items="formattedRoles"  
                    v-model:search-value="searchValue"
                    v-model:sort-by="sortBy"
                    v-model:sort-type="sortType"
                    table-class-name="customize-table"
                    alternating
                    buttons-pagination
                    border-cell
                >
                    <!-- Permissions -->
                    <template #item-permissions="{ permissions }">
                        <div class="flex flex-wrap gap-2">
                            <span 
                                v-for="permission in permissions" 
                                :key="permission.id"
                                class="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800"
                            >
                                {{ permission.name }}
                            </span>
                        </div>
                    </template>

                    <!-- Action Buttons -->
                    <template #item-action="{ id }">
                        <div class="flex space-x-2">
                
                            <Link 
                              
                                :href="route('roles.show', id)"
                                class="text-indigo-600 hover:text-indigo-900 hover:underline"
                            >
                                <Eye class="w-4" />
                            </Link>
                            <Link 
                              
                                :href="route('roles.edit', id)"
                                class="text-green-600 hover:text-green-900 hover:underline"
                            >
                               <SquarePen class="w-4" />
                            </Link>
                           
                            <button
                              
                                @click="deleteRole(id)"
                                class="text-red-600 hover:text-red-900 hover:underline"
                            >
                                <Trash class="w-4" />
                            </button>
                        </div>
                    </template>
                </Vue3EasyDataTable>
            </div>
        </div>
    </AppLayout>
</template>

<style>


</style>