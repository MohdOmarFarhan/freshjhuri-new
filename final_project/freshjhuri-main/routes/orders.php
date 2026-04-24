<?php

use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\ProductReviewController as AdminProductReviewController;
use App\Http\Controllers\User\ProductReviewController as UserProductReviewController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin')->middleware(['auth', 'verified'])->group(function () {
    Route::get('/orders', [OrderController::class, 'index'])->name('orders.index')->middleware('permission:ORDER_INDEX');
    Route::get('/orders/{order}/print', [OrderController::class, 'print'])->name('orders.print')->middleware('permission:ORDER_SHOW');
    Route::get('/orders/{order}', [OrderController::class, 'show'])->name('orders.show')->middleware('permission:ORDER_SHOW');
    Route::put('/orders/{order}', [OrderController::class, 'update'])->name('orders.update')->middleware('permission:ORDER_EDIT');
    Route::post('/orders/bulk-destroy', [OrderController::class, 'bulkDestroy'])->name('orders.bulk-destroy')->middleware('permission:ORDER_DELETE');
    Route::delete('/orders/{order}', [OrderController::class, 'destroy'])->name('orders.destroy')->middleware('permission:ORDER_DELETE');

    Route::get('/reviews', [AdminProductReviewController::class, 'index'])
        ->name('reviews.index')
        ->middleware('permission:ORDER_INDEX');
    Route::put('/reviews/{review}/status', [AdminProductReviewController::class, 'updateStatus'])
        ->name('reviews.status.update')
        ->middleware('permission:ORDER_EDIT');
});

// publically accessible routes for orders
Route::get('/my-orders', [App\Http\Controllers\User\OrderController::class, 'index'])
    ->name('user.orders.index')
    ->middleware(['auth']);
Route::get('/my-orders/{order}', [App\Http\Controllers\User\OrderController::class, 'show'])
    ->name('user.orders.show')
    ->middleware(['auth']);
Route::get('/my-orders/{order}/print', [App\Http\Controllers\User\OrderController::class, 'print'])
    ->name('user.orders.print')
    ->middleware(['auth']);
Route::post('/my-orders/{order}/items/{orderItem}/review', [UserProductReviewController::class, 'store'])
    ->name('user.orders.review.store')
    ->middleware(['auth']);
