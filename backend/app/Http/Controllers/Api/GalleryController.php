<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\GalleryImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class GalleryController extends Controller
{
    /**
     * Display a listing of gallery images.
     */
    public function index()
    {
        $images = GalleryImage::orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $images
        ]);
    }

    /**
     * Store a newly created gallery image.
     */
    public function store(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'is_active' => 'nullable|boolean'
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
            $imagePath = $file->storeAs('gallery', $filename, 'public');
            $imagePath = '/storage/' . $imagePath;
        }

        $galleryImage = GalleryImage::create([
            'image' => $imagePath,
            'is_active' => $request->is_active ?? true
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Gallery image uploaded successfully',
            'data' => $galleryImage
        ], 201);
    }

    /**
     * Display the specified gallery image.
     */
    public function show($id)
    {
        $image = GalleryImage::findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $image
        ]);
    }

    /**
     * Update the specified gallery image.
     */
    public function update(Request $request, $id)
    {
        $galleryImage = GalleryImage::findOrFail($id);

        $request->validate([
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'is_active' => 'nullable|boolean'
        ]);

        $data = [];

        if ($request->has('is_active')) {
            $data['is_active'] = $request->is_active;
        }

        if ($request->hasFile('image')) {
            // Delete old image
            if ($galleryImage->image) {
                $oldPath = str_replace('/storage/', '', $galleryImage->image);
                Storage::disk('public')->delete($oldPath);
            }

            $file = $request->file('image');
            $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
            $imagePath = $file->storeAs('gallery', $filename, 'public');
            $data['image'] = '/storage/' . $imagePath;
        }

        $galleryImage->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Gallery image updated successfully',
            'data' => $galleryImage
        ]);
    }

    /**
     * Remove the specified gallery image.
     */
    public function destroy($id)
    {
        $galleryImage = GalleryImage::findOrFail($id);

        // Delete the image file
        if ($galleryImage->image) {
            $imagePath = str_replace('/storage/', '', $galleryImage->image);
            Storage::disk('public')->delete($imagePath);
        }

        $galleryImage->delete();

        return response()->json([
            'success' => true,
            'message' => 'Gallery image deleted successfully'
        ]);
    }

    /**
     * Toggle active status.
     */
    public function toggleActive($id)
    {
        $galleryImage = GalleryImage::findOrFail($id);
        $galleryImage->is_active = !$galleryImage->is_active;
        $galleryImage->save();

        return response()->json([
            'success' => true,
            'message' => 'Gallery image status updated',
            'data' => $galleryImage
        ]);
    }

    /**
     * Get active images for public display.
     */
    public function publicIndex()
    {
        $images = GalleryImage::where('is_active', true)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $images
        ]);
    }
}
