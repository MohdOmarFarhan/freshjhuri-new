<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\District;
use App\Models\Thana;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ThanaController extends Controller
{
    public function index(Request $request)
    {
        $query = Thana::with(['district.division']);

        if ($request->has('search')) {
            $search = $request->search;
            $query->where('name', 'like', "%{$search}%")
                ->orWhere('bn_name', 'like', "%{$search}%")
                ->orWhereHas('district', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhereHas('division', function ($d) use ($search) {
                            $d->where('name', 'like', "%{$search}%");
                        });
                });
        }

        $thanas = $query->get();

        return Inertia::render('Admin/Locations/Thanas/Index', [
            'thanas' => $thanas,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Locations/Thanas/Create', [
            'districts' => District::with('division')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'district_id' => 'required|exists:districts,id',
            'name' => 'required|string|max:255',
            'bn_name' => 'nullable|string|max:255',
        ]);

        Thana::create($request->all());

        return redirect()->route('admin.thanas.index')->with('success', 'Thana created successfully.');
    }

    public function edit(Thana $thana)
    {
        return Inertia::render('Admin/Locations/Thanas/Edit', [
            'thana' => $thana,
            'districts' => District::with('division')->get(),
        ]);
    }

    public function update(Request $request, Thana $thana)
    {
        $request->validate([
            'district_id' => 'required|exists:districts,id',
            'name' => 'required|string|max:255',
            'bn_name' => 'nullable|string|max:255',
        ]);

        $thana->update($request->all());

        return redirect()->route('admin.thanas.index')->with('success', 'Thana updated successfully.');
    }

    public function destroy(Thana $thana)
    {
        $thana->delete();

        return redirect()->route('admin.thanas.index')->with('success', 'Thana deleted successfully.');
    }
}
