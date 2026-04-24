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
public function handle(Request $request, Closure $next, ...$roles)
    {
        // 1. Nếu không truyền vào role nào ở api.php, mặc định chỉ cho 'admin'
        if (empty($roles)) {
            $roles = ['admin'];
        }

        // 2. Kiểm tra nếu role của user nằm trong danh sách được phép (in_array)
        if (auth()->check() && in_array(auth()->user()->role, $roles)) {
            return $next($request);
        }

        // 3. Nếu không khớp role nào, chặn lại
        return response()->json(['message' => 'Bạn không có quyền thực hiện hành động này!'], 403);
    }
}
