<?php

use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\ComboProductController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\ProductStatusController;
use App\Http\Controllers\Admin\SizeController;
use App\Http\Controllers\Admin\VariantController;
use Illuminate\Support\Facades\Route;

// categories
Route::get('categories', [CategoryController::class, 'index'])->name('categories.index')->middleware('permission:CATEGORY_INDEX');
Route::get('categories/create', [CategoryController::class, 'create'])->name('categories.create')->middleware('permission:CATEGORY_CREATE');
Route::post('categories/store', [CategoryController::class, 'store'])->name('categories.store')->middleware('permission:CATEGORY_CREATE');
Route::get('categories/{category}/edit', [CategoryController::class, 'edit'])->name('categories.edit')->middleware('permission:CATEGORY_EDIT');
Route::put('categories/update/{category}', [CategoryController::class, 'update'])->name('categories.update')->middleware('permission:CATEGORY_EDIT');
Route::delete('categories/delete/{category}', [CategoryController::class, 'delete'])->name('categories.delete')->middleware('permission:CATEGORY_DELETE');

// sizes
Route::get('sizes', [SizeController::class, 'index'])->name('sizes.index')->middleware('permission:SIZE_INDEX');
Route::get('sizes/create', [SizeController::class, 'create'])->name('sizes.create')->middleware('permission:SIZE_CREATE');
Route::post('sizes/store', [SizeController::class, 'store'])->name('sizes.store')->middleware('permission:SIZE_CREATE');
Route::get('sizes/{size}/edit', [SizeController::class, 'edit'])->name('sizes.edit')->middleware('permission:SIZE_EDIT');
Route::put('sizes/update/{size}', [SizeController::class, 'update'])->name('sizes.update')->middleware('permission:SIZE_EDIT');
Route::delete('sizes/delete/{size}', [SizeController::class, 'delete'])->name('sizes.delete')->middleware('permission:SIZE_DELETE');

// product statuses
Route::get('product-statuses', [ProductStatusController::class, 'index'])->name('product-statuses.index')->middleware('permission:PRODUCT_STATUS_INDEX');
Route::get('product-statuses/create', [ProductStatusController::class, 'create'])->name('product-statuses.create')->middleware('permission:PRODUCT_STATUS_CREATE');
Route::post('product-statuses/store', [ProductStatusController::class, 'store'])->name('product-statuses.store')->middleware('permission:PRODUCT_STATUS_CREATE');
Route::get('product-statuses/{productStatus}/edit', [ProductStatusController::class, 'edit'])->name('product-statuses.edit')->middleware('permission:PRODUCT_STATUS_EDIT');
Route::put('product-statuses/update/{productStatus}', [ProductStatusController::class, 'update'])->name('product-statuses.update')->middleware('permission:PRODUCT_STATUS_EDIT');
Route::delete('product-statuses/delete/{productStatus}', [ProductStatusController::class, 'delete'])->name('product-statuses.delete')->middleware('permission:PRODUCT_STATUS_DELETE');

// variants
Route::get('variants', [VariantController::class, 'index'])->name('variants.index')->middleware('permission:VARIANT_INDEX');
Route::get('variants/create', [VariantController::class, 'create'])->name('variants.create')->middleware('permission:VARIANT_CREATE');
Route::post('variants/store', [VariantController::class, 'store'])->name('variants.store')->middleware('permission:VARIANT_CREATE');
Route::get('variants/{variant}/edit', [VariantController::class, 'edit'])->name('variants.edit')->middleware('permission:VARIANT_EDIT');
Route::put('variants/update/{variant}', [VariantController::class, 'update'])->name('variants.update')->middleware('permission:VARIANT_EDIT');
Route::delete('variants/delete/{variant}', [VariantController::class, 'delete'])->name('variants.delete')->middleware('permission:VARIANT_DELETE');
Route::delete('variants/group-delete/{variant}', [VariantController::class, 'deleteGroup'])->name('variants.group-delete')->middleware('permission:VARIANT_DELETE');

// combo products (combo variants mapping)
Route::get('combo-products', [ComboProductController::class, 'index'])->name('combo-products.index')->middleware('permission:PRODUCT_INDEX');
Route::get('combo-products/create', [ComboProductController::class, 'create'])->name('combo-products.create')->middleware('permission:PRODUCT_CREATE');
Route::post('combo-products', [ComboProductController::class, 'store'])->name('combo-products.store')->middleware('permission:PRODUCT_CREATE');
Route::get('combo-products/{variant}/edit', [ComboProductController::class, 'edit'])->name('combo-products.edit')->middleware('permission:PRODUCT_EDIT');
Route::put('combo-products/{variant}', [ComboProductController::class, 'update'])->name('combo-products.update')->middleware('permission:PRODUCT_EDIT');
Route::delete('combo-products/{variant}', [ComboProductController::class, 'destroy'])->name('combo-products.destroy')->middleware('permission:PRODUCT_DELETE');

// products
Route::get('products', [ProductController::class, 'index'])->name('products.index')->middleware('permission:PRODUCT_INDEX');
Route::get('products/create', [ProductController::class, 'create'])->name('products.create')->middleware('permission:PRODUCT_CREATE');
Route::post('products/store', [ProductController::class, 'store'])->name('products.store')->middleware('permission:PRODUCT_CREATE');
Route::get('products/{product}/edit', [ProductController::class, 'edit'])->name('products.edit')->middleware('permission:PRODUCT_EDIT');
Route::put('products/update/{product}', [ProductController::class, 'update'])->name('products.update')->middleware('permission:PRODUCT_EDIT');
Route::delete('products/slider-image/{sliderImage}', [ProductController::class, 'deleteSliderImage'])->name('products.slider-image.delete')->middleware('permission:PRODUCT_EDIT');
Route::delete('products/delete/{product}', [ProductController::class, 'destroy'])->name('products.destroy')->middleware('permission:PRODUCT_DELETE');
Route::get('products/{product}', [ProductController::class, 'show'])->name('products.show')->middleware('permission:PRODUCT_SHOW');
