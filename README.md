# Dishaspora Backend — Spring Boot API

> KNUST · Computer Science · CodeQuest 2026 · Group 12

---

## Tech Stack
- **Java 17** + **Spring Boot 3.2**
- **Spring Security** + **JWT**
- **Spring Data JPA** + **PostgreSQL**
- **Maven**
- **Lombok**

---

## Prerequisites

1. **Java 17+** — download from https://adoptium.net
2. **Maven 3.9+** — download from https://maven.apache.org
3. **PostgreSQL 14+** — download from https://postgresql.org

---

## Database Setup

```sql
-- Open psql or pgAdmin and run:
CREATE DATABASE dishaspora;
CREATE USER postgres WITH PASSWORD 'postgres';
GRANT ALL PRIVILEGES ON DATABASE dishaspora TO postgres;
```

Or use pgAdmin (GUI) if you prefer.

---

## Configuration

Edit `src/main/resources/application.properties` if your DB credentials differ:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/dishaspora
spring.datasource.username=postgres
spring.datasource.password=postgres
```

---

## Run the Backend

```bash
# From the dishaspora-backend/ folder:

# Build
mvn clean install -DskipTests

# Run
mvn spring-boot:run
```

The API starts on **http://localhost:8080**

---

## Auto-seeded on First Run

When you start the app, it automatically creates:

| What           | Value                          |
|----------------|--------------------------------|
| Admin email    | admin@dishaspora.com           |
| Admin password | admin123                       |
| Sample recipes | Jollof Rice, Waakye, Sushi... |

---

## API Endpoints

### Auth (public)
```
POST /api/auth/register    { name, email, password, country }
POST /api/auth/login       { email, password }  → { token, user }
GET  /api/auth/me          (requires Bearer token)
```

### Recipes (public GET, auth POST)
```
GET  /api/recipes                   ?category=local&country=GH
GET  /api/recipes/popular
GET  /api/recipes/search            ?q=jollof
GET  /api/recipes/{id}
POST /api/recipes                   (VENDOR or ADMIN only)
PUT  /api/recipes/{id}              (VENDOR or ADMIN only)
DELETE /api/recipes/{id}            (ADMIN only)
```

### Marketplace (public GET, auth POST)
```
GET  /api/marketplace/vendors       ?country=GH
GET  /api/marketplace/vendors/{id}
POST /api/marketplace/vendors/register
POST /api/marketplace/orders
GET  /api/marketplace/orders/my
```

### Nutrition (auth required)
```
GET  /api/nutrition/today
POST /api/nutrition/log             { recipeId, servings, mealType }
GET  /api/nutrition/history         ?days=7
```

### Admin (ADMIN role only)
```
GET  /api/admin/stats
GET  /api/admin/vendors/pending
POST /api/admin/vendors/{id}/approve
POST /api/admin/vendors/{id}/reject  { reason }
GET  /api/admin/recipes/pending
POST /api/admin/recipes/{id}/approve
POST /api/admin/recipes/{id}/reject
```

---

## Testing with Postman

1. **Register**: `POST /api/auth/register`
2. **Login**: `POST /api/auth/login` — copy the `token`
3. **Add header** to protected requests: `Authorization: Bearer <token>`
4. **Admin login**: `admin@dishaspora.com` / `admin123`

---

## Project Structure

```
dishaspora-backend/
├── pom.xml
└── src/main/java/com/dishaspora/
    ├── DishasporaApplication.java      ← entry point
    ├── config/
    │   ├── SecurityConfig.java         ← CORS, JWT filter, role rules
    │   ├── GlobalExceptionHandler.java ← clean error responses
    │   └── DataSeeder.java             ← seeds admin + recipes on startup
    ├── controller/
    │   ├── AuthController.java
    │   ├── RecipeController.java
    │   ├── MarketplaceController.java
    │   ├── NutritionController.java
    │   └── AdminController.java
    ├── service/
    │   ├── AuthService.java
    │   ├── RecipeService.java
    │   ├── VendorService.java
    │   ├── NutritionService.java
    │   └── AdminService.java
    ├── entity/
    │   ├── User.java
    │   ├── Recipe.java
    │   ├── Vendor.java
    │   └── MarketplaceEntities.java
    ├── repository/
    │   ├── UserRepository.java
    │   └── RecipeRepository.java
    ├── security/
    │   ├── JwtService.java
    │   └── JwtAuthFilter.java
    └── dto/
        └── AuthDtos.java
```
