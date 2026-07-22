alter table public.routes
  add column if not exists visibility text not null default 'private';

alter table public.calculations
  add column if not exists visibility text not null default 'private';

alter table public.routes
  drop constraint if exists routes_visibility_check;

alter table public.routes
  add constraint routes_visibility_check
  check (visibility in ('private', 'company'));

alter table public.calculations
  drop constraint if exists calculations_visibility_check;

alter table public.calculations
  add constraint calculations_visibility_check
  check (visibility in ('private', 'company'));
