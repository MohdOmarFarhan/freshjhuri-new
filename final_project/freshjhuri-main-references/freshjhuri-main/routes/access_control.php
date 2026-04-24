<?php

use App\Http\Controllers\PermissionController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

// Role related routes

Route::resource('/roles', RoleController::class)->only(['create', 'store'])->middleware('permission:ROLE_CREATE');
Route::resource('/roles', RoleController::class)->only(['edit', 'update'])->middleware(('permission:ROLE_EDIT'));
Route::resource('/roles', RoleController::class)->only(['destroy'])->middleware(('permission:ROLE_DELETE'));
Route::resource('/roles', RoleController::class)->only(['index', 'show'])->middleware(('permission:ROLE_CREATE|ROLE_EDIT|ROLE_DELETE|ROLE_SHOW|ROLE_INDEX'));
Route::get('permissions', [PermissionController::class, 'index'])->name('permissions')->middleware('permission:PERMISSION_INDEX');

// without permission
// Route::resource('/roles', RoleController::class)->only(['create', 'store']);
// Route::resource('/roles', RoleController::class)->only(['edit', 'update']);
// Route::resource('/roles', RoleController::class)->only(['destroy']);
// Route::resource('/roles', RoleController::class)->only(['index', 'show']);
// Route::get('permissions', [PermissionController::class, 'index'])->name('permissions');

// user related routes

Route::resource('/users', UserController::class)->only(['create', 'store'])->middleware(('permission:USER_CREATE'));
Route::resource('/users', UserController::class)->only(['edit', 'update'])->middleware(('permission:USER_EDIT'));
Route::resource('/users', UserController::class)->only(['destroy'])->middleware(('permission:USER_DELETE'));
Route::put('/users/{id}/restore', [UserController::class, 'restore'])->name('users.restore')->middleware('permission:USER_DELETE');
Route::delete('/users/{id}/force-delete', [UserController::class, 'forceDelete'])->name('users.force-delete')->middleware('permission:USER_DELETE');
Route::resource('/users', UserController::class)->only(['index', 'show'])
    ->middleware(('permission:USER_CREATE|USER_EDIT|USER_DELETE|USER_SHOW|USER_INDEX'));

// without permission
// Route::resource('/users', UserController::class)->only(['create', 'store']);
// Route::resource('/users', UserController::class)->only(['edit', 'update']);
// Route::resource('/users', UserController::class)->only(['destroy']);
// Route::resource('/users', UserController::class)->only(['index', 'show']);
