<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAnswerRequest;
use App\Models\Discussion;
use App\Models\DiscussionAnswer;
use App\Models\StudentActivityLog;
use App\Events\QuestionAnswered;
use App\Events\AnswerAccepted;
use Illuminate\Support\Facades\Auth;

class DiscussionAnswerController extends Controller
{
    public function store(StoreAnswerRequest $request, Discussion $discussion)
    {
        $this->authorize('view', $discussion);

        $answer = $discussion->answers()->create([
            'user_id' => Auth::id(),
            'body' => $request->body,
            'is_anonymous' => $request->boolean('is_anonymous'),
        ]);

        StudentActivityLog::create([
            'student_id' => Auth::id(),
            'subject_id' => $discussion->discussionable_type === 'subject' ? $discussion->discussionable_id : null,
            'action' => 'posted_answer',
            'loggable_id' => $answer->id,
            'loggable_type' => DiscussionAnswer::class,
        ]);

        if ($discussion->status === 'open') {
            $discussion->update(['status' => 'answered']);
        }

        event(new QuestionAnswered($answer));

        return redirect()->route('questions.show', $discussion)
            ->with('success', 'Answer posted.');
    }

    public function update(StoreAnswerRequest $request, DiscussionAnswer $answer)
    {
        $this->authorize('update', $answer);

        $answer->update([
            'body' => $request->body,
            'is_anonymous' => $request->boolean('is_anonymous'),
        ]);

        return redirect()->route('questions.show', $answer->discussion_id)
            ->with('success', 'Answer updated.');
    }

    public function destroy(DiscussionAnswer $answer)
    {
        $this->authorize('delete', $answer);

        $discussionId = $answer->discussion_id;
        $answer->delete();

        return redirect()->route('questions.show', $discussionId)
            ->with('success', 'Answer deleted.');
    }

    public function accept(DiscussionAnswer $answer)
    {
        $discussion = $answer->discussion;

        $this->authorize('update', $discussion);

        if (!$answer->is_accepted) {
            $discussion->answers()->where('id', '!=', $answer->id)->update(['is_accepted' => false]);
        }

        $answer->update(['is_accepted' => !$answer->is_accepted]);

        if ($answer->is_accepted) {
            event(new AnswerAccepted($answer));
        }

        return redirect()->route('questions.show', $discussion)
            ->with('success', 'Answer status updated.');
    }

    public function endorse(DiscussionAnswer $answer)
    {
        $this->authorize('endorse', $answer);

        $answer->update(['is_teacher_endorsed' => !$answer->is_teacher_endorsed]);

        if ($answer->is_teacher_endorsed) {
            $answer->user->increment('reputation', 10);
            $message = 'Answer explicitly endorsed by teacher. +10 Reputation awarded to the student.';
        } else {
            $answer->user->decrement('reputation', 10);
            $message = 'Teacher endorsement removed. -10 Reputation from the student.';
        }
        
        return redirect()->route('questions.show', $answer->discussion)
            ->with('success', $message);
    }
}
