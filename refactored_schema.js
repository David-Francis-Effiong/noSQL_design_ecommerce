// Refactored NoSQL Schema Design for E-commerce (MongoDB-based)

/* 
  New Requirements Addressed:
  1. Analytics: Large-scale queries to understand product trends and sales data.
  2. High Availability & Partition Tolerance: Handling user increase via Sharding and Replication.
*/

// Sharding Strategy for High Availability & Partition Tolerance:
// - The system uses a Replica Set configuration (Primary-Secondary-Secondary) to ensure high availability. 
//   If the primary node fails, a secondary node is elected to maintain uptime.
// - Collections are sharded to distribute data and read/write load across multiple nodes.

// 1. Users Collection
// Sharded by `_id` (Hashed) to ensure even distribution of user data across shards.
const userSchema = {
  "_id": "ObjectId", // Shard key (hashed)
  "username": "String",
  "email": "String",
  "password_hash": "String",
  "created_at": "Date"
};
// sh.shardCollection("ecommerce.users", { _id: "hashed" })

// 2. Products Collection
// Sharded by `category` to localize queries that fetch products within a specific category.
// Denormalization: Added `total_sales_count` and `total_revenue` for fast analytics without complex aggregations.
const productSchema = {
  "_id": "ObjectId",
  "name": "String",
  "description": "String",
  "category": "String", // Shard key
  "price": "Decimal128",
  "stock_quantity": "Int32",
  "tags": ["String"],
  
  // Denormalized fields updated asynchronously for analytics:
  "total_sales_count": "Int32",
  "total_revenue": "Decimal128",
  "created_at": "Date"
};
// sh.shardCollection("ecommerce.products", { category: 1 })
// db.products.createIndex({ total_sales_count: -1 }) // Index for trending products

// 3. Orders Collection
// Sharded by `created_at` or `user_id` to distribute write load.
// Denormalization: Added `category` to embedded items to allow sales analysis by category directly from orders.
const orderSchema = {
  "_id": "ObjectId",
  "user_id": "ObjectId",
  "customer_info": {
    "name": "String",
    "email": "String",
    "shipping_address": "String"
  },
  "items": [
    {
      "product_id": "ObjectId",
      "product_name": "String",
      "category": "String", // Denormalized for category-based sales analytics
      "quantity": "Int32",
      "price": "Decimal128"
    }
  ],
  "total_amount": "Decimal128",
  "status": "String",
  "created_at": "Date" // Shard key (e.g., month/year for time-based routing, or hashed for write distribution)
};
// sh.shardCollection("ecommerce.orders", { created_at: 1 })

// 4. Monthly Sales Analytics Collection (Pre-aggregated Data)
// To support large-scale analytical queries instantly, a scheduled job (or MongoDB materialized view) 
// pre-aggregates order data into this collection.
const monthlySalesAnalyticsSchema = {
  "_id": "String", // e.g., "YYYY-MM" like "2026-10"
  "total_revenue": "Decimal128",
  "total_orders": "Int32",
  "category_sales": {
    "Electronics": "Decimal128",
    "Clothing": "Decimal128",
    "Books": "Decimal128"
    // ...other categories
  },
  "last_updated": "Date"
};
