<?php

namespace App\Http\Controllers\Platform;

use App\Models\Grievance\Grievance;
use App\Models\Grievance\GrievanceEvent;
use App\Services\BsDateService;
use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Http\Controllers\Controller;

class StatsController extends Controller
{
    public function overview()
    {
        return response()->json([
            'total' => Grievance::visible()->count(),
            'open' => Grievance::visible()->where('status', '!=', 'resolved')->count(),
            'resolved_today' => Grievance::visible()->whereDate('resolved_at', today())->count(),
            'pending_moderation' => Grievance::where('moderation_status', 'pending')->count(),
        ]);
    }

    public function categoryBreakdown()
    {
        $stats = Grievance::visible()
            ->selectRaw('category_id, COUNT(*) as total')
            ->groupBy('category_id')
            ->with('category:id,name')
            ->get()
            ->map(fn($g) => [
                'name' => $g->category?->name ?? 'Unknown',
                'total' => $g->total,
            ]);

        return response()->json($stats);
    }

    public function issuesOverTime()
    {
        $stats = Grievance::visible()
            ->selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->where('created_at', '>=', now()->subDays(7))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return response()->json($stats);
    }
}