<?php

namespace App\Jobs;

use App\Mail\ContactFormMail;
use App\Models\CommonSetting;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Mail;

class SendContactEmailJob implements ShouldQueue
{
    use Queueable;

    public $data;

    /**
     * Create a new job instance.
     */
    public function __construct($data)
    {
        $this->data = $data;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        // Send email to admin
        $adminEmail = CommonSetting::value('email') ?? config('mail.from.address');
        Mail::to($adminEmail)->send(new ContactFormMail($this->data));
    }
}
