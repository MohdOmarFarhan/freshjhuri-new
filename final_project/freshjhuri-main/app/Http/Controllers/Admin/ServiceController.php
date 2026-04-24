<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ServiceController extends Controller
{
    public function index(Request $request)
    {
        $query = Service::query()->orderBy('sort_order')->latest();

        if ($request->filled('search')) {
            $search = $request->string('search')->toString();
            $query->where(function ($q) use ($search) {
                $q->where('title_en', 'like', "%{$search}%")
                    ->orWhere('title_bn', 'like', "%{$search}%");
            });
        }

        $services = $query->paginate(10)->withQueryString();

        return Inertia::render('Service/Index', [
            'services' => $services,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Service/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title_en' => ['required', 'string', 'max:255'],
            'title_bn' => ['required', 'string', 'max:255'],
            'description_en' => ['nullable', 'string'],
            'description_bn' => ['nullable', 'string'],
            'benefits_en' => ['nullable'],
            'benefits_bn' => ['nullable'],
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,webp', 'max:4096'],
            'video_url' => [
                'nullable',
                'url',
                'max:4096',
                function ($attribute, $value, $fail) {
                    $host = parse_url($value, PHP_URL_HOST);
                    $host = is_string($host) ? strtolower(preg_replace('/^www\./', '', $host)) : '';
                    $allowed = ['facebook.com', 'm.facebook.com', 'fb.watch', 'youtube.com', 'm.youtube.com', 'youtu.be'];
                    if (! in_array($host, $allowed, true)) {
                        $fail('Only Facebook or YouTube video links are allowed.');
                    }
                },
            ],
            'status' => ['nullable', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]);

        $validated['benefits_en'] = $this->normalizeList($request->input('benefits_en'));
        $validated['benefits_bn'] = $this->normalizeList($request->input('benefits_bn'));
        $validated['status'] = $request->boolean('status', true);
        $validated['sort_order'] = (int) ($validated['sort_order'] ?? 0);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('services/images', 'public');
        }

        Service::create($validated);

        return Redirect::route('services.index')->with('message', 'Service created successfully.');
    }

    public function show(Service $service)
    {
        return Inertia::render('Service/Show', [
            'service' => $service,
        ]);
    }

    public function edit(Service $service)
    {
        return Inertia::render('Service/Edit', [
            'service' => $service,
        ]);
    }

    public function update(Request $request, Service $service)
    {
        $validated = $request->validate([
            'title_en' => ['required', 'string', 'max:255'],
            'title_bn' => ['required', 'string', 'max:255'],
            'description_en' => ['nullable', 'string'],
            'description_bn' => ['nullable', 'string'],
            'benefits_en' => ['nullable'],
            'benefits_bn' => ['nullable'],
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,webp', 'max:4096'],
            'video_url' => [
                'nullable',
                'url',
                'max:4096',
                function ($attribute, $value, $fail) {
                    $host = parse_url($value, PHP_URL_HOST);
                    $host = is_string($host) ? strtolower(preg_replace('/^www\./', '', $host)) : '';
                    $allowed = ['facebook.com', 'm.facebook.com', 'fb.watch', 'youtube.com', 'm.youtube.com', 'youtu.be'];
                    if (! in_array($host, $allowed, true)) {
                        $fail('Only Facebook or YouTube video links are allowed.');
                    }
                },
            ],
            'status' => ['nullable', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]);

        $validated['benefits_en'] = $this->normalizeList($request->input('benefits_en'));
        $validated['benefits_bn'] = $this->normalizeList($request->input('benefits_bn'));
        $validated['status'] = $request->boolean('status', true);
        $validated['sort_order'] = (int) ($validated['sort_order'] ?? 0);

        if ($request->hasFile('image')) {
            if ($service->image) {
                Storage::disk('public')->delete($service->image);
            }
            $validated['image'] = $request->file('image')->store('services/images', 'public');
        }

        $service->update($validated);

        return Redirect::route('services.index')->with('message', 'Service updated successfully.');
    }

    public function destroy(Service $service)
    {
        if ($service->image) {
            Storage::disk('public')->delete($service->image);
        }

        $service->delete();

        return Redirect::route('services.index')->with('message', 'Service deleted successfully.');
    }

    private function normalizeList($value): array
    {
        if (is_array($value)) {
            return array_values(array_filter(array_map('trim', $value), fn ($v) => $v !== ''));
        }

        if (! is_string($value)) {
            return [];
        }

        $lines = preg_split("/\r\n|\n|\r/", $value) ?: [];

        return array_values(array_filter(array_map('trim', $lines), fn ($v) => $v !== ''));
    }
}
