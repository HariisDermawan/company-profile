<?php

namespace App\Models;

use Database\Factories\BlogPostFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use Override;

/**
 * @property int $id
 * @property string $title
 * @property string $slug
 * @property string|null $excerpt
 * @property string $content
 * @property string|null $cover_image
 * @property string|null $category
 * @property array<int, string>|null $tags
 * @property string|null $author
 * @property Carbon|null $published_at
 * @property bool $is_active
 */
#[Fillable([
    'title',
    'slug',
    'excerpt',
    'content',
    'cover_image',
    'category',
    'tags',
    'author',
    'published_at',
    'is_active',
])]

class BlogPost extends Model
{
    /** @use HasFactory<BlogPostFactory> */
    use HasFactory;

    #[Override]
    protected function casts(): array
    {
        return [
            'tags' => 'array',
            'published_at' => 'datetime',
            'is_active' => 'boolean',
        ];
    }
}
