<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Contact\MarkContactMessageRequest;
use App\Http\Requests\Contact\StoreContactMessageRequest;
use App\Http\Resources\Contact\ContactMessageResource;
use App\Models\ContactMessage;
use Illuminate\Http\JsonResponse;

class ContactMessageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $messages = ContactMessage::latest()->get();

        return response()->json([
            'data' => ContactMessageResource::collection($messages),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreContactMessageRequest $request): JsonResponse
    {
        $message = ContactMessage::create($request->validated());

        return response()->json([
            'message' => 'Message sent successfully',
            'data' => new ContactMessageResource($message),
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(ContactMessage $message): JsonResponse
    {
        return response()->json([
            'data' => new ContactMessageResource($message),
        ]);
    }

    /**
     * Mark the specified message as read / unread.
     */
    public function markAsRead(
        ContactMessage $message,
        MarkContactMessageRequest $request,
    ): JsonResponse {
        $isRead = $request->boolean('is_read');

        $message->update([
            'is_read' => $isRead,
            'read_at' => $isRead ? now() : null,
        ]);

        return response()->json([
            'message' => $isRead ? 'Message marked as read' : 'Message marked as unread',
            'data' => new ContactMessageResource($message->fresh()),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ContactMessage $message): JsonResponse
    {
        $message->delete();

        return response()->json([
            'message' => 'Message deleted successfully',
        ]);
    }
}
