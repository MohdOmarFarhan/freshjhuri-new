<script setup>
import { Head, Link, usePage } from '@inertiajs/vue3';
import { onMounted, computed } from 'vue';
import AppLogoIcon from '@/components/AppLogoIcon.vue';

const props = defineProps({
    order: Object,
});

const page = usePage();
const common_settings = computed(() => page.props.common_settings);

onMounted(() => {
    setTimeout(() => window.print(), 100);
});
</script>

<template>
    <Head :title="`Order #${order.id} Invoice`" />

    <div class="max-w-4xl mx-auto p-6 print:p-0">
        <div class="flex items-center justify-between mb-6 print:hidden">
            <Link :href="route('orders.show', order.id)" class="text-primary hover:underline">Back</Link>
            <button
                type="button"
                class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                @click="window.print()"
            >
                Print
            </button>
        </div>

        <div class="bg-card border border-border rounded-lg p-6 print:border-0 print:p-0">
            <!-- Header with Logo and Company Info -->
            <div class="flex items-start justify-between border-b border-border pb-6 mb-6">
                <div class="flex items-center gap-4">
                    <div class="w-16 h-16 flex items-center justify-center">
                        <AppLogoIcon class="w-full h-full object-contain" />
                    </div>
                    <div>
                        <h1 class="text-2xl font-bold text-foreground">{{ common_settings?.project_name || 'Unique Agro' }}</h1>
                        <p class="text-sm text-muted-foreground">{{ common_settings?.address_en || 'Dhaka, Bangladesh' }}</p>
                        <p class="text-sm text-muted-foreground">{{ common_settings?.phone || '+880 1234-567890' }}</p>
                        <p class="text-sm text-muted-foreground">{{ common_settings?.email || 'info@uniqueagro.com' }}</p>
                    </div>
                </div>
                <div class="text-right">
                    <h2 class="text-3xl font-bold text-primary mb-2">INVOICE</h2>
                    <p class="text-sm text-muted-foreground font-medium">#{{ order.id }}</p>
                    <p class="text-sm text-muted-foreground">
                        Date: {{ new Date(order.created_at).toLocaleDateString() }}
                    </p>
                    <div class="mt-2 inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide border" 
                         :class="{
                            'bg-green-100 text-green-800 border-green-200': order.payment_status === 'paid',
                            'bg-red-100 text-red-800 border-red-200': order.payment_status !== 'paid'
                         }">
                        {{ order.due_amount > 0 ? 'Unpaid' : 'Paid' }}
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-2 gap-8 mb-8">
                <div>
                    <h3 class="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Bill To</h3>
                    <div class="text-foreground">
                        <p class="font-bold text-lg">{{ order.shipping_address?.name || 'Guest Customer' }}</p>
                        <p class="text-sm">{{ order.shipping_address?.address || '-' }}</p>
                        <p class="text-sm">
                            {{ order.shipping_address?.thana?.name || '' }}, 
                            {{ order.shipping_address?.district?.name || '' }}
                        </p>
                        <p class="text-sm mt-1">{{ order.shipping_address?.phone || '-' }}</p>
                        <p class="text-sm">{{ order.user?.email || '' }}</p>
                    </div>
                </div>
                <!-- Optional: Ship To if different, or just order details -->
            </div>

            <div class="border border-border rounded-lg overflow-hidden mb-6">
                <table class="w-full text-sm">
                    <thead class="bg-muted/50 border-b border-border">
                        <tr>
                            <th class="text-left px-4 py-3 font-semibold text-muted-foreground">Product Details</th>
                            <th class="text-center px-4 py-3 font-semibold text-muted-foreground">Size</th>
                            <th class="text-center px-4 py-3 font-semibold text-muted-foreground">Qty</th>
                            <th class="text-right px-4 py-3 font-semibold text-muted-foreground">Unit Price</th>
                            <th class="text-right px-4 py-3 font-semibold text-muted-foreground">Total</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-border">
                        <tr v-for="item in order.items" :key="item.id">
                            <td class="px-4 py-3">
                                <p class="font-medium text-foreground">
                                    {{ item.variant?.product?.title_en || item.product_name || 'Unknown Product' }}
                                </p>
                            </td>
                            <td class="px-4 py-3 text-center text-foreground">
                                {{ item.variant?.size?.amount }} {{ item.variant?.size?.unit_en }}
                            </td>
                            <td class="px-4 py-3 text-center text-foreground">{{ item.qty }}</td>
                            <td class="px-4 py-3 text-right text-foreground">৳{{ item.unit_price }}</td>
                            <td class="px-4 py-3 text-right font-medium text-foreground">৳{{ item.subtotal }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="flex justify-end">
                <div class="w-72 space-y-3">
                    <div class="flex justify-between text-sm">
                        <span class="text-muted-foreground">Subtotal</span>
                        <span class="font-medium text-foreground">৳{{ order.subtotal }}</span>
                    </div>
                    <div class="flex justify-between text-sm">
                        <span class="text-muted-foreground">Shipping Cost</span>
                        <span class="font-medium text-foreground">৳{{ order.shipping_cost }}</span>
                    </div>
                    <div v-if="order.special_discount > 0" class="flex justify-between text-sm text-red-600">
                        <span>Discount</span>
                        <span>-৳{{ order.special_discount }}</span>
                    </div>
                    <div class="border-t border-border pt-3 mt-3">
                        <div class="flex justify-between items-end">
                            <span class="font-bold text-lg text-foreground">Total</span>
                            <span class="font-bold text-xl text-primary">৳{{ order.pay_amount }}</span>
                        </div>
                        <div v-if="order.due_amount > 0" class="flex justify-between text-sm text-red-600 mt-1">
                            <span>Due Amount</span>
                            <span>৳{{ order.due_amount }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="order.admin_note" class="mt-8 border-t border-border pt-4 print:mt-12">
                <h4 class="text-sm font-semibold text-muted-foreground mb-1">Note:</h4>
                <p class="text-sm text-foreground italic">{{ order.admin_note }}</p>
            </div>
            
            <!-- Footer Signature Area (Optional for print) -->
            <div class="mt-16 pt-8 border-t border-dashed border-border flex justify-between print:flex hidden">
                <div class="text-center">
                    <div class="border-t border-foreground w-32 mx-auto mb-2"></div>
                    <p class="text-xs text-muted-foreground">Customer Signature</p>
                </div>
                <div class="text-center">
                    <div class="border-t border-foreground w-32 mx-auto mb-2"></div>
                    <p class="text-xs text-muted-foreground">Authorized Signature</p>
                </div>
            </div>
        </div>
    </div>
</template>
