<script setup>
import { Head, Link } from '@inertiajs/vue3';
import { ShoppingCart, Package, Users, MessageSquare, TrendingUp, AlertTriangle } from 'lucide-vue-next';
import { route } from 'ziggy-js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/AppLayout.vue';

const props = defineProps({
    stats: Object,
    recentOrders: Array,
    recentMessages: Array,
    isAdmin: Boolean,
});

const breadcrumbs = [
    {
        title: 'Dashboard',
        href: route('dashboard'),
    },
];

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-BD', { style: 'currency', currency: 'BDT' }).format(amount);
};

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
};
</script>

<template>
    <Head title="Dashboard" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col gap-6 p-4">

            <!-- Stats Grid -->
            <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

                <!-- Admin Stats -->
                <template v-if="isAdmin">
                    <Card v-if="stats.total_orders !== undefined">
                        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle class="text-sm font-medium">Total Orders</CardTitle>
                            <ShoppingCart class="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div class="text-2xl font-bold">{{ stats.total_orders }}</div>
                            <p class="text-xs text-muted-foreground" v-if="stats.pending_orders">
                                {{ stats.pending_orders }} Pending
                            </p>
                        </CardContent>
                    </Card>

                    <Card v-if="stats.total_sales !== undefined">
                        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle class="text-sm font-medium">Total Sales</CardTitle>
                            <TrendingUp class="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div class="text-2xl font-bold">{{ formatCurrency(stats.total_sales) }}</div>
                            <p class="text-xs text-muted-foreground" v-if="stats.today_sales">
                                +{{ formatCurrency(stats.today_sales) }} today
                            </p>
                        </CardContent>
                    </Card>

                    <Card v-if="stats.total_products !== undefined">
                        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle class="text-sm font-medium">Products</CardTitle>
                            <Package class="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div class="text-2xl font-bold">{{ stats.total_products }}</div>
                            <p class="text-xs text-red-500 font-medium" v-if="stats.low_stock_products > 0">
                                <AlertTriangle class="inline h-3 w-3 mr-1" />
                                {{ stats.low_stock_products }} Low Stock
                            </p>
                        </CardContent>
                    </Card>

                    <Card v-if="stats.total_users !== undefined">
                        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle class="text-sm font-medium">Total Users</CardTitle>
                            <Users class="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div class="text-2xl font-bold">{{ stats.total_users }}</div>
                        </CardContent>
                    </Card>

                    <Card v-if="stats.total_visitors !== undefined">
                        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle class="text-sm font-medium">Visitors</CardTitle>
                            <Users class="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div class="text-2xl font-bold">{{ stats.total_visitors }}</div>
                            <p class="text-xs text-muted-foreground" v-if="stats.today_visitors">
                                +{{ stats.today_visitors }} today
                            </p>
                        </CardContent>
                    </Card>

                     <Card v-if="stats.unread_messages !== undefined">
                        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle class="text-sm font-medium">Messages</CardTitle>
                            <MessageSquare class="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div class="text-2xl font-bold">{{ stats.unread_messages }}</div>
                        </CardContent>
                    </Card>
                </template>

                <!-- Customer Stats -->
                <template v-else>
                    <Card>
                        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle class="text-sm font-medium">My Orders</CardTitle>
                            <ShoppingCart class="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div class="text-2xl font-bold">{{ stats.my_orders || 0 }}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle class="text-sm font-medium">Total Spent</CardTitle>
                            <TrendingUp class="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div class="text-2xl font-bold">{{ formatCurrency(stats.my_spent || 0) }}</div>
                        </CardContent>
                    </Card>
                </template>
            </div>

            <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <!-- Recent Orders -->
                <Card class="col-span-4" v-if="recentOrders && recentOrders.length > 0">
                    <CardHeader>
                        <CardTitle>Recent Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div class="space-y-4">
                            <div v-for="order in recentOrders" :key="order.id" class="flex items-center justify-between border-b pb-2 last:border-0">
                                <div class="flex flex-col">
                                    <span class="font-medium">Order #{{ order.id }}</span>
                                    <span class="text-sm text-muted-foreground">{{ formatDate(order.created_at) }}</span>
                                </div>
                                <div class="flex items-center gap-4">
                                    <span class="font-bold">{{ formatCurrency(order.pay_amount) }}</span>
                                    <span
                                        class="px-2 py-1 rounded-full text-xs font-medium"
                                        :class="{
                                            'bg-yellow-100 text-yellow-800': order.status === 'Pending',
                                            'bg-blue-100 text-blue-800': order.status === 'Processing',
                                            'bg-green-100 text-green-800': order.status === 'Delivered',
                                            'bg-red-100 text-red-800': order.status === 'Cancelled',
                                        }"
                                    >
                                        {{ order.status }}
                                    </span>
                                    <Link :href="route(isAdmin ? 'orders.show' : 'user.orders.show', order.id)" class="text-sm text-blue-600 hover:underline">View</Link>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <!-- Recent Messages (Admin Only) -->
                <Card class="col-span-3" v-if="isAdmin && recentMessages && recentMessages.length > 0">
                    <CardHeader>
                        <CardTitle>Recent Messages</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div class="space-y-4">
                            <div v-for="msg in recentMessages" :key="msg.id" class="flex items-start gap-3 border-b pb-3 last:border-0">
                                <div class="bg-primary/10 p-2 rounded-full">
                                    <MessageSquare class="h-4 w-4 text-primary" />
                                </div>
                                <div class="flex-1 overflow-hidden">
                                    <div class="flex justify-between items-center mb-1">
                                        <span class="font-medium text-sm truncate">{{ msg.email }}</span>
                                        <span class="text-xs text-muted-foreground">{{ formatDate(msg.created_at) }}</span>
                                    </div>
                                    <p class="text-xs text-muted-foreground truncate">
                                        {{ msg.message_en || msg.message_bn || 'No content' }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    </AppLayout>
</template>
