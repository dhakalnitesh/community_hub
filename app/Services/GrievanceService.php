<?php

namespace App\Services;

use App\Models\Grievance\Grievance;
use App\Models\Grievance\GrievanceEvent;
use App\Models\Platform\SpamLog;
use App\Events\GrievanceSubmitted;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class GrievanceService
{
    public function __construct(
        private TurnstileService $turnstileService,
        private TrustService $trustService,
        private MergeService $mergeService,
    ) {}

    public function createGrievance(Request $request): array
    {
        if ($request->filled('website')) {
            SpamLog::create([
                'event_type' => 'honeypot_trigger',
                'uuid' => $request->cookie('_auid'),
                'ip_hash' => IpAnonymizer::hash($request->ip()),
                'metadata' => ['user_agent' => $request->userAgent()],
            ]);

            $this->trustService->adjustScore(null, $request->cookie('_auid'), -0.3);

            return ['honeypot' => true];
        }

        $validated = $request->validate([
            'institution_id' => 'required|exists:institutions,id',
            'semester_id' => 'nullable|exists:semesters,id',
            'subject_id' => 'nullable|exists:subjects,id',
            'category_id' => 'required|exists:grievance_categories,id',
            'priority' => 'required|in:low,medium,high,critical',
            'title' => 'required|string|max:200',
            'description' => 'required|string|min:10|max:5000',
            'is_anonymous' => 'boolean',
            'photo' => 'nullable|image|max:5120',
            'video' => 'nullable|mimes:mp4,webm,ogg,avi,mov|max:51200',
        ]);

        if ($this->turnstileService->shouldShowCaptcha($request)) {
            $request->validate([
                'cf-turnstile-response' => 'required|string',
            ]);
            if (!$this->turnstileService->verify($request->input('cf-turnstile-response'))) {
                return ['captcha_error' => true];
            }
        }

        $spamResult = AbuseDetectionService::check(
            description: $validated['description'],
            ipHash: IpAnonymizer::hash($request->ip()),
            uuid: $request->cookie('_auid'),
        );

        $duplicates = DuplicateDetectionService::findDuplicates(
            $validated['description'],
            $validated['institution_id']
        );

        $photoPath = null;
        if ($request->hasFile('photo')) {
            $photoPath = $request->file('photo')->store('grievance-photos', 'public');
        }

        $videoPath = null;
        if ($request->hasFile('video')) {
            $videoPath = $request->file('video')->store('grievance-videos', 'public');
        }

        $userPriority = $validated['priority'];

        $grievance = DB::transaction(function () use ($validated, $photoPath, $videoPath, $request, $spamResult, $userPriority) {
            $grievance = Grievance::create([
                'user_id' => auth()->id(),
                'institution_id' => $validated['institution_id'],
                'semester_id' => $validated['semester_id'] ?? null,
                'subject_id' => $validated['subject_id'] ?? null,
                'category_id' => $validated['category_id'],
                'priority' => $userPriority,
                'user_priority' => $userPriority,
                'title' => $validated['title'],
                'description' => $validated['description'],
                'reporter_ip' => $request->ip(),
                'reporter_ip_hash' => IpAnonymizer::hash($request->ip()),
                'anonymous_uuid' => $request->cookie('_auid'),
                'is_anonymous' => $request->boolean('is_anonymous', true),
                'spam_score' => $spamResult['spam_score'],
                'hidden_at' => $spamResult['is_spam'] ? now() : null,
                'moderation_status' => $spamResult['is_spam'] ? 'pending' : 'approved',
                'photo_path' => $photoPath,
                'video_path' => $videoPath,
            ]);

            if ($spamResult['is_spam']) {
                $this->turnstileService->incrementSuspicion($request, 0.3);
                SpamLog::create([
                    'event_type' => 'spam_detected',
                    'loggable_type' => Grievance::class,
                    'loggable_id' => $grievance->id,
                    'uuid' => $request->cookie('_auid'),
                    'ip_hash' => IpAnonymizer::hash($request->ip()),
                    'spam_score' => $spamResult['spam_score'],
                    'metadata' => ['reasons' => $spamResult['reasons']],
                ]);
            }

            if ($photoPath) {
                $grievance->media()->create(['path' => $photoPath, 'type' => 'photo']);
            }
            if ($videoPath) {
                $grievance->media()->create(['path' => $videoPath, 'type' => 'video']);
            }

            $referenceCode = Grievance::generateReferenceCode($validated['institution_id']);
            $grievance->update(['reference_code' => $referenceCode]);

            GrievanceEvent::create([
                'grievance_id' => $grievance->id,
                'type' => 'created',
                'description' => 'Grievance submitted successfully.',
                'metadata' => [
                    'priority' => $validated['priority'],
                    'is_anonymous' => $grievance->is_anonymous,
                ],
                'is_public' => true,
            ]);

            if ($spamResult['is_spam']) {
                $this->trustService->adjustScore(auth()->user(), $request->cookie('_auid'), -0.2);
            } else {
                $this->trustService->adjustScore(auth()->user(), $request->cookie('_auid'), 0.05);
            }

            $effectivePriority = $this->trustService->getEffectivePriority($grievance);
            if ($effectivePriority !== $grievance->priority) {
                $grievance->update(['priority' => $effectivePriority]);
            }

            return $grievance;
        });

        GrievanceSubmitted::dispatch($grievance);

        $bestDuplicate = !empty($duplicates) ? $duplicates[0] : null;
        if ($bestDuplicate && $bestDuplicate['similarity'] > 0.5) {
            $parentGrievance = Grievance::find($bestDuplicate['id']);
            if ($parentGrievance && $parentGrievance->status !== 'merged') {
                $this->mergeService->autoMerge($grievance, $parentGrievance);

                return [
                    'merged' => true,
                    'merged_into' => $parentGrievance,
                    'grievance' => $grievance,
                ];
            }
        }

        return [
            'grievance' => $grievance,
            'duplicates' => $duplicates,
            'merged' => false,
        ];
    }
}