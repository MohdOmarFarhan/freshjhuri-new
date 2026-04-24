<script setup>
import { Head, Link } from "@inertiajs/vue3";
import { computed } from "vue";
import { useLocalization } from "@/helper/localization";
import HomeLayout from "@/layouts/Home/HomeLayout.vue";

const { locale, t, toBanglaNumber } = useLocalization();

const props = defineProps({
  shippingCharts: {
    type: Array,
    default: () => [],
  },
});

const formattedCharge = (value) => {
  if (value === null || value === undefined || value === "") return "—";
  const charge = Number(value) || 0;
  const formatted = charge.toFixed(2);
  return locale.value === "bn" ? `৳ ${toBanglaNumber(formatted)}` : `৳ ${formatted}`;
};

const findFirst = (productType, productCondition) => {
  return (props.shippingCharts || []).find(
    (r) => r.product_type === productType && r.product_condition === productCondition
  );
};

const feed = computed(() => findFirst("Feed", "Number"));
const bag = computed(() => findFirst("Bag", "Number"));

const medicineRows = computed(() => {
  const list = (props.shippingCharts || []).filter((r) => r.product_type === "Medicine");
  return list
    .slice()
    .sort((a, b) => {
      const c = String(a.product_condition || "").localeCompare(String(b.product_condition || ""));
      if (c !== 0) return c;
      return String(a.product_size || "").localeCompare(String(b.product_size || ""));
    });
});

const getMedicineSize = (row) => {
  if (locale.value === "bn") return row?.product_size_bn || row?.product_size_en || row?.product_size || "—";
  return row?.product_size_en || row?.product_size || "—";
};

const pageTitle = computed(() => (locale.value === "bn" ? "শিপিং চার্জ" : "Shipping Charges"));
const subtitle = computed(() =>
  locale.value === "bn"
    ? "পণ্যের ধরন অনুযায়ী শিপিং চার্জের তালিকা"
    : "A simple shipping charge list by product type"
);

const perBagLabel = computed(() => (locale.value === "bn" ? "প্রতি ব্যাগ" : "Per Bag"));
const perCartonLabel = computed(() => (locale.value === "bn" ? "প্রতি কার্টন" : "Per Carton"));
const perPieceLabel = computed(() => (locale.value === "bn" ? "প্রতি পিস" : "Per Piece"));
const backLabel = computed(() => (locale.value === "bn" ? "হোম" : "Home"));
</script>

<template>
  <HomeLayout :navbarFloating="true">
    <Head :title="pageTitle" />

    <section class="w-full mt-10 bg-background dark:bg-background">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <div class="text-center space-y-3 mb-10">
          <h1 class="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
            {{ pageTitle }}
          </h1>
          <p class="text-sm text-muted-foreground">
            {{ subtitle }}
          </p>
          <div class="flex justify-center">
            <Link :href="route('home')" class="text-sm font-medium text-primary hover:underline">
              {{ backLabel }}
            </Link>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div class="text-sm font-semibold text-foreground mb-2">
              {{ locale === "bn" ? "ফিড (Feed)" : "Feed" }}
            </div>
            <div class="text-sm text-muted-foreground mb-4">
              {{ locale === "bn" ? "শিপিং চার্জ ব্যাগ হিসেবে গণনা হবে।" : "Shipping is calculated per bag." }}
            </div>
            <div class="flex items-center justify-between rounded-xl bg-muted/40 px-4 py-3">
              <span class="text-sm text-foreground">{{ perBagLabel }}</span>
              <span class="text-sm font-semibold text-primary">
                {{ formattedCharge(feed?.shpping_charge_per_cutton) }}
              </span>
            </div>
          </div>

          <div class="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div class="text-sm font-semibold text-foreground mb-2">
              {{ locale === "bn" ? "মেডিসিন (Medicine)" : "Medicine" }}
            </div>
            <div class="text-sm text-muted-foreground mb-4">
              {{
                locale === "bn"
                  ? "সলিড এবং লিকুইড—দুইটাই কার্টন হিসেবে গণনা হবে।"
                  : "Solid and liquid both follow carton-based shipping."
              }}
            </div>

            <div class="rounded-xl border border-border overflow-hidden">
              <div class="grid grid-cols-4 bg-muted/40 text-xs font-semibold text-muted-foreground">
                <div class="px-3 py-2">{{ locale === "bn" ? "ধরন" : "Type" }}</div>
                <div class="px-3 py-2">{{ locale === "bn" ? "সাইজ" : "Size" }}</div>
                <div class="px-3 py-2">{{ locale === "bn" ? "কার্টন" : "Carton" }}</div>
                <div class="px-3 py-2 text-right">{{ locale === "bn" ? "চার্জ" : "Charge" }}</div>
              </div>
              <div v-if="medicineRows.length" class="divide-y divide-border">
                <div v-for="(row, idx) in medicineRows" :key="row.id ?? idx" class="grid grid-cols-4 text-sm">
                  <div class="px-3 py-2 text-foreground">
                    {{ row.product_condition === "Solid" ? (locale === "bn" ? "সলিড" : "Solid") : (locale === "bn" ? "লিকুইড" : "Liquid") }}
                  </div>
                  <div class="px-3 py-2 text-muted-foreground">
                    {{ getMedicineSize(row) }}
                  </div>
                  <div class="px-3 py-2 text-muted-foreground">
                    {{ row.cutton_contain_amount ? (locale === "bn" ? toBanglaNumber(row.cutton_contain_amount) : row.cutton_contain_amount) : "—" }}
                  </div>
                  <div class="px-3 py-2 text-right font-semibold text-primary">
                    {{ formattedCharge(row.shpping_charge_per_cutton) }}
                  </div>
                </div>
              </div>
              <div v-else class="px-3 py-3 text-sm text-muted-foreground">
                {{ locale === "bn" ? "কোনো মেডিসিন শিপিং চার্ট পাওয়া যায়নি।" : "No medicine shipping charts found." }}
              </div>
            </div>
          </div>

          <div class="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div class="text-sm font-semibold text-foreground mb-2">
              {{ locale === "bn" ? "পিপি উভেন ব্যাগ (PP Woven Bag)" : "PP Woven Bag" }}
            </div>
            <div class="text-sm text-muted-foreground mb-4">
              {{ locale === "bn" ? "শিপিং চার্জ সংখ্যা হিসেবে গণনা হবে।" : "Shipping is calculated per piece." }}
            </div>
            <div class="flex items-center justify-between rounded-xl bg-muted/40 px-4 py-3">
              <span class="text-sm text-foreground">{{ perPieceLabel }}</span>
              <span class="text-sm font-semibold text-primary">
                {{ formattedCharge(bag?.shpping_charge_per_cutton) }}
              </span>
            </div>
          </div>
        </div>

        <div class="mt-8 text-xs text-muted-foreground text-center">
          {{
            locale === "bn"
              ? "নোট: ডেলিভারি এলাকা অনুযায়ী অতিরিক্ত শিপিং চার্জ চেকআউটে যোগ হতে পারে।"
              : "Note: Delivery-area shipping costs may be added at checkout."
          }}
        </div>
      </div>
    </section>
  </HomeLayout>
</template>
