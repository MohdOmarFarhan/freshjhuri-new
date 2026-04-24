<script setup lang="ts">
import { Head, useForm, usePage } from '@inertiajs/vue3'; 
import { LoaderCircle, Eye, EyeOff, User, Mail, Lock, Phone } from 'lucide-vue-next';
import { ref, computed } from 'vue';

// Branding logic for mobile header (copied from Login.vue)
const page = usePage();
const commonSettings = computed<Record<string, any>>(() => page.props.commonsetting ?? page.props.common_settings ?? {});
const projectName = computed(() => commonSettings.value.project_name || 'Unique Agro Care');
const logoUrl = computed(() => {
    if (!commonSettings.value.logo_1) return null;
    if (commonSettings.value.logo_1.startsWith('http')) return commonSettings.value.logo_1;
    if (commonSettings.value.logo_1.startsWith('/')) return commonSettings.value.logo_1;
    if (commonSettings.value.logo_1.startsWith('storage/')) return `/${commonSettings.value.logo_1}`;
    return `/storage/${commonSettings.value.logo_1}`;
});
const bannerUrl = computed(() => {
    if (!commonSettings.value.banner_image) return null;
    if (commonSettings.value.banner_image.startsWith('http')) return commonSettings.value.banner_image;
    if (commonSettings.value.banner_image.startsWith('/')) return commonSettings.value.banner_image;
    if (commonSettings.value.banner_image.startsWith('storage/')) return `/${commonSettings.value.banner_image}`;
    return `/storage/${commonSettings.value.banner_image}`;
});
import { route } from 'ziggy-js';
import InputError from '@/components/InputError.vue';
import TextLink from '@/components/TextLink.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthSplitLayout from '@/layouts/auth/AuthSplitLayout.vue';

const form = useForm({
    name: '',
    phone: '',
    email: '',
    password: '',
    password_confirmation: '',
});

const showPassword = ref(false);
const showConfirmPassword = ref(false);

const togglePasswordVisibility = () => (showPassword.value = !showPassword.value);
const toggleConfirmPasswordVisibility = () => (showConfirmPassword.value = !showConfirmPassword.value);

const submit = () => {
    form.post(route('register'), {
        onFinish: () => form.reset('password', 'password_confirmation'),
    });
};
</script>

<template>
        <!-- Mobile-only header for branding -->
        <div class="block lg:hidden w-full bg-white/90 dark:bg-gray-900/90 shadow-sm m-0 p-0">
            <div class="flex flex-col items-center justify-center p-0 m-0 gap-1">
                <div v-if="logoUrl" class="h-14 w-14 rounded-full overflow-hidden bg-white flex items-center justify-center border border-gray-200 dark:border-gray-700">
                    <img :src="logoUrl" :alt="projectName" class="h-full w-full object-contain" />
                </div>
                <div v-else class="h-14 w-14 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold">
                    {{ projectName.charAt(0) }}
                </div>
                <div class="text-center">
                    <span class="text-xl font-bold text-primary">{{ projectName }}</span>
                </div>
                <div v-if="bannerUrl" class="w-full max-w-xs rounded-lg overflow-hidden mt-2 mb-0">
                    <img :src="bannerUrl" alt="Banner" class="w-full h-20 object-cover align-top mb-0" />
                </div>
            </div>
        </div>

        <AuthSplitLayout
                title="Create your account"
                description="Enter your details below to get started with your new account."
                class="!mt-0 !pt-0"
        >
        <Head title="Register" />
         <div class="flex justify-center items-center w-full">
        <form @submit.prevent="submit" class="flex flex-col gap-3 ">
            
            <div class="grid gap-4">
                        
                <!-- Name -->
                <div class="grid gap-2">
                    <Label for="name">Full Name <span class="text-red-500">*</span></Label>
                    <div class="relative">
                        <User class="absolute left-3 top-5 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            id="name"
                            type="text"
                            class="pl-10"
                            required
                            tabindex="1"
                            v-model="form.name"
                            placeholder="John Doe"
                        />
                    </div>
                    <InputError :message="form.errors.name" />
                </div>

                <!-- Phone -->
                <div class="grid gap-2">
                    <Label for="phone">Phone Number <span class="text-red-500">*</span></Label>
                    <div class="relative">
                        <Phone class="absolute left-3 top-5 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            id="phone"
                            type="text"
                            class="pl-10"
                            required
                            tabindex="2"
                            v-model="form.phone"
                            placeholder="017xxxxxxxx"
                        />
                    </div>
                    <InputError :message="form.errors.phone" />
                </div>

                <!-- Email -->
                <div class="grid gap-2">
                    <Label for="email">Email Address</Label>
                    <div class="relative">
                        <Mail class="absolute left-3 top-5 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            id="email"
                            type="email"
                            class="pl-10"
                            tabindex="3"
                            v-model="form.email"
                            placeholder="email@example.com"
                        />
                    </div>
                    <InputError :message="form.errors.email" />
                </div>

                <!-- Password -->
                <div class="grid gap-2">
                    <Label for="password">Password <span class="text-red-500">*</span></Label>
                    <div class="relative">
                        <Lock class="absolute left-3 top-5 -translate-y-1/2 h-4 w-4 text-gray-400" />

                        <Input
                            id="password"
                            :type="showPassword ? 'text' : 'password'"
                            class="pl-10 pr-10"
                            required
                            tabindex="4"
                            v-model="form.password"
                            placeholder="••••••••"
                        />

                        <button
                            type="button"
                            @click="togglePasswordVisibility"
                            class="absolute right-3 top-5 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                            <Eye v-if="!showPassword" class="h-4 w-4" />
                            <EyeOff v-else class="h-4 w-4" />
                        </button>
                    </div>
                    <InputError :message="form.errors.password" />
                </div>

                <!-- Confirm Password -->
                <div class="grid gap-2">
                    <Label for="password_confirmation">Confirm Password <span class="text-red-500">*</span></Label>
                    <div class="relative">
                        <Lock class="absolute left-3 top-5 -translate-y-1/2 h-4 w-4 text-gray-400" />

                        <Input
                            id="password_confirmation"
                            :type="showConfirmPassword ? 'text' : 'password'"
                            class="pl-10 pr-10"
                            required
                            tabindex="5"
                            v-model="form.password_confirmation"
                            placeholder="••••••••"
                        />

                        <button
                            type="button"
                            @click="toggleConfirmPasswordVisibility"
                            class="absolute right-3 top-5 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                            <Eye v-if="!showConfirmPassword" class="h-4 w-4" />
                            <EyeOff v-else class="h-4 w-4" />
                        </button>
                    </div>
                    <InputError :message="form.errors.password_confirmation" />
                </div>

                <!-- Submit -->
                <Button
                    type="submit"
                    class="mt-2 w-full"
                    tabindex="6"
                    :disabled="form.processing"
                >
                    <LoaderCircle v-if="form.processing" class="h-4 w-4 animate-spin" />
                    <span v-else>Create Account</span>
                </Button>
            </div>

            <!-- Login link -->
            <div class="text-center text-sm text-muted-foreground">
                Already have an account?
                <TextLink :href="route('login')" class="underline underline-offset-4">Log in</TextLink>
            </div>
        </form>
        </div>
    </AuthSplitLayout>
</template>