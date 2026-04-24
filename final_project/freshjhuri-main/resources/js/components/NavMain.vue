<script setup>
import { Link, usePage } from '@inertiajs/vue3'
import { Plus, Minus } from 'lucide-vue-next'
import { ref, computed } from 'vue'
import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
} from '@/components/ui/sidebar'

const props = defineProps({
    items: {
        type: Array,
        required: true
    }
})

const page = usePage()

const openMenus = ref([])

const filteredItems = computed(() =>
  props.items.filter(item => {
    if (item.children && item.children.length > 0) {
      const hasVisibleChild = item.children.some(child => child.hasPermission !== false);
      return hasVisibleChild;
    }
    return item.hasPermission !== false;
  }).map(item => {
    if (item.children && item.children.length > 0) {
      return {
        ...item,
        children: item.children.filter(child => child.hasPermission !== false)
      }
    }
    return item;
  })
);

const toggleMenu = (title) => {
  const index = openMenus.value.indexOf(title);
  if (index === -1) {
    openMenus.value.push(title);
  } else {
    openMenus.value.splice(index, 1);
  }
}
</script>

<template>
    <SidebarGroup class="px-2 py-0 pt-5">
        <SidebarMenu>
            <SidebarMenuItem
                v-for="item in filteredItems"
                :key="item.title"
            >
                <!-- Parent with children -->
                <template v-if="item.children && item.children.length">
                    <div class="flex items-center justify-between">
                        <SidebarMenuButton :tooltip="item.title" @click="toggleMenu(item.title)">
                            <component :is="item.icon" :class="item.color || 'text-gray-500'" />
                            <span>{{ item.title }}</span>
                        </SidebarMenuButton>
                        <button @click.stop="toggleMenu(item.title)" class="p-1">
                            <component :is="openMenus.includes(item.title) ? Minus : Plus" class="w-4 h-4" />
                        </button>
                    </div>

                    <!-- Child items with transition -->
                    <transition
                        enter-active-class="transition-all duration-300 ease-out"
                        enter-from-class="opacity-0 max-h-0"
                        enter-to-class="opacity-100 max-h-[500px]"
                        leave-active-class="transition-all duration-200 ease-in"
                        leave-from-class="opacity-100 max-h-[500px]"
                        leave-to-class="opacity-0 max-h-0"
                    >
                        <div v-if="openMenus.includes(item.title)" class="ml-6 mt-1 space-y-1 overflow-hidden">
                            <SidebarMenuItem
                                v-for="child in item.children"
                                :key="child.title"
                            >
                                <SidebarMenuButton
                                    as-child
                                    :is-active="child.href === page.url"
                                    :tooltip="child.title"
                                >
                                    <Link :href="child.href">
                                        <component :is="child.icon" :class="child.color || 'text-gray-500'" />
                                        <span>{{ child.title }}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </div>
                    </transition>
                </template>

                <!-- Normal item without children -->
                <template v-else>
                    <SidebarMenuButton
                        as-child
                        :is-active="item.href === page.url"
                        :tooltip="item.title"
                    >
                        <Link :href="item.href">
                            <component :is="item.icon" :class="item.color || 'text-gray-500'" />
                            <span>{{ item.title }}</span>
                        </Link>
                    </SidebarMenuButton>
                </template>
            </SidebarMenuItem>
        </SidebarMenu>
    </SidebarGroup>
</template>
