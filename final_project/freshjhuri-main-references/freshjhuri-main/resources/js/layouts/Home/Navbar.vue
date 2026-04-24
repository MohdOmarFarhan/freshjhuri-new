<script setup>
import { Link, router, usePage } from '@inertiajs/vue3';
import { ChevronDown, Globe, Info, LogIn, Menu, MessageCircle, MoreHorizontal, Search, ShoppingCart, Truck, X, } from 'lucide-vue-next';
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch, Teleport } from 'vue';
import DarkMode from '@/components/DarkMode.vue';
import LanguageSwitcher from '@/components/LanguageSwitcher.vue';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger, } from '@/components/ui/dropdown-menu';
import { useAppearance } from '@/composables/useAppearance';
import { useLocalization } from '@/helper/localization';

const props = defineProps({
  floating: {
    type: Boolean,
    default: false,
  },
});

const page = usePage();
const { resolvedAppearance } = useAppearance();
const { locale, t } = useLocalization();

const showMobileMenu = ref(false);
const activeDropdown = ref(null);
const isScrolled = ref(false);
const showFullNavbar = ref(true);
const isDesktop = ref(false);
const headerRef = ref(null);
const topBarRef = ref(null);
const secondBarRef = ref(null);
const moreButtonRef = ref(null);
const moreDropdownPosition = ref({ top: 0, right: 0 });
const topBarHeight = ref(0);
const secondBarHeight = ref(0);
const searchQuery = ref('');

let closeTimeout = null;
let lastScrollY = 0;
let scrollDirection = 0;
let scrollAccumulated = 0;
let scrollTicking = false;
let desktopMediaQuery = null;
let onDesktopMediaChange = null;
let onResize = null;
let rafId = null;

const commonSettings = computed(() => page.props.commonsetting ?? page.props.common_settings ?? {});
const categories = computed(() => page.props.categories ?? []);
const productMenuCategories = computed(() => page.props.productMenuCategories ?? []);
const cartCount = computed(() => page.props.cartCount || 0);
const isAuthenticated = computed(() => !!page.props.auth?.user);
const isHomeRoute = computed(() => page.url === '/' || route().current('home'));

const buildWhatsAppHref = (value) => {
  if (!value) return null;
  const raw = String(value).trim();
  if (!raw) return null;
  if (raw.startsWith('http')) return raw;
  let digits = raw.replace(/\D/g, '');
  if (!digits) return null;
  if (digits.startsWith('0') && digits.length === 11) {
    digits = `88${digits}`;
  }
  return `https://wa.me/${digits}`;
};

const navbarCategories = computed(() => categoryMenuEntries.value);
const navbarStripCategories = computed(() => {
  return navbarCategories.value;
});

const categoryMenuEntries = computed(() => {
  const sorted = productMenuCategories.value
    .slice()
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map((category) => ({
      ...category,
      products: (category.products || []).filter((product) => product?.slug),
    }))
    .filter((category) => category.products.length > 0);
  
  if (typeof window !== 'undefined') {
    console.log('Navbar category order:', sorted.map(c => ({ name: c.name_en, sort_order: c.sort_order })));
  }
  return sorted;
});

const moreLinks = computed(() => {
  return [
    {
      id: 'learn_more',
      labelKey: 'learn_more',
      href: route('contact.page'),
      icon: Info,
    },
    {
      id: 'whatsapp',
      labelKey: 'whatsapp',
      href: buildWhatsAppHref(commonSettings.value?.whatsapp) || 'https://wa.me/8801000000000',
      icon: MessageCircle,
      external: true,
    },
    {
      id: 'tracking',
      labelKey: 'tracking',
      href: route('login'),
      icon: Truck,
    },
  ];
});

const isFloatingHeader = computed(() => props.floating && !isScrolled.value);
const isDarkTheme = computed(() => resolvedAppearance.value === 'dark');
const projectName = computed(() => commonSettings.value.project_name || 'Unique Agro Care');
const logoUrl = computed(() => {
  if (!commonSettings.value.logo_1) return null;
  if (commonSettings.value.logo_1.startsWith('http')) return commonSettings.value.logo_1;
  if (commonSettings.value.logo_1.startsWith('/')) return commonSettings.value.logo_1;
  if (commonSettings.value.logo_1.startsWith('storage/')) return `/${commonSettings.value.logo_1}`;
  return `/storage/${commonSettings.value.logo_1}`;
});

const pageThemeClasses = computed(() => {
  if (isFloatingHeader.value) {
    return isDarkTheme.value ? 'navbar-shell text-white' : 'navbar-shell text-foreground';
  }
  return 'navbar-shell';
});

const topBarClasses = computed(() => {
  return [
    'relative z-50 transition-all duration-300',
    pageThemeClasses.value,
    isFloatingHeader.value ? 'navbar-panel navbar-panel--floating' : 'navbar-panel navbar-panel--strong',
  ];
});

const secondBarClasses = computed(() => {
  return [
    'relative z-10 transition-all duration-300',
    pageThemeClasses.value,
    isFloatingHeader.value ? 'navbar-panel navbar-panel--floating' : 'navbar-panel navbar-panel--strong',
  ];
});

const headerContainerClasses = computed(() => {
  return 'fixed inset-x-0 top-0 z-50';
});

const topBarWrapperClasses = computed(() => {
  const visible = !isDesktop.value || !isScrolled.value || showFullNavbar.value;
  return [
    'transition-[max-height,opacity,transform] duration-300 ease-out',
    visible ? 'max-h-[240px] opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-4 pointer-events-none',
  ];
});

const spacerHeightStyle = computed(() => {
  const showTopBar = !isDesktop.value || !isScrolled.value || showFullNavbar.value;
  const height = (showTopBar ? topBarHeight.value : 0) + secondBarHeight.value;
  return { height: `${Math.max(0, Math.round(height))}px` };
});

const shellClasses = computed(() => {
  return isFloatingHeader.value ? 'text-white' : 'text-foreground';
});

const searchShellClasses = computed(() => {
  return isFloatingHeader.value 
    ? isDarkTheme.value 
      ? 'border border-white/20 bg-white/10 text-white placeholder:text-white/70' 
      : 'border border-border/70 bg-background/90 text-foreground placeholder:text-muted-foreground'
    : 'navbar-search border';
});

const searchInputClasses = computed(() => {
  if (!isFloatingHeader.value) {
    return 'placeholder:text-muted-foreground';
  }
  return isDarkTheme.value ? 'placeholder:text-white/70' : 'placeholder:text-muted-foreground';
});

const actionButtonClasses = computed(() => {
  if (!isFloatingHeader.value) {
    return 'relative navbar-button inline-flex h-10 w-10 items-center justify-center rounded-full';
  }
  return isDarkTheme.value 
    ? 'relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/10'
    : 'relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-background/90 text-foreground transition-colors hover:bg-accent/5';
});

const moreDropdownClasses = computed(() => {
  if (!isFloatingHeader.value) {
    return 'fixed z-[9999] w-60 overflow-visible rounded-2xl bg-white p-2 shadow-lg dark:bg-gray-900';
  }
  return isDarkTheme.value 
    ? 'fixed z-[9999] w-60 overflow-visible rounded-2xl border border-white/20 bg-gray-900/95 p-2 text-white shadow-xl backdrop-blur-xl'
    : 'fixed z-[9999] w-60 overflow-visible rounded-2xl bg-white/95 p-2 shadow-lg backdrop-blur-xl';
});

const mobileMenuClasses = computed(() => {
  return 'dropdown-menu mt-3 rounded-3xl p-4 shadow-xl lg:hidden navbar-mobile-sheet';
});

const mobileOverlayClasses = computed(() => {
  return 'fixed inset-0 z-[80] backdrop-blur-[2px] lg:hidden navbar-mobile-overlay';
});

const normalizeSlug = (value) => String(value || '').trim().toLowerCase();

const currentProductSlug = computed(() => {
  const url = String(page.url || '').split('?')[0];
  const match = url.match(/^\/product-details\/([^/?#]+)/);
  return match?.[1] ? normalizeSlug(match[1]) : null;
});

const currentCategorySlug = computed(() => {
  const fromCategoryPageProp = page.props?.currentCategory?.slug;
  if (fromCategoryPageProp) {
    return normalizeSlug(fromCategoryPageProp);
  }
  const fromProductProp = page.props?.product?.category?.slug;
  if (fromProductProp) {
    return normalizeSlug(fromProductProp);
  }
  const fromRouteParam = route()?.params?.slug;
  if (fromRouteParam) {
    return normalizeSlug(fromRouteParam);
  }
  const url = String(page.url || '').split('?')[0];
  const match = url.match(/^\/category\/products\/([^/?#]+)/);
  if (match?.[1]) {
    try {
      return normalizeSlug(decodeURIComponent(match[1]));
    } catch {
      return normalizeSlug(match[1]);
    }
  }
  return null;
});

const isCategoryActive = (category) => {
  const categorySlug = normalizeSlug(category?.slug);
  if (!categorySlug) {
    return false;
  }
  if (currentCategorySlug.value && categorySlug === currentCategorySlug.value) {
    return true;
  }
  if (route().current('productsoncategory', { slug: category.slug })) {
    return true;
  }
  const rawUrl = String(page.url || '').split('?')[0];
  if (rawUrl.startsWith('/category/products/') && rawUrl.includes(`/${categorySlug}`)) {
    return true;
  }
  if (!currentProductSlug.value) {
    return false;
  }
  return (category?.products || []).some((product) => normalizeSlug(product?.slug) === currentProductSlug.value);
};

const categoryLinkClasses = (category) => {
  const isActive = isCategoryActive(category);
  if (isFloatingHeader.value) {
    return isDarkTheme.value 
      ? [
          'rounded-full border px-4 py-2 text-sm font-medium transition-colors',
          isActive ? 'border-transparent bg-white text-foreground' : 'border-white/20 bg-white/10 text-white hover:bg-white/10',
        ]
      : [
          'rounded-full border px-4 py-2 text-sm font-medium transition-colors',
          isActive ? 'border-transparent bg-primary text-primary-foreground' : 'border-border/70 bg-background/85 text-foreground hover:bg-accent/5',
        ];
  }
  return [
    'navbar-link rounded-full px-4 py-2 text-sm font-medium',
    isActive ? 'navbar-link--active' : '',
  ];
};

const categoryDropdownButtonClasses = (category) => {
  const isActive = isCategoryActive(category);
  return [
    'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors backdrop-blur-sm',
    isActive ? 'navbar-link--active' : 'navbar-link',
  ];
};

const categoryLabel = (category) => {
  const localizedKey = `name_${locale.value}`;
  return (
    category?.[localizedKey] || category?.name || category?.name_en || category?.name_bn || t('category_fallback')
  );
};

const productLabel = (product) => {
  const localizedKey = `title_${locale.value}`;
  return (
    product?.[localizedKey] || product?.title || product?.title_en || product?.title_bn || t('product_fallback')
  );
};

const normalizeText = (value) => {
  return String(value || '').trim().toLowerCase();
};

// Critical fix: Update dropdown position relative to button's current position
const updateMoreDropdownPosition = () => {
  if (moreButtonRef.value && activeDropdown.value === 'more') {
    const rect = moreButtonRef.value.getBoundingClientRect();
    moreDropdownPosition.value = {
      top: rect.bottom,
      right: window.innerWidth - rect.right,
    };
  }
};

// Continuous position update using requestAnimationFrame
const startContinuousPositionUpdate = () => {
  const update = () => {
    if (activeDropdown.value === 'more') {
      updateMoreDropdownPosition();
      rafId = requestAnimationFrame(update);
    }
  };
  if (rafId) {
    cancelAnimationFrame(rafId);
  }
  rafId = requestAnimationFrame(update);
};

const stopContinuousPositionUpdate = () => {
  if (rafId) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
};

const openDropdown = (dropdown) => {
  if (closeTimeout) {
    clearTimeout(closeTimeout);
    closeTimeout = null;
  }
  if (dropdown === 'more' && moreButtonRef.value) {
    updateMoreDropdownPosition();
    startContinuousPositionUpdate();
  }
  activeDropdown.value = dropdown;
};

const closeDropdown = () => {
  activeDropdown.value = null;
  stopContinuousPositionUpdate();
};

const closeDropdownWithDelay = () => {
  closeTimeout = setTimeout(() => {
    activeDropdown.value = null;
    stopContinuousPositionUpdate();
  }, 250);
};

const toggleDropdown = (dropdown) => {
  if (dropdown === 'more') {
    if (activeDropdown.value === 'more') {
      closeDropdown();
    } else {
      updateMoreDropdownPosition();
      startContinuousPositionUpdate();
      activeDropdown.value = dropdown;
    }
  } else {
    activeDropdown.value = activeDropdown.value === dropdown ? null : dropdown;
  }
};

const updateDesktopState = () => {
  isDesktop.value = window.matchMedia('(min-width: 1024px)').matches;
};

const measureHeights = async () => {
  await nextTick();
  const topEl = topBarRef.value;
  const secondEl = secondBarRef.value;
  if (topEl) {
    const height = Math.round(topEl.getBoundingClientRect().height);
    if (height > 0) topBarHeight.value = height;
  }
  if (secondEl) {
    const height = Math.round(secondEl.getBoundingClientRect().height);
    if (height > 0) secondBarHeight.value = height;
  }
};

const handleScroll = () => {
  if (scrollTicking) return;
  scrollTicking = true;
  
  window.requestAnimationFrame(() => {
    const scrollY = window.scrollY || 0;
    isScrolled.value = scrollY > 10;
    
    // Position update is handled by continuous animation frame
    // No need to update here separately
    
    if (!isDesktop.value || !isScrolled.value) {
      showFullNavbar.value = true;
      lastScrollY = scrollY;
      scrollDirection = 0;
      scrollAccumulated = 0;
      scrollTicking = false;
      return;
    }
    
    const delta = scrollY - lastScrollY;
    if (delta != 0) {
      const nextDirection = delta > 0 ? 1 : -1;
      if (nextDirection != scrollDirection) {
        scrollDirection = nextDirection;
        scrollAccumulated = 0;
      }
      scrollAccumulated += Math.abs(delta);
      
      if (scrollDirection > 0 && scrollAccumulated >= 88) {
        showFullNavbar.value = false;
        scrollAccumulated = 0;
      }
      if (scrollDirection < 0 && scrollAccumulated >= 28) {
        showFullNavbar.value = true;
        scrollAccumulated = 0;
      }
    }
    
    lastScrollY = scrollY;
    scrollTicking = false;
  });
};

const handleClickOutside = (event) => {
  if (!event.target.closest('.more-dropdown') && !event.target.closest('.more-button')) {
    closeDropdown();
  }
};

const handleSearch = () => {
  const query = normalizeText(searchQuery.value);
  if (!query) {
    closeDropdown();
    return;
  }
  const categoryMatch = navbarCategories.value.find((category) =>
    normalizeText(categoryLabel(category)).includes(query)
  );
  if (categoryMatch?.slug) {
    closePanels();
    router.get(route('productsoncategory', { slug: categoryMatch.slug }));
    return;
  }
  const productMatch = navbarCategories.value
    .flatMap((category) => category.products || [])
    .find((product) => normalizeText(productLabel(product)).includes(query));
  if (productMatch?.slug) {
    closePanels();
    router.get(route('product.details', { slug: productMatch.slug }));
    return;
  }
  closeDropdown();
};

const navigateToCategory = (category) => {
  if (!category?.slug) return;
  closePanels();
  router.get(route('productsoncategory', { slug: category.slug }));
};

const closePanels = () => {
  showMobileMenu.value = false;
  closeDropdown();
};

onMounted(() => {
  updateDesktopState();
  lastScrollY = window.scrollY || 0;
  void measureHeights();
  handleScroll();
  window.addEventListener('scroll', handleScroll, { passive: true });
  
  onResize = () => {
    updateDesktopState();
    void measureHeights();
    handleScroll();
    if (activeDropdown.value === 'more') {
      updateMoreDropdownPosition();
    }
  };
  window.addEventListener('resize', onResize, { passive: true });
  
  desktopMediaQuery = window.matchMedia('(min-width: 1024px)');
  onDesktopMediaChange = () => {
    updateDesktopState();
    void measureHeights();
    handleScroll();
  };
  desktopMediaQuery.addEventListener?.('change', onDesktopMediaChange);
  desktopMediaQuery.addListener?.(onDesktopMediaChange);
  window.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('click', handleClickOutside);
  stopContinuousPositionUpdate();
  if (onResize) {
    window.removeEventListener('resize', onResize);
  }
  if (desktopMediaQuery && onDesktopMediaChange) {
    desktopMediaQuery.removeEventListener?.('change', onDesktopMediaChange);
    desktopMediaQuery.removeListener?.(onDesktopMediaChange);
  }
  if (closeTimeout) {
    clearTimeout(closeTimeout);
  }
});

watch(
  () => page.url,
  () => {
    closePanels();
  }
);
</script>

<template>
  <header ref="headerRef" :class="['w-full', shellClasses, headerContainerClasses]">
    <div :class="topBarWrapperClasses">
      <div ref="topBarRef" :class="topBarClasses">
        <div class="container mx-auto px-4 lg:px-8 py-3 lg:py-4">
          <!-- Desktop Layout - 3 columns -->
          <div class="hidden lg:flex lg:items-center lg:justify-between lg:gap-6">
            <!-- Left Column: Logo -->
            <div class="lg:shrink-0">
              <Link :href="route('home')" class="flex items-center">
                <div class="flex h-16 w-auto items-center justify-center overflow-hidden">
                  <img v-if="logoUrl" :src="logoUrl" :alt="projectName" class="h-full w-auto object-contain" />
                  <span v-else class="text-xl font-bold">{{ projectName }}</span>
                </div>
              </Link>
            </div>

            <!-- Center Column: Search -->
            <div class="flex-1 max-w-2xl mx-auto">
              <form @submit.prevent="handleSearch">
                <div :class="['flex items-center gap-2 rounded-2xl border px-4 py-2 shadow-sm transition-colors', searchShellClasses]">
                  <Search class="h-5 w-5 shrink-0" />
                  <input
                    v-model="searchQuery"
                    type="text"
                    :class="['w-full bg-transparent  text-sm outline-none placeholder:opacity-100', searchInputClasses]"
                    :placeholder="t('search_placeholder')"
                  />
                  <button type="submit" class="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90">
                    {{ t('search') }}
                  </button>
                </div>
              </form>
            </div>

            <!-- Right Column: Actions -->
            <div class="flex items-center gap-3 lg:shrink-0">
              <LanguageSwitcher />
              <DarkMode :class="actionButtonClasses" />
              <Link v-if="!isAuthenticated" :href="route('login')" :class="actionButtonClasses" :aria-label="t('sign_in')">
                <LogIn class="h-5 w-5" />
              </Link>
              <Link :href="route('cart.index')" :class="actionButtonClasses" :aria-label="t('cart')">
                <ShoppingCart class="h-5 w-5" />
                <span v-if="cartCount > 0" class="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                  {{ cartCount }}
                </span>
              </Link>
              
              <div class="relative" @mouseenter="openDropdown('more')" @mouseleave="closeDropdownWithDelay">
                <button
                  ref="moreButtonRef"
                  type="button"
                  :class="['more-button', actionButtonClasses]"
                  @click="toggleDropdown('more')"
                  :aria-label="t('open_more_menu')"
                >
                  <MoreHorizontal class="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          <!-- Mobile Layout -->
          <div class="flex flex-col gap-3 lg:hidden">
            <div class="flex items-center justify-between gap-3">
              <Link :href="route('home')" class="flex items-center gap-3 min-w-0">
                <div class="flex h-12 w-auto items-center justify-center overflow-hidden">
                  <img v-if="logoUrl" :src="logoUrl" :alt="projectName" class="h-full w-auto object-contain" />
                  <span v-else class="text-base font-bold">{{ projectName.charAt(0) }}</span>
                </div>
              </Link>
              
              <div class="flex items-center gap-2 ml-auto">
                <LanguageSwitcher />
                <DarkMode :class="actionButtonClasses" />
                <Link v-if="!isAuthenticated" :href="route('login')" :class="actionButtonClasses" :aria-label="t('sign_in')">
                  <LogIn class="h-5 w-5" />
                </Link>
                <Link :href="route('cart.index')" :class="actionButtonClasses" :aria-label="t('cart')">
                  <ShoppingCart class="h-5 w-5" />
                  <span v-if="cartCount > 0" class="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                    {{ cartCount }}
                  </span>
                </Link>
                <button type="button" :class="actionButtonClasses" @click="showMobileMenu = !showMobileMenu" :aria-expanded="showMobileMenu" :aria-label="t('toggle_menu')">
                  <component :is="showMobileMenu ? X : Menu" class="h-5 w-5" />
                </button>
              </div>
            </div>

            <!-- Mobile Search -->
            <form @submit.prevent="handleSearch">
              <div :class="['flex items-center gap-2 rounded-2xl border px-3 py-2.5 shadow-sm transition-colors', searchShellClasses]">
                <Search class="h-4 w-4 shrink-0" />
                <input
                  v-model="searchQuery"
                  type="text"
                  :class="['w-full bg-transparent text-sm outline-none placeholder:opacity-100', searchInputClasses]"
                  :placeholder="t('search_placeholder')"
                />
                <button type="submit" class="inline-flex items-center gap-2 rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90">
                  {{ t('search') }}
                </button>
              </div>
            </form>
          </div>

          <!-- Mobile Menu -->
          <div v-if="showMobileMenu" :class="mobileMenuClasses">
            <div class="space-y-3">
              <div class="flex items-center gap-2 text-sm font-semibold">
                <Globe class="h-4 w-4" />
                <span>{{ t('quick_links') }}</span>
              </div>
              <Link v-if="!isAuthenticated" :href="route('login')" class="flex items-center gap-3 rounded-2xl border border-border/70 px-4 py-3 text-sm transition-colors hover:bg-accent/5" :aria-label="t('sign_in')">
                <LogIn class="h-4 w-4 shrink-0" />
                <span>{{ t('sign_in') }}</span>
              </Link>
              <Link
                v-for="item in moreLinks"
                :key="item.id"
                :href="item.href"
                :target="item.external ? '_blank' : undefined"
                :rel="item.external ? 'noopener noreferrer' : undefined"
                class="flex items-center gap-3 rounded-2xl border border-border/70 px-4 py-3 text-sm transition-colors hover:bg-accent/5"
              >
                <component :is="item.icon" class="h-4 w-4 shrink-0" />
                <span>{{ t(item.labelKey) }}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Category Navigation Bar (Desktop & Mobile) - FIXED VERSION -->
    <div ref="secondBarRef" :class="secondBarClasses">
      <div class="container mx-auto px-4 lg:px-8 py-3">
        <div class="flex items-center justify-center">
          <div class="flex flex-wrap items-center justify-center gap-2">
            <DropdownMenu v-for="category in navbarCategories" :key="category.id">
              <DropdownMenuTrigger as-child>
                <button 
                  type="button" 
                  :class="categoryDropdownButtonClasses(category)" 
                  @mouseenter="openDropdown(category.id)" 
                  @mouseleave="closeDropdownWithDelay"
                  @click.stop="toggleDropdown(category.id)"
                >
                  <span :class="isCategoryActive(category) ? 'text-primary font-semibold' : ''">
                    {{ categoryLabel(category) }}
                  </span>
                  <ChevronDown class="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="start" 
                class="navbar-dropdown max-h-[70vh] w-80 overflow-y-auto rounded-2xl p-2 z-[9999]" 
                @mouseenter="openDropdown(category.id)" 
                @mouseleave="closeDropdownWithDelay"
              >
                <!-- View All Products Link -->
                <DropdownMenuItem 
                  :as-child="true"
                  class="rounded-xl p-0"
                >
                  <Link 
                    :href="route('productsoncategory', { slug: category.slug })" 
                    class="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-primary"
                    @click="closePanels"
                  >
                    <span class="h-2 w-2 rounded-full bg-primary" />
                    <span>{{ t('view_all_products') }}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <!-- Individual Products -->
                <DropdownMenuItem v-for="product in category.products" :key="product.id" :as-child="true" class="navbar-dropdown-item rounded-xl p-0">
                  <Link :href="route('product.details', { slug: product.slug })" class="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm" @click="closePanels">
                    <span class="h-2 w-2 rounded-full bg-primary" />
                    <span class="truncate">{{ productLabel(product) }}</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <span v-if="!navbarCategories.length" class="px-4 py-2 text-sm text-muted-foreground">
              {{ t('no_categories_available') }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </header>

  <!-- Teleported More Dropdown -->
  <Teleport to="body">
    <div
      v-if="activeDropdown === 'more'"
      :class="moreDropdownClasses"
      :style="{
        top: `${moreDropdownPosition.top}px`,
        right: `${moreDropdownPosition.right}px`,
      }"
      class="more-dropdown"
      @mouseenter="openDropdown('more')"
      @mouseleave="closeDropdownWithDelay"
    >
      <a :href="route('contact.page')" class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-accent/5">
        <Info class="h-4 w-4 shrink-0" />
        <span>{{ t('learn_more') }}</span>
      </a>
      <a
        :href="buildWhatsAppHref(commonSettings?.whatsapp) || 'https://wa.me/8801000000000'"
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-accent/5"
      >
        <MessageCircle class="h-4 w-4 shrink-0" />
        <span>{{ t('whatsapp') }}</span>
      </a>
      <a :href="route('login')" class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-accent/5">
        <Truck class="h-4 w-4 shrink-0" />
        <span>{{ t('tracking') }}</span>
      </a>
    </div>
  </Teleport>

  <div aria-hidden="true" class="transition-[height] duration-300 ease-out" :style="spacerHeightStyle"></div>

  <div v-if="showMobileMenu" :class="mobileOverlayClasses" @click.self="closePanels">
    <div :class="['absolute right-0 top-0 h-full w-full max-w-sm overflow-y-auto p-4 shadow-2xl', 'navbar-mobile-sheet']">
      <div class="flex items-center justify-between pb-4">
        <span class="text-base font-semibold">{{ t('more_options') }}</span>
        <button type="button" :class="actionButtonClasses" @click="closePanels">
          <X class="h-5 w-5" />
        </button>
      </div>
      <div class="space-y-4">
        <div class="space-y-2">
          <p class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{{ t('products') }}</p>
          <div class="grid gap-3">
            <details v-for="category in navbarCategories" :key="category.id" class="rounded-2xl border border-border px-4 py-3">
              <summary class="cursor-pointer list-none text-sm font-medium">
                <div class="flex items-center justify-between gap-3">
                  <span>{{ categoryLabel(category) }}</span>
                  <span class="flex items-center gap-2 text-xs text-muted-foreground">
                    {{ category.products.length }} {{ t('items') }}
                    <ChevronDown class="h-3.5 w-3.5" />
                  </span>
                </div>
              </summary>
              <div class="mt-3 space-y-2 pl-1">
                <Link :href="route('productsoncategory', { slug: category.slug })" class="block rounded-xl px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-accent/5" @click="closePanels">
                  {{ t('view_all_in', { category: categoryLabel(category) }) }}
                </Link>
                <Link v-for="product in category.products" :key="product.id" :href="route('product.details', { slug: product.slug })" class="block rounded-xl px-3 py-2 text-sm transition-colors hover:bg-accent/5" @click="closePanels">
                  {{ productLabel(product) }}
                </Link>
              </div>
            </details>
            <span v-if="!navbarCategories.length" class="rounded-2xl border border-border px-4 py-3 text-sm text-muted-foreground">
              {{ t('no_products_available') }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>