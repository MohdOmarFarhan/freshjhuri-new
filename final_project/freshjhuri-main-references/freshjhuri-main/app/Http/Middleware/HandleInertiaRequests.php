<?php

namespace App\Http\Middleware;

use App\Models\Cart;
use App\Models\Category;
use App\Models\CommonSetting;
use App\Models\Footer;
use App\Models\Social;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {

        $user = Auth::user();
        if ($user) {
            $user = User::with('roles')->find($user->id);
        }

        $cartCount = 0;
        if ($user) {
            $cartCount = Cart::where('user_id', $user->id)->count();
        } else {
            $sessionId = session()->getId();
            $cartCount = Cart::where('session_id', $sessionId)->count();
        }

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'cartCount' => $cartCount,

            'flash' => [
                'success' => fn() => $request->session()->get('success'),
                'error' => fn() => $request->session()->get('error'),
                'info' => fn() => $request->session()->get('info'),
            ],

            'auth' => [
                'user' => $user,
                'permissions' => fn() => $user?->getAllPermissions()->pluck('name') ?? [],
                'is_default_password' => fn() => $user ? \Illuminate\Support\Facades\Hash::check($user->phone, $user->password) : false,
            ],

            'ziggy' => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],

            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'common_settings' => CommonSetting::latest()->first() ?? null,
            'footer_settings' => Footer::latest()->first() ?? null,
            'categories' => Category::orderBy('sort_order')->where('status', 1)->select('id', 'name_en', 'name_bn', 'slug')->get(),
            'product_types' => config('product_types'),

            'productMenuCategories' => Category::query()
                ->where('status', true)
                ->whereHas('products', function ($query) {
                    $query->where('status', true)
                        ->whereHas('variants');
                })
                ->select('id', 'name_en', 'name_bn', 'slug', 'sort_order')
                ->with(['products' => function ($query) {
                    $query->where('status', true)
                        ->whereHas('variants')
                        ->select('id', 'category_id', 'title_en', 'title_bn', 'slug')
                        ->latest();
                }])
                ->orderBy('sort_order')
                ->orderBy('name_en')
                ->get(),
            'socials' => Social::all(),
        ];
    }
}
