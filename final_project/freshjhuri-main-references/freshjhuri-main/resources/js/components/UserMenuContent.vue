<script setup lang="ts">
import { Link, router } from '@inertiajs/vue3';
import { LogOut, Settings, Moon, Sun, Monitor, Check } from 'lucide-vue-next';
import { computed } from 'vue';
import { route } from 'ziggy-js';
import {
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';
import UserInfo from '@/components/UserInfo.vue';
import { useAppearance } from '@/composables/useAppearance';
import type { User } from '@/types';

type Props = {
    user: User;
};

const handleLogout = () => {
    router.post(route('logout'));
};

defineProps<Props>();

const { appearance, updateAppearance } = useAppearance();

const themeIcon = computed(() => {
    if (appearance.value === 'dark') return Moon;
    if (appearance.value === 'light') return Sun;
    return Monitor;
});
</script>

<template>
    <DropdownMenuLabel class="p-0 font-normal">
        <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <UserInfo :user="user" :show-email="true" />
        </div>
    </DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuGroup>
        <DropdownMenuSub>
            <DropdownMenuSubTrigger>
                <component :is="themeIcon" class="mr-2 h-4 w-4" />
                <span>Theme</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
                <DropdownMenuItem @click="updateAppearance('light')">
                    <Sun class="mr-2 h-4 w-4" />
                    <span>Light</span>
                    <Check v-if="appearance === 'light'" class="ml-auto h-4 w-4" />
                </DropdownMenuItem>
                <DropdownMenuItem @click="updateAppearance('dark')">
                    <Moon class="mr-2 h-4 w-4" />
                    <span>Dark</span>
                    <Check v-if="appearance === 'dark'" class="ml-auto h-4 w-4" />
                </DropdownMenuItem>
                <DropdownMenuItem @click="updateAppearance('system')">
                    <Monitor class="mr-2 h-4 w-4" />
                    <span>System</span>
                    <Check v-if="appearance === 'system'" class="ml-auto h-4 w-4" />
                </DropdownMenuItem>
            </DropdownMenuSubContent>
        </DropdownMenuSub>
    </DropdownMenuGroup>
    <DropdownMenuSeparator />
    <DropdownMenuGroup>
        <DropdownMenuItem :as-child="true">
            <Link class="block w-full cursor-pointer" :href="route('profile.edit')" prefetch>
                <Settings class="mr-2 h-4 w-4" />
                Settings
            </Link>
        </DropdownMenuItem>
    </DropdownMenuGroup>
    <DropdownMenuSeparator />
    <DropdownMenuItem :as-child="true">
        <Link
            class="block w-full cursor-pointer"
            :href="route('logout')"
            method="post"
            as="button"
            data-test="logout-button"
        >
            <LogOut class="mr-2 h-4 w-4" />
            Log out
        </Link>
    </DropdownMenuItem>
</template>
