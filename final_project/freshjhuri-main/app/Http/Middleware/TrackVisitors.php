<?php

namespace App\Http\Middleware;

use App\Models\Visitor;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TrackVisitors
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $ip = $request->ip();
        $date = now()->toDateString();

        // Check if visitor already exists for today
        $visitor = Visitor::where('ip_address', $ip)
            ->where('visited_date', $date)
            ->first();

        if (! $visitor) {
            Visitor::create([
                'ip_address' => $ip,
                'user_agent' => $request->userAgent(),
                'page_url' => $request->fullUrl(),
                'visited_date' => $date,
            ]);
        }

        return $next($request);
    }
}
