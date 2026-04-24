// app.ts
import '../css/app.css';
import '../css/global-scrollbar.css';
import { createInertiaApp } from '@inertiajs/vue3';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import type { DefineComponent } from 'vue';
import { createApp, h } from 'vue';
import { useRoute } from 'ziggy-js';
import { ZiggyVue } from '../../vendor/tightenco/ziggy';
import { initializeTheme } from './composables/useAppearance';
import i18n from './plugins/i18n'



declare global {
    interface Window {
        queryParams: Record<string, any>;
    }
}

window.queryParams = window.queryParams || {};

const appName = import.meta.env.VITE_APP_NAME || 'Fassionadda';

// -----------------------------
// 3️⃣ Create Inertia app
// -----------------------------
createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.vue`,
            import.meta.glob<DefineComponent>('./pages/**/*.vue'),
        ),
    setup({ el, App, props, plugin }) {
        const app = createApp({ render: () => h(App, props) });

        // Install Inertia plugin
        app.use(plugin);

        // Install Ziggy for route helpers
        app.use(ZiggyVue);

        // Install i18n plugin
        app.use(i18n);

        // Make route function globally available
        app.config.globalProperties.$route = useRoute;

        // Mount app
        app.mount(el);
    },
    progress: {
        color: '#4B5563',
    },
});

// -----------------------------
// 4️⃣ Initialize theme (light/dark mode)
// -----------------------------
initializeTheme();

// -----------------------------
// 5️⃣ Optional: helper to safely access queryParams
// -----------------------------
export const getQueryParam = (key: string, defaultValue: any = null) => {
    return window.queryParams[key] ?? defaultValue;
};
