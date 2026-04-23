<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
   public function handle(Request $request, Closure $next)
{
    // Kiểm tra nếu User đã đăng nhập và có role là 'admin'
    if (auth()->check() && auth()->user()->role === 'admin') {
        return $next($request);
    }

    // Nếu không phải admin, trả về lỗi 403 (Cấm truy cập)
    return response()->json(['message' => 'Bạn không có quyền thực hiện hành động này!'], 403);
}
}
