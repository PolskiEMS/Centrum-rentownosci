alter policy routes_select_access on public.routes
using (
  created_by = (select auth.uid())
  or (visibility = 'company' and private.is_company_member(company_id))
);

alter policy routes_insert_own on public.routes
with check (
  created_by = (select auth.uid())
  and private.is_company_member(company_id)
);

alter policy routes_update_access on public.routes
using (
  created_by = (select auth.uid())
  or (visibility = 'company' and private.is_company_admin(company_id))
)
with check (
  created_by = (select auth.uid())
  and private.is_company_member(company_id)
);

alter policy routes_delete_access on public.routes
using (
  created_by = (select auth.uid())
  or (visibility = 'company' and private.is_company_admin(company_id))
);

alter policy calculations_select_access on public.calculations
using (
  created_by = (select auth.uid())
  or (visibility = 'company' and private.is_company_member(company_id))
);

alter policy calculations_insert_own on public.calculations
with check (
  created_by = (select auth.uid())
  and private.is_company_member(company_id)
);

alter policy calculations_update_access on public.calculations
using (
  created_by = (select auth.uid())
  or (visibility = 'company' and private.is_company_admin(company_id))
)
with check (
  created_by = (select auth.uid())
  and private.is_company_member(company_id)
);

alter policy calculations_delete_access on public.calculations
using (
  created_by = (select auth.uid())
  or (visibility = 'company' and private.is_company_admin(company_id))
);

revoke execute on function public.handle_new_user() from public, anon, authenticated;
grant execute on function public.handle_new_user() to service_role, supabase_auth_admin;
