-- LuckyStar Garages initial schema for a shared self-hosted Supabase VPS.
-- Read SHARED_DB_RULES.md before applying this migration.

create schema if not exists luckystar_garage;

create extension if not exists pgcrypto;

create table if not exists luckystar_garage.service_prices (
  id uuid primary key default gen_random_uuid(),
  service_slug text not null,
  service_name text not null,
  category text not null default 'service',
  vehicle_brand text not null default '',
  vehicle_model text not null default '',
  engine_type text not null default '',
  price_min numeric(12,2) not null default 0,
  price_max numeric(12,2),
  currency text not null default 'USD',
  notes text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint service_prices_unique unique (service_slug, vehicle_brand, vehicle_model, engine_type)
);

create table if not exists luckystar_garage.parts_catalog (
  id uuid primary key default gen_random_uuid(),
  part_slug text not null,
  part_name text not null,
  vehicle_brand text not null default '',
  vehicle_model text not null default '',
  engine_type text not null default '',
  price numeric(12,2) not null default 0,
  currency text not null default 'USD',
  stock_status text not null default 'on_order',
  notes text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint parts_catalog_unique unique (part_slug, vehicle_brand, vehicle_model, engine_type)
);

create table if not exists luckystar_garage.quick_replies (
  id uuid primary key default gen_random_uuid(),
  reply_key text not null unique,
  title text not null,
  message text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists luckystar_garage.bot_config (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

create table if not exists luckystar_garage.conversation_sessions (
  id uuid primary key default gen_random_uuid(),
  phone text not null unique,
  customer_name text,
  current_intent text,
  current_step text,
  status text not null default 'active',
  collected_data jsonb not null default '{}'::jsonb,
  last_message_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists luckystar_garage.customer_requests (
  id uuid primary key default gen_random_uuid(),
  phone text not null,
  customer_name text,
  request_type text not null,
  vehicle_brand text,
  vehicle_model text,
  vehicle_year text,
  engine_type text,
  requested_service text,
  requested_part text,
  has_parts text,
  preferred_date text,
  preferred_time text,
  location text,
  summary text not null,
  status text not null default 'new',
  source text not null default 'whatsapp',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists luckystar_garage.messages (
  id uuid primary key default gen_random_uuid(),
  phone text not null,
  direction text not null,
  message_type text not null default 'text',
  text_body text not null,
  intent text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create or replace function luckystar_garage.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists service_prices_set_updated_at on luckystar_garage.service_prices;
create trigger service_prices_set_updated_at
before update on luckystar_garage.service_prices
for each row
execute function luckystar_garage.set_updated_at();

drop trigger if exists parts_catalog_set_updated_at on luckystar_garage.parts_catalog;
create trigger parts_catalog_set_updated_at
before update on luckystar_garage.parts_catalog
for each row
execute function luckystar_garage.set_updated_at();

drop trigger if exists quick_replies_set_updated_at on luckystar_garage.quick_replies;
create trigger quick_replies_set_updated_at
before update on luckystar_garage.quick_replies
for each row
execute function luckystar_garage.set_updated_at();

drop trigger if exists conversation_sessions_set_updated_at on luckystar_garage.conversation_sessions;
create trigger conversation_sessions_set_updated_at
before update on luckystar_garage.conversation_sessions
for each row
execute function luckystar_garage.set_updated_at();

drop trigger if exists customer_requests_set_updated_at on luckystar_garage.customer_requests;
create trigger customer_requests_set_updated_at
before update on luckystar_garage.customer_requests
for each row
execute function luckystar_garage.set_updated_at();

alter table luckystar_garage.service_prices enable row level security;
alter table luckystar_garage.parts_catalog enable row level security;
alter table luckystar_garage.quick_replies enable row level security;
alter table luckystar_garage.bot_config enable row level security;
alter table luckystar_garage.conversation_sessions enable row level security;
alter table luckystar_garage.customer_requests enable row level security;
alter table luckystar_garage.messages enable row level security;

grant usage on schema luckystar_garage to anon, authenticated, service_role;
grant all on all tables in schema luckystar_garage to service_role;
grant all on all sequences in schema luckystar_garage to service_role;

create policy "service_role_full_service_prices"
on luckystar_garage.service_prices
for all
to service_role
using (true)
with check (true);

create policy "service_role_full_parts_catalog"
on luckystar_garage.parts_catalog
for all
to service_role
using (true)
with check (true);

create policy "service_role_full_quick_replies"
on luckystar_garage.quick_replies
for all
to service_role
using (true)
with check (true);

create policy "service_role_full_bot_config"
on luckystar_garage.bot_config
for all
to service_role
using (true)
with check (true);

create policy "service_role_full_conversation_sessions"
on luckystar_garage.conversation_sessions
for all
to service_role
using (true)
with check (true);

create policy "service_role_full_customer_requests"
on luckystar_garage.customer_requests
for all
to service_role
using (true)
with check (true);

create policy "service_role_full_messages"
on luckystar_garage.messages
for all
to service_role
using (true)
with check (true);

create policy "deny_anon_service_prices"
on luckystar_garage.service_prices
for all
to anon
using (false)
with check (false);

create policy "deny_anon_parts_catalog"
on luckystar_garage.parts_catalog
for all
to anon
using (false)
with check (false);

create policy "deny_anon_quick_replies"
on luckystar_garage.quick_replies
for all
to anon
using (false)
with check (false);

create policy "deny_anon_bot_config"
on luckystar_garage.bot_config
for all
to anon
using (false)
with check (false);

create policy "deny_anon_conversation_sessions"
on luckystar_garage.conversation_sessions
for all
to anon
using (false)
with check (false);

create policy "deny_anon_customer_requests"
on luckystar_garage.customer_requests
for all
to anon
using (false)
with check (false);

create policy "deny_anon_messages"
on luckystar_garage.messages
for all
to anon
using (false)
with check (false);

insert into luckystar_garage.quick_replies (reply_key, title, message)
values
  ('greeting', 'Welcome message', 'Good day sir/madam. Welcome to LuckyStar Garages. Reply with a number or type what you want: 1. Car service 2. Mechanic assessment / diagnosis 3. Spare parts 4. Prices 5. Location / working hours 6. Talk to a person'),
  ('location', 'Location and hours', 'LuckyStar Garages is available during our posted working hours. Share your preferred date and we will confirm availability.'),
  ('human_handoff', 'Human handoff', 'Thank you. A team member from LuckyStar Garages will reach out to you shortly.')
on conflict (reply_key) do nothing;

insert into luckystar_garage.bot_config (key, value)
values
  ('business_name', 'LuckyStar Garages'),
  ('business_hours', 'Mon-Sat 8:00 AM - 5:30 PM'),
  ('quote_note', 'Exact prices may change depending on model, engine, and parts availability.')
on conflict (key) do nothing;

insert into luckystar_garage.service_prices (
  service_slug,
  service_name,
  category,
  vehicle_brand,
  vehicle_model,
  price_min,
  price_max,
  notes
)
values
  ('minor-service', 'Minor service', 'service', 'Toyota', '', 45, 80, 'Labour estimate before parts'),
  ('major-service', 'Major service', 'service', 'Toyota', '', 85, 150, 'Labour estimate before parts'),
  ('diagnostic-assessment', 'Diagnostic assessment', 'assessment', '', '', 25, 45, 'Inspection fee'),
  ('brake-service', 'Brake service', 'service', '', '', 35, 90, 'Depends on pads, discs and sensors')
on conflict do nothing;

insert into luckystar_garage.parts_catalog (
  part_slug,
  part_name,
  vehicle_brand,
  vehicle_model,
  price,
  stock_status,
  notes
)
values
  ('oil-filter', 'Oil filter', 'Toyota', '', 12, 'in_stock', 'OEM equivalent'),
  ('brake-pads-front', 'Front brake pads', 'Mercedes', 'C180', 55, 'on_order', 'Price per axle set'),
  ('air-filter', 'Air filter', '', '', 18, 'in_stock', 'Aftermarket premium')
on conflict do nothing;

do $$
declare
  v_current text;
  v_schema text := 'luckystar_garage';
begin
  select split_part(cfg, '=', 2) into v_current
  from pg_roles, unnest(rolconfig) as cfg
  where rolname = 'authenticator'
    and cfg like 'pgrst.db_schemas=%';

  if v_current is null or v_current = '' then
    v_current := 'public,storage,graphql_public,robocore,robokorda,aura,smartschools,azim_motors,icecream_erp';
  end if;

  if position(v_schema in v_current) = 0 then
    execute format(
      'alter role authenticator set "pgrst.db_schemas" to %L',
      v_current || ',' || v_schema
    );
    raise notice 'pgrst.db_schemas updated to: %', v_current || ',' || v_schema;
    notify pgrst;
  else
    raise notice 'Schema % already in pgrst.db_schemas - no change needed', v_schema;
  end if;
end $$;
