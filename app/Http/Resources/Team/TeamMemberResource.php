<?php

namespace App\Http\Resources\Team;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TeamMemberResource extends JsonResource
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
            'position' => $this->position,
            'photo' => $this->photo,
            'bio' => $this->bio,
            'email' => $this->email,
            'linkedin_url' => $this->linkedin_url,
            'twitter_url' => $this->twitter_url,
            'order' => $this->order,
            'is_active' => $this->is_active,
        ];
    }
}
