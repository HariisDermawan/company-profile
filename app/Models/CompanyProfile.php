<?php

namespace App\Models;

use Database\Factories\CompanyProfileFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Override;

/**
 * @property int $id
 * @property string $name
 * @property string|null $tagline
 * @property string|null $about
 * @property string|null $mission
 * @property string|null $vision
 * @property string|null $logo
 * @property string|null $email
 * @property string|null $phone
 * @property string|null $address
 * @property string|null $website_url
 * @property string|null $facebook_url
 * @property string|null $instagram_url
 * @property string|null $twitter_url
 * @property string|null $linkedin_url
 * @property bool $is_active
 */
#[Fillable([
    'name',
    'tagline',
    'about',
    'mission',
    'vision',
    'logo',
    'email',
    'phone',
    'address',
    'website_url',
    'facebook_url',
    'instagram_url',
    'twitter_url',
    'linkedin_url',
    'is_active',
])]

class CompanyProfile extends Model
{
    /** @use HasFactory<CompanyProfileFactory> */
    use HasFactory;

    #[Override]
    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }
}
