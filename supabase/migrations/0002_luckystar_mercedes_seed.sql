-- Seed LuckyStar Mercedes Garage profile, chatbot copy and W203/W204 parts.

insert into luckystar_garage.bot_config (key, value)
values
  ('business_name', 'LuckyStar Mercedes Garage'),
  ('business_phone', '+263 787 209 882'),
  ('business_address', '1 Hampden Street, Belvedere, Harare'),
  ('business_latitude', '-17.8292'),
  ('business_longitude', '31.0127'),
  ('business_hours', 'Mon-Sat 8:00 AM - 5:30 PM'),
  ('quote_note', 'Prices are subject to change. Request a quotation for updated prices.')
on conflict (key) do update set
  value = excluded.value,
  updated_at = now();

insert into luckystar_garage.quick_replies (reply_key, title, message)
values
  (
    'greeting',
    'Welcome message',
    'Welcome to LuckyStar Mercedes Garage, the home of all Benz spare parts, repairs, diagnostics and service.'
  ),
  (
    'location',
    'Location and hours',
    'LuckyStar Mercedes Garage is open Monday to Saturday, 8:00 AM to 5:30 PM. Use View GPS directions to open Google Maps to the garage.'
  ),
  (
    'human_handoff',
    'Human handoff',
    'Thank you. A LuckyStar Mercedes Garage team member will contact you shortly.'
  )
on conflict (reply_key) do update set
  title = excluded.title,
  message = excluded.message,
  is_active = true,
  updated_at = now();

insert into luckystar_garage.parts_catalog (
  part_slug,
  part_name,
  vehicle_brand,
  vehicle_model,
  price,
  currency,
  stock_status,
  notes,
  is_active
)
values
  ('w204-shocks', 'W204 shocks', 'Mercedes-Benz', 'W204', 120, 'USD', 'in_stock', 'Suspension parts', true),
  ('w204-knuckles', 'W204 knuckles', 'Mercedes-Benz', 'W204', 30, 'USD', 'in_stock', 'Suspension parts', true),
  ('w204-tie-rod-ends', 'W204 tie rod ends', 'Mercedes-Benz', 'W204', 30, 'USD', 'in_stock', 'Suspension parts', true),
  ('w204-lower-control-arms-x2', 'W204 lower control arms x2', 'Mercedes-Benz', 'W204', 80, 'USD', 'in_stock', 'Suspension parts', true),
  ('w204-upper-control-arms-x2', 'W204 upper control arms x2', 'Mercedes-Benz', 'W204', 80, 'USD', 'in_stock', 'Suspension parts', true),
  ('w204-links', 'W204 links', 'Mercedes-Benz', 'W204', 40, 'USD', 'in_stock', 'Suspension parts', true),
  ('w204-front-brake-pads', 'W204 front brake pads', 'Mercedes-Benz', 'W204', 30, 'USD', 'in_stock', 'Brake parts', true),
  ('w204-rear-brake-pads', 'W204 rear brake pads', 'Mercedes-Benz', 'W204', 25, 'USD', 'in_stock', 'Brake parts', true),
  ('w203-cast-control-arms-x2', 'W203 cast control arms x2', 'Mercedes-Benz', 'W203', 80, 'USD', 'in_stock', 'Suspension parts', true),
  ('w203-aluminum-control-arms-x2', 'W203 aluminum control arms x2', 'Mercedes-Benz', 'W203', 80, 'USD', 'in_stock', 'Suspension parts', true),
  ('w203-stabilizer-bar-links-x2', 'W203 stabilizer bar links x2', 'Mercedes-Benz', 'W203', 25, 'USD', 'in_stock', 'Suspension parts', true),
  ('w203-stabilizer-bar-bushes-x2', 'W203 stabilizer bar bushes x2', 'Mercedes-Benz', 'W203', 20, 'USD', 'in_stock', 'Suspension parts', true),
  ('w203-knuckles-x2', 'W203 knuckles x2', 'Mercedes-Benz', 'W203', 25, 'USD', 'in_stock', 'Suspension parts', true),
  ('w203-tie-rod-ends-x2', 'W203 tie rod ends x2', 'Mercedes-Benz', 'W203', 25, 'USD', 'in_stock', 'Suspension parts', true),
  ('w203-front-shocks-x2', 'W203 front shocks x2', 'Mercedes-Benz', 'W203', 100, 'USD', 'in_stock', 'Suspension parts', true),
  ('w203-rear-shocks-x2', 'W203 rear shocks x2', 'Mercedes-Benz', 'W203', 80, 'USD', 'in_stock', 'Suspension parts', true),
  ('w203-front-brake-pads-x2', 'W203 front brake pads x2', 'Mercedes-Benz', 'W203', 30, 'USD', 'in_stock', 'Brake parts', true),
  ('w203-rear-brake-pads-x2', 'W203 rear brake pads x2', 'Mercedes-Benz', 'W203', 20, 'USD', 'in_stock', 'Brake parts', true)
on conflict (part_slug, vehicle_brand, vehicle_model, engine_type) do update set
  part_name = excluded.part_name,
  price = excluded.price,
  currency = excluded.currency,
  stock_status = excluded.stock_status,
  notes = excluded.notes,
  is_active = true,
  updated_at = now();
