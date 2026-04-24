<script setup>
import { Link, usePage } from '@inertiajs/vue3'
import { ShieldCheck, Zap, Lock } from 'lucide-vue-next'
import { computed } from 'vue'
import { route } from 'ziggy-js'
import AppLogoIcon from '@/components/AppLogoIcon.vue'

const page = usePage()

const common_settings = computed(() => page.props.common_settings)
const currentYear = new Date().getFullYear()

const backgroundImage = computed(() => {
    return common_settings.value?.banner_image || null
})

defineProps({
    title: String,
    description: String,
})

const features = [
    {
        icon: ShieldCheck,
        title: 'Secure & Reliable',
        description: 'Enterprise-grade security for your peace of mind',
    },
    {
        icon: Zap,
        title: 'Fast & Efficient',
        description: 'Lightning-quick performance and seamless experience',
    },
    {
        icon: Lock,
        title: 'Privacy First',
        description: 'Your data is encrypted and protected always',
    },
]
</script>


<template>
    <div
        class="relative grid h-dvh flex-col items-center justify-center px-8 sm:px-0 lg:max-w-none lg:grid-cols-2 lg:px-0 bg-white dark:bg-slate-950"
    >
        <!-- Left Side - Branding & Features with Dynamic Background -->
        <div
            class="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r overflow-hidden"
            :style="{
                backgroundImage: backgroundImage ? `url('${backgroundImage}')` : 'linear-gradient(to bottom right, rgb(37, 99, 235), rgb(30, 58, 138), rgb(55, 48, 163))',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }"
        >
            <!-- Dark overlay for text readability -->
            <div 
                class="absolute inset-0"
                :style="{
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                }"
            />

            <!-- Animated background elements (only show if no custom image) -->
            <div v-if="!backgroundImage" class="absolute inset-0 overflow-hidden">
                <div
                    class="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"
                />
                <div
                    class="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl animate-pulse"
                    style="animation-delay: 1s"
                />
            </div>

            <!-- Content -->
            <div class="relative z-20 flex flex-col h-full">
                <!-- Logo & Brand -->
                <Link
                    :href="route('home')"
                    class="flex items-center text-lg font-bold mb-12 hover:opacity-90 transition-opacity group"
                >
                    <div
                        class="mr-3 p-2 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors backdrop-blur-sm"
                    >
                        <AppLogoIcon class="size-7 fill-current text-white" />
                    </div>
                    <span>{{ page.props.name || common_settings?.project_name || 'MyApp' }}</span>
                </Link>

                <!-- Features -->
                <div class="flex-1 space-y-8 mb-auto">
                    <div class="space-y-2">
                        <h2 class="text-3xl font-bold leading-tight">
                            Welcome Back
                        </h2>
                        <p class="text-blue-100">
                            Your trusted platform for secure authentication
                        </p>
                    </div>

                    <div class="space-y-6 pt-8">
                        <div
                            v-for="(feature, index) in features"
                            :key="index"
                            class="flex gap-4 items-start animate-fadeInUp"
                            :style="{
                                animationDelay: `${index * 100}ms`,
                                animationFillMode: 'both',
                            }"
                        >
                            <div
                                class="flex-shrink-0 w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors backdrop-blur-sm"
                            >
                                <component
                                    :is="feature.icon"
                                    class="w-6 h-6 text-white"
                                />
                            </div>
                            <div>
                                <h3 class="font-semibold mb-1">
                                    {{ feature.title }}
                                </h3>
                                <p class="text-sm text-blue-100">
                                    {{ feature.description }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div class="text-xs text-blue-100 space-y-1">
                    <p>© {{ currentYear }} {{ page.props.name || common_settings?.project_name || 'MyApp' }}. All rights reserved.</p>
                </div>
            </div>
        </div>

        <!-- Right Side - Form -->
        <div class="lg:p-8 w-full h-full flex items-center mt-10 justify-center">
            <div
                class="w-full h-full lg:h-auto flex flex-col justify-star md:justify-center sm:w-105 sm:rounded-2xl sm:border sm:border-gray-200 dark:sm:border-gray-800 sm:bg-white dark:sm:bg-slate-900 sm:shadow-xl sm:p-8 p-4 gap-7 animate-fadeInRight"
            >
                <!-- Header Section -->
                <div class="flex flex-col gap-2">
                    <h1
                        v-if="title"
                        class="text-3xl text-center lg:text-2xl font-bold text-gray-900 dark:text-white tracking-tight leading-tight"
                    >
                        {{ title }}
                    </h1>
                    <p
                        v-if="description"
                        class="text-sm text-center text-gray-600 dark:text-gray-400 leading-relaxed"
                    >
                        {{ description }}
                    </p>
                </div>

                <!-- Divider -->
                <div class="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent dark:via-gray-700" />

                <!-- Form Slot -->
                <div class="flex flex-col gap-6">
                    <slot />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeInRight {
    from {
        opacity: 0;
        transform: translateX(20px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

.animate-fadeInUp {
    animation: fadeInUp 0.6s ease-out;
}

.animate-fadeInRight {
    animation: fadeInRight 0.6s ease-out 0.2s both;
}
</style>
