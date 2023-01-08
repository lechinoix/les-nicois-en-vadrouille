alter table "public"."Comment" drop constraint "Comment_user_id_fkey";

alter table "public"."Reaction" drop constraint "Reaction_user_id_fkey";

alter table "public"."Comment" drop column "user_id";

alter table "public"."Comment" add column "user" uuid;

alter table "public"."Reaction" drop column "user_id";

alter table "public"."Reaction" add column "user" uuid;

alter table "public"."Comment" add constraint "Comment_user_fkey" FOREIGN KEY ("user") REFERENCES auth.users(id) not valid;

alter table "public"."Comment" validate constraint "Comment_user_fkey";

alter table "public"."Reaction" add constraint "Reaction_user_fkey" FOREIGN KEY ("user") REFERENCES auth.users(id) not valid;

alter table "public"."Reaction" validate constraint "Reaction_user_fkey";


