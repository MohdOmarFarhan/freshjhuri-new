<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\District;
use App\Models\Division;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DistrictController extends Controller
{
    public function index(Request $request)
    {
        $query = District::with('division');

        if ($request->has('search')) {
            $search = $request->search;
            $query->where('name', 'like', "%{$search}%")
                ->orWhere('bn_name', 'like', "%{$search}%")
                ->orWhereHas('division', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                });
        }

        $districts = $query->get();

        return Inertia::render('Admin/Locations/Districts/Index', [
            'districts' => $districts,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Locations/Districts/Create', [
            'divisions' => Division::all(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'division_id' => 'required|exists:divisions,id',
            'name' => 'required|string|max:255',
            'bn_name' => 'nullable|string|max:255',
        ]);

        District::create($request->all());

        return redirect()->route('admin.districts.index')->with('success', 'District created successfully.');
    }

    public function edit(District $district)
    {
        return Inertia::render('Admin/Locations/Districts/Edit', [
            'district' => $district,
            'divisions' => Division::all(),
        ]);
    }

    public function update(Request $request, District $district)
    {
        $request->validate([
            'division_id' => 'required|exists:divisions,id',
            'name' => 'required|string|max:255',
            'bn_name' => 'nullable|string|max:255',
        ]);

        $district->update($request->all());

        return redirect()->route('admin.districts.index')->with('success', 'District updated successfully.');
    }

    public function destroy(District $district)
    {
        $district->delete();

        return redirect()->route('admin.districts.index')->with('success', 'District deleted successfully.');
    }
}
