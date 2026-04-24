<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ProductReview;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class ProductReviewController extends Controller
{
    public function index(Request $request)
    {
        $reviews = ProductReview::query()
            ->with([
                'user:id,name,email,phone',
                'product:id,title_en,title_bn,slug',
                'order:id,status',
            ])
            ->when($request->filled('status'), function ($query) use ($request) {
                if ($request->status === 'approved') {
                    $query->where('is_approved', true);
                } elseif ($request->status === 'pending') {
                    $query->where('is_approved', false);
                }
            })
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Review/Index', [
            'reviews' => $reviews,
            'filters' => $request->only(['status']),
        ]);
    }

    public function updateStatus(Request $request, ProductReview $review)
    {
        $validated = $request->validate([
            'is_approved' => ['required', 'boolean'],
        ]);

        $review->update([
            'is_approved' => (bool) $validated['is_approved'],
        ]);

        return Redirect::back()->with('success', 'Review status updated successfully.');
    }
}
