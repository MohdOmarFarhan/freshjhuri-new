<script setup>
import { Link, router, usePage } from '@inertiajs/vue3';
import { Search, ShoppingCart, Menu, Moon, Sun, Globe, User, ChevronDown, X } from 'lucide-vue-next';
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { useAppearance } from '@/composables/useAppearance';
import { useLocalization } from '@/helper/localization';

const props = defineProps({
  floating: {
    type: Boolean,
    default: false,
  },
});

const page = usePage();
const { resolvedAppearance, updateAppearance } = useAppearance();
const { locale, changeLanguage, t } = useLocalization();

const toggleAppearance = () => {
  updateAppearance(resolvedAppearance.value === 'dark' ? 'light' : 'dark');
};

const isScrolled = ref(false);
const searchQuery = ref('');
const showMobileMenu = ref(false);

const commonSettings = computed(() => page.props.commonsetting ?? page.props.common_settings ?? {});
const productMenuCategories = computed(() => page.props.productMenuCategories ?? []);
const cartCount = computed(() => page.props.cartCount || 0);
const isAuthenticated = computed(() => !!page.props.auth?.user);
const user = computed(() => page.props.auth?.user);

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20;
};

onMounted(() => {
  handleScroll();
  window.addEventListener('scroll', handleScroll, { passive: true });
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});

const toggleLanguage = () => {
  changeLanguage(locale.value === 'en' ? 'bn' : 'en');
};

const handleSearch = () => {
  if (!searchQuery.value) return;
  // Try to find category or product matching query
  const query = searchQuery.value.toLowerCase();
  
  // Basic search fallback to products page or search route
  // Assuming a generic search route or we navigate to /category/all?search=
  router.get(route('productsoncategory', { slug: 'all' }), { search: query });
};

// Simplified category listing logic (top 10 active categories)
const navbarCategories = computed(() => {
  return productMenuCategories.value
    .slice()
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .slice(0, 10); // Show only top 10 on navbar
});

const categoryLabel = (category) => {
  const localizedKey = `name_${locale.value}`;
  return category?.[localizedKey] || category?.name || category?.name_en || category?.name_bn || t('category_fallback');
};

watch(
  () => page.url,
  () => {
    showMobileMenu.value = false;
  }
);
</script>

<template>
  <header
    :class="[
      'fixed top-0 w-full z-40 transition-all duration-300',
      isScrolled 
        ? 'bg-white/90 dark:bg-stone-950/90 backdrop-blur-md shadow-sm' 
        : 'bg-white/80 dark:bg-stone-950/80 backdrop-blur-sm'
    ]"
  >
    <!-- Top Tier: Branding, Search, Actions -->
    <div class="border-b border-gray-200/60 dark:border-white/5 py-3 md:py-4">
      <div class="container mx-auto px-4 flex flex-wrap md:flex-nowrap items-center justify-between gap-4 md:gap-8">
        
        <!-- Mobile Menu & Logo -->
        <div class="flex items-center gap-3">
          <button @click="showMobileMenu = !showMobileMenu" class="md:hidden p-1 text-stone-700 dark:text-stone-300 hover:text-primary-green transition">
            <Menu class="w-6 h-6" />
          </button>
          <Link :href="route('home')" class="flex flex-col">
            <h1 class="text-2xl md:text-3xl font-bold text-primary-green tracking-tight font-sans leading-none">
              my<span class="text-honey-gold">Bazar</span>
            </h1>
            <span class="text-[10px] text-stone-500 uppercase tracking-widest hidden md:block mt-1 font-semibold">Agro Products</span>
          </Link>
        </div>

        <!-- Expanded Search Bar -->
        <div class="order-last md:order-none w-full md:flex-1 max-w-2xl">
          <form @submit.prevent="handleSearch" class="relative w-full flex items-center bg-stone-100 dark:bg-stone-900 border border-transparent dark:border-stone-800 rounded-full transition-all focus-within:ring-2 focus-within:ring-primary-green/50 focus-within:border-primary-green/50">
            <div class="pl-4 pr-2 text-stone-400">
              <Search class="w-5 h-5" />
            </div>
            <input
              type="text"
              :placeholder="locale === 'en' ? 'Search products, brands, or categories' : 'মধু, খেজুর, মসলা খুঁজুন...'"
              v-model="searchQuery"
              class="w-full bg-transparent py-2.5 outline-none text-stone-700 dark:text-stone-200 text-sm md:text-base placeholder-stone-400 dark:placeholder-stone-500"
            />
            <div class="pr-1.5 py-1.5">
              <button type="submit" class="bg-primary-green hover:bg-primary-green-hover text-white text-sm font-bold px-5 py-1.5 rounded-full transition-colors">
                {{ t('search') }}
              </button>
            </div>
          </form>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <!-- Language Toggle -->
          <button
            @click="toggleLanguage"
            class="hidden sm:flex items-center bg-stone-100 dark:bg-stone-900 rounded-full p-1 border border-stone-200 dark:border-stone-800 transition-colors"
            title="Toggle Language"
          >
            <span :class="['px-2.5 py-0.5 rounded-full text-xs font-bold transition-colors', locale === 'en' ? 'bg-honey-gold text-white shadow-sm' : 'text-stone-500']">EN</span>
            <span :class="['px-2.5 py-0.5 rounded-full text-xs font-bold transition-colors', locale === 'bn' ? 'bg-primary-green text-white shadow-sm' : 'text-stone-500']">BN</span>
          </button>

          <!-- Theme Toggle -->
          <button
            @click="toggleAppearance"
            class="w-10 h-10 flex flex-col items-center justify-center rounded-full border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 transition-colors"
            title="Toggle Dark Mode"
          >
            <Sun v-if="resolvedAppearance === 'dark'" class="w-4 h-4" />
            <Moon v-else class="w-4 h-4" />
          </button>

          <!-- User Login / My Account -->
          <Link 
            :href="isAuthenticated ? route('dashboard') : route('login')"
            class="px-4 h-10 flex items-center justify-center rounded-full border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 transition-colors gap-2"
          >
            <User class="w-4 h-4" />
            <span v-if="isAuthenticated && user?.name" class="text-xs font-bold truncate max-w-[80px] hidden lg:block">
              {{ user.name.split(' ')[0] }}
            </span>
            <span v-else class="text-xs font-bold hidden lg:block">{{ t('sign_in') }}</span>
          </Link>

          <!-- Cart Icon -->
          <Link
            :href="route('cart.index')"
            class="relative w-10 h-10 flex items-center justify-center rounded-full border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 transition-colors ml-1"
          >
            <ShoppingCart class="w-4 h-4" />
            <transition
              enter-active-class="transition transform duration-300 ease-out"
              enter-from-class="scale-0 opacity-0"
              enter-to-class="scale-100 opacity-100"
              leave-active-class="transition transform duration-200 ease-in"
              leave-from-class="scale-100 opacity-100"
              leave-to-class="scale-0 opacity-0"
            >
              <span v-if="cartCount > 0" class="absolute -top-1.5 -right-1.5 bg-honey-gold text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm border-2 border-white dark:border-stone-950">
                {{ cartCount }}
              </span>
            </transition>
          </Link>
        </div>
      </div>
    </div>

    <!-- Bottom Tier: Category Pills -->
    <div class="container mx-auto px-4 py-2.5 hidden md:flex items-center gap-3 overflow-x-auto no-scrollbar">
      <!-- Products Pill -->
      <Link :href="route('productsoncategory', { slug: 'all' })" class="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-stone-800 dark:bg-stone-800 hover:bg-black dark:hover:bg-stone-700 text-white text-sm font-semibold transition-colors shrink-0">
        {{ t('all_products', 'All Products') }}
      </Link>

      <!-- Categories -->
      <Link
        v-for="cat in navbarCategories"
        :key="cat.id"
        :href="route('productsoncategory', { slug: cat.slug })"
        class="px-4 py-1.5 rounded-full border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 text-sm font-medium transition-colors shrink-0"
      >
        {{ categoryLabel(cat) }}
      </Link>
    </div>

    <!-- Mobile Menu Overlay -->
    <div v-if="showMobileMenu" class="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm lg:hidden" @click="showMobileMenu = false">
      <div class="absolute left-0 top-0 h-full w-[80%] max-w-sm bg-white dark:bg-stone-950 shadow-2xl flex flex-col" @click.stop>
        <div class="p-4 border-b border-gray-100 dark:border-stone-800 flex justify-between items-center">
          <Link :href="route('home')" class="flex flex-col" @click="showMobileMenu = false">
            <h1 class="text-xl font-bold text-primary-green tracking-tight font-sans leading-none">
              my<span class="text-honey-gold">Bazar</span>
            </h1>
          </Link>
          <button @click="showMobileMenu = false" class="p-2 text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white rounded-full bg-stone-100 dark:bg-stone-900">
            <X class="w-5 h-5" />
          </button>
        </div>
        
        <div class="p-4 overflow-y-auto flex-1">
          <div class="space-y-4">
            <Link :href="route('productsoncategory', { slug: 'all' })" class="block font-semibold text-lg text-stone-800 dark:text-stone-200" @click="showMobileMenu = false">
              All Products
            </Link>
            <div class="w-full h-[1px] bg-stone-100 dark:bg-stone-800"></div>
            <Link 
              v-for="cat in navbarCategories" 
              :key="cat.id" 
              :href="route('productsoncategory', { slug: cat.slug })"
              class="block py-2 text-stone-600 dark:text-stone-400 font-medium"
              @click="showMobileMenu = false"
            >
              {{ categoryLabel(cat) }}
            </Link>
          </div>
        </div>

        <div class="p-4 border-t border-gray-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 mt-auto">
          <button @click="toggleLanguage" class="flex items-center justify-between w-full py-3 px-4 bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl mb-3">
            <span class="font-medium text-stone-700 dark:text-stone-300">Language</span>
            <div class="flex gap-2">
              <span :class="['px-2 py-1 rounded text-xs font-bold', locale === 'en' ? 'bg-honey-gold text-white' : 'text-stone-500 bg-stone-100 dark:bg-stone-800']">EN</span>
              <span :class="['px-2 py-1 rounded text-xs font-bold', locale === 'bn' ? 'bg-primary-green text-white' : 'text-stone-500 bg-stone-100 dark:bg-stone-800']">BN</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  </header>
  
  <!-- Add spacer below header to push content down -->
  <div class="h-[120px] md:h-[135px] w-full" aria-hidden="true"></div>
</template>

<style scoped>
/* Hide scrollbar for category row */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>