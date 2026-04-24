<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ config('app.name') }}</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>


    <!-- Google Fonts: Roboto & Noto Sans Bengali -->
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&family=Noto+Sans+Bengali:wght@400;700&display=swap" rel="stylesheet">

    <style>
        html, body {
            font-family: 'Roboto', ui-sans-serif, system-ui, sans-serif;
            font-weight: 400;
            letter-spacing: 0.01em;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }

        /* Bengali font improvement: Use Noto Sans Bengali for Bangla text */
        [lang="bn"], .font-bengali, .bengali-text {
            font-family: 'Noto Sans Bengali', 'Roboto', ui-sans-serif, system-ui, sans-serif !important;
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