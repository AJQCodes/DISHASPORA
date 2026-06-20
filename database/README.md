# Dishaspora Database

## Overview
This folder contains the complete PostgreSQL database schema and seed data for the Dishaspora mobile application — a culturally inclusive food ecosystem combining recipe discovery, nutrition awareness, a local marketplace, and premium cooking support.

**Institution:** Kwame Nkrumah University of Science and Technology
**Department:** Computer Science
**Group:** Group 12
**Event:** CodeQuest 2026

---

## Folder Structure
---

## How to Set Up the Database

### Prerequisites
- PostgreSQL installed and running
- A database created named `dishaspora`

### Step 1 — Run schema files in order
Open pgAdmin, select your `dishaspora` database, open the Query Tool and run each file in this exact order:

| Order | File | Tables Created |
|-------|------|----------------|
| 1 | 001_create_countries.sql | countries |
| 2 | 002_create_categories.sql | categories |
| 3 | 003_create_users.sql | users |
| 4 | 004_create_vendor_profiles.sql | vendor_profiles, vendor_documents |
| 5 | 005_create_recipes.sql | recipes, recipe_ingredients, recipe_steps, recipe_media, saved_recipes |
| 6 | 006_create_food_listings.sql | food_listings, ingredient_listings |
| 7 | 007_create_orders.sql | cart_items, orders, order_items |
| 8 | 008_create_subscriptions.sql | subscription_plans, user_subscriptions |
| 9 | 009_create_reviews.sql | reviews |
| 10 | 010_create_admin_actions.sql | admin_actions, content_flags |
| 11 | 011_create_notifications.sql | notifications, chat_messages |

### Step 2 — Run seed files
After all schema files have run successfully, seed the lookup tables:

| File | Data Inserted |
|------|---------------|
| seed_countries_and_categories.sql | 195 countries, 4 categories |

---

## Table Summary

### Authentication / User Service
| Table | Description |
|-------|-------------|
| users | Core identity and credentials for all users, vendors, and admins |
| vendor_profiles | Business profile extending a user into a vendor |
| vendor_documents | Supporting documents uploaded during vendor registration |

### Recipe Service
| Table | Description |
|-------|-------------|
| recipes | Core recipe content with nutrition data and approval status |
| recipe_ingredients | Ingredient list per recipe |
| recipe_steps | Step-by-step cooking instructions per recipe |
| recipe_media | Images, videos, and audio guides attached to a recipe |
| saved_recipes | Recipes bookmarked by users |

### Lookup Tables
| Table | Description |
|-------|-------------|
| countries | All 195 countries. is_active controls platform availability |
| categories | Recipe categories: Local Dishes, Continental, Foreign Dishes, Drinks |

### Marketplace Service
| Table | Description |
|-------|-------------|
| food_listings | Prepared meals listed for sale by vendors |
| ingredient_listings | Raw ingredients listed for sale by vendors |

### Order Service
| Table | Description |
|-------|-------------|
| cart_items | Items in a user's active cart before checkout |
| orders | Confirmed orders — one order per vendor |
| order_items | Line items belonging to an order |

### Subscription Service
| Table | Description |
|-------|-------------|
| subscription_plans | Available subscription tiers and their features |
| user_subscriptions | Links a user to a plan with validity and billing info |

### Reviews
| Table | Description |
|-------|-------------|
| reviews | Ratings and comments targeting either a recipe or a vendor |

### Admin Service
| Table | Description |
|-------|-------------|
| admin_actions | Audit trail of every admin decision on the platform |
| content_flags | Flagged content feeding into the moderation queue |

### Notifications / Chat
| Table | Description |
|-------|-------------|
| notifications | System alerts sent to users — drives the bell icon screen |
| chat_messages | Premium cooking support conversations between users and vendors |

---

## Key Design Decisions

**UUIDs as primary keys** — Used for all user-facing tables to ensure global uniqueness across microservices without ID collisions.

**SMALLSERIAL for lookup tables** — Countries and categories use small auto-incrementing integers since they have a fixed, small number of rows.

**Country-based filtering** — Almost every table references country_id to enforce the same-country transaction restriction described in the proposal.

**Approval workflow** — Vendors, recipes, and listings all have an approval_status column that feeds into the admin moderation queue.

**Price snapshotting** — order_items stores unit_price at the time of purchase so historical orders are unaffected by future listing price changes.

**Polymorphic references** — Tables like order_items, cart_items, and reviews use two nullable foreign keys with a CHECK constraint ensuring exactly one is filled per row.

**Cached rating fields** — average_rating and review_count are cached on recipes and vendor_profiles for fast display without expensive joins on every page load.

---

## Group Members
| Index No. | Student No. | Name | Role |
|-----------|-------------|------|------|
| 21120543 | 6181524 | QUAYE Ann-Janelle Naa Ahimah | DATABASE
| 21120828 | 6163124 | JAMALDEEN Hikmat Ajaansuma | INTEGRATION AND PAYMENTS
| 21121154 | 6141424 | ANTOBRE Rebecca Frimpomaa | UI/UX & STYLE
| 21121437 | 6170424 | NIMAKO Afia Pokua | FRONTEND
| 21121635 | 6127124 | ADDAI Christabel | BACKEND