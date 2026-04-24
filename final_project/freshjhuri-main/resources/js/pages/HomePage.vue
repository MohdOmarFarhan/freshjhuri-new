<script setup>
import Bannar from '@/components/HomeComponent/Bannar.vue';
import BrandMarquee from '@/components/HomeComponent/BrandMarquee.vue';
import Category from '@/components/HomeComponent/Category.vue';
import ProductRowSlider from '@/components/HomeComponent/ProductRowSlider.vue';
import ServiceSection from '@/components/HomeComponent/ServiceSection.vue';
import HomeLayout from '@/layouts/Home/HomeLayout.vue';

defineProps({
  bannars: Array,
  staticBannars: Array,
  categories: Array,
  brandMarquees: Array,
  services: Array,
  featureProducts: Array,
  bestSellingProducts: Array,
  serviceVideos: Array,
  comboProducts: Array,
  homepageSections: Array,
});
</script>

<template>
  <HomeLayout :navbarFloating="true">
    <Bannar :bannars="bannars" :static-bannars="staticBannars" :upcoming-products="featureProducts" />
    <BrandMarquee :marquees="brandMarquees" />
    <Category :categories="categories" />

    <!-- Dynamic Homepage Sections -->
    <template v-for="section in homepageSections" :key="section.id">
      <ProductRowSlider :section="section" />
    </template>

    <ServiceSection :services="services" :serviceVideos="serviceVideos" />
  </HomeLayout>
</template>