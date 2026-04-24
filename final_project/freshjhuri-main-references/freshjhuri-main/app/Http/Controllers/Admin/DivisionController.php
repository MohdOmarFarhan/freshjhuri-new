<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Division;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DivisionController extends Controller
{
    public function index(Request $request)
    {
        $query = Division::query();

        if ($request->has('search')) {
            $search = $request->search;
            $query->where('name', 'like', "%{$search}%")
                ->orWhere('bn_name', 'like', "%{$search}%");
        }

        $divisions = $query->get();

        return Inertia::render('Admin/Locations/Divisions/Index', [
            'divisions' => $divisions,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Locations/Divisions/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'bn_name' => 'nullable|string|max:255',
        ]);

        Division::create($request->all());

        return redirect()->route('admin.divisions.index')->with('success', 'Division created successfully.');
    }

    public function edit(Division $division)
    {
        return Inertia::render('Admin/Locations/Divisions/Edit', [
            'division' => $division,
        ]);
    }

    public function update(Request $request, Division $division)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'bn_name' => 'nullable|string|max:255',
        ]);

        $division->update($request->all());

        return redirect()->route('admin.divisions.index')->with('success', 'Division updated successfully.');
    }

    public function destroy(Division $division)
    {
        $division->delete();

        return redirect()->route('admin.divisions.index')->with('success', 'Division deleted successfully.');
    }
}
