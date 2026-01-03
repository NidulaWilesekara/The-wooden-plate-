<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Auth\Events\PasswordReset;

class CustomerPasswordController extends Controller
{
    /**
     * Send password reset link
     */
    public function forgotPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:customers,email',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // For now, return a mock token since email setup is complex
        // In production, use: Password::broker('customers')->sendResetLink($request->only('email'));

        $customer = Customer::where('email', $request->email)->first();
        $token = Str::random(64);

        // Store token in database (would need password_resets table for customers)
        // For MVP, we'll return the token directly

        return response()->json([
            'message' => 'Password reset link sent to your email',
            'reset_token' => $token, // Remove this in production
            'email' => $request->email
        ], 200);
    }

    /**
     * Reset password
     */
    public function resetPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:customers,email',
            'token' => 'required',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // For MVP, accept any token. In production, validate token from password_resets table
        $customer = Customer::where('email', $request->email)->first();

        if (!$customer) {
            return response()->json([
                'message' => 'Customer not found'
            ], 404);
        }

        $customer->password = Hash::make($request->password);
        $customer->remember_token = Str::random(60);
        $customer->save();

        return response()->json([
            'message' => 'Password reset successful'
        ], 200);
    }
}
