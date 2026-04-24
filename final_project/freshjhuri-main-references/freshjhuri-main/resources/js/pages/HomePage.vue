<script setup>
import Bannar from '@/components/HomeComponent/Bannar.vue';
import Category from '@/components/HomeComponent/Category.vue';
import FeaturedProducts from '@/components/HomeComponent/FeaturedProducts.vue';
import ComboProducts from '@/components/HomeComponent/ComboProducts.vue';
import BestSellingProducts from '@/components/HomeComponent/BestSellingProducts.vue';
import ServiceSection from '@/components/HomeComponent/ServiceSection.vue';
import HomeLayout from '@/layouts/Home/HomeLayout.vue';

defineProps({
  bannars: Array,
  staticBannars: Array,
  categories: Array,
  services: Array,
  featureProducts: Array,
  bestSellingProducts: Array,
  serviceVideos: Array,
  comboProducts: Array
});
</script>

<template>
  <HomeLayout :navbarFloating="true">
    <Bannar :bannars="bannars" :static-bannars="staticBannars" :upcoming-products="featureProducts" />
    <Category :categories="categories" />
    <FeaturedProducts :featureProducts="featureProducts" />
    <ComboProducts :comboProducts="comboProducts" />
    <BestSellingProducts :bestSellingProducts="bestSellingProducts" />
    <ServiceSection :services="services" :serviceVideos="serviceVideos" />
  </HomeLayout>
</template>