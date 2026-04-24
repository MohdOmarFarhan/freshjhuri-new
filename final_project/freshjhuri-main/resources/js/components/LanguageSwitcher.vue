<script setup>
import { onMounted, ref } from 'vue';
import { useLocalization } from '@/helper/localization';

const { locale: currentLocale, changeLanguage } = useLocalization();

const savedLanguage = ref(localStorage.getItem('selectedLanguage') ?? currentLocale.value);


// Function to switch the language and font
const setLanguage = (lang) => {
  changeLanguage(lang);
  document.body.className = lang === 'bn' ? ' font-bengali' : 'font-sans';

  localStorage.setItem('selectedLanguage', lang);
};

onMounted(() => {
  if (savedLanguage.value !== currentLocale.value) {
    setLanguage(savedLanguage.value);
  } else {

    document.body.className = savedLanguage.value === 'bn' ? 'font-bengali' : 'font-sans';
  }
});

</script>

<template>
  <div class="flex items-center justify-center">
    <div class="relative inline-flex w-20 h-8 bg-foreground  rounded-full shadow-inner">
      <button
        v-for="(lang, index) in [{ code: 'en', label: 'EN' }, { code: 'bn', label: 'বাং' }]"
        :key="lang.code"
        @click="setLanguage(lang.code)"
        :class="[
          'w-1/2 h-6 mx-1 rounded-full text-[11px] font-medium flex items-center justify-center transition-all mt-1',
          currentLocale === lang.code
            ? 'bg-accent text-light-primary shadow-md'
            : 'bg-secondary text-foreground hover:bg-light-tertiary',
          lang.code === 'bn' ? 'font-bengali' : 'font-sans',
          index === 0 ? 'ml-1' : 'mr-1'
        ]"
      >
        {{ lang.label }}
      </button>
    </div>
  </div>
</template>


<style>
button {
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}
button:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
