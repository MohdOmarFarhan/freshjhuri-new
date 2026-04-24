<script setup lang="ts">
import { Head, useForm, usePage } from '@inertiajs/vue3';
import { Mail, Lock, Eye, EyeOff } from 'lucide-vue-next';
import { ref, computed } from 'vue';
import { route } from 'ziggy-js';
import InputError from '@/components/InputError.vue';
import TextLink from '@/components/TextLink.vue';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthSplitLayout from '@/layouts/auth/AuthSplitLayout.vue';
import { useLocalization } from '@/helper/localization';


// Type commonSettings as Record<string, any> to avoid TS errors
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

defineProps<{
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
    showFirstLoginMessage?: boolean;
}>();

const { t } = useLocalization();



const showPassword = ref(false);

const form = useForm({
    email: '',
    password: '',
    remember: false,
});

const submit = () => {
    form.post(route('login'), {
        onFinish: () => form.reset('password'),
    });
};
</script>

<template>

    <div class="flex flex-col"> 
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
        title="Log in to your account"
        description="Enter your email and password below to continue"
        class="!mt-0 !pt-0"
    >
        <Head title="Log in" />
        <!-- Success message -->
        <div
            v-if="status"
            class="mb-4  text-center text-sm font-medium text-green-600"
        >
            {{ status }}
        </div>


        <form
            @submit.prevent="submit"
            class="flex flex-col gap-6 max-w-sm m-auto"
        >
            <div class="grid gap-6">

                <!-- Email or Phone -->
                <div class="grid gap-2">
                    <Label for="email">Email or Phone</Label>
                    <div class="relative">
                        <Mail class="absolute left-3 top-5 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            id="email"
                            type="text"
                            class="pl-10"
                            required
                            autofocus
                            :tabindex="1"
                            autocomplete="username"
                            placeholder="Email or Phone Number"
                            v-model="form.email"
                        />
                    </div>
                    <InputError :message="form.errors.email" />
                </div>

                <!-- Password -->
                <div class="grid gap-2">
                    <div class="flex items-center justify-between">
                        <Label for="password">Password</Label>

                        <TextLink
                            v-if="canResetPassword"
                            :href="route('password.request')"
                            class="text-sm"
                        >
                            Forgot password?
                        </TextLink>
                    </div>

                    <div class="relative">
                        <Lock class="absolute left-3 top-5 -translate-y-1/2 h-4 w-4 text-gray-400" />

                        <Input
                            id="password"
                            :type="showPassword ? 'text' : 'password'"
                            class="pl-10 pr-10"
                            required
                            :tabindex="2"
                            autocomplete="current-password"
                            placeholder="••••••••"
                            v-model="form.password"
                        />

                        <button
                            type="button"
                            @click="showPassword = !showPassword"
                            class="absolute right-3 top-5 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                            <Eye v-if="!showPassword" class="h-4 w-4" />
                            <EyeOff v-else class="h-4 w-4" />
                        </button>
                    </div>

                    <InputError :message="form.errors.password" />
                </div>

                <!-- Remember me -->
                <div class="flex items-center space-x-3">
                    <Checkbox
                        id="remember"
                        v-model:checked="form.remember"
                        :tabindex="3"
                    />
                    <Label for="remember">Remember me</Label>
                </div>

                <!-- Submit button -->
                <Button
                    type="submit"
                    class="mt-4 w-full bg-primary py-3 text-sm text-white font-medium"
                    :tabindex="4"
                    :disabled="form.processing"
                >
                    <Spinner v-if="form.processing" />
                    <span v-else>Log in</span>
                </Button>
            </div>

            <!-- Sign up -->
            <div
                class="text-center text-sm  text-muted-foreground"
                v-if="canRegister"
            >
                Don’t have an account?
                <TextLink :href="route('register')" :tabindex="5">
                    Sign up
                </TextLink>
            </div>
        </form>
    </AuthSplitLayout>
    </div>
</template>
