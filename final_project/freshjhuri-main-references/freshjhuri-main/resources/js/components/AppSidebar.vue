<script setup>
import { Link, usePage } from '@inertiajs/vue3';
import {
  AudioWaveform,
  BadgeCheck,
  Bell,
  BookOpen,
  Bot,
  ChevronRight,
  ChevronsUpDown,
  Command,
  CreditCard,
  Folder,
  Forward,
  Frame,
  GalleryVerticalEnd,
  LogOut,
  Map,
  MoreHorizontal,
  PieChart,
  Plus,
  Settings2,
  Sparkles,
  SquareTerminal,
  Trash2,
  Users,
  User,
  Settings,
  SquarePen,
  GraduationCap,
  MessageCircle,
  Lock,
  Key,
  Shield,
  ShoppingBasket,
  ChartBarStacked,
  LayoutGrid,
  Palette,
  PencilRuler,
  Barcode,
  Video,
  Nfc,
  ShoppingCart,
  LandPlot,
  BadgeDollarSign,
  Layers,
  Clock4,
  Grid,
  BookText,
  BookUser,
  Info,
  Truck,
  Image,
  PanelBottom,
  Share2,
  Phone,
  MessageSquare,
  Package,
  Ruler,
  MapPin,
  ClipboardList
} from 'lucide-vue-next';
import { computed } from 'vue';
import { route } from 'ziggy-js';
import NavFooter from '@/components/NavFooter.vue';
import NavMain from '@/components/NavMain.vue';
import NavUser from '@/components/NavUser.vue';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { can } from '@/lib/can';
import AppLogo from './AppLogo.vue';

const page = usePage();
const paymentStatus = computed(() => page.props.payment_status);

const mainNavItems = computed(() => [
     {
    title: 'Dashboard',
    href: route('dashboard'),
    icon: LayoutGrid,
    color: 'text-indigo-600',
    children: [],
  },
  {
    title: 'Profile',
    href: route('profile.edit'),
    icon: User,
    color: 'text-green-600',
    children: [],
  },
  {
    title: 'My Orders',
    href: route('user.orders.index'),
    icon: ShoppingCart,
    color: 'text-orange-600',
    children: [],
  },
  {
    title: 'Content Management',
    href: '#',
    icon: SquarePen,
    color: 'text-purple-600',
    children: [
    //   { title: 'Common Settings', href: route('common.settings'), icon: Settings, },
      { title: 'Common Settings', href: route('common.settings'), icon: Settings, color: 'text-purple-500', hasPermission: can('SETTINGS_INDEX') },
      { title: 'Bannars', href: route('bannars.index'), icon: Image, color: 'text-purple-500', hasPermission: can('BANNAR_INDEX') },
      { title: 'Footer', href: route('footer.index'), icon: PanelBottom, color: 'text-purple-500', hasPermission: can('FOOTER_INDEX') },
      { title: 'Social Media', href: route('social.index'), icon: Share2, color: 'text-purple-500', hasPermission: can('SOCIAL_INDEX') },
      { title: 'Services', href: route('services.index'), icon: Sparkles, color: 'text-purple-500', hasPermission: can('SERVICE_INDEX') },
      { title: 'Service Videos', href: route('service-videos.index'), icon: Video, color: 'text-purple-500', hasPermission: can('SERVICE_VIDEO_INDEX') },
      { title: 'Contact Details', href: route('contact.details'), icon: Phone, color: 'text-purple-500', hasPermission: can('CONTACT_INDEX') },
      { title: 'Contact Messages', href: route('contact.messages'), icon: MessageSquare, color: 'text-purple-500', hasPermission: can('CONTACT_MESSAGE_INDEX') },
      { title: 'Payment Media', href: route('payment.medias'), icon: CreditCard, color: 'text-purple-500', hasPermission: can('PAYMENT_MEDIA_INDEX') },
    ],
  },
  {
    title: 'Access Control',
    href: '#',
    icon: Lock,
    color: 'text-red-600',
    children: [

      { title: 'Users', href: '/users', icon: Users, color: 'text-red-500', hasPermission: can('USER_INDEX') },
      { title: 'Roles', href: '/roles', icon: Key, color: 'text-red-500', hasPermission: can('ROLE_INDEX') },
      { title: 'Permissions', href: '/permissions', icon: Shield, color: 'text-red-500', hasPermission: can('PERMISSION_INDEX') },
      // { title: 'Profile', href: route('profile.edit'), icon: Shield, hasPermission: can('PROFILE_INDEX') },



        //    { title: 'Users', href: '/users', icon: Users },
        //    { title: 'Roles', href: '/roles', icon: Key },
        //    { title: 'Permissions', href: '/permissions', icon: Shield },
    ],
  },
  {
        title: 'Products',
        href: '#',
        icon: Package,
        color: 'text-blue-600',
        children: [
            { title: 'Categories', href: route('categories.index'), icon: Layers, color: 'text-blue-500', hasPermission: can('CATEGORY_INDEX') },
            { title: 'Products', href: route('products.index'), icon: Package, color: 'text-blue-500', hasPermission: can('PRODUCT_INDEX') },
            { title: 'Sizes', href: route('sizes.index'), icon: Ruler, color: 'text-blue-500', hasPermission: can('SIZE_INDEX') },
            { title: 'Variants', href: route('variants.index'), icon: Barcode, color: 'text-blue-500', hasPermission: can('VARIANT_INDEX') },
            { title: 'Combo Products', href: route('combo-products.index'), icon: Grid, color: 'text-blue-500', hasPermission: can('PRODUCT_INDEX') },

        ],
    },
    {
        title: 'Locations & Shipping',
        href: '#',
        icon: Map,
        color: 'text-amber-600',
        children: [
            { title: 'Divisions', href: route('admin.divisions.index'), icon: MapPin, color: 'text-amber-500', hasPermission: can('DIVISION_INDEX') },
            { title: 'Districts', href: route('admin.districts.index'), icon: MapPin, color: 'text-amber-500', hasPermission: can('DISTRICT_INDEX') },
            { title: 'Thanas', href: route('admin.thanas.index'), icon: MapPin, color: 'text-amber-500', hasPermission: can('THANA_INDEX') },
            { title: 'Shipping Costs', href: route('admin.shipping.index'), icon: Truck, color: 'text-amber-500', hasPermission: can('SHIPPING_COST_INDEX') },
            { title: 'Shipping Charts', href: route('admin.shipping-charts.index'), icon: BookText, color: 'text-amber-500', hasPermission: can('SHIPPING_CHART_INDEX') },
        ],
    },
    {
        title: 'Orders',
        href: '#',
        icon: ShoppingCart,
        color: 'text-teal-600',
        children: [
            { title: 'All Orders', href: route('orders.index'), icon: ClipboardList, color: 'text-teal-500', hasPermission: can('ORDER_INDEX') },
            { title: 'Product Reviews', href: route('reviews.index'), icon: MessageSquare, color: 'text-teal-500', hasPermission: can('ORDER_INDEX') },
        ],
    },
    {
    },


]);

const footerNavItems = [
    // Add footer items here if needed
];

</script>

<template>
    <Sidebar collapsible="icon" variant="inset">
        <SidebarHeader>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton size="lg" as-child>
                        <Link :href="route('dashboard')">
                            <AppLogo />
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
            <NavMain :items="mainNavItems" />
        </SidebarContent>

        <SidebarFooter>
            <NavFooter :items="footerNavItems" />
            <NavUser />
        </SidebarFooter>
    </Sidebar>
    <slot />
</template>
