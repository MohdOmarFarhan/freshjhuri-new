<script setup>
import { Head, Link, router } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { ref, computed } from 'vue';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash, Eye } from 'lucide-vue-next';
import Vue3EasyDataTable from "vue3-easy-data-table";
import "vue3-easy-data-table/dist/style.css";
import Swal from 'sweetalert2';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

const props = defineProps({
    messages: Array,
});

const searchValue = ref("");
const showModal = ref(false);
const selectedMessage = ref(null);

const headers = [
    { text: "ID", value: "id", sortable: true },
    { text: "Email", value: "email", sortable: true },
    { text: "Phone", value: "phone", sortable: true },
    { text: "WhatsApp", value: "whatsapp", sortable: true },
    { text: "Date", value: "created_at", sortable: true },
    { text: "Actions", value: "action", sortable: false },
];

const breadcrumbs = [
    { title: "Dashboard", href: route('dashboard') },
    { title: "Contact Messages", href: route('contact.messages') },
];

const deleteMessage = (id) => {
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            router.delete(route('contactmessage.delete', id), {
                onSuccess: () => {
                    Swal.fire("Deleted!", "Message has been deleted.", "success");
                }
            });
        }
    });
};

const viewMessage = (message) => {
    selectedMessage.value = message;
    showModal.value = true;
};

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
};

const items = computed(() => {
    return props.messages.map(msg => ({
        ...msg,
        created_at: formatDate(msg.created_at)
    }));
});
</script>

<template>
    <Head title="Contact Messages" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="lg:w-full mx-auto p-4 sm:p-2 lg:p-8">
            <Card>
                <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle class="text-xl font-bold">Contact Messages</CardTitle>
                </CardHeader>
                <CardContent>
                    <!-- Success Message -->
                    <div v-if="$page.props.flash?.success" class="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded dark:bg-green-900/30 dark:border-green-800 dark:text-green-400">
                        {{ $page.props.flash.success }}
                    </div>

                    <div class="mb-4 flex justify-end">
                        <div class="relative max-w-sm w-full">
                            <input
                                v-model="searchValue"
                                type="text"
                                placeholder="Search messages..."
                                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <Vue3EasyDataTable
                        :headers="headers"
                        :items="items"
                        v-model:search-value="searchValue"
                        table-class-name="customize-table"
                        alternating
                        border-cell
                        buttons-pagination
                        :rows-per-page="10"
                    >
                        <template #item-action="item">
                            <div class="flex space-x-2 justify-end">
                                <button
                                    @click="viewMessage(item)"
                                    class="text-blue-600 hover:text-blue-900 hover:underline"
                                    title="View"
                                >
                                    <Eye class="w-4 h-4" />
                                </button>
                                <button
                                    @click="deleteMessage(item.id)"
                                    class="text-red-600 hover:text-red-900 hover:underline"
                                    title="Delete"
                                >
                                    <Trash class="w-4 h-4" />
                                </button>
                            </div>
                        </template>
                    </Vue3EasyDataTable>
                </CardContent>
            </Card>
        </div>

        <!-- Message Detail Modal -->
        <Dialog :open="showModal" @update:open="showModal = false">
            <DialogContent class="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Message Details</DialogTitle>
                    <DialogDescription>
                        Received on {{ selectedMessage ? formatDate(selectedMessage.created_at) : '' }}
                    </DialogDescription>
                </DialogHeader>
                
                <div v-if="selectedMessage" class="space-y-4 py-4">
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <h4 class="font-semibold text-sm text-gray-500">Email</h4>
                            <p>{{ selectedMessage.email }}</p>
                        </div>
                        <div>
                            <h4 class="font-semibold text-sm text-gray-500">Phone</h4>
                            <p>{{ selectedMessage.phone }}</p>
                        </div>
                        <div>
                            <h4 class="font-semibold text-sm text-gray-500">WhatsApp</h4>
                            <p>{{ selectedMessage.whatsapp }}</p>
                        </div>
                    </div>

                    <div v-if="selectedMessage.message_en">
                        <h4 class="font-semibold text-sm text-gray-500 mb-1">Message (English)</h4>
                        <div class="p-3 bg-gray-50 dark:bg-gray-900 rounded-md border text-sm whitespace-pre-wrap">
                            {{ selectedMessage.message_en }}
                        </div>
                    </div>

                    <div v-if="selectedMessage.message_bn">
                        <h4 class="font-semibold text-sm text-gray-500 mb-1">Message (Bengali)</h4>
                        <div class="p-3 bg-gray-50 dark:bg-gray-900 rounded-md border text-sm whitespace-pre-wrap">
                            {{ selectedMessage.message_bn }}
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button type="button" variant="secondary" @click="showModal = false">
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </AppLayout>
</template>