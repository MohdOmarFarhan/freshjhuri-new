<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ContactDetailsController extends Controller
{
    public function index()
    {
        $contactdetails = ContactDetail::latest()->get();

        return Inertia::render('ContactDetails/Index', [
            'contactdetails' => $contactdetails,
        ]);
    }

    public function create()
    {
        return Inertia::render('ContactDetails/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'],
            'phone' => ['required', 'string', 'max:255'],
            'whats_app' => ['nullable', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:contact_details,email'],
            'corporate_office_en' => ['required', 'string'],
            'corporate_office_bn' => ['required', 'string'],
            'local_office_1_en' => ['nullable', 'string'],
            'local_office_1_bn' => ['nullable', 'string'],
            'local_office_2_en' => ['nullable', 'string'],
            'local_office_2_bn' => ['nullable', 'string'],
            'local_office_3_en' => ['nullable', 'string'],
            'local_office_3_bn' => ['nullable', 'string'],
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('contact_details', 'public');
        }

        ContactDetail::create($validated);

        return Redirect::route('contact.details')->with('message', 'Contact detail created successfully.');
    }

    public function edit(ContactDetail $contactdetail)
    {
        return Inertia::render('ContactDetails/Edit', [
            'contactdetail' => $contactdetail,
        ]);
    }

    public function update(Request $request, ContactDetail $contactdetail)
    {
        $validated = $request->validate([
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'],
            'phone' => ['required', 'string', 'max:255'],
            'whats_app' => ['nullable', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:contact_details,email,'.$contactdetail->id],
            'corporate_office_en' => ['required', 'string'],
            'corporate_office_bn' => ['required', 'string'],
            'local_office_1_en' => ['nullable', 'string'],
            'local_office_1_bn' => ['nullable', 'string'],
            'local_office_2_en' => ['nullable', 'string'],
            'local_office_2_bn' => ['nullable', 'string'],
            'local_office_3_en' => ['nullable', 'string'],
            'local_office_3_bn' => ['nullable', 'string'],
        ]);

        if ($request->hasFile('image')) {
            if ($contactdetail->image) {
                Storage::disk('public')->delete($contactdetail->image);
            }

            $validated['image'] = $request->file('image')->store('contact_details', 'public');
        }

        $contactdetail->update($validated);

        return Redirect::route('contact.details')->with('message', 'Contact detail updated successfully.');
    }

    public function delete(ContactDetail $contactdetail)
    {
        if ($contactdetail->image) {
            Storage::disk('public')->delete($contactdetail->image);
        }

        $contactdetail->delete();

        return Redirect::route('contact.details')->with('message', 'Contact detail deleted successfully.');
    }
}
