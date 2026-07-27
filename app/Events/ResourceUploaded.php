<?php

namespace App\Events;

use App\Models\Academic\Resource;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ResourceUploaded
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public Resource $resource,
    ) {}
}
