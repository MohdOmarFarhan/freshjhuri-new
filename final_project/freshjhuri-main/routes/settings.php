<?php

use App\Http\Controllers\Admin\CommonSettingController;
use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\Settings\TwoFactorAuthenticationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth'])->group(function () {
    Route::redirect('settings', '/settings/profile');

    Route::get('settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('settings/profile', [ProfileController::class, 'update'])->name('profile.update');

    Route::get('settings/password', [PasswordController::class, 'edit'])->name('user-password.edit');

    Route::put('settings/password', [PasswordController::class, 'update'])
        ->middleware('throttle:6,1')
        ->name('user-password.update');

    Route::get('settings/appearance', function () {
        return Inertia::render('settings/Appearance');
    })->name('appearance.edit');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('settings/two-factor', [TwoFactorAuthenticationController::class, 'show'])
        ->name('two-factor.show');
});

// // common settings
Route::get('common-settings', [CommonSettingController::class, 'index'])->name('common.settings')->middleware('permission:SETTINGS_INDEX');
Route::get('common-settings/create', [CommonSettingController::class, 'create'])->name('common.setting.create')->middleware('permission:SETTINGS_CREATE');
Route::post('common-settings/store', [CommonSettingController::class, 'store'])->name('common.setting.store')->middleware('permission:SETTINGS_CREATE');
Route::get('common-settings/{commonsetting}/edit', [CommonSettingController::class, 'edit'])->name('common.setting.edit')->middleware('permission:SETTINGS_EDIT');
Route::put('common-settings/update/{commonsetting}', [CommonSettingController::class, 'update'])->name('common.setting.update')->middleware('permission:SETTINGS_EDIT');
Route::delete('common-settings/delete/{commonsetting}', [CommonSettingController::class, 'delete'])->name('common.setting.delete')->middleware('permission:SETTINGS_DELETE');

// Location & Shipping Management
Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    // Divisions
    Route::get('divisions', [\App\Http\Controllers\Admin\DivisionController::class, 'index'])->name('divisions.index')->middleware('permission:DIVISION_INDEX');
    Route::get('divisions/create', [\App\Http\Controllers\Admin\DivisionController::class, 'create'])->name('divisions.create')->middleware('permission:DIVISION_CREATE');
    Route::post('divisions', [\App\Http\Controllers\Admin\DivisionController::class, 'store'])->name('divisions.store')->middleware('permission:DIVISION_CREATE');
    Route::get('divisions/{division}/edit', [\App\Http\Controllers\Admin\DivisionController::class, 'edit'])->name('divisions.edit')->middleware('permission:DIVISION_EDIT');
    Route::put('divisions/{division}', [\App\Http\Controllers\Admin\DivisionController::class, 'update'])->name('divisions.update')->middleware('permission:DIVISION_EDIT');
    Route::delete('divisions/{division}', [\App\Http\Controllers\Admin\DivisionController::class, 'destroy'])->name('divisions.destroy')->middleware('permission:DIVISION_DELETE');

    // Districts
    Route::get('districts', [\App\Http\Controllers\Admin\DistrictController::class, 'index'])->name('districts.index')->middleware('permission:DISTRICT_INDEX');
    Route::get('districts/create', [\App\Http\Controllers\Admin\DistrictController::class, 'create'])->name('districts.create')->middleware('permission:DISTRICT_CREATE');
    Route::post('districts', [\App\Http\Controllers\Admin\DistrictController::class, 'store'])->name('districts.store')->middleware('permission:DISTRICT_CREATE');
    Route::get('districts/{district}/edit', [\App\Http\Controllers\Admin\DistrictController::class, 'edit'])->name('districts.edit')->middleware('permission:DISTRICT_EDIT');
    Route::put('districts/{district}', [\App\Http\Controllers\Admin\DistrictController::class, 'update'])->name('districts.update')->middleware('permission:DISTRICT_EDIT');
    Route::delete('districts/{district}', [\App\Http\Controllers\Admin\DistrictController::class, 'destroy'])->name('districts.destroy')->middleware('permission:DISTRICT_DELETE');

    // Thanas
    Route::get('thanas', [\App\Http\Controllers\Admin\ThanaController::class, 'index'])->name('thanas.index')->middleware('permission:THANA_INDEX');
    Route::get('thanas/create', [\App\Http\Controllers\Admin\ThanaController::class, 'create'])->name('thanas.create')->middleware('permission:THANA_CREATE');
    Route::post('thanas', [\App\Http\Controllers\Admin\ThanaController::class, 'store'])->name('thanas.store')->middleware('permission:THANA_CREATE');
    Route::get('thanas/{thana}/edit', [\App\Http\Controllers\Admin\ThanaController::class, 'edit'])->name('thanas.edit')->middleware('permission:THANA_EDIT');
    Route::put('thanas/{thana}', [\App\Http\Controllers\Admin\ThanaController::class, 'update'])->name('thanas.update')->middleware('permission:THANA_EDIT');
    Route::delete('thanas/{thana}', [\App\Http\Controllers\Admin\ThanaController::class, 'destroy'])->name('thanas.destroy')->middleware('permission:THANA_DELETE');

    // Shipping Costs
    Route::get('shipping', [\App\Http\Controllers\Admin\ShippingCostController::class, 'index'])->name('shipping.index')->middleware('permission:SHIPPING_COST_INDEX');
    Route::get('shipping/create', [\App\Http\Controllers\Admin\ShippingCostController::class, 'create'])->name('shipping.create')->middleware('permission:SHIPPING_COST_CREATE');
    Route::post('shipping', [\App\Http\Controllers\Admin\ShippingCostController::class, 'store'])->name('shipping.store')->middleware('permission:SHIPPING_COST_CREATE');
    Route::get('shipping/{shippingCost}/edit', [\App\Http\Controllers\Admin\ShippingCostController::class, 'edit'])->name('shipping.edit')->middleware('permission:SHIPPING_COST_EDIT');
    Route::put('shipping/{shippingCost}', [\App\Http\Controllers\Admin\ShippingCostController::class, 'update'])->name('shipping.update')->middleware('permission:SHIPPING_COST_EDIT');
    Route::delete('shipping/{shippingCost}', [\App\Http\Controllers\Admin\ShippingCostController::class, 'destroy'])->name('shipping.destroy')->middleware('permission:SHIPPING_COST_DELETE');

    // Shipping Charts
    Route::get('shipping-charts', [\App\Http\Controllers\Admin\ShippingChartController::class, 'index'])->name('shipping-charts.index')->middleware('permission:SHIPPING_CHART_INDEX');
    Route::get('shipping-charts/create', [\App\Http\Controllers\Admin\ShippingChartController::class, 'create'])->name('shipping-charts.create')->middleware('permission:SHIPPING_CHART_CREATE');
    Route::post('shipping-charts', [\App\Http\Controllers\Admin\ShippingChartController::class, 'store'])->name('shipping-charts.store')->middleware('permission:SHIPPING_CHART_CREATE');
    Route::get('shipping-charts/{shippingChart}/edit', [\App\Http\Controllers\Admin\ShippingChartController::class, 'edit'])->name('shipping-charts.edit')->middleware('permission:SHIPPING_CHART_EDIT');
    Route::put('shipping-charts/{shippingChart}', [\App\Http\Controllers\Admin\ShippingChartController::class, 'update'])->name('shipping-charts.update')->middleware('permission:SHIPPING_CHART_EDIT');
    Route::delete('shipping-charts/{shippingChart}', [\App\Http\Controllers\Admin\ShippingChartController::class, 'destroy'])->name('shipping-charts.destroy')->middleware('permission:SHIPPING_CHART_DELETE');
});
// without role permission
// Route::get('common-settings', [CommonSettingController::class, 'index'])->name('common.settings');
// Route::get('common-settings/create', [CommonSettingController::class, 'create'])->name('common.setting.create');
// Route::post('common-settings/store', [CommonSettingController::class, 'store'])->name('common.setting.store');
// Route::get('common-settings/{commonsetting}/edit', [CommonSettingController::class, 'edit'])->name('common.setting.edit');
// Route::put('common-settings/update/{commonsetting}', [CommonSettingController::class, 'update'])->name('common.setting.update');
// Route::delete('common-settings/delete/{commonsetting}', [CommonSettingController::class, 'delete'])->name('common.setting.delete');
