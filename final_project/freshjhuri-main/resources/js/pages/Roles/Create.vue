<script setup lang="ts">
import { Head, Link, useForm } from "@inertiajs/vue3";
import { route } from "ziggy-js";
import AppLayout from '@/layouts/AppLayout.vue';

const form = useForm({
    name: '',
    permissions: [] 
});

defineProps({
    errors: Object,
    permissions: Array
});

const submit = () => {
    form.post(route('roles.store'));
};
</script>

<template>
 <AppLayout>
        <nav class="bg-gray-100 dark:bg-gray-900 px-4 py-3 rounded-md shadow mb-6">
            <ol class="flex items-center space-x-2">
                <li>
                    <span class="text-accent-primary">Roles</span>
                </li>
                <li>
                    <Link :href="route('roles.index')" class="text-accent-primary hover:underline">/Index</Link>
                </li>
                <li>
                    <span class="text-accent-primary">/</span>
                </li>
                <li>
                    <span class="text-accent-secondary font-semibold hover:underline">Create</span>
                </li>
            </ol>
        </nav>

        <Head title="roles-create" />
        <div class="mt-8 max-w-6xl mx-auto bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700 p-8">
            <form @submit.prevent="submit" class="space-y-8">
                <div class="grid grid-cols-1 gap-6">
                    <!-- Name -->
                    <div>
                        <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                        <input id="name" v-model="form.name"
                            class="w-full bg-gray-50 dark:bg-dark-primary border border-gray-300 text-sm rounded-lg focus:ring-accent-primary focus:border-accent-primary block p-3"
                            placeholder="Enter Role Name" />
                        <div class="text-red-400 text-sm mt-1" v-if="errors?.name">{{ errors.name }}</div>
                    </div>

                    <!-- Permissions -->
                    <div>
                        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Permissions</label>
                     
                        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            <div v-for="permission in permissions"  class="flex items-center">
                                <input 
                                    type="checkbox" 
                                    :value="permission" 
                                    v-model="form.permissions"
                                    class="w-4 h-4 text-accent-primary bg-gray-100 border-gray-300 rounded focus:ring-accent-primary dark:focus:ring-accent-primary dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                />
                                <label  class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                    {{ permission }}
                                </label>
                            </div>
                        </div>
                        <div class="text-red-400 text-sm mt-1" v-if="errors?.permissions">{{ errors.permissions }}</div>
                    </div>
                </div>

                <!-- Submit Button -->
                <div class="flex justify-center mt-6">
                    <Button class="bg-primary text-white p-2 rounded" type="submit" :disabled="form.processing">
                        {{ form.processing ? 'Creating...' : 'Create Role' }}
                    </Button>
                </div>
            </form>
        </div>
    </AppLayout>
</template>