<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Team\StoreTeamMemberRequest;
use App\Http\Requests\Team\UpdateTeamMemberRequest;
use App\Http\Resources\Team\TeamMemberResource;
use App\Models\TeamMember;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class TeamMemberController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $members = TeamMember::orderBy('order')->get();

        return response()->json([
            'data' => TeamMemberResource::collection($members),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTeamMemberRequest $request): JsonResponse
    {
        $data = $request->validated();

        if ($request->hasFile('photo')) {
            $data['photo'] = $request->file('photo')->store('team', 'public');
        }

        $member = TeamMember::create($data);

        return response()->json([
            'message' => 'Team member created successfully',
            'data' => new TeamMemberResource($member),
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(TeamMember $teamMember): JsonResponse
    {
        return response()->json([
            'data' => new TeamMemberResource($teamMember),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTeamMemberRequest $request, TeamMember $teamMember): JsonResponse
    {
        $data = $request->validated();

        if ($request->hasFile('photo')) {
            if ($teamMember->photo) {
                Storage::disk('public')->delete($teamMember->photo);
            }

            $data['photo'] = $request->file('photo')->store('team', 'public');
        }

        $teamMember->update($data);

        return response()->json([
            'message' => 'Team member updated successfully',
            'data' => new TeamMemberResource($teamMember->fresh()),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TeamMember $teamMember): JsonResponse
    {
        if ($teamMember->photo) {
            Storage::disk('public')->delete($teamMember->photo);
        }

        $teamMember->delete();

        return response()->json([
            'message' => 'Team member deleted successfully',
        ]);
    }
}
