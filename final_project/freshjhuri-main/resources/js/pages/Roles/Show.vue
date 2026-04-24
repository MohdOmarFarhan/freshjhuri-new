<script setup lang="ts">
import { Head, Link } from "@inertiajs/vue3";
import { route } from "ziggy-js";
import AppLayout from "@/layouts/AppLayout.vue";

// Props
const props = defineProps<{
    role: {
        id: number;
        name: string;
    };
    rolePermissions: string[];
}>();
</script>

<template>
    <AppLayout>
        <Head :title="`Show Role - ${props.role.name}`" />

        <!-- Breadcrumb -->
        <nav class="bg-gray-100 dark:bg-gray-900 px-4 py-3 rounded-md shadow mb-6">
            <ol class="flex items-center space-x-2">
                <li>
                    <Link :href="route('roles.index')" class="text-accent-primary hover:underline">Roles</Link>
                </li>
                <li><span class="text-accent-primary">/</span></li>
                <li><span class="text-accent-secondary font-semibold">Show</span></li>
            </ol>
        </nav>

        <!-- Role Info -->
        <div class="max-w-6xl mx-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-8 mt-8 space-y-8">

            <!-- Role Name -->
            <div>
                <h2 class="text-sm font-medium text-gray-900 dark:text-white mb-2">Role Name</h2>
                <p class="p-3 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-dark-primary text-gray-800 dark:text-white">
                    {{ props.role.name }}
                </p>
            </div>

            <!-- Role Permissions -->
            <div>
                <h2 class="text-sm font-medium text-gray-900 dark:text-white mb-2">Permissions</h2>
                <ul class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 list-disc list-inside">
                    <li v-for="permission in props.rolePermissions" :key="permission" class="text-gray-700 dark:text-gray-300">
                        {{ permission }}
                    </li>
                </ul>
            </div>

            <!-- Back Button -->
            <div class="flex justify-end">
                <Link
                    :href="route('roles.index')"
                    class="px-6 py-3 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
                >
                    Back to Roles
                </Link>
            </div>
        </div>
    </AppLayout>
</template>
