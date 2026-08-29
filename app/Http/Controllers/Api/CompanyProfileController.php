<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Company\StoreCompanyProfileRequest;
use App\Http\Requests\Company\UpdateCompanyProfileRequest;
use App\Http\Resources\Company\CompanyProfileResource;
use App\Models\CompanyProfile;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class CompanyProfileController extends Controller
{
    /**
     * Display the (single) company profile.
     */
    public function index(): JsonResponse
    {
        $profile = CompanyProfile::query()
            ->orderBy('id')
            ->firstOr(function () {
                return new CompanyProfile(['name' => config('app.name')]);
            });

        return response()->json([
            'data' => new CompanyProfileResource($profile),
        ]);
    }

    /**
     * Display the company profile for the public website (active only).
     */
    public function public(): JsonResponse
    {
        $profile = CompanyProfile::where('is_active', true)
            ->orderBy('id')
            ->firstOr(function () {
                return new CompanyProfile(['name' => config('app.name')]);
            });

        return response()->json([
            'data' => new CompanyProfileResource($profile),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCompanyProfileRequest $request): JsonResponse
    {
        $data = $request->validated();

        if ($request->hasFile('logo')) {
            $data['logo'] = $request->file('logo')->store('company', 'public');
        }

        $profile = CompanyProfile::create($data);

        return response()->json([
            'message' => 'Company profile created successfully',
            'data' => new CompanyProfileResource($profile),
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(CompanyProfile $companyProfile): JsonResponse
    {
        return response()->json([
            'data' => new CompanyProfileResource($companyProfile),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(
        UpdateCompanyProfileRequest $request,
        CompanyProfile $companyProfile,
    ): JsonResponse {
        $data = $request->validated();

        if ($request->hasFile('logo')) {
            if ($companyProfile->logo) {
                Storage::disk('public')->delete($companyProfile->logo);
            }

            $data['logo'] = $request->file('logo')->store('company', 'public');
        }

        $companyProfile->update($data);

        return response()->json([
            'message' => 'Company profile updated successfully',
            'data' => new CompanyProfileResource($companyProfile->fresh()),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CompanyProfile $companyProfile): JsonResponse
    {
        if ($companyProfile->logo) {
            Storage::disk('public')->delete($companyProfile->logo);
        }

        $companyProfile->delete();

        return response()->json([
            'message' => 'Company profile deleted successfully',
        ]);
    }
}
