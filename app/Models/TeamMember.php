<?php

namespace App\Models;

use Database\Factories\TeamMemberFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Override;

/**
 * @property int $id
 * @property string $name
 * @property string $position
 * @property string|null $photo
 * @property string|null $bio
 * @property string|null $email
 * @property string|null $linkedin_url
 * @property string|null $twitter_url
 * @property int $order
 * @property bool $is_active
 */
#[Fillable([
    'name',
    'position',
    'photo',
    'bio',
    'email',
    'linkedin_url',
    'twitter_url',
    'order',
    'is_active',
])]

class TeamMember extends Model
{
    /** @use HasFactory<TeamMemberFactory> */
    use HasFactory;

    #[Override]
    protected function casts(): array
    {
        return [
            'order' => 'integer',
            'is_active' => 'boolean',
        ];
    }
}
