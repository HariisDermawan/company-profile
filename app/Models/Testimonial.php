<?php

namespace App\Models;

use Database\Factories\TestimonialFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Override;

/**
 * @property int $id
 * @property string $name
 * @property string|null $company
 * @property string|null $position
 * @property string|null $photo
 * @property string $content
 * @property int $rating
 * @property bool $is_active
 */
#[Fillable([
    'name',
    'company',
    'position',
    'photo',
    'content',
    'rating',
    'is_active',
])]

class Testimonial extends Model
{
    /** @use HasFactory<TestimonialFactory> */
    use HasFactory;

    #[Override]
    protected function casts(): array
    {
        return [
            'rating' => 'integer',
            'is_active' => 'boolean',
        ];
    }
}
