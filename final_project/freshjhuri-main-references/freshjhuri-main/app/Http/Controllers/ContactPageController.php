<?php

namespace App\Http\Controllers;

use App\Models\ContactDetail;
use Inertia\Inertia;

class ContactPageController extends Controller
{
    public function contactPage()
    {

        $contactDetail = ContactDetail::all();

        return Inertia::render('Home/ContactPage', compact('contactDetail'));
    }
}
