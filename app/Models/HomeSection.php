<?php

namespace App\Models;

use Database\Factories\HomeSectionFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Override;

/**
 * @property int $id
 * @property string $section_key
 * @property string|null $title
 * @property string|null $subtitle
 * @property string|null $description
 * @property string|null $image
 * @property array<string, mixed>|null $data
 * @property bool $is_active
 */
#[Fillable([
    'section_key',
    'title',
    'subtitle',
    'description',
    'image',
    'data',
    'is_active',
])]

class HomeSection extends Model
{
    /** @use HasFactory<HomeSectionFactory> */
    use HasFactory;

    #[Override]
    protected function casts(): array
    {
        return [
            'data' => 'array',
            'is_active' => 'boolean',
        ];
    }
}
