<?php

use App\Http\Controllers\Admin\BannarController;
use App\Http\Controllers\Admin\BrandMarqueeController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\ContactDetailsController;
use App\Http\Controllers\Admin\ContactMessageController;
use App\Http\Controllers\Admin\FooterController;
use App\Http\Controllers\Admin\HomepageSectionController;
use App\Http\Controllers\Admin\ServiceController;
use App\Http\Controllers\Admin\SocialController;
use App\Http\Controllers\Admin\StaticBannarController;
use App\Http\Controllers\ContactPageController;
use App\Http\Controllers\Home\ShippingChargeController;
use Illuminate\Support\Facades\Route;

Route::get('brand-marquees', [BrandMarqueeController::class, 'index'])
    ->name('brand-marquees.index')
    ->middleware('permission:BRAND_MARQUEE_INDEX');
Route::get('brand-marquees/create', [BrandMarqueeController::class, 'create'])
    ->name('brand-marquees.create')
    ->middleware('permission:BRAND_MARQUEE_CREATE');
Route::post('brand-marquees/store', [BrandMarqueeController::class, 'store'])
    ->name('brand-marquees.store')
    ->middleware('permission:BRAND_MARQUEE_CREATE');
Route::get('brand-marquees/{brandMarquee}/edit', [BrandMarqueeController::class, 'edit'])
    ->name('brand-marquees.edit')
    ->middleware('permission:BRAND_MARQUEE_EDIT');
Route::put('brand-marquees/update/{brandMarquee}', [BrandMarqueeController::class, 'update'])
    ->name('brand-marquees.update')
    ->middleware('permission:BRAND_MARQUEE_EDIT');
Route::delete('brand-marquees/delete/{brandMarquee}', [BrandMarqueeController::class, 'destroy'])
    ->name('brand-marquees.destroy')
    ->middleware('permission:BRAND_MARQUEE_DELETE');

Route::get('homepage-sections', [HomepageSectionController::class, 'index'])
    ->name('homepage-sections.index')
    ->middleware('permission:HOMEPAGE_SECTION_INDEX');
Route::get('homepage-sections/create', [HomepageSectionController::class, 'create'])
    ->name('homepage-sections.create')
    ->middleware('permission:HOMEPAGE_SECTION_CREATE');
Route::post('homepage-sections', [HomepageSectionController::class, 'store'])
    ->name('homepage-sections.store')
    ->middleware('permission:HOMEPAGE_SECTION_CREATE');
Route::get('homepage-sections/{homepageSection}/edit', [HomepageSectionController::class, 'edit'])
    ->name('homepage-sections.edit')
    ->middleware('permission:HOMEPAGE_SECTION_EDIT');
Route::put('homepage-sections/{homepageSection}', [HomepageSectionController::class, 'update'])
    ->name('homepage-sections.update')
    ->middleware('permission:HOMEPAGE_SECTION_EDIT');
Route::delete('homepage-sections/{homepageSection}', [HomepageSectionController::class, 'destroy'])
    ->name('homepage-sections.destroy')
    ->middleware('permission:HOMEPAGE_SECTION_DELETE');

// common settings
Route::get('bannars', [BannarController::class, 'index'])->name('bannars.index')->middleware('permission:BANNAR_INDEX');
Route::get('bannars/create', [BannarController::class, 'create'])->name('bannars.create')->middleware('permission:BANNAR_CREATE');
Route::post('bannars/store', [BannarController::class, 'store'])->name('bannars.store')->middleware('permission:BANNAR_CREATE');
Route::get('bannars/{bannar}/edit', [BannarController::class, 'edit'])->name('bannars.edit')->middleware('permission:BANNAR_EDIT');
Route::put('bannars/update/{bannar}', [BannarController::class, 'update'])->name('bannars.update')->middleware('permission:BANNAR_EDIT');
Route::delete('bannars/delete/{bannar}', [BannarController::class, 'delete'])->name('bannars.delete')->middleware('permission:BANNAR_DELETE');


// categories
Route::get('categories', [CategoryController::class, 'index'])->name('categories.index')->middleware('permission:CATEGORY_INDEX');
Route::get('categories/create', [CategoryController::class, 'create'])->name('categories.create')->middleware('permission:CATEGORY_CREATE');
Route::post('categories/store', [CategoryController::class, 'store'])->name('categories.store')->middleware('permission:CATEGORY_CREATE');
Route::get('categories/{category}/edit', [CategoryController::class, 'edit'])->name('categories.edit')->middleware('permission:CATEGORY_EDIT');
Route::put('categories/update/{category}', [CategoryController::class, 'update'])->name('categories.update')->middleware('permission:CATEGORY_EDIT');
Route::delete('categories/delete/{category}', [CategoryController::class, 'delete'])->name('categories.delete')->middleware('permission:CATEGORY_DELETE');

Route::get('/contact-page', [ContactPageController::class, 'contactPage'])->name('contact.page');
Route::get('/shipping-charges', [ShippingChargeController::class, 'index'])->name('shipping.charges');

Route::get('contact/details', [ContactDetailsController::class, 'index'])->name('contact.details')->middleware('permission:CONTACT_INDEX');
Route::get('contact/detail/create', [ContactDetailsController::class, 'create'])->name('contactdetail.create')->middleware('permission:CONTACT_CREATE');
Route::post('contact/detail/store', [ContactDetailsController::class, 'store'])->name('contactdetail.store')->middleware('permission:CONTACT_CREATE');
Route::get('contact/detail/{contactdetail}/edit', [ContactDetailsController::class, 'edit'])->name('contactdetail.edit')->middleware('permission:CONTACT_EDIT');
Route::put('contact/detail/update/{contactdetail}', [ContactDetailsController::class, 'update'])->name('contactdetail.update')->middleware('permission:CONTACT_EDIT');
Route::delete('contact/detail/delete/{contactdetail}', [ContactDetailsController::class, 'delete'])->name('contactdetail.delete')->middleware('permission:CONTACT_DELETE');

// Contact Message
Route::get('contact/messages', [ContactMessageController::class, 'Index'])->name('contact.messages');
Route::delete('/contact-message/{contact}', [ContactMessageController::class, 'contactMessageDelete'])->name('contactmessage.delete');

// Footer
Route::get('footer', [FooterController::class, 'index'])->name('footer.index')->middleware('permission:FOOTER_INDEX');
Route::get('footer/create', [FooterController::class, 'create'])->name('footer.create')->middleware('permission:FOOTER_CREATE');
Route::post('footer/store', [FooterController::class, 'store'])->name('footer.store')->middleware('permission:FOOTER_CREATE');
Route::get('footer/{footer}/edit', [FooterController::class, 'edit'])->name('footer.edit')->middleware('permission:FOOTER_EDIT');
Route::put('footer/update/{footer}', [FooterController::class, 'update'])->name('footer.update')->middleware('permission:FOOTER_EDIT');
Route::delete('footer/delete/{footer}', [FooterController::class, 'delete'])->name('footer.delete')->middleware('permission:FOOTER_DELETE');

// Social
Route::get('socials', [SocialController::class, 'index'])->name('social.index')->middleware('permission:SOCIAL_INDEX');
Route::get('socials/create', [SocialController::class, 'create'])->name('social.create')->middleware('permission:SOCIAL_CREATE');
Route::post('socials/store', [SocialController::class, 'store'])->name('social.store')->middleware('permission:SOCIAL_CREATE');
Route::get('socials/{social}/edit', [SocialController::class, 'edit'])->name('social.edit')->middleware('permission:SOCIAL_EDIT');
Route::put('socials/update/{social}', [SocialController::class, 'update'])->name('social.update')->middleware('permission:SOCIAL_EDIT');
Route::delete('socials/delete/{social}', [SocialController::class, 'destroy'])->name('social.destroy')->middleware('permission:SOCIAL_DELETE');

// Service
Route::get('services', [ServiceController::class, 'index'])->name('services.index')->middleware('permission:SERVICE_INDEX');
Route::get('services/create', [ServiceController::class, 'create'])->name('services.create')->middleware('permission:SERVICE_CREATE');
Route::post('services/store', [ServiceController::class, 'store'])->name('services.store')->middleware('permission:SERVICE_CREATE');
Route::get('services/{service}', [ServiceController::class, 'show'])->name('services.show')->middleware('permission:SERVICE_SHOW');
Route::get('services/{service}/edit', [ServiceController::class, 'edit'])->name('services.edit')->middleware('permission:SERVICE_EDIT');
Route::put('services/update/{service}', [ServiceController::class, 'update'])->name('services.update')->middleware('permission:SERVICE_EDIT');
Route::delete('services/delete/{service}', [ServiceController::class, 'destroy'])->name('services.destroy')->middleware('permission:SERVICE_DELETE');

// Service Video
Route::get('service-videos', [\App\Http\Controllers\Admin\ServiceVideoController::class, 'index'])->name('service-videos.index')->middleware('permission:SERVICE_VIDEO_INDEX');
Route::get('service-videos/create', [\App\Http\Controllers\Admin\ServiceVideoController::class, 'create'])->name('service-videos.create')->middleware('permission:SERVICE_VIDEO_CREATE');
Route::post('service-videos/store', [\App\Http\Controllers\Admin\ServiceVideoController::class, 'store'])->name('service-videos.store')->middleware('permission:SERVICE_VIDEO_CREATE');
Route::get('service-videos/{serviceVideo}/edit', [\App\Http\Controllers\Admin\ServiceVideoController::class, 'edit'])->name('service-videos.edit')->middleware('permission:SERVICE_VIDEO_EDIT');
Route::put('service-videos/update/{serviceVideo}', [\App\Http\Controllers\Admin\ServiceVideoController::class, 'update'])->name('service-videos.update')->middleware('permission:SERVICE_VIDEO_EDIT');
Route::delete('service-videos/delete/{serviceVideo}', [\App\Http\Controllers\Admin\ServiceVideoController::class, 'destroy'])->name('service-videos.destroy')->middleware('permission:SERVICE_VIDEO_DELETE');

Route::middleware('throttle:3,1')->post('send-email', [ContactMessageController::class, 'sendEmail'])->name('send.email');

Route::middleware('auth')->group(function () {});
