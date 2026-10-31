# Hotel Booking System

A web-based hotel booking and management system. Guests can search availability and book a room online, while staff manage rooms, bookings, payments and reports from a role-based admin area.

## Features

**Guests**
- Browse room types and search availability by date
- Submit a booking request and receive an email confirmation
- Look up, manage or cancel a booking using a booking reference

**Staff (admin, receptionist, manager)**
- Dashboard with booking and occupancy overview
- Booking workflow: confirm, assign a room, check in, check out, record payment
- Walk-in bookings created at the front desk
- Availability management and a booking calendar
- Guest records
- Reports with PDF and Excel export (admin and manager)
- Room type, room unit and photo management, and user management (admin)

Access is controlled by role:

| Role | Access |
|---|---|
| Admin | Everything, including room types, room units and users |
| Receptionist | Bookings, walk-ins, availability, calendar, guests |
| Manager | Reports, calendar, guests |

## Tech stack

- **Backend:** Laravel 12 (PHP 8.2+), Laravel Sanctum
- **Frontend:** React 18 with Inertia.js, Tailwind CSS, Vite
- **Database:** SQLite by default (any database supported by Laravel works)
- **Exports:** barryvdh/laravel-dompdf, Maatwebsite Excel

## Getting started

Requirements: PHP 8.2 or newer, Composer, Node.js 18 or newer.

```bash
git clone https://github.com/Leslie-24/hotel-booking-system.git
cd hotel-booking-system

composer install
npm install

cp .env.example .env
php artisan key:generate

touch database/database.sqlite
php artisan migrate

npm run build
php artisan serve
```

The app is then available at http://127.0.0.1:8000. For frontend development, run `npm run dev` in a second terminal instead of `npm run build`.

On Windows PowerShell, create the database file with `New-Item database\database.sqlite` and copy the environment file with `Copy-Item .env.example .env`.

### Creating the first admin

Register an account through the application, then promote it:

```bash
php artisan tinker
>>> App\Models\User::where('email', 'you@example.com')->update(['role' => 'admin']);
```

### Email

Booking emails are written to the log by default. To send real mail, set the `MAIL_*` values in `.env`.

## Tests

```bash
php artisan test
```

## Project structure

```
app/Http/Controllers/   Public booking flow and admin controllers
app/Models/             Booking, Room types and units, availability, users
database/migrations/    Database schema
resources/js/Pages/     Inertia pages (Public, Admin, Auth, Profile)
resources/views/        Email and PDF templates
routes/web.php          Application routes and role middleware
```
