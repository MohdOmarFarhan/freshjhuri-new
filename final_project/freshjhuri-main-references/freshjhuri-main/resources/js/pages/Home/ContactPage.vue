<script setup>
import { useForm, usePage, Head } from '@inertiajs/vue3';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useLocalization } from "@/helper/localization";
import HomeLayout from '@/layouts/Home/HomeLayout.vue';

const { t, locale, toBanglaNumber } = useLocalization();

const form = useForm({
  email: '',
  phone: '',
  whatsapp: '',
  message_en: '',
  message_bn: '',
});

defineProps({
  errors: Object,
  contactDetail: Array,
});

const getLocalizedField = (field) => `${field}_${locale.value}`;

const submit = () => {
  form.post(route('send.email'), {
    onSuccess: () => {
      form.reset();
    },
  });
};

const { props } = usePage();

const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `/storage/${path}`;
};
</script>

<template>

<HomeLayout :navbarFloating="true"> 
  <Head title="Contact Us" />
  <section class="w-full bg-background min-h-[85vh] py-12  md:py-20">
    <div class="container mx-auto px-4 md:px-6">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-foreground">
          {{ t('contact_us') }}
        </h2>
        <div class="w-20 h-1.5 bg-primary mx-auto mt-4 rounded-full"></div>
        
      </div>

      <div class="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
        <!-- Contact Information Cards -->
        <div class="flex flex-col gap-6">
          <Card
            v-for="data in contactDetail"
            :key="data.id"
            class="group overflow-hidden shadow-lg border-muted transition-all hover:shadow-xl"
          >
            <!-- Image Section -->
            <div class="relative h-48 w-full overflow-hidden">
              <img
                :src="getImageUrl(data.image)"
                alt="Office Location"
                class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div class="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>
              <div class="absolute bottom-4 left-4 text-white">
                <h3 class="text-xl font-bold">{{ t('corporate_office') }}</h3>
                <p class="text-sm opacity-90">{{ data[getLocalizedField('corporate_office')] }}</p>
              </div>
            </div>

            <!-- Contact Details -->
            <CardContent class="p-6 space-y-4">
              <div class="flex items-center space-x-4">
                <div class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Phone class="h-5 w-5" />
                </div>
                <div>
                  <p class="text-sm font-medium leading-none text-muted-foreground">{{ t('phone') }}</p>
                  <p class="text-sm font-medium mt-1">{{ locale === 'bn' ? toBanglaNumber(data.phone) : data.phone }}</p>
                </div>
              </div>

              <div class="flex items-center space-x-4">
                <div class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <MessageCircle class="h-5 w-5" />
                </div>
                <div>
                  <p class="text-sm font-medium leading-none text-muted-foreground">{{ t('whatsapp') }}</p>
                  <p class="text-sm font-medium mt-1">{{ locale === 'bn' ? toBanglaNumber(data.whats_app) : data.whats_app }}</p>
                </div>
              </div>

              <div class="flex items-center space-x-4">
                <div class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Mail class="h-5 w-5" />
                </div>
                <div>
                  <p class="text-sm font-medium leading-none text-muted-foreground">{{ t('email') }}</p>
                  <p class="text-sm font-medium mt-1 break-all">{{ data.email }}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- Contact Form -->
        <Card class="shadow-lg border-muted">
          <CardHeader>
            <CardTitle class="text-2xl font-bold text-center">{{ t('send_message') }}</CardTitle>
            <CardDescription class="text-center">
              {{ t('contact_description') }}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form @submit.prevent="submit" class="space-y-6">
              <div v-if="props.flash?.message" class="p-3 rounded-md bg-green-50 text-green-600 text-sm border border-green-200 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400">
                {{ props.flash.message }}
              </div>
              <div v-if="props.flash?.error" class="p-3 rounded-md bg-red-50 text-red-600 text-sm border border-red-200 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
                {{ props.flash.error }}
              </div>

              <div class="space-y-2">
                <label for="email" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{{ t('email') }}</label>
                <Input
                  id="email"
                  v-model="form.email"
                  type="email"
                  placeholder="name@example.com"
                  required
                />
                <p v-if="form.errors.email" class="text-sm text-red-500">{{ form.errors.email }}</p>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label for="phone" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{{ t('phone') }}</label>
                  <Input
                    id="phone"
                    v-model="form.phone"
                    type="text"
                    placeholder="+880..."
                    required
                  />
                  <p v-if="form.errors.phone" class="text-sm text-red-500">{{ form.errors.phone }}</p>
                </div>

                <div class="space-y-2">
                  <label for="whatsapp" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{{ t('whatsapp') }}</label>
                  <Input
                    id="whatsapp"
                    v-model="form.whatsapp"
                    type="text"
                    placeholder="+880..."
                    required
                  />
                   <p v-if="form.errors.whatsapp" class="text-sm text-red-500">{{ form.errors.whatsapp }}</p>
                </div>
              </div>

              <div class="space-y-2">
                <label for="message_en" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{{ t('message') }}</label>
                <Textarea
                  id="message_en"
                  v-model="form[getLocalizedField('message')]"
                  placeholder="How can we help you?"
                  class="min-h-30"
                  required
                />
                 <p v-if="form.errors.message_en" class="text-sm text-red-500">{{ form.errors.message_en }}</p>
              </div>

              <Button type="submit" class="w-full" size="lg" :disabled="form.processing">
                {{ form.processing ? t('sending') : t('send_message_btn') }}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  </section>
  </HomeLayout>
</template>
