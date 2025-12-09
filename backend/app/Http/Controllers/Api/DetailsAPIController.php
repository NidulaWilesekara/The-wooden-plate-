<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Details;
use App\Http\Requests\StoreDetailsRequest;
use App\Http\Requests\UpdateDetailsRequest;

class DetailsAPIController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $details = Details::all();
            return response()->json($details);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve details',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreDetailsRequest $request)
    {
        try {
            $details = Details::create($request->validated());
            return response()->json([
                'message' => 'Details created successfully',
                'data' => $details
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create details',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $details = Details::findOrFail($id);
            return response()->json($details);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Details not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDetailsRequest $request, string $id)
    {
        try {
            $details = Details::findOrFail($id);
            $details->update($request->validated());
            return response()->json([
                'message' => 'Details updated successfully',
                'data' => $details
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update details',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $details = Details::findOrFail($id);
            $details->delete();
            return response()->json([
                'message' => 'Details deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete details',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
