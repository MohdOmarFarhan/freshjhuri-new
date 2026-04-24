<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckPaymentStatus
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, $requiredStatus): Response
    {
        $user = Auth::user();

        if (! $user) {
            return redirect()->route('login');
        }

        $paymentInfo = $user->paymentInfo()->latest()->first();
        $hasPayment = $paymentInfo !== null;
        $isPaid = $paymentInfo?->payment_status === 'yes';

        // Allow access only if payment info is submitted (Pending or Paid)
        if ($requiredStatus === 'submitted') {
            if (! $hasPayment) {
                return redirect()->route('basic-info.create');
            }

            return $next($request);
        }

        // Allow access only if payment info is NOT submitted (New Applicant)
        if ($requiredStatus === 'not_submitted') {
            if ($hasPayment) {
                return redirect()->route('admission-info.show');
            }

            return $next($request);
        }

        // Legacy/Strict Status Check (yes/no)
        $currentStatus = $paymentInfo?->payment_status ?? 'no';

        if ($currentStatus !== $requiredStatus) {
            if ($currentStatus === 'yes') {
                return redirect()->route('admission-info.show');
            }

            // If user is Pending ('no') but route requires 'yes',
            // check if they are submitted. If so, send to Info page (which shows pending status).
            if ($hasPayment) {
                return redirect()->route('admission-info.show');
            }

            return redirect()->route('basic-info.create');
        }

        return $next($request);
    }
}
