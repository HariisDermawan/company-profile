<?php

namespace App\Http\Resources\Company;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CompanyProfileResource extends JsonResource
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
            'tagline' => $this->tagline,
            'about' => $this->about,
            'mission' => $this->mission,
            'vision' => $this->vision,
            'logo' => $this->logo,
            'email' => $this->email,
            'phone' => $this->phone,
            'address' => $this->address,
            'website_url' => $this->website_url,
            'facebook_url' => $this->facebook_url,
            'instagram_url' => $this->instagram_url,
            'twitter_url' => $this->twitter_url,
            'linkedin_url' => $this->linkedin_url,
            'is_active' => $this->is_active,
        ];
    }
}
