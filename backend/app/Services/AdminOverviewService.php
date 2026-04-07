<?php

namespace App\Services;

use App\Models\Category;
use App\Models\ContactMessage;
use App\Models\Details;
use App\Models\GalleryImage;
use App\Models\MenuItem;
use App\Models\Product;
use App\Models\Promotion;
use Illuminate\Support\Str;

class AdminOverviewService
{
    /**
     * Build the full admin dashboard payload.
     */
    public function getDashboardData(): array
    {
        $context = $this->buildContext();

        return [
            'generated_at' => $context['generated_at'],
            'stats' => [
                'unread_messages' => [
                    'value' => $context['unread_messages'],
                    'note' => $context['total_messages'] . ' total message' . ($context['total_messages'] === 1 ? '' : 's'),
                ],
                'active_promotions' => [
                    'value' => $context['active_promotions'],
                    'note' => $context['expiring_soon_promotions'] > 0
                        ? $context['expiring_soon_promotions'] . ' expiring soon'
                        : 'Currently running offers',
                ],
                'menu_items' => [
                    'value' => $context['total_menu_items'],
                    'note' => $context['available_menu_items'] . ' available | ' . $context['popular_menu_items'] . ' popular',
                ],
                'products' => [
                    'value' => $context['total_products'],
                    'note' => $context['available_products'] . ' available | ' . $context['featured_products'] . ' featured | ' . $context['new_products'] . ' new',
                ],
                'categories' => [
                    'value' => $context['total_categories'],
                    'note' => $context['active_categories'] . ' active',
                ],
                'gallery_images' => [
                    'value' => $context['total_gallery_images'],
                    'note' => $context['active_gallery_images'] . ' visible | ' . ($context['total_gallery_images'] - $context['active_gallery_images']) . ' hidden',
                ],
            ],
            'settings_summary' => [
                'exists' => (bool) $context['settings'],
                'completion_percentage' => $context['settings_completion'],
                'missing_fields' => $context['missing_settings_fields'],
            ],
            'checks' => $context['checks'],
            'alerts' => $context['alerts'],
            'recent' => [
                'messages' => $context['recent_messages'],
                'menu_items' => $context['recent_menu_items'],
                'promotions' => $context['recent_promotions'],
            ],
            'quick_actions' => $context['quick_actions'],
            'counts' => [
                'popular_menu_items' => $context['popular_menu_items'],
                'active_categories' => $context['active_categories'],
                'active_gallery_images' => $context['active_gallery_images'],
                'available_menu_items' => $context['available_menu_items'],
                'unavailable_menu_items' => $context['unavailable_menu_items'],
            ],
        ];
    }

    /**
     * Build a lighter notification payload for the navbar drawer.
     */
    public function getNotificationsData(): array
    {
        $context = $this->buildContext();
        $nonMessageAlertCount = collect($context['alerts'])
            ->reject(fn (array $alert) => ($alert['kind'] ?? null) === 'messages')
            ->count();

        return [
            'generated_at' => $context['generated_at'],
            'summary' => [
                'attention_count' => $context['unread_messages'] + $nonMessageAlertCount,
                'unread_messages' => $context['unread_messages'],
                'alert_count' => count($context['alerts']),
            ],
            'alerts' => $context['alerts'],
            'messages' => $context['notification_messages'],
        ];
    }

    /**
     * Gather the raw admin overview context used by dashboard and notifications.
     */
    private function buildContext(): array
    {
        $now = now();
        $weekAhead = $now->copy()->addDays(7);

        $totalProducts = Product::count();
        $availableProducts = Product::where('is_available', true)->count();
        $featuredProducts = Product::where('is_featured', true)->count();
        $newProducts = Product::where('is_new', true)->count();

        $totalMenuItems = MenuItem::count();
        $availableMenuItems = MenuItem::where('is_available', true)->count();
        $popularMenuItems = MenuItem::where('is_popular', true)->count();
        $unavailableMenuItems = MenuItem::where('is_available', false)->count();

        $totalCategories = Category::count();
        $activeCategories = Category::where('is_active', true)->count();

        $totalGalleryImages = GalleryImage::count();
        $activeGalleryImages = GalleryImage::where('is_active', true)->count();

        $unreadMessages = ContactMessage::where('is_read', false)->count();
        $totalMessages = ContactMessage::count();

        $activePromotionsQuery = Promotion::query()
            ->where('is_active', true)
            ->where(function ($query) use ($now) {
                $query->whereNull('starts_at')->orWhere('starts_at', '<=', $now);
            })
            ->where(function ($query) use ($now) {
                $query->whereNull('ends_at')->orWhere('ends_at', '>=', $now);
            });

        $activePromotions = (clone $activePromotionsQuery)->count();
        $expiringSoonPromotions = (clone $activePromotionsQuery)
            ->whereNotNull('ends_at')
            ->whereBetween('ends_at', [$now, $weekAhead])
            ->count();

        $settings = Details::query()->latest('id')->first();
        $requiredSettingsFields = [
            'name' => 'Shop name',
            'contact_email' => 'Contact email',
            'contact_phone' => 'Contact phone',
            'address' => 'Address',
            'opening_hours' => 'Opening hours',
        ];

        $missingSettingsFields = collect($requiredSettingsFields)
            ->filter(fn ($label, $field) => blank($settings?->{$field}))
            ->values()
            ->all();

        $settingsCompletion = count($requiredSettingsFields) === 0
            ? 100
            : (int) round(((count($requiredSettingsFields) - count($missingSettingsFields)) / count($requiredSettingsFields)) * 100);

        $checks = [
            [
                'label' => 'Shop settings',
                'status' => !$settings ? 'error' : (count($missingSettingsFields) > 0 ? 'warning' : 'ok'),
                'description' => !$settings
                    ? 'No settings record found yet.'
                    : (count($missingSettingsFields) > 0
                        ? 'Missing: ' . implode(', ', $missingSettingsFields)
                        : 'Business contact details are ready.'),
                'path' => '/admin/settings',
            ],
            [
                'label' => 'Visible categories',
                'status' => $activeCategories > 0 ? 'ok' : 'error',
                'description' => $activeCategories > 0
                    ? $activeCategories . ' active categories are visible on the site.'
                    : 'No active categories are currently visible on the site.',
                'path' => '/admin/categories',
            ],
            [
                'label' => 'Available menu items',
                'status' => $availableMenuItems > 0 ? 'ok' : 'error',
                'description' => $availableMenuItems > 0
                    ? $availableMenuItems . ' menu items are currently available.'
                    : 'There are no available menu items for customers right now.',
                'path' => '/admin/menu-items',
            ],
            [
                'label' => 'Chef specials',
                'status' => $popularMenuItems > 0 ? 'ok' : 'warning',
                'description' => $popularMenuItems > 0
                    ? $popularMenuItems . ' popular menu items can appear in Chef\'s Specials.'
                    : 'No menu items are marked as popular.',
                'path' => '/admin/menu-items',
            ],
            [
                'label' => 'Gallery visibility',
                'status' => $activeGalleryImages > 0 ? 'ok' : 'warning',
                'description' => $activeGalleryImages > 0
                    ? $activeGalleryImages . ' gallery images are visible to customers.'
                    : 'No active gallery images are currently visible on the website.',
                'path' => '/admin/gallery',
            ],
        ];

        $alerts = [];

        if ($unreadMessages > 0) {
            $alerts[] = [
                'kind' => 'messages',
                'level' => 'warning',
                'title' => $unreadMessages . ' unread contact message' . ($unreadMessages === 1 ? '' : 's'),
                'description' => 'Customer inquiries are waiting for review.',
                'path' => '/admin/contact-messages',
                'action_label' => 'Open messages',
            ];
        }

        if (!$settings || count($missingSettingsFields) > 0) {
            $alerts[] = [
                'kind' => 'settings',
                'level' => !$settings ? 'danger' : 'warning',
                'title' => !$settings ? 'Shop settings are missing' : 'Shop settings need attention',
                'description' => !$settings
                    ? 'Add the restaurant details so the site looks complete.'
                    : 'Complete: ' . implode(', ', $missingSettingsFields),
                'path' => '/admin/settings',
                'action_label' => !$settings ? 'Add settings' : 'Edit settings',
            ];
        }

        if ($expiringSoonPromotions > 0) {
            $alerts[] = [
                'kind' => 'promotions',
                'level' => 'info',
                'title' => $expiringSoonPromotions . ' promotion' . ($expiringSoonPromotions === 1 ? '' : 's') . ' expiring within 7 days',
                'description' => 'Review current offers and extend or replace them if needed.',
                'path' => '/admin/promotions',
                'action_label' => 'Review promotions',
            ];
        }

        if ($popularMenuItems === 0) {
            $alerts[] = [
                'kind' => 'specials',
                'level' => 'info',
                'title' => 'Chef specials are empty',
                'description' => 'Mark one or more menu items as popular to highlight them on the homepage.',
                'path' => '/admin/menu-items',
                'action_label' => 'Manage menu items',
            ];
        }

        if ($activeCategories === 0) {
            $alerts[] = [
                'kind' => 'categories',
                'level' => 'danger',
                'title' => 'No active categories are visible',
                'description' => 'Customers cannot browse categories until at least one category is active.',
                'path' => '/admin/categories',
                'action_label' => 'Manage categories',
            ];
        }

        if ($availableMenuItems === 0) {
            $alerts[] = [
                'kind' => 'menu',
                'level' => 'danger',
                'title' => 'No available menu items',
                'description' => 'The public menu currently has no items available for customers.',
                'path' => '/admin/menu-items',
                'action_label' => 'Review menu',
            ];
        }

        if ($activeGalleryImages === 0) {
            $alerts[] = [
                'kind' => 'gallery',
                'level' => 'warning',
                'title' => 'Gallery is hidden from customers',
                'description' => 'Activate at least one gallery image to keep the page populated.',
                'path' => '/admin/gallery',
                'action_label' => 'Open gallery',
            ];
        }

        $recentMessages = ContactMessage::query()
            ->latest('created_at')
            ->limit(5)
            ->get()
            ->map(function (ContactMessage $message) {
                return [
                    'id' => $message->id,
                    'name' => $message->name,
                    'email' => $message->email,
                    'excerpt' => Str::limit($message->message, 80),
                    'is_read' => $message->is_read,
                    'created_at' => $message->created_at,
                ];
            })
            ->values();

        $recentMenuItems = MenuItem::query()
            ->with('category:id,name')
            ->latest('created_at')
            ->limit(5)
            ->get()
            ->map(function (MenuItem $item) {
                return [
                    'id' => $item->id,
                    'name' => $item->name,
                    'category' => $item->category?->name,
                    'is_available' => $item->is_available,
                    'is_popular' => $item->is_popular,
                    'created_at' => $item->created_at,
                ];
            })
            ->values();

        $recentPromotions = Promotion::query()
            ->latest('created_at')
            ->limit(5)
            ->get()
            ->map(function (Promotion $promotion) {
                return [
                    'id' => $promotion->id,
                    'title' => $promotion->title,
                    'is_active' => $promotion->is_active,
                    'ends_at' => $promotion->ends_at,
                    'created_at' => $promotion->created_at,
                ];
            })
            ->values();

        $notificationMessages = ContactMessage::query()
            ->orderBy('is_read')
            ->orderByDesc('created_at')
            ->limit(6)
            ->get()
            ->map(function (ContactMessage $message) {
                return [
                    'id' => $message->id,
                    'name' => $message->name,
                    'email' => $message->email,
                    'excerpt' => Str::limit($message->message, 90),
                    'is_read' => $message->is_read,
                    'created_at' => $message->created_at,
                    'path' => '/admin/contact-messages/' . $message->id,
                ];
            })
            ->values();

        $quickActions = [
            ['label' => 'Add Product', 'path' => '/admin/products/create', 'description' => 'Create a new product entry.'],
            ['label' => 'Add Menu Item', 'path' => '/admin/menu-items/create', 'description' => 'Add a dish to the public menu.'],
            ['label' => 'Create Promotion', 'path' => '/admin/promotions/create', 'description' => 'Launch a new campaign or offer.'],
            ['label' => 'Upload Gallery Image', 'path' => '/admin/gallery', 'description' => 'Refresh the gallery with new photos.'],
            ['label' => 'Edit Settings', 'path' => '/admin/settings', 'description' => 'Update business contact information.'],
            ['label' => 'Open Messages', 'path' => '/admin/contact-messages', 'description' => 'Review customer inquiries.'],
        ];

        return [
            'generated_at' => $now,
            'total_products' => $totalProducts,
            'available_products' => $availableProducts,
            'featured_products' => $featuredProducts,
            'new_products' => $newProducts,
            'total_menu_items' => $totalMenuItems,
            'available_menu_items' => $availableMenuItems,
            'popular_menu_items' => $popularMenuItems,
            'unavailable_menu_items' => $unavailableMenuItems,
            'total_categories' => $totalCategories,
            'active_categories' => $activeCategories,
            'total_gallery_images' => $totalGalleryImages,
            'active_gallery_images' => $activeGalleryImages,
            'unread_messages' => $unreadMessages,
            'total_messages' => $totalMessages,
            'active_promotions' => $activePromotions,
            'expiring_soon_promotions' => $expiringSoonPromotions,
            'settings' => $settings,
            'missing_settings_fields' => $missingSettingsFields,
            'settings_completion' => $settingsCompletion,
            'checks' => $checks,
            'alerts' => $alerts,
            'recent_messages' => $recentMessages,
            'recent_menu_items' => $recentMenuItems,
            'recent_promotions' => $recentPromotions,
            'notification_messages' => $notificationMessages,
            'quick_actions' => $quickActions,
        ];
    }
}
