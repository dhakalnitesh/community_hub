<?php

namespace App\Models\Core;

use Illuminate\Database\Eloquent\Relations\Pivot;

class InstitutionUser extends Pivot
{
    protected $fillable = [
        'institution_id',
        'user_id',
        'role',
    ];
}
