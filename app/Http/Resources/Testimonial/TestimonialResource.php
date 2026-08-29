<?php

namespace App\Http\Resources\Testimonial;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TestimonialResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'company' => $this->company,
            'position' => $this->position,
            'photo' => $this->photo,
            'content' => $this->content,
            'rating' => $this->rating,
            'is_active' => $this->is_active,
        ];
    }
}
