<script setup>
import { Head, Link, useForm, usePage } from '@inertiajs/vue3';
import { Loader2 } from 'lucide-vue-next';
import { computed, ref, watch, onMounted } from 'vue';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useLocalization } from '@/helper/localization';
import HomeLayout from '@/layouts/Home/HomeLayout.vue';

const page = usePage();
const { locale, t, toBanglaNumber, toEnglishNumber } = useLocalization();
const getLocalizedField = (field) => `${field}_${locale.value}`;

const props = defineProps({
    cartItems: {
        type: Array,
        required: true,
        default: () => []
    },
    subtotal: {
        type: Number,
        required: true,
        default: 0
    },
    shippingCost: {
        type: Number,
        default: 0
    },
    shippingRulesMissing: {
        type: Boolean,
        default: false
    },
    user: {
        type: Object,
        default: null
    },
    lastShippingAddress: {
        type: Object,
        default: null
    },
    divisions: {
        type: Array,
        default: () => []
    },
    districts: {
        type: Array,
        default: () => []
    },
    thanas: {
        type: Array,
        default: () => []
    },
    orderHasFreeShipping: {
        type: Boolean,
        default: false
    }
});

const common_settings = computed(() => page.props.common_settings || {});

// Filter districts based on selected division
const filteredDistricts = computed(() => {
    if (!form.division_id || !props.districts || props.districts.length == 0) {
        return [];
    }
    return props.districts.filter(d => d.division_id == form.division_id);
});

// Filter thanas based on selected district
const filteredThanas = computed(() => {
    if (!form.district_id || !props.thanas || props.thanas.length == 0) {
        return [];
    }
    return props.thanas.filter(t => t.district_id == form.district_id);
});

const orderHasFreeShipping = computed(() => {
    try {
        return props.orderHasFreeShipping || (
            Array.isArray(props.cartItems) &&
            props.cartItems.length > 0 &&
            props.cartItems.every(item => item?.variant?.product?.is_free_shipping == true)
        );
    } catch (error) {
        console.error('Error checking free shipping:', error);
        return false;
    }
});

const hasShippingRulesIssue = computed(() => {
    try {
        return !orderHasFreeShipping.value && Boolean(props.shippingRulesMissing);
    } catch (error) {
        console.error('Error checking shipping rules:', error);
        return false;
    }
});

const effectiveShippingCost = computed(() => {
    try {
        return orderHasFreeShipping.value ? 0 : Number(props.shippingCost || 0);
    } catch (error) {
        console.error('Error calculating shipping cost:', error);
        return 0;
    }
});

// Initialize form with safe values
const form = useForm({
    name: props.lastShippingAddress?.name || props.user?.name || '',
    phone: props.lastShippingAddress?.phone || props.user?.phone || '',
    email: props.user?.email || '',
    division_id: props.lastShippingAddress?.division_id?.toString() || '',
    district_id: props.lastShippingAddress?.district_id?.toString() || '',
    thana_id: props.lastShippingAddress?.thana_id?.toString() || '',
    address: props.lastShippingAddress?.address || props.user?.address || '',
    notes: '',
    payment_type: 'cod',
});

// Ensure phone number is always in English digits
watch(() => form.phone, (newVal) => {
    if (newVal) {
        const converted = toEnglishNumber(newVal);
        if (converted !== newVal) {
            form.phone = converted;
        }
    }
});

// Reset district and thana when division changes
watch(() => form.division_id, (newVal) => {
    form.district_id = '';
    form.thana_id = '';
});

// Reset thana when district changes
watch(() => form.district_id, (newVal) => {
    form.thana_id = '';
});

const total = computed(() => {
    try {
        return Number(props.subtotal || 0) + effectiveShippingCost.value;
    } catch (error) {
        console.error('Error calculating total:', error);
        return 0;
    }
});

const submit = () => {
    form.post(route('order.store'));
};

const getImageUrl = (path) => {
    try {
        if (!path) return '/placeholder.png';
        return path.startsWith('http') || path.startsWith('/') ? path : `/${path}`;
    } catch (error) {
        return '/placeholder.png';
    }
};

// Debug mounted to check data
onMounted(() => {
    console.log('Checkout component mounted');
    console.log('Divisions:', props.divisions);
    console.log('Districts:', props.districts);
    console.log('Thanas:', props.thanas);
    console.log('Cart Items:', props.cartItems);
});
</script>

<template>
    <HomeLayout :navbarFloating="true">
        <Head title="Checkout" />
        <div class="container mt-16 mx-auto px-4 py-8">
            <h1 class="text-3xl font-bold mb-8 text-center text-primary">{{ t('title') }}</h1>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Left Column: Shipping & Payment Form -->
                <div class="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle class="text-primary">{{ t('shipping_info') }}</CardTitle>
                        </CardHeader>
                        <CardContent class="space-y-4">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div class="space-y-2">
                                    <Label for="name">{{ t('full_name') }} <span class="text-red-500">*</span></Label>
                                    <Input id="name" v-model="form.name" :placeholder="t('name_placeholder')" class="focus-visible:ring-primary" />
                                    <span v-if="form.errors.name" class="text-xs text-red-500">{{ form.errors.name }}</span>
                                </div>
                                <div class="space-y-2">
                                    <Label for="phone">{{ t('phone_number') }} <span class="text-red-500">*</span></Label>
                                    <Input id="phone" v-model="form.phone" :placeholder="t('phone_placeholder')" class="focus-visible:ring-primary" />
                                    <span v-if="form.errors.phone" class="text-xs text-red-500">{{ form.errors.phone }}</span>
                                </div>
                            </div>

                            <div class="space-y-2">
                                <Label for="email">{{ t('email_address') }}</Label>
                                <Input id="email" type="email" v-model="form.email" :placeholder="t('email_placeholder')" class="focus-visible:ring-primary" />
                                <span v-if="form.errors.email" class="text-xs text-red-500">{{ form.errors.email }}</span>
                            </div>

                            <!-- Location Dropdowns - Using props data directly -->
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <!-- Division Dropdown -->
                                <div class="space-y-2">
                                    <Label for="division">{{ t('division') }} <span class="text-red-500">*</span></Label>
                                    <select
                                        id="division"
                                        v-model="form.division_id"
                                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <option value="" disabled>{{ t('select_division') }}</option>
                                        <template v-if="divisions && divisions.length">
                                            <option v-for="division in divisions" :key="division.id" :value="division.id.toString()">
                                                {{ locale == 'bn' ? (division.bn_name || division.name) : division.name }}
                                            </option>
                                        </template>
                                    </select>
                                    <span v-if="form.errors.division_id" class="text-xs text-red-500">{{ form.errors.division_id }}</span>
                                </div>

                                <!-- District Dropdown -->
                                <div class="space-y-2">
                                    <Label for="district">{{ t('district') }} <span class="text-red-500">*</span></Label>
                                    <select
                                        id="district"
                                        v-model="form.district_id"
                                        :disabled="!form.division_id || filteredDistricts.length == 0"
                                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <option value="" disabled>{{ t('select_district') }}</option>
                                        <option v-for="district in filteredDistricts" :key="district.id" :value="district.id.toString()">
                                            {{ locale == 'bn' ? (district.bn_name || district.name) : district.name }}
                                        </option>
                                    </select>
                                    <span v-if="form.errors.district_id" class="text-xs text-red-500">{{ form.errors.district_id }}</span>
                                </div>

                                <!-- Thana Dropdown -->
                                <div class="space-y-2">
                                    <Label for="thana">{{ t('thana') }} <span class="text-red-500">*</span></Label>
                                    <select
                                        id="thana"
                                        v-model="form.thana_id"
                                        :disabled="!form.district_id || filteredThanas.length == 0"
                                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <option value="" disabled>{{ t('select_thana') }}</option>
                                        <option v-for="thana in filteredThanas" :key="thana.id" :value="thana.id.toString()">
                                            {{ locale == 'bn' ? (thana.bn_name || thana.name) : thana.name }}
                                        </option>
                                    </select>
                                    <span v-if="form.errors.thana_id" class="text-xs text-red-500">{{ form.errors.thana_id }}</span>
                                </div>
                            </div>

                            <div class="space-y-2">
                                <Label for="address">{{ t('address') }} <span class="text-red-500">*</span></Label>
                                <Textarea id="address" v-model="form.address" :placeholder="t('address_placeholder')" class="focus-visible:ring-primary" />
                                <span v-if="form.errors.address" class="text-xs text-red-500">{{ form.errors.address }}</span>
                            </div>

                            <div class="space-y-2">
                                <Label for="notes">{{ t('order_notes') }}</Label>
                                <Textarea id="notes" v-model="form.notes" :placeholder="t('notes_placeholder')" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle class="text-primary">{{ t('payment_method') }}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <RadioGroup v-model="form.payment_type" default-value="cod" class="space-y-3">
                                <div class="flex items-center space-x-2 border p-3 rounded-md cursor-pointer crud-row"
                                     :class="{'border-primary bg-primary/5': form.payment_type == 'cod'}"
                                     @click="form.payment_type = 'cod'">
                                    <RadioGroupItem id="cod" value="cod" class="text-primary border-primary" />
                                    <Label for="cod" class="cursor-pointer flex-1 font-medium">{{ t('cod') }}</Label>
                                </div>
                                <!-- Future Payment Methods -->
                                <div class="flex items-center space-x-2 border p-3 rounded-md opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-900">
                                    <RadioGroupItem id="prepaid" value="prepaid" disabled />
                                    <Label for="prepaid">{{ t('online_payment') }}</Label>
                                </div>
                            </RadioGroup>
                            <span v-if="form.errors.payment_type" class="text-xs text-red-500">{{ form.errors.payment_type }}</span>
                        </CardContent>
                    </Card>
                </div>

                <!-- Right Column: Order Summary -->
                <div class="lg:col-span-1">
                    <Card class="sticky top-4 border-t-4 border-t-primary shadow-lg">
                        <CardHeader>
                            <CardTitle class="text-primary">{{ t('order_summary') }}</CardTitle>
                        </CardHeader>
                        <CardContent class="space-y-4">
                            <div class="space-y-3 max-h-60 overflow-y-auto pr-2">
                                <template v-if="cartItems && cartItems.length">
                                    <div v-for="item in cartItems" :key="item.id" class="flex gap-3 text-sm">
                                        <div class="w-12 h-12 shrink-0 bg-gray-100 rounded overflow-hidden">
                                            <img :src="getImageUrl(item.variant?.product?.feature_image)" class="w-full h-full object-cover" />
                                        </div>
                                        <div class="flex-1">
                                            <p class="font-medium line-clamp-2">{{ item.variant?.product?.[getLocalizedField('title')] }}</p>
                                            <p class="text-gray-500 text-xs">
                                                {{ locale == 'bn' ? toBanglaNumber(item.qty) : item.qty }} x {{ locale == 'bn' ? toBanglaNumber(Number(item.unit_price).toFixed(2)) : Number(item.unit_price).toFixed(2) }}
                                                <span v-if="item.variant?.size">({{ item.variant.size[getLocalizedField('amount')] }} {{ item.variant.size[getLocalizedField('unit')] }})</span>
                                            </p>
                                        </div>
                                        <div class="font-medium">
                                            {{ locale == 'bn' ? toBanglaNumber((item.qty * item.unit_price).toFixed(2)) : (item.qty * item.unit_price).toFixed(2) }}
                                        </div>
                                    </div>
                                </template>
                                <div v-else class="text-center text-gray-500 py-4">
                                    No items in cart
                                </div>
                            </div>

                            <Separator />

                            <div class="space-y-2 text-sm">
                                <div class="flex justify-between">
                                    <span class="text-gray-600 dark:text-gray-400">{{ t('subtotal') }}</span>
                                    <span class="font-medium">{{ locale == 'bn' ? toBanglaNumber(Number(subtotal).toFixed(2)) : Number(subtotal).toFixed(2) }} {{ locale == 'bn' ? '৳' : 'BDT' }}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-600 dark:text-gray-400">
                                        {{ t('shipping') }}
                                        <span v-if="!orderHasFreeShipping" class="text-xs text-red-500 font-bold align-super">*</span>
                                    </span>
                                    <span class="font-medium">
                                        <template v-if="orderHasFreeShipping">
                                            {{ locale == 'bn' ? toBanglaNumber(0) : 0 }} {{ locale == 'bn' ? '৳' : 'BDT' }}
                                            <span class="ml-1 text-xs text-green-600">({{ t('free_shipping') }})</span>
                                        </template>
                                        <template v-else-if="hasShippingRulesIssue">
                                            <span class="text-red-500">
                                                {{ locale == 'bn' ? 'শিপিং রুল সেট করা নেই' : 'Shipping rules missing' }}
                                            </span>
                                        </template>
                                        <template v-else>
                                            {{ locale == 'bn' ? toBanglaNumber(Number(shippingCost).toFixed(2)) : Number(shippingCost).toFixed(2) }} {{ locale == 'bn' ? '৳' : 'BDT' }}
                                        </template>
                                    </span>
                                </div>
                                <div v-if="hasShippingRulesIssue" class="text-xs text-red-400">
                                    <span class="align-super">*</span>
                                    {{ t('conditions_apply') }}
                                    <a :href="`tel:${common_settings?.phone}`" class="ml-1" v-if="common_settings?.phone">
                                        {{ locale == 'bn' ? toBanglaNumber(common_settings?.phone) : common_settings?.phone }}
                                    </a>
                                </div>
                                <Separator />
                                <div class="flex justify-between text-lg font-bold">
                                    <span>{{ t('total') }}</span>
                                    <span class="text-primary">{{ locale == 'bn' ? toBanglaNumber(total.toFixed(2)) : total.toFixed(2) }} {{ locale == 'bn' ? '৳' : 'BDT' }}</span>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button class="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg h-12" size="lg" :disabled="form.processing || hasShippingRulesIssue" @click="submit">
                                <Loader2 v-if="form.processing" class="w-5 h-5 mr-2 animate-spin" />
                                {{ form.processing ? t('processing') : t('place_order') }}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    </HomeLayout>
</template>
