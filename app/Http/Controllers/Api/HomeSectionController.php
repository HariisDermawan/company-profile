<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Home\StoreHomeSectionRequest;
use App\Http\Requests\Home\UpdateHomeSectionRequest;
use App\Http\Resources\Home\HomeSectionResource;
use App\Models\HomeSection;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class HomeSectionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $sections = HomeSection::orderBy('section_key')->get();

        return response()->json([
            'data' => HomeSectionResource::collection($sections),
        ]);
    }

    /**
     * Display the active home sections for the public website.
     */
    public function public(): JsonResponse
    {
        $sections = HomeSection::where('is_active', true)
            ->orderBy('section_key')
            ->get()
            ->keyBy('section_key');

        return response()->json([
            'data' => HomeSectionResource::collection($sections),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreHomeSectionRequest $request): JsonResponse
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('home', 'public');
        }

        $section = HomeSection::create($data);

        return response()->json([
            'message' => 'Home section created successfully',
            'data' => new HomeSectionResource($section),
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(HomeSection $homeSection): JsonResponse
    {
        return response()->json([
            'data' => new HomeSectionResource($homeSection),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateHomeSectionRequest $request, HomeSection $homeSection): JsonResponse
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            if ($homeSection->image) {
                Storage::disk('public')->delete($homeSection->image);
            }

            $data['image'] = $request->file('image')->store('home', 'public');
        }

        $homeSection->update($data);

        return response()->json([
            'message' => 'Home section updated successfully',
            'data' => new HomeSectionResource($homeSection->fresh()),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(HomeSection $homeSection): JsonResponse
    {
        if ($homeSection->image) {
            Storage::disk('public')->delete($homeSection->image);
        }

        $homeSection->delete();

        return response()->json([
            'message' => 'Home section deleted successfully',
        ]);
    }
}
