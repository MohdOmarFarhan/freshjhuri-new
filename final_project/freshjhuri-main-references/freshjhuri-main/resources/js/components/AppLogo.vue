<script setup>
import { usePage, Link } from '@inertiajs/vue3';
import { computed } from 'vue';
import AppLogoIcon from '@/components/AppLogoIcon.vue';
import { useLocalization } from '@/helper/localization';
const { locale,t } = useLocalization();
const getLocalizedField = (field) => `${field}_${locale.value}`;
const page = usePage();

const common_settings = computed(() => page.props.common_settings);



</script>

<template>
    <div
        class="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground"
    >
        <AppLogoIcon class=" fill-current text-white dark:text-black" />
    </div>
    <div class="ml-1 grid flex-1 text-left text-md">
        <Link :href="route('home')" class="mb-0.5 truncate leading-tight font-bold text-lg"
            >{{ common_settings?.project_name || 'No Data' }}
            </Link
        >
    </div>
</template>
