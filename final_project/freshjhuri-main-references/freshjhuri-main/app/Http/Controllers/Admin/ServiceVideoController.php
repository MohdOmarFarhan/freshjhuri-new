<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ServiceVideo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class ServiceVideoController extends Controller
{
    public function index()
    {
        $serviceVideos = ServiceVideo::latest()->paginate(10);
        return Inertia::render('ServiceVideo/Index', [
            'serviceVideos' => $serviceVideos,
        ]);
    }

    public function create()
    {
        return Inertia::render('ServiceVideo/Create');
    }

    public function store(Request $request)
    {
        $request->merge([
            'video_link' => trim(str_replace('`', '', (string) $request->input('video_link', ''))),
        ]);

        $validated = $request->validate([
            'title_en' => ['nullable', 'string', 'max:255'],
            'title_bn' => ['nullable', 'string', 'max:255'],
            'video_link' => ['required', 'url', 'max:2048'],
            'status' => ['nullable', 'boolean'],
        ]);

        $validated['status'] = $request->boolean('status', true); // default true on create

        ServiceVideo::create($validated);

        return Redirect::route('service-videos.index')->with('message', 'Service Video created successfully.');
    }

    public function edit(ServiceVideo $serviceVideo)
    {
        // dd($serviceVideo);
        return Inertia::render('ServiceVideo/Edit', [
            'serviceVideo' => $serviceVideo,
        ]);
    }

    public function update(Request $request, ServiceVideo $serviceVideo)
    {
        $request->merge([
            'video_link' => trim(str_replace('`', '', (string) $request->input('video_link', ''))),
        ]);

        $validated = $request->validate([
            'title_en' => ['nullable', 'string', 'max:255'],
            'title_bn' => ['nullable', 'string', 'max:255'],
            'video_link' => ['required', 'url', 'max:2048'],
            'status' => ['nullable', 'boolean'],
        ]);

        $validated['status'] = $request->boolean('status', (bool) $serviceVideo->status);

        $serviceVideo->update($validated);

        return Redirect::route('service-videos.index')->with('message', 'Service Video updated successfully.');
    }

    public function destroy(ServiceVideo $serviceVideo)
    {
        $serviceVideo->delete();

        return Redirect::route('service-videos.index')->with('message', 'Service Video deleted successfully.');
    }
}
