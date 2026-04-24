<script setup lang="ts">
import { Head, Link, useForm } from "@inertiajs/vue3";
import { route } from "ziggy-js";
import AppLayout from "@/layouts/AppLayout.vue";

// Props
const props = defineProps<{
    role: {
        id: number;
        name: string;
    };
    permissions: string[];
    rolePermissions: string[];
}>();

// Form initialization
const form = useForm({
    name: props.role.name || '',
    permissions: props.rolePermissions || [],
});

// Submit handler
const submit = () => {
    form.put(route('roles.update', { role: props.role.id }), {
        preserveScroll: true,
    });
};
</script>

<template>
    <AppLayout>
        <Head :title="`Edit Role - ${form.name}`" />

        <!-- Breadcrumb -->
        <nav class="bg-gray-100 dark:bg-gray-900 px-4 py-3 rounded-md shadow mb-6">
            <ol class="flex items-center space-x-2">
                <li>
                    <Link :href="route('roles.index')" class="text-accent-primary hover:underline">Roles</Link>
                </li>
                <li><span class="text-accent-primary">/</span></li>
                <li><span class="text-accent-secondary font-semibold">Edit</span></li>
            </ol>
        </nav>

        <!-- Form -->
        <div class="max-w-6xl mx-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-8 mt-8">
            <form @submit.prevent="submit" class="space-y-8">
                <!-- Role Name -->
                <div>
                    <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Role Name</label>
                    <input
                        id="name"
                        v-model="form.name"
                        type="text"
                        class="w-full bg-gray-50 dark:bg-dark-primary border border-gray-300 dark:border-gray-600 text-sm rounded-lg focus:ring-accent-primary focus:border-accent-primary block p-3"
                        placeholder="Enter Role Name"
                        :class="{ 'border-red-500': form.errors.name }"
                    />
                    <p v-if="form.errors.name" class="text-red-500 text-sm mt-1">{{ form.errors.name }}</p>
                </div>

                <!-- Permissions -->
                <div>
                    <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Permissions</label>
                    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <div
                            v-for="permission in props.permissions"
                            :key="permission"
                            class="flex items-center"
                        >
                            <input
                                type="checkbox"
                                :id="`permission-${permission}`"
                                :value="permission"
                                v-model="form.permissions"
                                class="w-4 h-4 text-accent-primary bg-gray-100 border-gray-300 rounded focus:ring-accent-primary dark:focus:ring-accent-primary dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            />
                            <label
                                :for="`permission-${permission}`"
                                class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                            >
                                {{ permission }}
                            </label>
                        </div>
                    </div>
                    <p v-if="form.errors.permissions" class="text-red-500 text-sm mt-1">{{ form.errors.permissions }}</p>
                </div>

                <!-- Action Buttons -->
                <div class="flex justify-between mt-6">
                    <Button class="bg-accent text-white p-2 rounded" variant="outline" as-child>
                        <Link :href="route('roles.index')">
                            Cancel
                        </Link>
                    </Button>
                    <Button class="bg-primary text-white p-2 rounded" type="submit" :disabled="form.processing">
                        {{ form.processing ? 'Updating...' : 'Update Role' }}
                    </Button>
                </div>
            </form>
        </div>
    </AppLayout>
</template>
