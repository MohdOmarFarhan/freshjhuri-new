<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\PaymentMedia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class CartController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $query = Cart::with(['variant.product', 'variant.size', 'variant.packagings']);

        if ($user) {
            $query->where('user_id', $user->id);
        } else {
            $query->where('session_id', session()->getId());
        }

        $cartItems = $query->get();
        $paymentMedia = PaymentMedia::all();

        $shippingRulesMissing = false;
        foreach ($cartItems as $item) {
            $variant = $item->variant;
            $product = $variant?->product;

            if (! $variant || ! $product) {
                continue;
            }

            if ($product->is_free_shipping) {
                continue;
            }

            if ($variant->packagings->isEmpty()) {
                $shippingRulesMissing = true;
                break;
            }
        }

        return Inertia::render('Cart/Index', [
            'cartItems' => $cartItems,
            'paymentMedia' => $paymentMedia,
            'shippingRulesMissing' => $shippingRulesMissing,
        ]);
    }

    public function addToCart(Request $request)
    {
        $request->validate([
            'variant_id' => 'required|exists:variants,id',
            'qty' => 'required|integer|min:1',
        ]);

        $variant = \App\Models\Variant::findOrFail($request->variant_id);
        $price = $variant->discount_price ?? $variant->price;

        $user = Auth::user();

        if ($user) {
            $cart = Cart::firstOrNew([
                'user_id' => $user->id,
                'variant_id' => $request->variant_id,
            ]);
        } else {
            $cart = Cart::firstOrNew([
                'session_id' => session()->getId(),
                'variant_id' => $request->variant_id,
            ]);
        }

        $cart->qty = $cart->exists ? $cart->qty + $request->qty : $request->qty;
        $cart->unit_price = $price;
        $cart->save();

        if ($request->has('buy_now') && $request->buy_now) {
            return Redirect::route('checkout.index')->with('success', 'Product added to cart!');
        }

        return Redirect::route('cart.index')->with('success', 'Product added to cart!');
    }

    public function addBundle(Request $request)
    {
        $request->validate([
            'variant_ids' => 'required|array|min:1',
            'variant_ids.*' => 'required|exists:variants,id',
            'qty' => 'nullable|integer|min:1',
        ]);

        $qty = (int) ($request->input('qty', 1));
        $variantIds = array_values(array_unique($request->input('variant_ids', [])));
        $user = Auth::user();

        foreach ($variantIds as $variantId) {
            $variant = \App\Models\Variant::findOrFail($variantId);
            $price = $variant->discount_price ?? $variant->price;

            if ($user) {
                $cart = Cart::firstOrNew([
                    'user_id' => $user->id,
                    'variant_id' => $variantId,
                ]);
            } else {
                $cart = Cart::firstOrNew([
                    'session_id' => session()->getId(),
                    'variant_id' => $variantId,
                ]);
            }

            $cart->qty = $cart->exists ? $cart->qty + $qty : $qty;
            $cart->unit_price = $price;
            $cart->save();
        }

        return Redirect::route('cart.index')->with('success', 'Bundle added to cart!');
    }

    public function removeFromCart($id)
    {
        $user = Auth::user();
        $query = Cart::where('id', $id);

        if ($user) {
            $query->where('user_id', $user->id);
        } else {
            $query->where('session_id', session()->getId());
        }

        $cartItem = $query->first();

        if ($cartItem) {
            $cartItem->delete();
        }

        return Redirect::route('cart.index')->with('success', 'Item Deleted Successfully!');
    }

    public function updateCart(Request $request)
    {
        $request->validate([
            'id' => 'required|exists:carts,id',
            'qty' => 'required|integer|min:1',
        ]);

        $user = Auth::user();
        $query = Cart::where('id', $request->id);

        if ($user) {
            $query->where('user_id', $user->id);
        } else {
            $query->where('session_id', session()->getId());
        }

        $cartItem = $query->first();

        if ($cartItem) {
            $cartItem->qty = $request->qty;
            $cartItem->save();
        }

        return Redirect::route('cart.index')->with('success', 'Cart Updated Successfully!');
    }
}
