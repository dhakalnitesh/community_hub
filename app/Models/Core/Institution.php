<?php

namespace App\Models\Core;

use App\Models\Academic\Semester;
use App\Models\Academic\Subject;


use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Institution extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'type',
        'address',
        'logo',
        'created_by',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    public function users(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(User::class, 'institution_users')
            ->withPivot('role')
            ->withTimestamps();
    }

    public function admins(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->users()->wherePivot('role', 'institution_admin');
    }

    public function creator(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function semesters(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Semester::class);
    }

    public function subjects(): \Illuminate\Database\Eloquent\Relations\HasManyThrough
    {
        return $this->hasManyThrough(Subject::class, Semester::class);
    }
}
