<?php

namespace App\Http\Resources;

use App\Services\BsDateService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GrievanceEventResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'type' => $this->type,
            'description' => $this->description,
            'is_public' => $this->is_public,
            'created_at' => $this->created_at->toISOString(),
            'bs_created_at' => BsDateService::toBsString($this->created_at, 'datetime_en'),
        ];
    }
}
