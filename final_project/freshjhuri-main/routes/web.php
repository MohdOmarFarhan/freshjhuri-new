<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Home\HomeController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'homePage'])->name('home');

Route::get('dashboard', [DashboardController::class, 'index'])->middleware(['auth'])->name('dashboard');

require __DIR__.'/access_control.php';
require __DIR__.'/settings.php';
require __DIR__.'/home_routes.php';
require __DIR__.'/products.php';
require __DIR__.'/product_show.php';
require __DIR__.'/create_order.php';
require __DIR__.'/orders.php';
