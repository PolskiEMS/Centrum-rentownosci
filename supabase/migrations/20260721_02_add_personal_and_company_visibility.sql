alter table public.routes
  add column if not exists visibility text not null default 'private'
  check (visibility in ('private', 'company'));

alter table public.calculations
  add column if not exists visibility text not null default 'private'
  check (visibility in ('private', 'company'));

create index if not exists routes_created_by_idx
  on public.routes(created_by);
create index if not exists routes_company_visibility_idx
  on public.routes(company_id, visibility);
create index if not exists calculations_created_by_idx
  on public.calculations(created_by);
create index if not exists calculations_company_visibility_idx
  on public.calculations(company_id, visibility);

alter table public.routes
  alter column created_by set default auth.uid();
alter table public.calculations
  alter column created_by set default auth.uid();

create or replace function private.can_access_route(target_route_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.routes r
    where r.id = target_route_id
      and (
        r.created_by = auth.uid()
        or (
          r.visibility = 'company'
          and private.is_company_member(r.company_id)
        )
      )
  );
$$;

create or replace function private.can_access_calculation(target_calculation_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.calculations c
    where c.id = target_calculation_id
      and (
        c.created_by = auth.uid()
        or (
          c.visibility = 'company'
          and private.is_company_member(c.company_id)
        )
      )
  );
$$;

drop policy if exists routes_company_access on public.routes;
create policy routes_select_access on public.routes
for select using (
  created_by = auth.uid()
  or (visibility = 'company' and private.is_company_member(company_id))
);
create policy routes_insert_own on public.routes
for insert with check (
  created_by = auth.uid()
  and private.is_company_member(company_id)
);
create policy routes_update_access on public.routes
for update using (
  created_by = auth.uid()
  or (visibility = 'company' and private.is_company_admin(company_id))
) with check (
  created_by = auth.uid()
  and private.is_company_member(company_id)
);
create policy routes_delete_access on public.routes
for delete using (
  created_by = auth.uid()
  or (visibility = 'company' and private.is_company_admin(company_id))
);

drop policy if exists calculations_company_access on public.calculations;
create policy calculations_select_access on public.calculations
for select using (
  created_by = auth.uid()
  or (visibility = 'company' and private.is_company_member(company_id))
);
create policy calculations_insert_own on public.calculations
for insert with check (
  created_by = auth.uid()
  and private.is_company_member(company_id)
);
create policy calculations_update_access on public.calculations
for update using (
  created_by = auth.uid()
  or (visibility = 'company' and private.is_company_admin(company_id))
) with check (
  created_by = auth.uid()
  and private.is_company_member(company_id)
);
create policy calculations_delete_access on public.calculations
for delete using (
  created_by = auth.uid()
  or (visibility = 'company' and private.is_company_admin(company_id))
);

drop policy if exists route_stops_company_access on public.route_stops;
create policy route_stops_select_access on public.route_stops
for select using (private.can_access_route(route_id));
create policy route_stops_insert_access on public.route_stops
for insert with check (private.can_access_route(route_id));
create policy route_stops_update_access on public.route_stops
for update using (private.can_access_route(route_id))
with check (private.can_access_route(route_id));
create policy route_stops_delete_access on public.route_stops
for delete using (private.can_access_route(route_id));

drop policy if exists cost_items_company_access on public.cost_items;
create policy cost_items_select_access on public.cost_items
for select using (private.can_access_calculation(calculation_id));
create policy cost_items_insert_access on public.cost_items
for insert with check (private.can_access_calculation(calculation_id));
create policy cost_items_update_access on public.cost_items
for update using (private.can_access_calculation(calculation_id))
with check (private.can_access_calculation(calculation_id));
create policy cost_items_delete_access on public.cost_items
for delete using (private.can_access_calculation(calculation_id));
