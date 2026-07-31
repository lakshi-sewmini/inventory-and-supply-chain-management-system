-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 31, 2026 at 05:43 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `inventory_and_supplychain_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `category_id` varchar(50) NOT NULL,
  `category_name` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`category_id`, `category_name`, `created_at`, `updated_at`) VALUES
('CAT-ELECTRONIC', 'Electronic', '2026-07-28 11:48:26', '2026-07-28 11:48:26'),
('CAT-ELECTRONICS', 'Electronics', '2026-07-28 11:49:31', '2026-07-28 11:49:31'),
('CAT-FURNITURE', 'Furniture', '2026-07-30 21:34:32', '2026-07-30 21:34:32');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2026_05_28_073403_create_personal_access_tokens_table', 1),
(5, '2026_05_28_074458_create_categories_table', 1),
(6, '2026_05_28_074656_create_products_table', 1),
(7, '2026_05_28_074754_create_suppliers_table', 1),
(8, '2026_05_28_074815_create_purchase_orders_table', 1),
(9, '2026_05_28_074846_create_purchase_order_items_table', 1),
(10, '2026_05_28_074919_create_stock_tansaction_table', 1),
(11, '2026_05_28_074944_create_supplier_products_table', 1),
(12, '2026_05_30_164007_add_quentity_to_products_table', 1),
(13, '2026_07_12_185359_create_support_tickets_table', 1),
(14, '2026_07_13_191217_create_settings_table', 1),
(15, '2026_07_14_150757_add_magic_token_to_purchase_orders_table', 1);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` varchar(255) NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, 'App\\Models\\User', 'A001', 'auth_token', 'e1e018778f694c50412f8356ff803b6ccb3a0a32ed8667005df88ecbaecdd4c2', '[\"*\"]', '2026-07-28 11:42:49', NULL, '2026-07-28 11:42:24', '2026-07-28 11:42:49'),
(2, 'App\\Models\\User', 'U001', 'auth_token', 'db0789cd7400c31b2895fa3ebf67e7f857fcd66ffbecf0a4511f3a0581a2bab6', '[\"*\"]', '2026-07-28 11:45:59', NULL, '2026-07-28 11:44:56', '2026-07-28 11:45:59'),
(3, 'App\\Models\\User', 'U002', 'auth_token', '6a5beddb475a611d6f3e3db315a829e1587eeed986cd19ce4bf29d733c8dfbe2', '[\"*\"]', '2026-07-28 11:47:03', NULL, '2026-07-28 11:46:56', '2026-07-28 11:47:03'),
(4, 'App\\Models\\User', 'U001', 'auth_token', '9f1ed645b8e85e995405ec1a5a2a14bf1347758404b5b4cc2b7c1a92fb089e71', '[\"*\"]', '2026-07-30 21:42:28', NULL, '2026-07-28 11:47:20', '2026-07-30 21:42:28');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `product_code` varchar(50) NOT NULL,
  `product_name` varchar(150) NOT NULL,
  `brand` varchar(100) NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 0,
  `reorder_level` int(11) NOT NULL DEFAULT 10,
  `status` varchar(20) NOT NULL,
  `category_id` varchar(50) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`product_code`, `product_name`, `brand`, `unit_price`, `quantity`, `reorder_level`, `status`, `category_id`, `created_at`, `updated_at`) VALUES
('P001', 'Laptop', 'Dell', 250000.00, 20, 10, 'Available', 'CAT-ELECTRONIC', '2026-07-28 11:48:26', '2026-07-28 12:24:10'),
('P002', 'Phone', 'Samsung', 7500.00, 6, 10, 'Active', 'CAT-ELECTRONICS', '2026-07-28 11:49:31', '2026-07-28 11:49:31'),
('P003', 'table', 'Damro', 15000.00, 9, 10, 'Available', 'CAT-FURNITURE', '2026-07-30 21:34:32', '2026-07-30 21:39:14');

-- --------------------------------------------------------

--
-- Table structure for table `purchase_orders`
--

CREATE TABLE `purchase_orders` (
  `po_number` varchar(50) NOT NULL,
  `order_date` date NOT NULL,
  `expected_date` date NOT NULL,
  `total_amount` decimal(12,2) NOT NULL,
  `tax` decimal(10,2) NOT NULL,
  `status` varchar(20) NOT NULL,
  `magic_token` varchar(80) DEFAULT NULL,
  `supplier_id` varchar(50) NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `purchase_orders`
--

INSERT INTO `purchase_orders` (`po_number`, `order_date`, `expected_date`, `total_amount`, `tax`, `status`, `magic_token`, `supplier_id`, `user_id`, `created_at`, `updated_at`) VALUES
('PO-0001', '2026-07-28', '2026-07-31', 267500.00, 10000.00, 'Shipped', 'XQCFtFI6SwPxQaAhCwQ5EBUskxn1xVIOksdFRnMm', 'SUP001', 1, '2026-07-28 12:22:26', '2026-07-28 12:27:43');

-- --------------------------------------------------------

--
-- Table structure for table `purchase_order_items`
--

CREATE TABLE `purchase_order_items` (
  `po_item_id` bigint(20) UNSIGNED NOT NULL,
  `po_number` varchar(50) NOT NULL,
  `product_code` varchar(50) NOT NULL,
  `quantity` int(11) NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `total` decimal(12,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `purchase_order_items`
--

INSERT INTO `purchase_order_items` (`po_item_id`, `po_number`, `product_code`, `quantity`, `unit_price`, `total`, `created_at`, `updated_at`) VALUES
(1, 'PO-0001', 'P001', 1, 250000.00, 250000.00, '2026-07-28 12:22:26', '2026-07-28 12:22:26'),
(2, 'PO-0001', 'P002', 1, 7500.00, 7500.00, '2026-07-28 12:22:26', '2026-07-28 12:22:26');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('BOWrY6VpeABr5m9tZ9CjBhjFqJSm0eZ222JBjYY1', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMEJxZGtDcnBhV1kzcHE4N1FqUGVaU0YzeFV1MGg1MENvcE12TlNuSyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1785466910);

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE `settings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `reorder_level` int(11) NOT NULL DEFAULT 10,
  `currency_code` varchar(255) NOT NULL DEFAULT 'LKR (Rs.)',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `stock_transactions`
--

CREATE TABLE `stock_transactions` (
  `transaction_id` varchar(50) NOT NULL,
  `batch_no` varchar(50) NOT NULL,
  `quantity` int(11) NOT NULL,
  `unit_cost` decimal(10,2) NOT NULL,
  `total_cost` decimal(12,2) NOT NULL,
  `date` datetime NOT NULL,
  `status` varchar(20) NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `product_code` varchar(50) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `stock_transactions`
--

INSERT INTO `stock_transactions` (`transaction_id`, `batch_no`, `quantity`, `unit_cost`, `total_cost`, `date`, `status`, `user_id`, `product_code`, `created_at`, `updated_at`) VALUES
('TRN-001-P001', 'BAT-P001-20260728-2323', 10, 250000.00, 2500000.00, '2026-07-28 00:00:00', 'Stock In', 1, 'P001', '2026-07-28 12:24:10', '2026-07-28 12:24:10'),
('TRN-002-P003', 'BAT-P003-20260731-0835', 5, 15000.00, 75000.00, '2026-07-31 00:00:00', 'Stock In', 1, 'P003', '2026-07-30 21:36:01', '2026-07-30 21:36:01'),
('TRN-004-P003', 'BAT-P003-20260731-0836', 1, 15000.00, 15000.00, '2026-07-31 00:00:00', 'Stock Out', 1, 'P003', '2026-07-30 21:36:38', '2026-07-30 21:36:38'),
('TRN-005-P003', 'BAT-P003-20260731-0837', 5, 15000.00, 75000.00, '2026-07-31 00:00:00', 'Stock Out', 1, 'P003', '2026-07-30 21:39:14', '2026-07-30 21:39:14');

-- --------------------------------------------------------

--
-- Table structure for table `suppliers`
--

CREATE TABLE `suppliers` (
  `supplier_id` varchar(50) NOT NULL,
  `supplier_name` varchar(150) NOT NULL,
  `contact_person` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `email` varchar(100) NOT NULL,
  `address` text NOT NULL,
  `status` varchar(20) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `suppliers`
--

INSERT INTO `suppliers` (`supplier_id`, `supplier_name`, `contact_person`, `phone`, `email`, `address`, `status`, `created_at`, `updated_at`) VALUES
('SUP001', 'Alphalec.pvt', 'Samantha Perera', '0112344666', 'info@alphaelec.lk', 'No.5,Colombo', 'Active', '2026-07-28 12:19:25', '2026-07-28 12:19:25'),
('SUP002', 'ABC.pvt', 'Kamal Perera', '0756765783', 'abc@gmail.com', 'N0.5,Colomo', 'Active', '2026-07-28 12:20:37', '2026-07-28 12:20:37');

-- --------------------------------------------------------

--
-- Table structure for table `supplier_products`
--

CREATE TABLE `supplier_products` (
  `supplier_id` varchar(50) NOT NULL,
  `product_code` varchar(50) NOT NULL,
  `supplied_date` date NOT NULL,
  `status` varchar(20) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `support_tickets`
--

CREATE TABLE `support_tickets` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_email` varchar(255) NOT NULL,
  `request_type` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Pending',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `role` varchar(30) NOT NULL DEFAULT 'Staff',
  `status` varchar(20) NOT NULL DEFAULT 'Active',
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `user_id`, `first_name`, `last_name`, `name`, `email`, `role`, `status`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'U001', NULL, NULL, 'System Admin', 'admin@gmail.com', 'Admin', 'Active', NULL, '$2y$12$wLTF25w.s03XOnCOWuCq..bYGkI7LfcGhctnMyiFXSfiJhpZZv/eu', NULL, '2026-07-28 11:40:49', '2026-07-28 11:42:49'),
(2, 'U002', NULL, NULL, 'Manager', 'manager@gmail.com', 'Manager', 'Active', NULL, '$2y$12$x2n4qztlW/A3k.Q2H.Yr5uBg7Kk4Y91N2AmAXVYhdluMzckxOe.N2', NULL, '2026-07-28 11:45:56', '2026-07-28 11:45:56');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_expiration_index` (`expiration`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_locks_expiration_index` (`expiration`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`category_id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`product_code`),
  ADD KEY `products_category_id_foreign` (`category_id`);

--
-- Indexes for table `purchase_orders`
--
ALTER TABLE `purchase_orders`
  ADD PRIMARY KEY (`po_number`),
  ADD UNIQUE KEY `purchase_orders_magic_token_unique` (`magic_token`),
  ADD KEY `purchase_orders_supplier_id_foreign` (`supplier_id`),
  ADD KEY `purchase_orders_user_id_foreign` (`user_id`);

--
-- Indexes for table `purchase_order_items`
--
ALTER TABLE `purchase_order_items`
  ADD PRIMARY KEY (`po_item_id`),
  ADD KEY `purchase_order_items_po_number_foreign` (`po_number`),
  ADD KEY `purchase_order_items_product_code_foreign` (`product_code`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `stock_transactions`
--
ALTER TABLE `stock_transactions`
  ADD PRIMARY KEY (`transaction_id`),
  ADD KEY `stock_transactions_user_id_foreign` (`user_id`),
  ADD KEY `stock_transactions_product_code_foreign` (`product_code`);

--
-- Indexes for table `suppliers`
--
ALTER TABLE `suppliers`
  ADD PRIMARY KEY (`supplier_id`);

--
-- Indexes for table `supplier_products`
--
ALTER TABLE `supplier_products`
  ADD PRIMARY KEY (`supplier_id`,`product_code`),
  ADD KEY `supplier_products_product_code_foreign` (`product_code`);

--
-- Indexes for table `support_tickets`
--
ALTER TABLE `support_tickets`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_user_id_unique` (`user_id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `purchase_order_items`
--
ALTER TABLE `purchase_order_items`
  MODIFY `po_item_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `settings`
--
ALTER TABLE `settings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `support_tickets`
--
ALTER TABLE `support_tickets`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE CASCADE;

--
-- Constraints for table `purchase_orders`
--
ALTER TABLE `purchase_orders`
  ADD CONSTRAINT `purchase_orders_supplier_id_foreign` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`supplier_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `purchase_orders_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `purchase_order_items`
--
ALTER TABLE `purchase_order_items`
  ADD CONSTRAINT `purchase_order_items_po_number_foreign` FOREIGN KEY (`po_number`) REFERENCES `purchase_orders` (`po_number`) ON DELETE CASCADE,
  ADD CONSTRAINT `purchase_order_items_product_code_foreign` FOREIGN KEY (`product_code`) REFERENCES `products` (`product_code`) ON DELETE CASCADE;

--
-- Constraints for table `stock_transactions`
--
ALTER TABLE `stock_transactions`
  ADD CONSTRAINT `stock_transactions_product_code_foreign` FOREIGN KEY (`product_code`) REFERENCES `products` (`product_code`) ON DELETE CASCADE,
  ADD CONSTRAINT `stock_transactions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `supplier_products`
--
ALTER TABLE `supplier_products`
  ADD CONSTRAINT `supplier_products_product_code_foreign` FOREIGN KEY (`product_code`) REFERENCES `products` (`product_code`) ON DELETE CASCADE,
  ADD CONSTRAINT `supplier_products_supplier_id_foreign` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`supplier_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
