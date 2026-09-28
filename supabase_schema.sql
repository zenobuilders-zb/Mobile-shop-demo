-- Mobile Shop Manager V1 - Supabase PostgreSQL schema
create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  avatar_url text,
  created_at timestamptz default now()
);

create table if not exists public.shops (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  phone text,
  address text,
  gstin text,
  logo_url text,
  currency text default 'INR',
  created_at timestamptz default now()
);

create table if not exists public.staff (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references public.shops(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null default 'staff' check (role in ('owner','manager','cashier','staff')),
  created_at timestamptz default now(),
  unique(shop_id,user_id)
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references public.shops(id) on delete cascade,
  name text not null,
  type text default 'product',
  created_at timestamptz default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references public.shops(id) on delete cascade,
  category_id uuid references public.categories(id) on delete set null,
  brand text,
  name text not null,
  model text,
  description text,
  image_url text,
  track_imei boolean default false,
  active boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  variant_name text not null,
  purchase_price numeric(12,2) default 0,
  selling_price numeric(12,2) default 0,
  mrp numeric(12,2) default 0,
  stock_quantity integer default 0,
  low_stock_threshold integer default 2,
  created_at timestamptz default now()
);

create table if not exists public.inventory_items (
  id uuid primary key default gen_random_uuid(),
  variant_id uuid not null references public.product_variants(id) on delete cascade,
  imei_1 text unique,
  imei_2 text,
  serial_number text,
  status text default 'in_stock' check (status in ('in_stock','sold','returned','damaged')),
  purchase_date date,
  sold_at timestamptz
);

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references public.shops(id) on delete cascade,
  name text not null,
  phone text,
  email text,
  address text,
  notes text,
  created_at timestamptz default now()
);

create table if not exists public.sales (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references public.shops(id) on delete cascade,
  customer_id uuid references public.customers(id) on delete set null,
  invoice_number text not null,
  subtotal numeric(12,2) default 0,
  discount numeric(12,2) default 0,
  tax numeric(12,2) default 0,
  total numeric(12,2) default 0,
  status text default 'completed' check (status in ('completed','cancelled','returned')),
  sold_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now(),
  unique(shop_id, invoice_number)
);

create table if not exists public.sale_items (
  id uuid primary key default gen_random_uuid(),
  sale_id uuid not null references public.sales(id) on delete cascade,
  variant_id uuid not null references public.product_variants(id),
  inventory_item_id uuid references public.inventory_items(id),
  quantity integer not null default 1,
  unit_price numeric(12,2) default 0,
  discount numeric(12,2) default 0,
  total numeric(12,2) default 0
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  sale_id uuid not null references public.sales(id) on delete cascade,
  method text not null check (method in ('cash','upi','card','bank_transfer','credit','split')),
  amount numeric(12,2) not null default 0,
  reference_number text,
  status text default 'paid',
  paid_at timestamptz default now()
);

create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references public.shops(id) on delete cascade,
  category text not null,
  description text,
  amount numeric(12,2) not null default 0,
  expense_date date default current_date,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.shops enable row level security;
alter table public.staff enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.inventory_items enable row level security;
alter table public.customers enable row level security;
alter table public.sales enable row level security;
alter table public.sale_items enable row level security;
alter table public.payments enable row level security;
alter table public.expenses enable row level security;

-- Helper: whether current user belongs to a shop
create or replace function public.is_shop_member(target_shop uuid)
returns boolean language sql stable security definer set search_path=public as $$
  select exists (
    select 1 from public.staff s
    where s.shop_id = target_shop and s.user_id = auth.uid()
  );
$$;

-- Basic policies
create policy "profile self read" on public.profiles for select using (id=auth.uid());
create policy "profile self update" on public.profiles for update using (id=auth.uid());
create policy "shop members read shops" on public.shops for select using (owner_id=auth.uid() or public.is_shop_member(id));
create policy "owner manages shops" on public.shops for all using (owner_id=auth.uid()) with check (owner_id=auth.uid());

create policy "members read staff" on public.staff for select using (public.is_shop_member(shop_id));
create policy "members read categories" on public.categories for select using (public.is_shop_member(shop_id));
create policy "members manage categories" on public.categories for all using (public.is_shop_member(shop_id)) with check (public.is_shop_member(shop_id));

create policy "members read products" on public.products for select using (public.is_shop_member(shop_id));
create policy "members manage products" on public.products for all using (public.is_shop_member(shop_id)) with check (public.is_shop_member(shop_id));

create policy "members read customers" on public.customers for select using (public.is_shop_member(shop_id));
create policy "members manage customers" on public.customers for all using (public.is_shop_member(shop_id)) with check (public.is_shop_member(shop_id));

create policy "members read sales" on public.sales for select using (public.is_shop_member(shop_id));
create policy "members manage sales" on public.sales for all using (public.is_shop_member(shop_id)) with check (public.is_shop_member(shop_id));

create policy "members read expenses" on public.expenses for select using (public.is_shop_member(shop_id));
create policy "members manage expenses" on public.expenses for all using (public.is_shop_member(shop_id)) with check (public.is_shop_member(shop_id));

-- Variants, inventory, sale_items and payments are protected through parent relationships.
create policy "members read variants" on public.product_variants for select using (
  exists(select 1 from public.products p where p.id=product_id and public.is_shop_member(p.shop_id))
);
create policy "members manage variants" on public.product_variants for all using (
  exists(select 1 from public.products p where p.id=product_id and public.is_shop_member(p.shop_id))
) with check (
  exists(select 1 from public.products p where p.id=product_id and public.is_shop_member(p.shop_id))
);

create policy "members read inventory" on public.inventory_items for select using (
  exists(select 1 from public.product_variants v join public.products p on p.id=v.product_id where v.id=variant_id and public.is_shop_member(p.shop_id))
);
create policy "members manage inventory" on public.inventory_items for all using (
  exists(select 1 from public.product_variants v join public.products p on p.id=v.product_id where v.id=variant_id and public.is_shop_member(p.shop_id))
) with check (
  exists(select 1 from public.product_variants v join public.products p on p.id=v.product_id where v.id=variant_id and public.is_shop_member(p.shop_id))
);

create policy "members read sale items" on public.sale_items for select using (
  exists(select 1 from public.sales s where s.id=sale_id and public.is_shop_member(s.shop_id))
);
create policy "members manage sale items" on public.sale_items for all using (
  exists(select 1 from public.sales s where s.id=sale_id and public.is_shop_member(s.shop_id))
) with check (
  exists(select 1 from public.sales s where s.id=sale_id and public.is_shop_member(s.shop_id))
);

create policy "members read payments" on public.payments for select using (
  exists(select 1 from public.sales s where s.id=sale_id and public.is_shop_member(s.shop_id))
);
create policy "members manage payments" on public.payments for all using (
  exists(select 1 from public.sales s where s.id=sale_id and public.is_shop_member(s.shop_id))
) with check (
  exists(select 1 from public.sales s where s.id=sale_id and public.is_shop_member(s.shop_id))
);
