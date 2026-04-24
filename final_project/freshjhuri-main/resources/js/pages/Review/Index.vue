<script setup>
import { Head, router } from '@inertiajs/vue3';
import { computed, ref, watch } from 'vue';
import AppLayout from '@/layouts/AppLayout.vue';

const props = defineProps({
  reviews: Object,
  filters: {
    type: Object,
    default: () => ({}),
  },
});

const statusFilter = ref(props.filters?.status || '');

const rows = computed(() => props.reviews?.data || []);

watch(statusFilter, (value) => {
  router.get(route('reviews.index'), { status: value || undefined }, { preserveState: true, replace: true });
});

const updateStatus = (review, isApproved) => {
  router.put(route('reviews.status.update', review.id), { is_approved: isApproved }, { preserveScroll: true });
};
</script>

<template>
  <AppLayout>
    <Head title="Product Reviews" />

    <div class="mx-auto w-full p-4 lg:p-8">
      <div class="rounded-xl border border-border bg-card">
        <div class="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 class="text-xl font-bold text-foreground">Product Reviews</h1>
          <select v-model="statusFilter" class="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
          </select>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full min-w-[920px]">
            <thead class="crud-table-head">
              <tr>
                <th class="crud-th">Product</th>
                <th class="crud-th">Customer</th>
                <th class="crud-th">Rating</th>
                <th class="crud-th">Review (EN)</th>
                <th class="crud-th">Review (BN)</th>
                <th class="crud-th">Status</th>
                <th class="crud-th text-center">Action</th>
              </tr>
            </thead>
            <tbody class="crud-table-body">
              <tr v-for="review in rows" :key="review.id" class="crud-row">
                <td class="crud-td">{{ review.product?.title_en || '—' }}</td>
                <td class="crud-td">{{ review.user?.name || '—' }}</td>
                <td class="crud-td">{{ review.rating }}/5</td>
                <td class="crud-td">{{ review.comment_en || '—' }}</td>
                <td class="crud-td">{{ review.comment_bn || '—' }}</td>
                <td class="crud-td">
                  <span
                    class="inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold"
                    :class="review.is_approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'"
                  >
                    {{ review.is_approved ? 'Approved' : 'Pending' }}
                  </span>
                </td>
                <td class="crud-td text-center">
                  <div class="inline-flex items-center gap-2">
                    <button
                      type="button"
                      class="rounded bg-green-600 px-3 py-1 text-xs font-semibold text-white hover:bg-green-700"
                      :disabled="review.is_approved"
                      @click="updateStatus(review, true)"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      class="rounded bg-gray-600 px-3 py-1 text-xs font-semibold text-white hover:bg-gray-700"
                      :disabled="!review.is_approved"
                      @click="updateStatus(review, false)"
                    >
                      Set Pending
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="!rows.length">
                <td colspan="7" class="crud-td py-8 text-center text-muted-foreground">No reviews found.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </AppLayout>
</template>
