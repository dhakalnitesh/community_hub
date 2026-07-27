<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProjectReviewRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Must be a teacher or admin to review projects
        return $this->user() && ($this->user()->isTeacher() || $this->user()->isAdmin());
    }

    public function rules(): array
    {
        return [
            'content' => ['required', 'string', 'min:10', 'max:1000'],
            'is_endorsed' => ['boolean'],
        ];
    }
}
