// Initial NoSQL Schema Design for E-commerce (MongoDB-based)

/* 
  Requirements Addressed:
  1. Users can browse and search for products.
  2. Orders are stored with customer info, items, and delivery status.
  3. System supports thousands of transactions per second.
*/

// 1. Users Collection
// Stores user profiles and authentication details.
const userSchema = {
  "_id": "ObjectId",
  "username": "String",
  "email": "String",
  "password_hash": "String",
  "created_at": "Date"
};

// 2. Products Collection
// Optimized for fast lookups and text search.
const productSchema = {
  "_id": "ObjectId",
  "name": "String",
  "description": "String",
  "category": "String",
  "price": "Decimal128",
  "stock_quantity": "Int32",
  "tags": ["String"], // Array of tags to facilitate search
  "created_at": "Date"
};
// Indexes:
// - Text index on 'name' and 'tags' for full-text search capabilities.
// db.products.createIndex({ name: "text", tags: "text" })
// - Index on 'category' for browsing.
// db.products.createIndex({ category: 1 })

// 3. Orders Collection
// Designed to handle high write throughput and ensure customer order data is stored consistently.
// We embed customer info and purchased items at the time of purchase to capture a snapshot.
const orderSchema = {
  "_id": "ObjectId",
  "user_id": "ObjectId", // Reference to the user who placed the order
  "customer_info": {     // Embedded snapshot of customer details for this specific order
    "name": "String",
    "email": "String",
    "shipping_address": "String"
  },
  "items": [             // Embedded array of items purchased
    {
      "product_id": "ObjectId",
      "product_name": "String",
      "quantity": "Int32",
      "price": "Decimal128" // Snapshot of price at the time of purchase
    }
  ],
  "total_amount": "Decimal128",
  "status": "String", // e.g., "Pending", "Processing", "Shipped", "Delivered"
  "created_at": "Date"
};
// Indexes:
// - Index on 'user_id' for quick retrieval of user order history.
// db.orders.createIndex({ user_id: 1 })
// - Index on 'status' and 'created_at' for order management.
// db.orders.createIndex({ status: 1, created_at: -1 })
