<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CommonSetting;
use App\Services\ImageConversionService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class CommonSettingController extends Controller
{
    public function index()
    {
        $commonsettings = CommonSetting::latest()->first();

        return Inertia::render('CommonSettings/Index', compact('commonsettings'));
    }

    public function create()
    {
        return Inertia::render('CommonSettings/Create');
    }

    public function store(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'project_name' => 'required|string|max:255',
            'slogan' => 'required|string|max:255',
            'est' => 'nullable|string|max:255',
            'email' => 'required|string|max:255',
            'phone' => 'required|string|max:255',
            'whatsapp' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'copyright' => 'required|string|max:255',
            'logo_1' => 'nullable|file|mimes:jpeg,png,jpg,gif,svg,webp|max:4048',
            'logo_2' => 'nullable|file|mimes:jpeg,png,jpg,gif,svg,webp|max:4048',
            'developer_logo' => 'nullable|file|mimes:jpeg,png,jpg,gif,webp,bmp|max:4048',
            'banner_image' => 'nullable|file|mimes:jpeg,png,jpg,gif,webp,bmp|max:4048',
            'facebook_pixel' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return Redirect::back()->withErrors($validator)->withInput();
        }

        $imageLogo1 = null;
        if ($request->hasFile('logo_1')) {
            $file = $request->file('logo_1');
            if (strtolower($file->getClientOriginalExtension()) === 'svg') {
                $imageLogo1 = $file->store('common_settings', 'public');
            } else {
                try {
                    $imageLogo1 = ImageConversionService::convertToWebP($file, 'common_settings', 85);
                } catch (Exception $exception) {
                    return Redirect::back()->withErrors([
                        'logo_1' => 'Image processing failed. Please try another file.',
                    ])->withInput();
                }
            }
        }

        $imageLogo2 = null;
        if ($request->hasFile('logo_2')) {
            $file = $request->file('logo_2');
            if (strtolower($file->getClientOriginalExtension()) === 'svg') {
                $imageLogo2 = $file->store('common_settings', 'public');
            } else {
                try {
                    $imageLogo2 = ImageConversionService::convertToWebP($file, 'common_settings', 85);
                } catch (Exception $exception) {
                    return Redirect::back()->withErrors([
                        'logo_2' => 'Image processing failed. Please try another file.',
                    ])->withInput();
                }
            }
        }

        $devLogo = null;
        if ($request->hasFile('developer_logo')) {
            try {
                $devLogo = ImageConversionService::convertToWebP($request->file('developer_logo'), 'common_settings', 85);
            } catch (Exception $exception) {
                return Redirect::back()->withErrors([
                    'developer_logo' => 'Image processing failed. Please try another file.',
                ])->withInput();
            }
        }

        $bannerImage = null;
        if ($request->hasFile('banner_image')) {
            try {
                $bannerImage = ImageConversionService::convertToWebP($request->file('banner_image'), 'common_settings', 85);
            } catch (Exception $exception) {
                return Redirect::back()->withErrors([
                    'banner_image' => 'Image processing failed. Please try another file.',
                ])->withInput();
            }
        }

        // Create the setting
        CommonSetting::create([
            'project_name' => $request->project_name,
            'slogan' => $request->slogan,
            'address' => $request->address,
            'est' => $request->est,
            'email' => $request->email,
            'phone' => $request->phone,
            'whatsapp' => $request->whatsapp,
            'copyright' => $request->copyright,
            'logo_1' => $imageLogo1 ? 'storage/'.$imageLogo1 : null,
            'logo_2' => $imageLogo2 ? 'storage/'.$imageLogo2 : null,
            'developer_logo' => $devLogo ? 'storage/'.$devLogo : null,
            'banner_image' => $bannerImage ? 'storage/'.$bannerImage : null,
            'facebook_pixel' => $request->facebook_pixel,
        ]);

        return Redirect::route('common.settings')->with('message', 'setting created successfully.');
    }

    public function edit(CommonSetting $commonsetting)
    {
        return Inertia::render('CommonSettings/Edit', compact('commonsetting'));
    }

    public function update(Request $request, CommonSetting $commonsetting)
    {
        $validator = Validator::make($request->all(), [
            'project_name' => 'required|string|max:255',
            'slogan' => 'required|string|max:255',
            'est' => 'nullable|string|max:255',
            'email' => 'required|string|max:255',
            'phone' => 'required|string|max:255',
            'whatsapp' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'copyright' => 'required|string|max:255',
            'logo_1' => 'nullable|file|mimes:jpeg,png,jpg,gif,svg,webp|max:4048',
            'logo_2' => 'nullable|file|mimes:jpeg,png,jpg,gif,svg,webp|max:4048',
            'developer_logo' => 'nullable|file|mimes:jpeg,png,jpg,gif,webp,bmp|max:4048',
            'banner_image' => 'nullable|file|mimes:jpeg,png,jpg,gif,webp,bmp|max:4048',
            'facebook_pixel' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return Redirect::back()->withErrors($validator)->withInput();
        }

        $data = $validator->validated();
        unset($data['logo_1'], $data['logo_2'], $data['developer_logo'], $data['banner_image']);

        if ($request->hasFile('logo_1')) {
            if ($commonsetting->logo_1) {
                ImageConversionService::deleteImage($commonsetting->logo_1);
            }
            $file = $request->file('logo_1');
            if (strtolower($file->getClientOriginalExtension()) === 'svg') {
                $path = $file->store('common_settings', 'public');
                $data['logo_1'] = 'storage/'.$path;
            } else {
                try {
                    $data['logo_1'] = 'storage/'.ImageConversionService::convertToWebP($file, 'common_settings', 85);
                } catch (Exception $exception) {
                    return Redirect::back()->withErrors([
                        'logo_1' => 'Image processing failed. Please try another file.',
                    ])->withInput();
                }
            }
        }

        if ($request->hasFile('logo_2')) {
            if ($commonsetting->logo_2) {
                ImageConversionService::deleteImage($commonsetting->logo_2);
            }
            $file = $request->file('logo_2');
            if (strtolower($file->getClientOriginalExtension()) === 'svg') {
                $path = $file->store('common_settings', 'public');
                $data['logo_2'] = 'storage/'.$path;
            } else {
                try {
                    $data['logo_2'] = 'storage/'.ImageConversionService::convertToWebP($file, 'common_settings', 85);
                } catch (Exception $exception) {
                    return Redirect::back()->withErrors([
                        'logo_2' => 'Image processing failed. Please try another file.',
                    ])->withInput();
                }
            }
        }

        if ($request->hasFile('developer_logo')) {
            if ($commonsetting->developer_logo) {
                ImageConversionService::deleteImage($commonsetting->developer_logo);
            }
            try {
                $data['developer_logo'] = 'storage/'.ImageConversionService::convertToWebP($request->file('developer_logo'), 'common_settings', 85);
            } catch (Exception $exception) {
                return Redirect::back()->withErrors([
                    'developer_logo' => 'Image processing failed. Please try another file.',
                ])->withInput();
            }
        }

        if ($request->hasFile('banner_image')) {
            if ($commonsetting->banner_image) {
                ImageConversionService::deleteImage($commonsetting->banner_image);
            }
            try {
                $data['banner_image'] = 'storage/'.ImageConversionService::convertToWebP($request->file('banner_image'), 'common_settings', 85);
            } catch (Exception $exception) {
                return Redirect::back()->withErrors([
                    'banner_image' => 'Image processing failed. Please try another file.',
                ])->withInput();
            }
        }

        $commonsetting->update($data);

        return Redirect::route(route: 'common.settings')->with('message', 'setting updated successfully.');
    }

    public function delete(CommonSetting $commonsetting)
    {
        // Delete all associated images
        $images = [
            $commonsetting->logo_1,
            $commonsetting->logo_2,
            $commonsetting->developer_logo,
            $commonsetting->banner_image,
        ];

        foreach ($images as $image) {
            if ($image) {
                ImageConversionService::deleteImage($image);
            }
        }

        $commonsetting->delete();

        return Redirect::route('common.settings')->with('message', 'setting deleted successfully.');
    }
}
