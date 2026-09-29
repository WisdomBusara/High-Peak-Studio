import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_press_items_kind" AS ENUM('press', 'award');
  CREATE TABLE "team_members" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" varchar NOT NULL,
  	"bio" varchar,
  	"portrait_id" integer,
  	"order" numeric DEFAULT 0,
  	"published" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "press_items" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"kind" "enum_press_items_kind" DEFAULT 'press' NOT NULL,
  	"title" varchar NOT NULL,
  	"source" varchar NOT NULL,
  	"date" timestamp(3) with time zone NOT NULL,
  	"link" varchar,
  	"show_in_ticker" boolean DEFAULT true,
  	"published" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "projects" ADD COLUMN "drawing_id" integer;
  ALTER TABLE "projects" ADD COLUMN "featured" boolean DEFAULT false;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "team_members_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "press_items_id" integer;
  ALTER TABLE "team_members" ADD CONSTRAINT "team_members_portrait_id_media_id_fk" FOREIGN KEY ("portrait_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "team_members_portrait_idx" ON "team_members" USING btree ("portrait_id");
  CREATE INDEX "team_members_updated_at_idx" ON "team_members" USING btree ("updated_at");
  CREATE INDEX "team_members_created_at_idx" ON "team_members" USING btree ("created_at");
  CREATE INDEX "press_items_updated_at_idx" ON "press_items" USING btree ("updated_at");
  CREATE INDEX "press_items_created_at_idx" ON "press_items" USING btree ("created_at");
  ALTER TABLE "projects" ADD CONSTRAINT "projects_drawing_id_media_id_fk" FOREIGN KEY ("drawing_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_team_members_fk" FOREIGN KEY ("team_members_id") REFERENCES "public"."team_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_press_items_fk" FOREIGN KEY ("press_items_id") REFERENCES "public"."press_items"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "projects_drawing_idx" ON "projects" USING btree ("drawing_id");
  CREATE INDEX "payload_locked_documents_rels_team_members_id_idx" ON "payload_locked_documents_rels" USING btree ("team_members_id");
  CREATE INDEX "payload_locked_documents_rels_press_items_id_idx" ON "payload_locked_documents_rels" USING btree ("press_items_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "team_members" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "press_items" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "team_members" CASCADE;
  DROP TABLE "press_items" CASCADE;
  ALTER TABLE "projects" DROP CONSTRAINT "projects_drawing_id_media_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_team_members_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_press_items_fk";
  
  DROP INDEX "projects_drawing_idx";
  DROP INDEX "payload_locked_documents_rels_team_members_id_idx";
  DROP INDEX "payload_locked_documents_rels_press_items_id_idx";
  ALTER TABLE "projects" DROP COLUMN "drawing_id";
  ALTER TABLE "projects" DROP COLUMN "featured";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "team_members_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "press_items_id";
  DROP TYPE "public"."enum_press_items_kind";`)
}
