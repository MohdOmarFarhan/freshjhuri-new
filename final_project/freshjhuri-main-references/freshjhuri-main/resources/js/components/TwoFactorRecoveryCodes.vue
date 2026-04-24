<script setup lang="ts">
import { useForm } from '@inertiajs/vue3';
import { Eye, EyeOff, LockKeyhole, RefreshCw } from 'lucide-vue-next';
import { nextTick, onMounted, ref } from 'vue';
import { route } from 'ziggy-js';
import AlertError from '@/components/AlertError.vue';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useTwoFactorAuth } from '@/composables/useTwoFactorAuth';

const { recoveryCodesList, fetchRecoveryCodes, errors } = useTwoFactorAuth();
const isRecoveryCodesVisible = ref<boolean>(false);
const recoveryCodeSectionRef = ref<HTMLElement | null>(null);

const form = useForm({});

const toggleRecoveryCodesVisibility = async () => {
    if (!isRecoveryCodesVisible.value && !recoveryCodesList.value.length) {
        await fetchRecoveryCodes();
    }

    isRecoveryCodesVisible.value = !isRecoveryCodesVisible.value;

    if (isRecoveryCodesVisible.value) {
        await nextTick();
        recoveryCodeSectionRef.value?.scrollIntoView({ behavior: 'smooth' });
    }
};

const regenerateCodes = () => {
    form.post(route('two-factor.recovery-codes'), {
        preserveScroll: true,
        onSuccess: () => {
            fetchRecoveryCodes();
        },
    });
};

onMounted(async () => {
    // Only fetch if we need to show them immediately, otherwise wait for toggle
    // However, the original code fetched on mount if empty.
    // If the section is hidden by default, we might not need to fetch immediately.
    // But keeping original logic:
    if (!recoveryCodesList.value.length) {
       // await fetchRecoveryCodes(); // Defer fetching until user asks for it to save request?
       // The original code fetched it. Let's stick to the original logic or improve it.
       // Actually, fetching on mount might be useful if the user previously enabled it and we want to be ready.
       // But usually recovery codes are sensitive and should only be fetched on demand.
       // Let's keep it as is for now to match original behavior, or maybe the original behavior was intended to just be ready.
       // Wait, the original code had:
       /*
       onMounted(async () => {
            if (!recoveryCodesList.value.length) {
                await fetchRecoveryCodes();
            }
        });
        */
       // But `isRecoveryCodesVisible` starts false.
       // `toggleRecoveryCodesVisibility` also fetches if empty.
       // So fetching on mount seems redundant if it's hidden, but maybe it's for preloading.
       // I'll keep it.
        await fetchRecoveryCodes();
    }
});
</script>

<template>
    <Card class="w-full">
        <CardHeader>
            <CardTitle class="flex gap-3">
                <LockKeyhole class="size-4" />2FA Recovery Codes
            </CardTitle>
            <CardDescription>
                Recovery codes let you regain access if you lose your 2FA
                device. Store them in a secure password manager.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <div
                class="flex flex-col gap-3 select-none sm:flex-row sm:items-center sm:justify-between"
            >
                <div class="w-fit">
                    <Button @click="toggleRecoveryCodesVisibility">
                        <component
                            :is="isRecoveryCodesVisible ? EyeOff : Eye"
                            class="size-4"
                        />
                        {{ isRecoveryCodesVisible ? 'Hide' : 'View' }} Recovery
                        Codes
                    </Button>
                </div>

                <div v-if="isRecoveryCodesVisible && recoveryCodesList.length">
                    <form @submit.prevent="regenerateCodes">
                        <Button
                            variant="secondary"
                            type="submit"
                            :disabled="form.processing"
                        >
                            <RefreshCw /> Regenerate Codes
                        </Button>
                    </form>
                </div>
            </div>
            <div
                :class="[
                    'relative overflow-hidden transition-all duration-300',
                    isRecoveryCodesVisible
                        ? 'h-auto opacity-100'
                        : 'h-0 opacity-0',
                ]"
            >
                <div v-if="errors?.length" class="mt-6">
                    <AlertError :errors="errors" />
                </div>
                <div v-else class="mt-3 space-y-3">
                    <div
                        ref="recoveryCodeSectionRef"
                        class="grid gap-1 rounded-lg bg-muted p-4 font-mono text-sm"
                    >
                        <div v-if="!recoveryCodesList.length" class="space-y-2">
                            <div
                                v-for="n in 8"
                                :key="n"
                                class="h-4 animate-pulse rounded bg-muted-foreground/20"
                            ></div>
                        </div>
                        <template v-else>
                            <div
                                v-for="(code, index) in recoveryCodesList"
                                :key="index"
                            >
                                {{ code }}
                            </div>
                        </template>
                    </div>
                    <p class="text-xs text-muted-foreground select-none">
                        Each recovery code can be used once to access your
                        account and will be removed after use. If you need more,
                        click
                        <span class="font-bold">Regenerate Codes</span> above.
                    </p>
                </div>
            </div>
        </CardContent>
    </Card>
</template>
