<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Requests\UpdateOrderStatusRequest;

class OrderController extends Controller
{
    /**
     * Customer: Get their orders
     */
    public function customerIndex(Request $request)
    {
        $customerId = $request->user()->customer->id ?? null;

        if (!$customerId) {
            return response()->json(['message' => 'Customer profile not found'], 404);
        }

        $orders = Order::with(['items.product', 'customer'])
            ->where('customer_id', $customerId)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($orders);
    }

    /**
     * Customer: Create a new order
     */
    public function store(StoreOrderRequest $request)
    {
        DB::beginTransaction();

        try {
            // Calculate total amount
            $totalAmount = 0;
            $orderItemsData = [];

            foreach ($request->items as $item) {
                $product = Product::findOrFail($item['product_id']);
                $subtotal = $product->price * $item['quantity'];
                $totalAmount += $subtotal;

                $orderItemsData[] = [
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'price' => $product->price,
                    'subtotal' => $subtotal
                ];
            }

            // Create order
            $order = Order::create([
                'customer_id' => $request->customer_id,
                'total_amount' => $totalAmount,
                'status' => 'pending',
                'is_locked' => false,
                'notes' => $request->notes
            ]);

            // Create order items
            foreach ($orderItemsData as $itemData) {
                $order->items()->create($itemData);
            }

            DB::commit();

            return response()->json([
                'message' => 'Order placed successfully',
                'order' => $order->load(['items.product', 'customer'])
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to create order',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get single order details
     */
    public function show($id, Request $request)
    {
        $order = Order::with(['items.product', 'customer'])->findOrFail($id);

        // Check if customer is viewing their own order or if admin
        $user = $request->user();
        if (!$user->is_admin) {
            $customerId = $user->customer->id ?? null;
            if ($order->customer_id !== $customerId) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
        }

        return response()->json($order);
    }

    /**
     * Customer: Delete their order (only if pending and not locked)
     */
    public function destroy($id, Request $request)
    {
        $order = Order::findOrFail($id);

        // Verify ownership
        $customerId = $request->user()->customer->id ?? null;
        if ($order->customer_id !== $customerId) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Check if can be deleted
        if (!$order->canBeDeletedByCustomer()) {
            return response()->json([
                'message' => 'Cannot delete this order. Only pending orders can be deleted.'
            ], 400);
        }

        $order->delete();

        return response()->json(['message' => 'Order deleted successfully']);
    }

    /**
     * Admin: Get all orders
     */
    public function adminIndex(Request $request)
    {
        $query = Order::with(['items.product', 'customer']);

        // Filter by status if provided
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $orders = $query->orderBy('created_at', 'desc')->get();

        return response()->json($orders);
    }

    /**
     * Admin: Update order status (and lock if needed)
     */
    public function updateStatus(UpdateOrderStatusRequest $request, $id)
    {
        $order = Order::findOrFail($id);

        // Use the updateStatus method which handles locking
        $order->updateStatus($request->status);

        return response()->json([
            'message' => 'Order status updated successfully',
            'order' => $order->load(['items.product', 'customer'])
        ]);
    }

    /**
     * Generate PDF invoice for an order
     */
    public function generateInvoice($id, Request $request)
    {
        $order = Order::with(['items.product', 'customer'])->findOrFail($id);

        // Check if customer is viewing their own order or if admin
        $user = $request->user();
        if (!$user->is_admin) {
            $customerId = $user->customer->id ?? null;
            if ($order->customer_id !== $customerId) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
        }

        $pdf = Pdf::loadView('invoices.order', compact('order'));

        return $pdf->download('invoice-' . $order->id . '.pdf');
    }
}
