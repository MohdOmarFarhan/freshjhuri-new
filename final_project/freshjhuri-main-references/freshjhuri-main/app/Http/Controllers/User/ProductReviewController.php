<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\ProductReview;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;

class ProductReviewController extends Controller
{
    public function store(Request $request, Order $order, OrderItem $orderItem)
    {
        if ((int) $order->user_id !== (int) Auth::id()) {
            abort(403);
        }

        if ((int) $orderItem->order_id !== (int) $order->id) {
            abort(404);
        }

        if (! in_array((string) $order->status, ['Delivered', 'Completed'], true)) {
            return Redirect::back()->withErrors([
                'review' => 'Review is allowed only for delivered/completed orders.',
            ]);
        }

        $orderItem->loadMissing('variant.product');
        if (! $orderItem->variant || ! $orderItem->variant->product_id) {
            return Redirect::back()->withErrors([
                'review' => 'Invalid product for review.',
            ]);
        }

        $validated = $request->validate([
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'comment_en' => ['nullable', 'string', 'max:2000'],
            'comment_bn' => ['nullable', 'string', 'max:2000'],
        ]);

        if (blank($validated['comment_en'] ?? null) && blank($validated['comment_bn'] ?? null)) {
            return Redirect::back()->withErrors([
                'review' => 'Please write review in English or Bangla.',
            ]);
        }

        ProductReview::updateOrCreate(
            [
                'user_id' => Auth::id(),
                'order_item_id' => $orderItem->id,
            ],
            [
                'product_id' => $orderItem->variant->product_id,
                'order_id' => $order->id,
                'rating' => $validated['rating'],
                'comment_en' => $validated['comment_en'] ?? null,
                'comment_bn' => $validated['comment_bn'] ?? null,
                'is_approved' => false,
            ]
        );

        return Redirect::back()->with('success', 'Review submitted. It will appear after admin approval.');
    }
}
