<script setup lang="js">
 
import { usePage, Link } from "@inertiajs/vue3";
import {computed} from 'vue';
 
const page = usePage();
const common_settings = computed(() => page.props.common_settings);
 
defineOptions({
    inheritAttrs: false,
});


</script>

<template>
        <Link :href="route('home')">
          <img :src="`/${common_settings?.logo_1}`" alt="Company Logo"
            class="w-20 h-8 object-cover hover:opacity-90 transition-opacity" />
          </Link>
</template>
