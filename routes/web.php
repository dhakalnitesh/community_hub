<?php

use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Academic\AssignmentController;
use App\Http\Controllers\Community\DiscussionAnswerController;
use App\Http\Controllers\Academic\EnrollmentController;
use App\Http\Controllers\InstitutionAdminController;
use App\Http\Controllers\Academic\SemesterController;
use App\Http\Controllers\Academic\SubjectController;
use App\Http\Controllers\Academic\SubmissionController;
use App\Http\Controllers\Community\DiscussionController;
use App\Http\Controllers\Mentorship\MentorSessionController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Student\DashboardController as StudentDashboardController;
use App\Http\Controllers\Student\ProjectController as StudentProjectController;
use App\Http\Controllers\Teacher\ClassController as TeacherClassController;
use App\Http\Controllers\Community\VoteController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        'stats' => [
            'questions' => \App\Models\Community\Discussion::count(),
            'answers' => \App\Models\Community\DiscussionAnswer::count(),
            'projects' => \App\Models\Mentorship\StudentProject::count(),
            'subjects' => \App\Models\Academic\Subject::count(),
        ],
    ]);
});

Route::get('/dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Notifications
    Route::get('/notifications', [App\Http\Controllers\Platform\NotificationController::class, 'index'])->name('notifications.index');
    Route::get('/notifications/api', [App\Http\Controllers\Platform\NotificationController::class, 'apiIndex'])->name('notifications.api');
    Route::post('/notifications/read-all', [App\Http\Controllers\Platform\NotificationController::class, 'markAllAsRead'])->name('notifications.read_all');
    Route::post('/notifications/{notification}/read', [App\Http\Controllers\Platform\NotificationController::class, 'markAsRead'])->name('notifications.mark_read');
});

Route::middleware(['auth', 'role:super_admin'])->group(function () {
    Route::get('/admin/users', [UserController::class, 'index'])->name('admin.users');
    Route::get('/admin/useractivity', [\App\Http\Controllers\Admin\UserActivityController::class, 'index'])->name('admin.useractivity');
    Route::get('/admin/institutions', [\App\Http\Controllers\Admin\InstitutionController::class, 'index'])->name('admin.institutions');
    Route::post('/admin/institutions', [\App\Http\Controllers\Admin\InstitutionController::class, 'store'])->name('admin.institutions.store');

    Route::get('/admin/institution_admins', [\App\Http\Controllers\Admin\SuperAdminPageController::class, 'institutionAdmins'])->name('admin.institution_admins');
    Route::get('/admin/analytics', [\App\Http\Controllers\Admin\SuperAdminPageController::class, 'analytics'])->name('admin.analytics');
    Route::get('/admin/monitoring', [\App\Http\Controllers\Admin\SuperAdminPageController::class, 'monitoring'])->name('admin.monitoring');
    Route::get('/admin/roles', [\App\Http\Controllers\Admin\SuperAdminPageController::class, 'roles'])->name('admin.roles');
    Route::put('/admin/roles/{user}', [\App\Http\Controllers\Admin\SuperAdminPageController::class, 'updateRole'])->name('admin.roles.update');
    Route::get('/admin/reports', [\App\Http\Controllers\Admin\SuperAdminPageController::class, 'reports'])->name('admin.reports');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/student/dashboard', [StudentDashboardController::class, 'index'])->name('student.dashboard');
    Route::get('/student/mysubject', [StudentDashboardController::class, 'mySubjects'])->name('student.subjects');
    Route::get('/classes', [TeacherClassController::class, 'index'])->name('classes.index');
});

Route::middleware('auth')->prefix('questions')->name('questions.')->group(function () {
    Route::get('/', [DiscussionController::class, 'index'])->name('index');
    Route::get('/create', [DiscussionController::class, 'create'])->name('create');
    Route::post('/', [DiscussionController::class, 'store'])->name('store');
    Route::post('/track', [DiscussionController::class, 'track'])->name('track');
    Route::get('/{discussion}', [DiscussionController::class, 'show'])->name('show');
    Route::get('/{discussion}/edit', [DiscussionController::class, 'edit'])->name('edit');
    Route::put('/{discussion}', [DiscussionController::class, 'update'])->name('update');
    Route::delete('/{discussion}', [DiscussionController::class, 'destroy'])->name('destroy');

    Route::post('/{discussion}/answers', [DiscussionAnswerController::class, 'store'])->name('answers.store');
    Route::put('/answers/{answer}', [DiscussionAnswerController::class, 'update'])->name('answers.update');
    Route::delete('/answers/{answer}', [DiscussionAnswerController::class, 'destroy'])->name('answers.destroy');
    Route::post('/answers/{answer}/accept', [DiscussionAnswerController::class, 'accept'])->name('answers.accept');
    Route::post('/answers/{answer}/endorse', [DiscussionAnswerController::class, 'endorse'])->name('answers.endorse');

    Route::post('/vote', [VoteController::class, 'toggle'])->middleware('throttle:60,1')->name('vote');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/talent-showcase', [StudentProjectController::class, 'index'])->name('projects.index');
    Route::post('/talent-showcase', [StudentProjectController::class, 'store'])->name('projects.store');
    Route::post('/projects/{project}/reviews', [App\Http\Controllers\Mentorship\ProjectReviewController::class, 'store'])->name('projects.reviews.store');
    
    Route::get('/mentor-board', [MentorSessionController::class, 'index'])->name('mentorship.index');
    Route::post('/mentor-sessions', [MentorSessionController::class, 'store'])->name('mentorship.store');
    Route::post('/mentor-sessions/{mentorSession}/accept', [MentorSessionController::class, 'accept'])->name('mentorship.accept');
    Route::post('/mentor-sessions/{mentorSession}/complete', [MentorSessionController::class, 'complete'])->name('mentorship.complete');
});

Route::middleware('auth')->prefix('assignments')->name('assignments.')->group(function () {
    Route::get('/', [AssignmentController::class, 'index'])->name('index');
    Route::get('/create', [AssignmentController::class, 'create'])->name('create');
    Route::post('/', [AssignmentController::class, 'store'])->name('store');

    Route::get('/submissions/{submission}', [SubmissionController::class, 'show'])->name('submissions.show');
    Route::put('/submissions/{submission}', [SubmissionController::class, 'update'])->name('submissions.update');

    Route::get('/{assignment}', [AssignmentController::class, 'show'])->name('show');
    Route::get('/{assignment}/edit', [AssignmentController::class, 'edit'])->name('edit');
    Route::put('/{assignment}', [AssignmentController::class, 'update'])->name('update');
    Route::delete('/{assignment}', [AssignmentController::class, 'destroy'])->name('destroy');

    Route::post('/{assignment}/submissions', [SubmissionController::class, 'store'])->name('submissions.store');
});

Route::middleware(['auth', 'role:super_admin|institution_admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [InstitutionAdminController::class, 'dashboard'])->name('dashboard');
    
    Route::resource('semesters', SemesterController::class)->except(['show']);
    Route::resource('subjects', SubjectController::class)->except(['show']);
    
    Route::post('/subjects/{subject}/teachers', [SubjectController::class, 'assignTeacher'])->name('subjects.teachers.assign');
    Route::delete('/subjects/{subject}/teachers/{teacher}', [SubjectController::class, 'removeTeacher'])->name('subjects.teachers.remove');
    
    Route::get('/enrollments', [EnrollmentController::class, 'index'])->name('enrollments.index');
    Route::delete('/enrollments/{semester}/{student}', [EnrollmentController::class, 'remove'])->name('enrollments.remove');
});

Route::middleware('auth')->post('/enroll', [EnrollmentController::class, 'enroll'])->name('enroll');

Route::resource('resources', App\Http\Controllers\Academic\ResourceController::class)->middleware(['auth', 'verified']);
Route::resource('announcements', App\Http\Controllers\Platform\AnnouncementController::class)->middleware(['auth', 'verified']);

require __DIR__ . '/auth.php';

// Grievance System Routes
Route::get('/grievances/submit', [App\Http\Controllers\Grievance\GrievanceController::class, 'create'])->name('grievances.create');
Route::post('/grievances', [App\Http\Controllers\Grievance\GrievanceController::class, 'store'])->name('grievances.store')->middleware('throttle:grievances:submit');
Route::get('/grievances/feed', [App\Http\Controllers\Grievance\GrievanceFeedController::class, 'index'])->name('grievances.feed');
Route::get('/grievances/track', [App\Http\Controllers\Grievance\GrievanceController::class, 'trackStatus'])->name('grievances.track')->middleware('throttle:grievances:status');
Route::get('/grievances/r/{reference_code}', [App\Http\Controllers\Grievance\GrievanceController::class, 'showReference'])->name('grievances.show-reference');

Route::post('/grievances/{grievance}/upvote', [App\Http\Controllers\Community\UpvoteController::class, 'toggle'])->name('grievances.upvote');
Route::get('/grievances/{grievance}/upvoters', [App\Http\Controllers\Community\UpvoteController::class, 'upvoters'])->name('grievances.upvoters');
Route::get('/grievances/{grievance}/comments', [App\Http\Controllers\Community\CommentController::class, 'index'])->name('grievances.comments.index')->middleware('throttle:grievances:feed');
Route::post('/grievances/{grievance}/comments', [App\Http\Controllers\Community\CommentController::class, 'store'])->name('grievances.comments.store')->middleware('throttle:grievances:comments');
Route::delete('/comments/{comment}', [App\Http\Controllers\Community\CommentController::class, 'destroy'])->name('grievances.comments.destroy');

Route::post('/grievances/{grievance}/flag', [App\Http\Controllers\Grievance\FlagController::class, 'flagGrievance'])->name('grievances.flag');
Route::post('/comments/{comment}/flag', [App\Http\Controllers\Grievance\FlagController::class, 'flagComment'])->name('comments.flag');

Route::get('/api/grievances/stats/overview', [App\Http\Controllers\Platform\StatsController::class, 'overview']);
Route::get('/api/grievances/stats/categories', [App\Http\Controllers\Platform\StatsController::class, 'categoryBreakdown']);
Route::get('/api/grievances/stats/trends', [App\Http\Controllers\Platform\StatsController::class, 'issuesOverTime']);

Route::middleware(['auth', 'role:super_admin|institution_admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/grievances', [\App\Http\Controllers\Admin\GrievanceController::class, 'index'])->name('grievances.index');
    Route::get('/grievances/{grievance}', [\App\Http\Controllers\Admin\GrievanceController::class, 'show'])->name('grievances.show');
    Route::patch('/grievances/{grievance}/status', [\App\Http\Controllers\Admin\GrievanceController::class, 'updateStatus'])->name('grievances.update-status');
    Route::post('/grievances/{grievance}/priority', [\App\Http\Controllers\Admin\GrievanceController::class, 'updatePriority'])->name('grievances.update-priority');
    Route::post('/grievances/{grievance}/assign', [\App\Http\Controllers\Admin\GrievanceController::class, 'assign'])->name('grievances.assign');

    Route::get('/moderation', [\App\Http\Controllers\Admin\ModerationController::class, 'index'])->name('moderation');
    Route::post('/moderation/{grievance}/hide', [\App\Http\Controllers\Admin\ModerationController::class, 'hide'])->name('moderation.hide');
    Route::post('/moderation/{grievance}/dismiss', [\App\Http\Controllers\Admin\ModerationController::class, 'dismiss'])->name('moderation.dismiss');
    Route::get('/moderation/comments', [\App\Http\Controllers\Admin\ModerationController::class, 'pendingComments'])->name('moderation.comments');
    Route::post('/moderation/comments/{comment}/approve', [\App\Http\Controllers\Admin\ModerationController::class, 'approveComment'])->name('moderation.comments.approve');
    Route::post('/moderation/comments/{comment}/hide', [\App\Http\Controllers\Admin\ModerationController::class, 'hideComment'])->name('moderation.comments.hide');
    Route::get('/spam-logs', [\App\Http\Controllers\Admin\ModerationController::class, 'spamLogs'])->name('spam-logs');
});
