<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Order::query()
            ->with(['user', 'shippingAddress'])
            ->latest();

        if ($request->has('status') && $request->status !== 'All') {
            $query->where('status', $request->status);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('id', 'like', "%{$search}%")
                    ->orWhereHas('shippingAddress', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%")
                            ->orWhere('phone', 'like', "%{$search}%"); // Added missing closing parenthesis
                    })
                    ->orWhereHas('user', function ($q) use ($search) {
                        $q->where('email', 'like', "%{$search}%");
                    });
            });
        }

        $orders = $query->paginate(25)->withQueryString();

        return Inertia::render('Order/Index', [
            'orders' => $orders,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Order $order)
    {
        $order->load([
            'user',
            'shippingAddress.division',
            'shippingAddress.district',
            'shippingAddress.thana',
            'items.variant.product',
            'items.variant.size',
        ]);

        return Inertia::render('Order/Show', [
            'order' => $order,
        ]);
    }

    public function print(Order $order)
    {
        $order->load([
            'user',
            'shippingAddress.division',
            'shippingAddress.district',
            'shippingAddress.thana',
            'items.variant.product',
            'items.variant.size',
        ]);

        return Inertia::render('Order/Print', [
            'order' => $order,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => 'nullable|in:Pending,Confirmed,Hold,Processing,Shipping,Delivered,Cancelled',
            'admin_note' => 'nullable|string',
            'payment_status' => 'nullable|string',
            'special_discount' => 'nullable|numeric|min:0',
        ]);

        $updateData = [];
        if (array_key_exists('status', $validated) && $validated['status'] !== null) {
            $updateData['status'] = $validated['status'];
        }
        if (array_key_exists('admin_note', $validated)) {
            $updateData['admin_note'] = $validated['admin_note'];
        }

        if (array_key_exists('special_discount', $validated)) {
            $specialDiscount = $validated['special_discount'] ?? 0;
            $updateData['special_discount'] = $specialDiscount;

            // Recalculate pay_amount
            // Formula: subtotal + shipping_cost - special_discount
            // Note: If there are other discounts (like coupon), they should be considered.
            // Assuming current structure: pay_amount was subtotal + shipping - discount
            // Since we don't have coupon_discount column in migration snippet, we assume special_discount is the only one or main one.

            $newPayAmount = max(0, $order->subtotal + $order->shipping_cost - $specialDiscount);
            $updateData['pay_amount'] = $newPayAmount;

            // Recalculate due_amount based on payment history
            // paid_amount = old_pay_amount - old_due_amount
            $paidAmount = max(0, $order->pay_amount - $order->due_amount);
            $newDueAmount = max(0, $newPayAmount - $paidAmount);

            $updateData['due_amount'] = $newDueAmount;
        }

        if (array_key_exists('payment_status', $validated)) {
            if ($validated['payment_status'] === 'paid') {
                $updateData['due_amount'] = 0;
            } elseif ($validated['payment_status'] === 'unpaid') {
                $updateData['due_amount'] = $order->pay_amount;
            }
        }

        if (! empty($updateData)) {
            $order->update($updateData);
        }

        return back()->with('success', 'Order updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Order $order)
    {
        // Optional: Implement delete logic
        $order->delete();

        return redirect()->route('orders.index')->with('success', 'Order deleted successfully.');
    }

    public function bulkDestroy(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:orders,id',
        ]);

        Order::whereIn('id', $request->ids)->delete();

        return redirect()->route('orders.index')->with('success', 'Orders deleted successfully.');
    }
}
