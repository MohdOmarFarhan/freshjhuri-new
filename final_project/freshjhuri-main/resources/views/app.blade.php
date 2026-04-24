<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ config('app.name') }}</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>


    <!-- Google Fonts: Outfit & Hind Siliguri -->
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Hind+Siliguri:wght@300;400;500;600;700&display=swap" rel="stylesheet">

    <style>
        html, body {
            font-family: 'Outfit', ui-sans-serif, system-ui, sans-serif;
            font-weight: 400;
            letter-spacing: 0.01em;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }

        /* Bengali font improvement: Use Hind Siliguri for Bangla text */
        [lang="bn"], .font-bengali, .bengali-text {
            font-family: 'Hind Siliguri', 'Outfit', ui-sans-serif, system-ui, sans-serif !important;
        }
    </style>

    <!-- Favicon -->
    <link rel="icon" href="/favicon.ico" sizes="any">

    <!-- Dark Mode Script -->
    <script>
        (function() {
            const appearance = localStorage.getItem('appearance') || 'system';
            const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

            if (appearance === 'dark' || (appearance === 'system' && systemDark)) {
                document.documentElement.classList.add('dark');
            }
        })();
    </script>

    <!-- Scripts -->
    @routes
    @vite(['resources/js/app.ts', "resources/js/pages/{$page['component']}.vue"])
    @inertiaHead

    {{-- Load Common Setting --}}
    @php
        $commonSetting = \App\Models\CommonSetting::latest()->first();
    @endphp

    {{-- Facebook Pixel --}}
    @if(!empty($commonSetting?->facebook_pixel))
        {!! $commonSetting->facebook_pixel !!}
    @endif
</head>

<body class="antialiased">
    @inertia
</body>

</html>