<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PaymentMedia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PaymentMediaController extends Controller
{
    public function index(Request $request)
    {
        $query = PaymentMedia::query();

        if ($request->search) {
            $query->where('name', 'like', '%'.$request->search.'%')
                ->orWhere('pay_number', 'like', '%'.$request->search.'%');
        }

        $paymentmedia = $query->latest()->get();

        return Inertia::render('PaymentMedia/Index', [
            'paymentmedia' => $paymentmedia,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create()
    {
        return Inertia::render('PaymentMedia/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'pay_number' => 'required|string|max:255',
            'icon' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp,svg|max:2048',
        ]);

        $data = $request->only(['name', 'pay_number']);

        if ($request->hasFile('icon')) {
            $data['icon'] = $request->file('icon')->store('payment_media', 'public');
        }

        PaymentMedia::create($data);

        return Redirect::route('payment.medias')->with('success', 'Payment Media created successfully.');
    }

    public function edit(PaymentMedia $paymentmedia)
    {
        return Inertia::render('PaymentMedia/Edit', compact('paymentmedia'));
    }

    public function update(Request $request, PaymentMedia $paymentmedia)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'pay_number' => 'required|string|max:255',
            'icon' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp,svg|max:2048',
        ]);

        $data = $request->only(['name', 'pay_number']);

        if ($request->hasFile('icon')) {
            if ($paymentmedia->icon) {
                Storage::disk('public')->delete($paymentmedia->icon);
            }
            $data['icon'] = $request->file('icon')->store('payment_media', 'public');
        }

        $paymentmedia->update($data);

        return Redirect::route('payment.medias')->with('success', 'Payment Media updated successfully.');
    }

    public function destroy(PaymentMedia $paymentmedia)
    {
        if ($paymentmedia->icon) {
            Storage::disk('public')->delete($paymentmedia->icon);
        }

        $paymentmedia->delete();

        return Redirect::route('payment.medias')->with('success', 'Payment Media deleted successfully.');
    }
}
