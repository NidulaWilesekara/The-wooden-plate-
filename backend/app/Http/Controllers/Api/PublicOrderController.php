<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Details;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PublicOrderController extends Controller
{
    /**
     * Place a new order (guest checkout)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_phone' => 'required|string|max:20',
            'customer_email' => 'nullable|email',
            'delivery_address' => 'nullable|string',
            'order_type' => 'required|in:dine-in,takeaway,delivery',
            'items' => 'required|array|min:1',
            'items.*.menu_item_id' => 'required|exists:menu_items,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0',
            'special_instructions' => 'nullable|string',
        ]);

        DB::beginTransaction();
        try {
            // Generate unique order number
            $orderNumber = 'ORD-' . strtoupper(Str::random(8));

            // Calculate totals
            $subtotal = 0;
            foreach ($validated['items'] as $item) {
                $subtotal += $item['price'] * $item['quantity'];
            }

            // Create order
            $order = Order::create([
                'order_number' => $orderNumber,
                'customer_name' => $validated['customer_name'],
                'customer_phone' => $validated['customer_phone'],
                'customer_email' => $validated['customer_email'] ?? null,
                'order_type' => $validated['order_type'],
                'delivery_address' => $validated['delivery_address'] ?? null,
                'subtotal' => $subtotal,
                'discount' => 0,
                'total' => $subtotal,
                'status' => 'pending',
                'special_instructions' => $validated['special_instructions'] ?? null,
            ]);

            // Create order details
            foreach ($validated['items'] as $item) {
                Details::create([
                    'order_id' => $order->id,
                    'menu_item_id' => $item['menu_item_id'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                ]);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Order placed successfully',
                'data' => [
                    'order_number' => $orderNumber,
                    'order_id' => $order->id,
                    'total' => $order->total,
                ]
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to place order: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Track order by order number
     */
    public function track($orderNumber)
    {
        $order = Order::with(['details.menuItem.category'])
            ->where('order_number', $orderNumber)
            ->first();

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'order_number' => $order->order_number,
                'customer_name' => $order->customer_name,
                'customer_phone' => $order->customer_phone,
                'order_type' => $order->order_type,
                'status' => $order->status,
                'subtotal' => $order->subtotal,
                'discount' => $order->discount,
                'total' => $order->total,
                'special_instructions' => $order->special_instructions,
                'items' => $order->details->map(function ($detail) {
                    return [
                        'name' => $detail->menuItem->name,
                        'category' => $detail->menuItem->category->name,
                        'quantity' => $detail->quantity,
                        'price' => $detail->price,
                        'subtotal' => $detail->quantity * $detail->price,
                    ];
                }),
                'created_at' => $order->created_at->format('Y-m-d H:i:s'),
                'estimated_time' => $this->getEstimatedTime($order->status),
            ]
        ]);
    }

    /**
     * Get estimated time based on status
     */
    private function getEstimatedTime($status)
    {
        $estimates = [
            'pending' => '15-20 minutes',
            'preparing' => '10-15 minutes',
            'ready' => 'Ready for pickup!',
            'completed' => 'Completed',
            'cancelled' => 'Cancelled',
        ];

        return $estimates[$status] ?? 'Processing...';
    }
}
