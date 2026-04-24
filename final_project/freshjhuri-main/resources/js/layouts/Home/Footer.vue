<script setup>
import { usePage, Link } from "@inertiajs/vue3";
import { Mail, PhoneCall, MapPin, Smartphone } from 'lucide-vue-next';
import { computed } from "vue";
import { useLocalization } from "@/helper/localization";

const { locale, t } = useLocalization();

const getLocalizedField = (field) => {
    return locale.value === 'bn' ? `${field}_bn` : `${field}_en`;
};

const page = usePage();
const footerSettings = computed(() => page.props.footer_settings);
const commonSettings = computed(() => page.props.commonsetting ?? page.props.common_settings);
const categories = computed(() => page.props.categories);
const socials = computed(() => page.props.socials);

const currentYear = new Date().getFullYear();

const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `/storage/${path}`;
};
</script>

<template>
  <footer v-if="footerSettings" class="bg-accent-foreground dark:bg-card text-primary-foreground dark:text-foreground pt-16 pb-8 mt-auto border-t dark:border-border">
    <div class="container mx-auto px-4">

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">

        <!-- Column 1 -->
        <div class="space-y-4">
          <div v-if="footerSettings.logo" class="mb-4 p-2 rounded-lg inline-block">
             <img :src="getImageUrl(footerSettings.logo)" alt="Logo" class="h-28 w-auto object-contain" />
          </div>

          <p class="text-sm opacity-90 leading-relaxed text-justify">
            {{ footerSettings[getLocalizedField('description')] }}
          </p>
        </div>

        <!-- Column 2 -->
        <div>
          <h3 class="text-lg font-bold mb-4 uppercase tracking-wider border-b-2 border-accent inline-block pb-1">
            {{ t('category') }}
          </h3>

          <ul class="space-y-2">
            <li v-for="category in categories.slice(0, 6)" :key="category.id">
              <Link
                :href="route('productsoncategory', { slug: category.slug })"
                class="text-sm hover:text-accent transition-colors duration-200 flex items-center gap-2 group"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-accent group-hover:scale-125 transition-transform"></span>
                {{ category[locale === 'bn' ? 'name_bn' : 'name_en'] }}
              </Link>
            </li>
          </ul>
        </div>

        <!-- Column 3 -->
        <div>
          <h3 class="text-lg font-bold mb-4 uppercase tracking-wider border-b-2 border-accent inline-block pb-1">
            {{ t('contactus') }}
          </h3>

          <ul class="space-y-4">
            <li class="flex items-start gap-3">
              <MapPin class="w-5 h-5 mt-0.5 text-accent shrink-0" />
              <span class="text-sm opacity-90">
                {{ footerSettings[getLocalizedField('office_address')] }}
              </span>
            </li>

            <li class="flex items-center gap-3">
              <Smartphone class="w-5 h-5 text-accent shrink-0" />
              <a :href="`tel:${footerSettings[getLocalizedField('mobile')]}`" class="text-sm hover:text-accent transition-colors">
                  {{ footerSettings[getLocalizedField('mobile')] }}
              </a>
            </li>

            <li v-if="footerSettings[getLocalizedField('hotline')]" class="flex items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                class="w-5 h-5 fill-current text-accent shrink-0"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <a :href="`tel:${footerSettings[getLocalizedField('hotline')]}`" class="text-sm hover:text-accent transition-colors">
                  {{ footerSettings[getLocalizedField('hotline')] }}
              </a>
            </li>
          </ul>
        </div>

        <!-- Column 4 -->
        <div v-if="footerSettings.image">
             <img
               :src="getImageUrl(footerSettings.image)"
               alt="Footer Image"
               class="w-full h-auto rounded-lg shadow-lg border-2 border-primary-foreground/10 hover:scale-105 transition-transform duration-300"
             />
        </div>

      </div>

      <!-- Bottom Section -->
      <div class="border-t border-primary-foreground/20 pt-6 mt-6">

        <div class="flex flex-col md:flex-row justify-between items-center gap-4">

          <!-- Copyright -->
          <p class="text-sm opacity-70">
            © {{ currentYear }}
            <span class="font-medium">
              {{ commonSettings?.project_name  }}
            </span>.
            {{ t('all_rights_reserved') || 'All rights reserved.' }}
          </p>

          <!-- Social + Developer -->
          <div class="flex items-center gap-6">

            <div v-if="socials && socials.length > 0" class="flex gap-3">
                <a
                    v-for="social in socials"
                    :key="social.id"
                    :href="social.link"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="bg-white/90 p-2 rounded-full hover:bg-white transition-all duration-200"
                >
                    <img
                        :src="getImageUrl(social.image)"
                        :alt="social.name"
                        class="w-4 h-4 object-contain"
                    />
                </a>
            </div>

            <div class="text-sm opacity-60">
              Developed by
              <a
                href="https://prismtechbd.com"
                target="_blank"
                class="font-semibold hover:text-accent transition-colors"
              >
                Prism Tech BD
              </a>
            </div>

          </div>
        </div>
      </div>

    </div>
  </footer>
</template>
