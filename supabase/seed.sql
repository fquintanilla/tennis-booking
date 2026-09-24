-- Development data only. Re-running this file updates the listed clubs and courts.
insert into public.clubs (name, description, address, latitude, longitude, phone, active)
values
  ('Club Terravalle', 'Club de tenis con canchas de arcilla y cemento en Cumbayá.', 'Av. Interoceánica, Cumbayá, Quito', -0.198500, -78.431200, '+593 2 289 1000', true),
  ('Quito Tenis & Golf Club', 'Club deportivo con canchas para todos los niveles.', 'Av. Manuel Córdova Galarza, El Condado, Quito', -0.097700, -78.501300, '+593 2 280 4200', true),
  ('Club Rancho San Francisco', 'Canchas de tenis al aire libre en el valle de Cumbayá.', 'Cumbayá, Quito', -0.200100, -78.428300, '+593 2 289 7100', true)
on conflict (name) do update
set
  description = excluded.description,
  address = excluded.address,
  latitude = excluded.latitude,
  longitude = excluded.longitude,
  phone = excluded.phone,
  active = excluded.active;

insert into public.courts (club_id, name, surface_type, is_indoor, price, active)
select clubs.id, court.name, court.surface_type, court.is_indoor, court.price, true
from public.clubs clubs
join (
  values
    ('Club Terravalle', 'Cancha 1', 'Arcilla', false, 12.00::numeric),
    ('Club Terravalle', 'Cancha 2', 'Cemento', false, 12.00::numeric),
    ('Club Terravalle', 'Cancha 3', 'Arcilla', false, 14.00::numeric),
    ('Quito Tenis & Golf Club', 'Cancha 1', 'Cemento', false, 14.00::numeric),
    ('Quito Tenis & Golf Club', 'Cancha 2', 'Arcilla', false, 14.00::numeric),
    ('Club Rancho San Francisco', 'Cancha 1', 'Césped sintético', false, 10.00::numeric),
    ('Club Rancho San Francisco', 'Cancha 2', 'Cemento', false, 10.00::numeric)
) as court(club_name, name, surface_type, is_indoor, price)
  on clubs.name = court.club_name
on conflict (club_id, name) do update
set
  surface_type = excluded.surface_type,
  is_indoor = excluded.is_indoor,
  price = excluded.price,
  active = excluded.active;
