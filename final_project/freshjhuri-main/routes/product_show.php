<?php

use App\Http\Controllers\Home\ProductPageController;
use Illuminate\Support\Facades\Route;

// prodctsoncategory
Route::get('category/products/{slug}', [ProductPageController::class, 'allProductsOnCategory'])->name('productsoncategory');
Route::get('/product-details/{slug}', [ProductPageController::class, 'singleProduct'])->name('product.details');
