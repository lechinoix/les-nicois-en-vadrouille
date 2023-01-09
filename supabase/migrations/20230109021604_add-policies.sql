alter table "public"."Comment" enable row level security;

alter table "public"."Reaction" enable row level security;

create policy "Enable insert for authenticated users only"
on "public"."Comment"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all users"
on "public"."Comment"
as permissive
for select
to public
using (true);


create policy "Enable read access for all users"
on "public"."Profile"
as permissive
for select
to public
using (true);


create policy "Enable insert for authenticated users only"
on "public"."Reaction"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all users"
on "public"."Reaction"
as permissive
for select
to public
using (true);



