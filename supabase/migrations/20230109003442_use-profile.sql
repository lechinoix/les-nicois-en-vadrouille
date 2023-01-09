alter table "public"."Comment" drop constraint "Comment_user_fkey";

alter table "public"."Reaction" drop constraint "Reaction_user_fkey";

create table "public"."Profile" (
    "id" uuid not null,
    "name" text
);


alter table "public"."Profile" enable row level security;

CREATE UNIQUE INDEX "Profile_pkey" ON public."Profile" USING btree (id);

alter table "public"."Profile" add constraint "Profile_pkey" PRIMARY KEY using index "Profile_pkey";

alter table "public"."Profile" add constraint "Profile_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) not valid;

alter table "public"."Profile" validate constraint "Profile_id_fkey";

alter table "public"."Comment" add constraint "Comment_user_fkey" FOREIGN KEY ("user") REFERENCES "Profile"(id) not valid;

alter table "public"."Comment" validate constraint "Comment_user_fkey";

alter table "public"."Reaction" add constraint "Reaction_user_fkey" FOREIGN KEY ("user") REFERENCES "Profile"(id) not valid;

alter table "public"."Reaction" validate constraint "Reaction_user_fkey";


