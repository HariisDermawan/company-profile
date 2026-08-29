<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Blog\StoreBlogPostRequest;
use App\Http\Requests\Blog\UpdateBlogPostRequest;
use App\Http\Resources\Blog\BlogPostResource;
use App\Models\BlogPost;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class BlogPostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $posts = BlogPost::latest()->get();

        return response()->json([
            'data' => BlogPostResource::collection($posts),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBlogPostRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['slug'] ??= Str::slug($data['title']);

        if ($request->hasFile('cover_image')) {
            $data['cover_image'] = $request->file('cover_image')->store('blog', 'public');
        }

        $post = BlogPost::create($data);

        return response()->json([
            'message' => 'Blog post created successfully',
            'data' => new BlogPostResource($post),
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(BlogPost $post): JsonResponse
    {
        return response()->json([
            'data' => new BlogPostResource($post),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBlogPostRequest $request, BlogPost $post): JsonResponse
    {
        $data = $request->validated();

        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['title']);
        }

        if ($request->hasFile('cover_image')) {
            if ($post->cover_image) {
                Storage::disk('public')->delete($post->cover_image);
            }

            $data['cover_image'] = $request->file('cover_image')->store('blog', 'public');
        }

        $post->update($data);

        return response()->json([
            'message' => 'Blog post updated successfully',
            'data' => new BlogPostResource($post->fresh()),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(BlogPost $post): JsonResponse
    {
        if ($post->cover_image) {
            Storage::disk('public')->delete($post->cover_image);
        }

        $post->delete();

        return response()->json([
            'message' => 'Blog post deleted successfully',
        ]);
    }
}
