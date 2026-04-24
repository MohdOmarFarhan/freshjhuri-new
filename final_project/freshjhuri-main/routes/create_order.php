<?php

use App\Http\Controllers\Admin\PaymentMediaController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group(function () {
    // Settings routes are handled in settings.php
});

Route::middleware(['auth', 'verified'])->group(function () {
    // Settings routes are handled in settings.php
});

Route::get('payment-medias', [PaymentMediaController::class, 'index'])->name('payment.medias')->middleware('permission:PAYMENT_MEDIA_INDEX');
Route::get('payment-media/create', [PaymentMediaController::class, 'create'])->name('payment.media.create')->middleware('permission:PAYMENT_MEDIA_CREATE');
Route::post('payment-media/store', [PaymentMediaController::class, 'store'])->name('payment.media.store')->middleware('permission:PAYMENT_MEDIA_CREATE');
Route::get('payment-media/{paymentmedia}/edit', [PaymentMediaController::class, 'edit'])->name('payment.media.edit')->middleware('permission:PAYMENT_MEDIA_EDIT');
Route::put('payment-media/update/{paymentmedia}', [PaymentMediaController::class, 'update'])->name('payment.media.update')->middleware('permission:PAYMENT_MEDIA_EDIT');
Route::delete('payment-media/delete/{paymentmedia}', [PaymentMediaController::class, 'destroy'])->name('payment.media.destroy')->middleware('permission:PAYMENT_MEDIA_DELETE');

// Cart Routes (Publicly Accessible)
Route::controller(CartController::class)->group(function () {
    Route::get('/cart', 'index')->name('cart.index');
    Route::post('/cart/add', 'addToCart')->name('cart.add');
    Route::post('/cart/add-bundle', 'addBundle')->name('cart.addBundle');
    Route::post('/cart/update', 'updateCart')->name('cart.update');
    Route::delete('/cart/remove/{id}', 'removeFromCart')->name('cart.remove');
});

Route::get('/checkout', [OrderController::class, 'create'])->name('checkout.index')->withoutMiddleware('auth');
Route::post('/order/store', [OrderController::class, 'store'])->name('order.store')->withoutMiddleware('auth');
Route::get('/order/success/{order}', [OrderController::class, 'success'])
    ->name('order.success')->withoutMiddleware('auth');
Route::get('/order/payment/{order}', [OrderController::class, 'orderCreate'])->name('order.payment')->withoutMiddleware('auth');
Route::post('/order/payment/{order}', [OrderController::class, 'orderSubmit'])->name('payment.store')->withoutMiddleware('auth');
