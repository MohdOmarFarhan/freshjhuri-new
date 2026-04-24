<script setup>
import { usePage, Link } from "@inertiajs/vue3";
import { ShoppingBag } from "lucide-vue-next";
import { computed } from "vue";
import NavLink from "@/components/NavLink.vue";
const page = usePage();
const cart_items = computed(() => page.props.cart_items);
 
</script>

<template>
 <div class="relative">
            <NavLink href="#" class="flex items-center space-x-2">
              <ShoppingBag class="w-6 h-6 mt-[6px] text-dark-primary dark:text-light-primary" />
              <span 
                class="absolute -top-0 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {{ cart_items.length || 0 }}
              </span>

            </NavLink>
          </div>
  
</template>

<style scoped>
/* Add your styles here */
</style>
