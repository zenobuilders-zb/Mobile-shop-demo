# Mobile Shop Manager — V1

A mobile-first prototype for a mobile phone shop.

## Included
- Dashboard
- Products and stock
- Product variants
- IMEI-ready inventory model
- Customers
- POS / New Sale flow
- Invoice completion screen
- Sales history
- Expenses
- Reports
- Shop settings
- Responsive mobile UI
- Supabase PostgreSQL schema with RLS policies

## Run
Open `index.html` in a browser, or deploy the folder to any static host.

## Supabase
Run `supabase_schema.sql` in Supabase SQL Editor, then connect the frontend to Supabase in the next build phase.

## Next production phase
1. Connect Supabase Auth
2. Replace demo state with Supabase queries
3. Add real IMEI scanning
4. Add invoice PDF / WhatsApp sharing
5. Add offline sync
6. Package as Android APK/AAB with Capacitor
