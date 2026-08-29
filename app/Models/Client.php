<?php

namespace App\Models;

use Database\Factories\ClientFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Override;

/**
 * @property int $id
 * @property string $name
 * @property string|null $logo
 * @property string|null $website_url
 * @property int $order
 * @property bool $is_active
 */
#[Fillable([
    'name',
    'logo',
    'website_url',
    'order',
    'is_active',
])]

class Client extends Model
{
    /** @use HasFactory<ClientFactory> */
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
