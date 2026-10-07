# NoSQL Database Design for E-Commerce

This repository contains hands-on exercises for designing NoSQL databases based on different requirement views, focusing on scalability, consistency, availability, and specific use case queries.

## Project Deliverables

- **`initial_schema.js`**: The initial NoSQL schema design (MongoDB-based) catering to product browsing, full-text search, and high-throughput order processing.
- **`refactored_schema.js`**: The adapted NoSQL schema design incorporating Sharding, Replication, and Denormalization to meet new requirements for large-scale analytics and High Availability.
- **`reflection_report.md`**: A short report discussing the challenges of the refactor, design decisions, and improvements in scalability, availability, and query performance.

## Core Concepts Addressed

### Part 1: Initial Design
- **Document Model**: Selected MongoDB's document model to natively store hierarchical data, like embedded order items.
- **Fast Lookups & Search**: Employed text indexing on product names and tags to facilitate user browsing.
- **Transactional Writes**: Stored orders as self-contained documents, encapsulating a snapshot of product details and pricing at the time of transaction.

### Part 2: Refactor (Analytics & High Availability)
- **Denormalization**: Added redundant data (e.g., product category inside order items, pre-calculated sales counts) to support fast read operations for analytical queries.
- **Pre-Aggregation**: Introduced a dedicated collection for monthly sales statistics to avoid heavy read computations.
- **Sharding & Replication**: Sharded large collections (`Products`, `Orders`) across multiple nodes to distribute the load and ensure partition tolerance. Utilized replica sets to provide failover and fault tolerance.
