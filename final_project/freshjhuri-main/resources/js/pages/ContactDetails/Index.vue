<script setup>
import { Head, Link, router } from "@inertiajs/vue3";
import { SquarePen, Trash, Plus, Phone, Mail, MapPin } from "lucide-vue-next";
import { computed, ref } from "vue";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { confirmDeletion } from "@/helper/sweetAlertHelpers";
import AppLayout from "@/layouts/AppLayout.vue";
import { can } from "@/lib/can";

const props = defineProps({
    contactdetails: {
        type: Object,
        required: true,
    },
});

const breadcrumbs = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Contact Details", href: "/contact/details" },
];

const headers = [
    { text: "Serial", value: "serial", sortable: true },
    { text: "Image", value: "image", sortable: false },
    { text: "Phone", value: "phone", sortable: true },
    { text: "WhatsApp", value: "whats_app", sortable: true },
    { text: "Email", value: "email", sortable: true },
    { text: "Corporate Office (EN)", value: "corporate_office_en", sortable: true },
    { text: "Created At", value: "created_at", sortable: true },
    { text: "Action", value: "action", sortable: false },
];

const searchValue = ref("");
const sortBy = ref("");
const sortType = ref("asc");

const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    return `/storage/${path}`;
};

const formattedContactDetails = computed(() => {
    // Handle both paginated (data property) and collection/array responses
    const items = props.contactdetails?.data ?? props.contactdetails ?? [];
    
    // Ensure items is an array before mapping
    if (!Array.isArray(items)) {
        console.warn('contactdetails is not an array:', items);
        return [];
    }

    return items
        .map((item, index) => ({
            serial: index + 1,
            id: item.id,
            phone: item.phone || "—",
            whats_app: item.whats_app || "—",
            email: item.email || "—",
            corporate_office_en: item.corporate_office_en || "—",
            image: item.image,
            image_url: getImageUrl(item.image),
            created_at: new Date(item.created_at).toLocaleDateString(),
        }))
        .filter((item) => {
            if (!searchValue.value) return true;
            const term = searchValue.value.toLowerCase();
            return (
                item.phone.toLowerCase().includes(term) ||
                item.whats_app.toLowerCase().includes(term) ||
                item.email.toLowerCase().includes(term) ||
                item.corporate_office_en.toLowerCase().includes(term)
            );
        })
        .sort((a, b) => {
            if (!sortBy.value) return 0;
            const aValue = a[sortBy.value];
            const bValue = b[sortBy.value];
            if (aValue === bValue) return 0;
            if (sortType.value === "asc") {
                return aValue > bValue ? 1 : -1;
            }
            return aValue < bValue ? 1 : -1;
        });
});

const deleteContactDetail = (id) => {
    confirmDeletion(() => {
        router.delete(route("contactdetail.delete", id));
    });
};
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head title="Contact Details" />

        <div class="lg:w-full mx-auto p-4 sm:p-2 lg:p-8">
            <Card>
                <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle class="text-xl font-bold">Contact Details</CardTitle>
                    <Button v-if="can('CONTACT_CREATE')" as-child>
                        <Link :href="route('contactdetail.create')">
                            <Plus class="mr-2 h-4 w-4" /> Add Contact Detail
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    <div
                        v-if="$page.props.flash?.message"
                        class="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded dark:bg-green-900/30 dark:border-green-800 dark:text-green-400"
                    >
                        {{ $page.props.flash.message }}
                    </div>

                    <div class="mb-4 flex justify-end">
                        <Input
                            v-model="searchValue"
                            type="text"
                            placeholder="Search contacts..."
                            class="max-w-sm"
                        />
                    </div>

                    <div class="crud-table-wrap">
                        <table class="crud-table">
                            <thead class="crud-table-head">
                                <tr>
                                    <th
                                        v-for="header in headers"
                                        :key="header.value"
                                        class="crud-th"
                                        :class="{ 'cursor-pointer hover:text-gray-700 dark:hover:text-gray-300': header.sortable }"
                                        @click="
                                            header.sortable &&
                                                ((sortBy = header.value),
                                                (sortType = sortType === 'asc' ? 'desc' : 'asc'))
                                        "
                                    >
                                        <div class="flex items-center gap-1">
                                            {{ header.text }}
                                            <span
                                                v-if="sortBy === header.value"
                                                class="text-emerald-600 dark:text-emerald-400"
                                            >
                                                {{ sortType === "asc" ? "↑" : "↓" }}
                                            </span>
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="crud-table-body">
                                <tr
                                    v-for="item in formattedContactDetails"
                                    :key="item.id"
                                    class="crud-row"
                                >
                                    <td
                                        class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100"
                                    >
                                        {{ item.serial }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <img
                                            v-if="item.image_url"
                                            :src="item.image_url"
                                            alt="Contact"
                                            class="h-10 w-10 rounded object-cover border border-gray-200 dark:border-gray-700"
                                        />
                                        <Badge v-else variant="secondary" class="text-xs">No Image</Badge>
                                    </td>
                                    <td
                                        class="px-6 py-4 text-sm text-gray-900 dark:text-gray-100"
                                    >
                                        <div class="flex items-center gap-2">
                                            <Phone class="w-4 h-4 text-muted-foreground" />
                                            <span>{{ item.phone }}</span>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                                        {{ item.whats_app }}
                                    </td>
                                    <td
                                        class="px-6 py-4 text-sm text-gray-900 dark:text-gray-100"
                                    >
                                        <div class="flex items-center gap-2">
                                            <Mail class="w-4 h-4 text-muted-foreground" />
                                            <span>{{ item.email }}</span>
                                        </div>
                                    </td>
                                    <td
                                        class="px-6 py-4 text-sm text-gray-900 dark:text-gray-100"
                                    >
                                        <div class="flex items-start gap-2 max-w-[200px]">
                                            <MapPin class="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                                            <span class="line-clamp-2">
                                                {{ item.corporate_office_en }}
                                            </span>
                                        </div>
                                    </td>
                                    <td
                                        class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
                                    >
                                        {{ item.created_at }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="flex space-x-2">
                                            <Button
                                                v-if="can('CONTACT_EDIT')"
                                                variant="ghost"
                                                size="icon"
                                                as-child
                                                class="text-green-600 hover:text-green-700 hover:bg-green-100 dark:text-green-400 dark:hover:text-green-300 dark:hover:bg-green-900/30"
                                            >
                                                <Link :href="route('contactdetail.edit', item.id)">
                                                    <SquarePen class="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button
                                                v-if="can('CONTACT_DELETE')"
                                                variant="ghost"
                                                size="icon"
                                                @click="deleteContactDetail(item.id)"
                                                class="text-red-600 hover:text-red-700 hover:bg-red-100 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/30"
                                            >
                                                <Trash class="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                                <tr v-if="formattedContactDetails.length === 0">
                                    <td colspan="8" class="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                        No contact details found.
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    </AppLayout>
</template>
