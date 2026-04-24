<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\District;
use App\Models\Division;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\ShippingAddress;
use App\Models\Thana;
use App\Models\User;
use App\Models\Variant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function create()
    {
        try {
            $user = Auth::user();
            $sessionId = session()->getId();

            $query = Cart::with(['variant.product', 'variant.size', 'variant.packagings']);

            if ($user) {
                $query->where('user_id', $user->id);
            } else {
                $query->where('session_id', $sessionId);
            }

            $cartItems = $query->get();

            // Calculate subtotal
            $subtotal = $cartItems->sum(function ($item) {
                return $item->qty * $item->unit_price;
            });

            // Determine if order has free shipping (if ALL items are free shipping)
            $orderHasFreeShipping = $cartItems->isNotEmpty() && $cartItems->every(function ($item) {
                return $item->variant && $item->variant->product && $item->variant->product->is_free_shipping;
            });

            $shippingCostAmount = 0;
            $shippingRulesMissing = false;
            if (! $orderHasFreeShipping) {
                $shippingData = $this->calculateShippingCostFromVariantPackagings($cartItems, false);
                $shippingCostAmount = $shippingData['total'];
                $shippingRulesMissing = $shippingData['missing'];
            }

            // Get last shipping address if user is logged in
            $lastShippingAddress = null;
            if ($user) {
                $lastOrder = Order::where('user_id', $user->id)->latest()->first();
                if ($lastOrder) {
                    $lastShippingAddress = ShippingAddress::where('order_id', $lastOrder->id)->first();
                }
            }

            // Get all location data
            $divisions = Division::all()->toArray();
            $districts = District::all()->toArray();
            $thanas = Thana::all()->toArray();

            // Debug log to verify data
            Log::info('Checkout data:', [
                'divisions_count' => count($divisions),
                'districts_count' => count($districts),
                'thanas_count' => count($thanas),
            ]);

            return Inertia::render('Checkout/Index', [
                'cartItems' => $cartItems->toArray(),
                'subtotal' => (float) $subtotal,
                'shippingCost' => (float) $shippingCostAmount,
                'shippingRulesMissing' => (bool) $shippingRulesMissing,
                'user' => $user ? $user->toArray() : null,
                'lastShippingAddress' => $lastShippingAddress ? $lastShippingAddress->toArray() : null,
                'divisions' => $divisions,
                'districts' => $districts,
                'thanas' => $thanas,
                'orderHasFreeShipping' => (bool) $orderHasFreeShipping,
            ]);

        } catch (\Exception $e) {
            Log::error('Checkout page error: '.$e->getMessage());

            return redirect()->route('cart.index')->with('error', 'Unable to load checkout page. Please try again.');
        }
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'email' => 'nullable|email|max:255',
            'address' => 'required|string|max:255',
            'division_id' => 'required|exists:divisions,id',
            'district_id' => 'required|exists:districts,id',
            'thana_id' => 'required|exists:thanas,id',
            'payment_type' => 'required|in:cod,prepaid',
            'notes' => 'nullable|string|max:500',
        ]);

        DB::beginTransaction();

        try {
            $sessionId = session()->getId();

            // Get cart items
            $query = Cart::with(['variant.product', 'variant.size', 'variant.packagings']);

            if (Auth::check()) {
                $query->where('user_id', Auth::id());
            } else {
                $query->where('session_id', $sessionId);
            }

            $cartItems = $query->get();

            if ($cartItems->isEmpty()) {
                return back()->withErrors(['error' => 'Your cart is empty.'])->withInput();
            }

            // Validate stock before processing
            foreach ($cartItems as $item) {
                if (! $item->variant) {
                    throw new \Exception('Invalid product in cart. Please remove and try again.');
                }

                if ($this->isComboVariant($item->variant)) {
                    $this->assertComboStockAvailable($item->variant, (int) $item->qty);
                }

                if ($item->variant->stock < $item->qty) {
                    $productName = $item->variant->product->title_en ?? 'Product';
                    $sizeInfo = $item->variant->size ?
                        " ({$item->variant->size->amount} {$item->variant->size->unit})" : '';

                    throw new \Exception(
                        "Insufficient stock for {$productName}{$sizeInfo}. Available: {$item->variant->stock}"
                    );
                }
            }

            $subtotal = $cartItems->sum(fn ($item) => $item->unit_price * $item->qty);

            // Check if all products have free shipping
            $hasFreeShipping = $cartItems->isNotEmpty() && $cartItems->every(function ($item) {
                return $item->variant &&
                       $item->variant->product &&
                       $item->variant->product->is_free_shipping;
            });

            // Calculate Shipping Cost
            $shippingCostAmount = 0;
            if (! $hasFreeShipping) {
                $shippingData = $this->calculateShippingCostFromVariantPackagings($cartItems, true);
                $shippingCostAmount = $shippingData['total'];
            }

            $totalAmount = $subtotal + $shippingCostAmount;

            // Handle user creation/login
            $userId = Auth::check() ? Auth::id() : null;

            if (! $userId) {
                // Check if user exists with this phone number
                $user = User::where('phone', $request->phone)->first();

                if (! $user) {
                    // Create new user
                    $userData = [
                        'name' => $request->name,
                        'phone' => $request->phone,
                        'password' => Hash::make($request->phone),
                        'status' => 'active',
                        'email_verified_at' => now(),
                    ];
                    if ($request->email) {
                        $userData['email'] = $request->email;
                    }
                    $user = User::create($userData);
                    $user->assignRole('user');

                    // Auto login only NEWLY created users
                    Auth::login($user);
                } else {
                    // User exists but not logged in.

                    // SECURITY CHECK: If user is admin/staff, require login.
                    if ($user->hasRole(['admin', 'super-admin', 'manager'])) {
                        throw new \Exception('This phone number belongs to an administrator. Please login to place an order.');
                    }

                    // For regular users, we attach the order to them but DO NOT auto-login
                    // to prevent account hijacking via phone number.
                    // The user will remain a guest in the current session,
                    // but the order will be linked to their account in DB.
                }
                $userId = $user->id;
            }

            // Create order
            $order = Order::create([
                'user_id' => $userId,
                'order_number' => $this->generateOrderNumber(),
                'subtotal' => $subtotal,
                'shipping_cost' => $shippingCostAmount,
                'total_amount' => $totalAmount,
                'pay_amount' => $totalAmount,
                'due_amount' => $request->payment_type == 'cod' ? $totalAmount : 0,
                'payment_type' => $request->payment_type,
                'payment_status' => $request->payment_type == 'cod' ? 'pending' : 'paid',
                'has_free_shipping' => $hasFreeShipping,
                'notes' => $request->notes,
                'status' => 'pending',
                'order_date' => now(),
            ]);

            // Create shipping address
            ShippingAddress::create([
                'order_id' => $order->id,
                'name' => $request->name,
                'phone' => $request->phone,
                'address' => $request->address,
                'division_id' => $request->division_id,
                'district_id' => $request->district_id,
                'thana_id' => $request->thana_id,
            ]);

            // Create order items and update stock
            foreach ($cartItems as $item) {
                // Reduce stock
                $item->variant->decrement('stock', $item->qty);

                if ($this->isComboVariant($item->variant)) {
                    $this->decrementComboIncludedStock($item->variant, (int) $item->qty);
                }

                // Create order item
                OrderItem::create([
                    'order_id' => $order->id,
                    'variant_id' => $item->variant_id,
                    'product_name' => $item->variant->product->title_en ?? 'Product',
                    'variant_info' => $item->variant->size ?
                        "{$item->variant->size->amount} {$item->variant->size->unit}" : '',
                    'qty' => $item->qty,
                    'unit_price' => $item->unit_price,
                    'subtotal' => $item->qty * $item->unit_price,
                ]);
            }

            // Clear cart
            Cart::whereIn('id', $cartItems->pluck('id'))->delete();

            DB::commit();

            // Log the order creation
            Log::info('Order created successfully', ['order_id' => $order->id, 'order_number' => $order->order_number]);

            // Redirect based on payment type
            if ($request->payment_type == 'prepaid') {
                return redirect()->route('order.payment', $order->id);
            }

            return redirect()->route('order.success', $order->id);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Order creation failed: '.$e->getMessage(), [
                'trace' => $e->getTraceAsString(),
            ]);

            return back()
                ->withErrors(['error' => 'Failed to place order: '.$e->getMessage()])
                ->withInput();
        }
    }

    private function isComboVariant(Variant $variant): bool
    {
        $types = $variant->product_type ?? [];
        return is_array($types) && in_array('combo', $types, true);
    }

    private function assertComboStockAvailable(Variant $comboVariant, int $comboQty): void
    {
        $comboVariant->loadMissing('comboItems.includedVariant.product');

        if ($comboVariant->comboItems->isEmpty()) {
            throw new \Exception('Combo items are not configured. Please contact support.');
        }

        foreach ($comboVariant->comboItems as $comboItem) {
            $included = $comboItem->includedVariant;
            if (! $included) {
                throw new \Exception('Combo items are not configured correctly. Please contact support.');
            }

            $required = (int) $comboItem->qty * $comboQty;
            if ($included->stock < $required) {
                $name = $included->product?->title_en ?? 'Product';
                throw new \Exception("Insufficient stock for combo item {$name}. Available: {$included->stock}");
            }
        }
    }

    private function decrementComboIncludedStock(Variant $comboVariant, int $comboQty): void
    {
        $comboVariant->loadMissing('comboItems.includedVariant');

        foreach ($comboVariant->comboItems as $comboItem) {
            $included = $comboItem->includedVariant;
            if (! $included) {
                continue;
            }

            $required = (int) $comboItem->qty * $comboQty;
            if ($required > 0) {
                $included->decrement('stock', $required);
            }
        }
    }

    public function success(Order $order)
    {
        $user = Auth::user();

        // Ensure user can only see their own order
        if (! $user) {
            // Redirect to login with message
            return redirect()->route('login')->with('status', 'Please login to view your order details.');
        }

        // Check if user has permission to view any order OR owns this order
        if ($order->user_id !== $user->id && ! $user->can('ORDER_SHOW')) {
            abort(403, 'Unauthorized access to order.');
        }

        $order->load([
            'items.variant.product',
            'shippingAddress.division',
            'shippingAddress.district',
            'shippingAddress.thana',
        ]);

        return Inertia::render('Order/Success', [
            'order' => $order,
        ]);
    }

    /**
     * Get existing user or create new one
     */
    private function getOrCreateUser(Request $request): int
    {
        // If user is logged in, return their ID
        if (Auth::check()) {
            return Auth::id();
        }

        // Check if user exists with this phone number
        $user = User::where('phone', $request->phone)->first();

        if (! $user) {
            // Create new user
            $userData = [
                'name' => $request->name,
                'phone' => $request->phone,
                'password' => Hash::make($request->phone), // Consider using a random password
                'status' => 'active',
                'email_verified_at' => now(),
            ];

            if ($request->email) {
                $userData['email'] = $request->email;
            }

            $user = User::create($userData);

            // Auto login the user
            Auth::login($user);
        } else {
            // Update user name if needed
            $user->update(['name' => $request->name]);

            // Auto login existing user
            Auth::login($user);
        }

        return $user->id;
    }

    /**
     * Generate unique order number
     */
    private function generateOrderNumber(): string
    {
        $prefix = 'ORD';
        $date = now()->format('Ymd');
        $random = strtoupper(substr(uniqid(), -6));

        return $prefix.'-'.$date.'-'.$random;
    }

    private function calculateShippingCostFromVariantPackagings($cartItems, bool $strict = true): array
    {
        $total = 0.0;
        $missing = false;

        foreach ($cartItems as $item) {
            $variant = $item->variant;
            $product = $variant?->product;

            if (! $variant || ! $product) {
                throw new \Exception('Invalid product in cart. Please remove and try again.');
            }

            if ($product->is_free_shipping) {
                continue;
            }

            $defaultPackaging = $variant->packagings?->firstWhere('is_default', true) ?? $variant->packagings?->first();

            if (! $defaultPackaging) {
                if ($strict) {
                    throw new \Exception('Shipping rules are not set for one or more items. Please contact support.');
                }

                $missing = true;

                continue;
            }

            $maxPerPackage = (int) $defaultPackaging->max_per_package;
            if ($maxPerPackage < 1) {
                if ($strict) {
                    throw new \Exception('Invalid packaging max quantity configured. Please contact support.');
                }

                $missing = true;

                continue;
            }

            $packages = (int) ceil(((int) $item->qty) / $maxPerPackage);
            $chargePerPackage = (float) $defaultPackaging->shipping_charge_per_package;

            $total += $packages * $chargePerPackage;
        }

        return [
            'total' => round($total, 2),
            'missing' => $missing,
        ];
    }

    /**
     * Cancel order (if needed)
     */
    public function cancel(Order $order)
    {
        $user = Auth::user();

        if (! $user || $order->user_id !== $user->id) {
            abort(403);
        }

        if (! in_array($order->status, ['pending', 'processing'])) {
            return back()->withErrors(['error' => 'This order cannot be cancelled.']);
        }

        DB::beginTransaction();

        try {
            // Restore stock
            foreach ($order->items as $item) {
                if ($item->variant) {
                    $item->variant->increment('stock', $item->qty);
                }
            }

            $order->update(['status' => 'cancelled']);

            DB::commit();

            return redirect()->route('order.show', $order->id)
                ->with('success', 'Order cancelled successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Order cancellation failed: '.$e->getMessage());

            return back()->withErrors(['error' => 'Failed to cancel order.']);
        }
    }
}
