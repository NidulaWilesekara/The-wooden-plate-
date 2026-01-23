<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Mail\OtpMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

class CustomerAuthController extends Controller
{
    /**
     * Register a new customer (no password)
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:customers',
            'phone' => 'nullable|string|max:20|unique:customers',
            'address' => 'nullable|string|max:500',
        ], [
            'email.unique' => 'This email is already registered.',
            'phone.unique' => 'This phone number is already registered.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $customer = Customer::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'address' => $request->address,
        ]);

        return response()->json([
            'message' => 'Registration successful! Please login with your email to receive an OTP.',
            'customer' => $customer,
        ], 201);
    }

    /**
     * Send OTP to customer email
     */
    public function sendOTP(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $customer = Customer::where('email', $request->email)->first();

        if (!$customer) {
            return response()->json([
                'message' => 'No account found with this email address.'
            ], 404);
        }

        // Generate 6-digit OTP
        $otp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        // Store OTP in cache for 5 minutes
        Cache::put('otp_' . $request->email, $otp, now()->addMinutes(5));

        // Send OTP via email
        try {
            Mail::to($request->email)->send(new OtpMail(
                $otp,
                $customer->name,
                5,
                null,
                null
            ));
        } catch (\Exception $e) {
            // For development, log the OTP
            Log::info("OTP for {$request->email}: {$otp}");
            Log::error("Mail error: " . $e->getMessage());
        }

        return response()->json([
            'message' => 'OTP sent to your email address.',
            'debug_otp' => config('app.debug') ? $otp : null
        ], 200);
    }

    /**
     * Verify OTP and login customer
     */
    public function verifyOTP(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'otp' => 'required|string|size:6',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $customer = Customer::where('email', $request->email)->first();

        if (!$customer) {
            return response()->json([
                'message' => 'Customer not found.'
            ], 404);
        }

        // Verify OTP
        $cachedOTP = Cache::get('otp_' . $request->email);

        if (!$cachedOTP || $cachedOTP != $request->otp) {
            return response()->json([
                'message' => 'Invalid or expired OTP.'
            ], 401);
        }

        // Clear OTP after successful verification
        Cache::forget('otp_' . $request->email);

        // Create token
        $token = $customer->createToken('customer-token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'customer' => $customer,
            'token' => $token
        ], 200);
    }

    /**
     * Logout customer
     */
    public function logout(Request $request)
    {
        $request->user('sanctum')->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully'
        ], 200);
    }

    /**
     * Get authenticated customer
     */
    public function me(Request $request)
    {
        return response()->json([
            'customer' => $request->user('sanctum')
        ], 200);
    }
}
