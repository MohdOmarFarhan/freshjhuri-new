<script setup lang="ts">
import { Head, Link, useForm } from "@inertiajs/vue3";
import { route } from "ziggy-js";
import Button from "@/components/ui/button/Button.vue";
import AppLayout from '@/layouts/AppLayout.vue';
import type { User } from '@/types';

const props = defineProps<{
    user: User;
    roles: string[];
    usrRoles: string[];
}>();

const form = useForm({
    name: props.user.name || "",
    email: props.user.email || "",
    phone: props.user.phone || "",
    status: props.user.status || 'active',
    roles: props.usrRoles || [],
});

const submit = () => {
    form.put(route('users.update', { user: props.user.id }), {
        preserveScroll: true,
    });
};
</script>

<template>
 <AppLayout>
        <nav class="bg-gray-100 dark:bg-gray-900 px-4 py-3 rounded-md shadow mb-6">
            <ol class="flex items-center space-x-1">
                <li>
                    <span class="text-accent-primary">User Edit</span>
                </li>
                <li>
                    <Link :href="route('users.index')" class="text-accent-primary hover:underline">/Index</Link>
                </li>
                <li>
                    <span class="text-accent-primary">/</span>
                </li>
                <li>
                    <span class="text-accent-secondary font-semibold hover:underline">Edit</span>
                </li>
            </ol>
        </nav>

        <Head title="user-edit"/>
        <div class="mt-8 w-full md:max-w-xl mx-auto bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700 p-8">
            <form @submit.prevent="submit" class="space-y-8">
                <div class="grid grid-cols-1 gap-6">
                    <!-- Name -->
                    <div>
                        <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                        <input id="name" v-model="form.name"
                            class="w-full bg-gray-50 dark:bg-dark-primary border border-gray-300 text-sm rounded-lg focus:ring-accent-primary focus:border-accent-primary block p-3
                              dark:text-background"
                        />  
                    </div>
                    
                    <!-- Email -->
                    <div>
                        <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                        <input id="email" v-model="form.email"
                            class="w-full bg-gray-50 dark:bg-dark-primary border border-gray-300 text-sm rounded-lg focus:ring-accent-primary focus:border-accent-primary 
                            block p-3 text-gray-900 dark:text-background"
                        />
                      
                    </div>
                    
                    <!-- Phone -->
                    <div>
                        <label for="phone" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone</label>
                        <input id="phone" v-model="form.phone"
                            class="w-full bg-gray-50 dark:bg-dark-primary border border-gray-300 text-sm rounded-lg focus:ring-accent-primary focus:border-accent-primary 
                            block p-3 text-gray-900 dark:text-background"
                        />
                    </div>

                    <!-- Status -->
                    <div>
                        <label for="status" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Status</label>
                        <select id="status" v-model="form.status"
                            class="w-full bg-gray-50 dark:bg-dark-primary border border-gray-300 text-sm rounded-lg focus:ring-accent-primary focus:border-accent-primary block p-3
                             text-gray-900 dark:text-background"
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                    
                   
                     <div>
                        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Roles</label>
                        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            <div v-for="role in roles"  class="flex items-center">
                                <input 
                                    type="checkbox" 
                                    :value="role" 
                                    v-model="form.roles"
                                    class="w-4 h-4 text-accent-primary bg-gray-100 border-gray-300 rounded focus:ring-accent-primary dark:focus:ring-accent-primary dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                />
                                <label  class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                    {{ role }}
                                </label>
                            </div>
                        </div> 
                    
                    </div>

                </div>

                <div class="flex justify-between mt-6">
                    <Button class="bg-accent text-white p-2 rounded" variant="outline" as-child>
                        <Link :href="route('users.index')">
                            Cancel
                        </Link>
                    </Button>
                    <Button class="bg-primary text-white p-2 rounded" type="submit" :disabled="form.processing">
                        {{ form.processing ? 'Updating...' : 'Update User' }}
                    </Button>
                </div>
            </form>
        </div>
</AppLayout>
</template>

 