<script setup lang="ts">
import { Head, Link, useForm } from "@inertiajs/vue3";
import { route } from "ziggy-js";
import AppLayout from '@/layouts/AppLayout.vue';

const form = useForm({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    roles: [],
});

defineProps({
    errors: Object,
    roles: Array,
});

const submit = () => {
    form.post(route("users.store"));
};
</script>

<template>
    <AppLayout>
        <!-- Breadcrumb -->
        <nav class="bg-gray-100 dark:bg-gray-900 px-4 py-3 rounded-md shadow mb-6">
            <ol class="flex items-center space-x-1">
                <li><span class="text-accent">Users</span></li>
                <li>
                    <Link :href="route('users.index')" class="text-accent hover:underline">
                        /Index
                    </Link>
                </li>
                <li><span class="text-accent">/</span></li>
                <li>
                    <span class="text-primary font-semibold hover:underline">Create</span>
                </li>
            </ol>
        </nav>

        <Head title="users-create" />

        <!-- Card -->
        <div class="mt-8 w-full md:max-w-xl mx-auto 
            bg-background text-foreground 
            border border-gray-300 dark:border-gray-700
            rounded-lg shadow-lg p-8">

            <form @submit.prevent="submit" class="space-y-8">
                <!-- Name -->
                <div>
                    <label class="block mb-2 text-sm font-medium">Name</label>
                    <input
                        v-model="form.name"
                        class="w-full bg-white dark:bg-accent
                        border border-gray-300 dark:border-gray-600
                        text-sm rounded-lg
                        focus:ring-primary focus:border-primary
                        p-3"
                        placeholder="Enter User Name"
                    />
                    <div class="text-red-400 text-sm mt-1" v-if="errors?.name">
                        {{ errors.name }}
                    </div>
                </div>

                <!-- Email -->
                <div>
                    <label class="block mb-2 text-sm font-medium">Email</label>
                    <input
                        v-model="form.email"
                        class="w-full bg-white dark:bg-accent
                        border border-gray-300 dark:border-gray-600
                        text-sm rounded-lg
                        focus:ring-primary focus:border-primary
                        p-3"
                        placeholder="Enter email"
                    />
                    <div class="text-red-400 text-sm mt-1" v-if="errors?.email">
                        {{ errors.email }}
                    </div>
                </div>

                <!-- Password -->
                <div>
                    <label class="block mb-2 text-sm font-medium">Password</label>
                    <input
                        type="password"
                        v-model="form.password"
                        class="w-full bg-white dark:bg-accent
                        border border-gray-300 dark:border-gray-600
                        text-sm rounded-lg
                        focus:ring-primary focus:border-primary
                        p-3"
                        placeholder="Enter password"
                    />
                    <div class="text-red-400 text-sm mt-1" v-if="errors?.password">
                        {{ errors.password }}
                    </div>
                </div>

                <!-- Password Confirmation -->
                <div>
                    <label class="block mb-2 text-sm font-medium">Confirm Password</label>
                    <input
                        type="password"
                        v-model="form.password_confirmation"
                        class="w-full bg-white dark:bg-accent
                        border border-gray-300 dark:border-gray-600
                        text-sm rounded-lg
                        focus:ring-primary focus:border-primary
                        p-3"
                        placeholder="Confirm password"
                    />
                    <div class="text-red-400 text-sm mt-1" v-if="errors?.password_confirmation">
                        {{ errors.password_confirmation }}
                    </div>
                </div>

                <!-- Roles -->
                <div>
                    <label class="block mb-2 text-sm font-medium">Roles</label>

                    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <div v-for="role in roles" class="flex items-center">
                            <input
                                type="checkbox"
                                :value="role"
                                v-model="form.roles"
                                class="w-4 h-4 text-primary rounded border-gray-300 dark:border-gray-600"
                            />
                            <label class="ml-2 text-sm">{{ role }}</label>
                        </div>
                    </div>

                    <div class="text-red-400 text-sm mt-1" v-if="errors?.roles">
                        {{ errors.roles }}
                    </div>
                </div>

                <!-- Button -->
                <div class="flex justify-end  mt-6">
                    <Button class="bg-primary text-white p-2 rounded" type="submit" :disabled="form.processing">
                        {{ form.processing ? 'Creating...' : 'Create User' }}
                    </Button>
                </div>
            </form>
        </div>
    </AppLayout>
</template>
