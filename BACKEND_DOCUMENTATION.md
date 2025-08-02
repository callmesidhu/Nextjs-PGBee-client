# PGBee Server Backend Documentation

## Overview
PGBee is a backend server for a hostel booking application, built with Node.js, Express, TypeScript, Sequelize (PostgreSQL), and Passport.js for authentication. It provides RESTful APIs for user management, hostel listings, amenities, reviews, enquiries, and authentication (including Google OAuth).

---

## Project Structure
```
db/                # Database config, migrations, seeders
src/
  app.ts           # Express app setup
  index.ts         # Entry point
  swagger.json     # OpenAPI spec
  config/
    passport.ts    # Passport.js config
  controllers/     # Route handlers (business logic)
  middlewares/     # Express middlewares (auth, error, logging)
  models/          # Sequelize models (ORM)
  routes/          # Express routers (API endpoints)
  types/           # TypeScript types
  utils/           # Utilities (logger, docs, response handler, etc.)
  views/           # EJS templates
Dockerfile         # Docker setup
nginx.conf         # Nginx reverse proxy config
package.json       # Dependencies & scripts
```

---

## Database
- **PostgreSQL** is used as the database.
- **Sequelize** ORM manages models, migrations, and relations.
- Configuration is in `db/config/config.js` (uses environment variables).
- Migrations are in `db/migrations/` (e.g., `create-user-table.cjs`).
- Models are in `src/models/` (User, Owner, Student, Hostel, Review, Ammenities, Enquiry, Role).
- Relations are defined in `src/models/relations.ts`.

---

## Models
- **User**: id, name, email, password, roleId, timestamps
- **Owner**: id, userId, owner-specific fields
- **Student**: id, userId, student-specific fields
- **Hostel**: id, hostelName, phone, address, curfew, location, rent, gender, bedrooms, bathrooms, userId, timestamps
- **Review**: id, userId, hostelId, rating, text, image, date
- **Ammenities**: id, hostelId, wifi, ac, kitchen, parking, laundry, tv, firstAid, workspace, security, etc.
- **Enquiry**: id, studentId, hostelId, enquiry
- **Role**: id, name

---

## Authentication
- **JWT-based authentication** for API endpoints.
- **Google OAuth** via Passport.js (`src/config/passport.ts`, `google-auth-controller.ts`).
- Auth middlewares in `src/middlewares/auth-middleware.ts`.
- Session management via `express-session`.

---

## API Endpoints
- **Auth**: `/auth/signup`, `/auth/login`, `/auth/logout`, `/auth/google`, `/auth/google/callback`, `/auth/token/refresh`
- **Hostel**: `/hostel/` (CRUD), `/hostel/user` (owner's hostels)
- **Student**: `/student/` (CRUD)
- **Owner**: `/owners/` (CRUD)
- **Review**: `/review/` (CRUD), `/review/user`, `/review/hostel/:id`
- **Ammenities**: `/ammenities/` (CRUD), `/ammenities/:id`
- **Enquiry**: `/enquiry/` (CRUD), `/enquiry/hostel/:id`, `/enquiry/student/:id`
- **Docs**: `/docs` (Rapidoc UI), `/api-spec` (OpenAPI JSON)

---

## Middlewares
- **Authorization**: Checks JWT and user roles.
- **Error Handling**: Centralized error handler for all routes.
- **Request Logger**: Logs incoming requests.
- **Async Handler**: Wraps async route handlers for error propagation.

---

## Utilities
- **Logger**: Centralized logging utility (`src/utils/logger.ts`).
- **ResponseHandler**: Standardizes API responses (`src/utils/response-handler.ts`).
- **Docs**: Serves Rapidoc UI for API documentation (`src/utils/docs.ts`).
- **API Spec**: Serves OpenAPI spec (`src/utils/api-spec.ts`).
- **Seed**: Seeds database with sample data (`src/utils/seed.ts`).
- **Sequelize**: Database connection utility (`src/utils/sequelize.ts`).

---

## Configuration
- **Environment Variables**: Managed via `.env` (see `.env.example`).
- **Session Secret**: Required for session management.
- **JWT Secret**: Required for authentication.
- **Database Credentials**: Required for Sequelize.

---

## Deployment
- **Docker**: Containerizes the backend (`Dockerfile`).
- **Nginx**: Reverse proxy and SSL termination (`nginx.conf`).
- **docker-compose.yaml**: Orchestrates services (backend, database, nginx).

---

## API Documentation
- **OpenAPI Spec**: `src/swagger.json` describes all endpoints, request/response schemas, authentication, and error codes.
- **Rapidoc UI**: Accessible at `/docs` for interactive API exploration.

---

## Scripts
- `npm run dev` / `pnpm dev`: Start server in development mode
- `npm run build`: Compile TypeScript
- `npm start`: Run compiled server
- `npm run seed`: Seed database
- `npm run db:create`: Create database
- `npm run db:migrate`: Run migrations
- `npm run lint`: Lint code

---

## Dependencies
- **express**: Web framework
- **sequelize**: ORM
- **passport**: Authentication
- **jsonwebtoken**: JWT handling
- **express-session**: Session management
- **zod**: Validation
- **@faker-js/faker**: Data seeding
- **ejs**: Templating
- **dotenv**: Env vars
- **cors**: CORS support
- **cookie-parser**: Cookie handling
- **swagger-jsdoc**, **swagger-ui-express**, **rapidoc**: API docs

---

## How to Run
1. Install dependencies: `pnpm install` or `npm install`
2. Set up `.env` with required secrets and DB credentials
3. Run migrations: `pnpm db:migrate`
4. Seed database: `pnpm run seed`
5. Start server: `pnpm dev` (development) or `pnpm start` (production)
6. Access API docs at `http://localhost:<PORT>/docs`

---

## Additional Notes
- All API endpoints are protected by JWT except `/auth` and `/docs`.
- Google OAuth requires proper setup in Google Developer Console.
- Error handling is centralized; all errors return standardized JSON responses.
- Database relations are enforced via Sequelize associations.
- For full API details, see `src/swagger.json` or `/docs` endpoint.

---

## Contact
For support, contact: [support@pgbee.com](mailto:support@pgbee.com)
