<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Jobs\SendContactEmailJob;
use App\Models\ContactMessage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContactMessageController extends Controller
{
    public function index()
    {
        // This is for admin to view messages
        $messages = ContactMessage::latest()->get();

        return Inertia::render('Admin/ContactMessages/Index', [
            'messages' => $messages,
        ]);
    }

    public function sendEmail(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email|max:255',
            'phone' => ['required', 'string', 'max:20', 'regex:/^([0-9\s\-\+\(\)]*)$/'],
            'whatsapp' => ['required', 'string', 'max:20', 'regex:/^([0-9\s\-\+\(\)]*)$/'],
            'message_en' => 'nullable|string|max:5000',
            'message_bn' => 'nullable|string|max:5000',
        ]);

        // Save message to database
        $message = ContactMessage::create($validated);

        // Dispatch job to send email
        SendContactEmailJob::dispatch($validated);

        return back()->with('message', 'Message sent successfully!');
    }

    public function contactMessageDelete($id)
    {
        $contact = ContactMessage::findOrFail($id);
        $contact->delete();

        return back()->with('success', 'Message deleted successfully!');
    }
}
