<script setup>
import { Link, router } from "@inertiajs/vue3";
import { Head } from "@inertiajs/vue3";
import { confirmDeletion } from "../../../js/helper/sweetAlertHelpers";
import AppLayout from "@/layouts/AppLayout.vue";
import Vue3EasyDataTable from "vue3-easy-data-table";
import "vue3-easy-data-table/dist/style.css";
import { Eye, SquarePen, Trash, RotateCcw } from 'lucide-vue-next';
import { computed, ref, watch } from "vue";
import { Button } from "@/components/ui/button";
import { can } from "@/lib/can";

const props = defineProps({
    users: Array,
    filters: Object,
});

const searchValue = ref("");
const sortBy = ref("");
const sortType = ref("asc");
const trashed = ref(props.filters?.trashed || '');

watch(trashed, (value) => {
    router.get(
        route("users.index"),
        { trashed: value },
        { preserveState: true, replace: true }
    );
});

const deleteUser = (id, isTrashed) => {
    if (isTrashed) {
        // Force Delete
        confirmDeletion(() => {
            router.delete(route("users.force-delete", id));
        });
    } else {
        // Soft Delete
        confirmDeletion(() => {
            router.delete(route("users.destroy", id));
        });
    }
};

const restoreUser = (id) => {
    router.put(route("users.restore", id));
};

const headers = [
    { text: "Name", value: "name", sortable: true },
    { text: "Email", value: "email", sortable: true },
    { text: "Phone", value: "phone", sortable: true },
    { text: "Roles", value: "roles", sortable: true },
    { text: "Status", value: "is_active", sortable: true },
    { text: "Actions", value: "action", sortable: false },
];

const formattedUsers = computed(() =>
    props.users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || 'N/A',
        roles: user.roles,
        is_active: user.deleted_at ? "Deleted" : (user.status === 'active' ? "Active" : "Inactive"),
        deleted_at: user.deleted_at,
    })),
);
</script>

<template>
    <AppLayout>
        <Head title="Users" />
        
        <div class="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <!-- Header -->
            <div class="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 class="text-2xl font-bold text-foreground">Users</h1>
                    <p class="text-sm text-muted-foreground">Manage all system users</p>
                </div>
                <Button v-if="can('USER_CREATE')" as-child>
                    <Link :href="route('users.create')">
                        Add New User
                    </Link>
                </Button>
            </div>

            <!-- Search and Table -->
            <div class="bg-white rounded-lg shadow">
                <div class="p-4 border-b flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div class="relative max-w-xs w-full">
                        <input
                            v-model="searchValue"
                            type="text"
                            placeholder="Search users..."
                            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>

                    <div class="w-full sm:w-[180px]">
                        <select
                            v-model="trashed"
                            class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="">Active Users</option>
                            <option value="with">All Users</option>
                            <option value="only">Trashed Users</option>
                        </select>
                    </div>
                </div>

                <Vue3EasyDataTable
                    :headers="headers"
                    :items="formattedUsers"
                    v-model:search-value="searchValue"
                    v-model:sort-by="sortBy"
                    v-model:sort-type="sortType"
                    table-class-name="customize-table"
                    alternating
                    buttons-pagination
                    border-cell
                >
                    <!-- Status -->
                    <template #item-is_active="{ is_active }">
                        <span
                            :class="{
                                'bg-green-100 text-green-800': is_active === 'Active',
                                'bg-red-100 text-red-800': is_active === 'Inactive',
                                'bg-gray-100 text-gray-800': is_active === 'Deleted'
                            }"
                            class="px-2 py-1 text-xs font-medium rounded-full"
                        >
                            {{ is_active }}
                        </span>
                    </template>

                    <!-- roles -->
                    <template #item-roles="item">
                        <div class="flex flex-wrap gap-2">
                            <span 
                                v-for="role in item.roles" 
                                :key="role.id"
                                class="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800"
                            >
                                {{ role.name }}
                            </span>
                            <span v-if="!item.roles || item.roles.length === 0" class="text-gray-500 text-xs">No Roles</span>
                        </div>
                    </template>

                    <!-- Action Buttons -->
                    <template #item-action="item">
                        <div class="flex space-x-2">
                            <template v-if="!item.deleted_at">
                                <Link
                                    :href="route('users.show', item.id)"
                                    class="text-indigo-600 hover:text-indigo-900 hover:underline"
                                    title="View User"
                                >
                                    <Eye class="w-4 h-4" />
                                </Link>
                            
                                <Link 
                                    :href="route('users.edit', item.id)"
                                    class="text-green-600 hover:text-green-900 hover:underline"
                                    title="Edit User"
                                >
                                <SquarePen class="w-4 h-4" />
                                </Link>
                            
                                <button
                                    @click="deleteUser(item.id, false)"
                                    class="text-red-600 hover:text-red-900 hover:underline"
                                    title="Delete User"
                                >
                                    <Trash class="w-4 h-4" />
                                </button>
                            </template>
                            <template v-else>
                                <button
                                    @click="restoreUser(item.id)"
                                    class="text-green-600 hover:text-green-900 hover:underline"
                                    title="Restore User"
                                >
                                    <RotateCcw class="w-4 h-4" />
                                </button>
                                <button
                                    @click="deleteUser(item.id, true)"
                                    class="text-red-600 hover:text-red-900 hover:underline"
                                    title="Delete Permanently"
                                >
                                    <Trash class="w-4 h-4" />
                                </button>
                            </template>
                        </div>
                    </template>
                </Vue3EasyDataTable>
            </div>
        </div>
    </AppLayout>
</template>

<style>

</style>