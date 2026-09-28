import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_role" AS ENUM('editor', 'admin', 'super-admin', 'analyst', 'sales');
  CREATE TYPE "public"."enum_projects_category" AS ENUM('residential', 'commercial', 'institutional', 'hospitality', 'other');
  CREATE TYPE "public"."enum_projects_status" AS ENUM('completed', 'in-progress', 'planning');
  CREATE TYPE "public"."enum_leads_project_type" AS ENUM('residential', 'commercial', 'institutional', 'hospitality', 'other');
  CREATE TYPE "public"."enum_leads_status" AS ENUM('new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost', 'spam');
  CREATE TYPE "public"."enum_leads_source" AS ENUM('website', 'chatbot', 'contact-form', 'journal', 'project-page', 'referral', 'other');
  CREATE TYPE "public"."enum_chat_conversations_messages_role" AS ENUM('user', 'assistant');
  CREATE TYPE "public"."enum_chat_conversations_status" AS ENUM('active', 'escalated', 'closed');
  CREATE TYPE "public"."enum_chat_requests_request_type" AS ENUM('quote', 'callback', 'site-visit', 'general-enquiry', 'human-handoff', 'project-consultation');
  CREATE TYPE "public"."enum_chat_requests_status" AS ENUM('new', 'acknowledged', 'assigned', 'in-progress', 'completed', 'closed');
  CREATE TYPE "public"."enum_chat_requests_priority" AS ENUM('low', 'normal', 'high', 'urgent');
  CREATE TYPE "public"."enum_knowledge_sources_source_type" AS ENUM('project', 'service', 'article', 'faq');
  CREATE TYPE "public"."enum_knowledge_versions_status" AS ENUM('received', 'validating', 'fetching', 'normalizing', 'chunking', 'embedding', 'validating_index', 'ready', 'active', 'retired', 'outdated', 'incompatible', 'invalid', 'failed', 'blocked');
  CREATE TYPE "public"."enum_knowledge_events_event_type" AS ENUM('knowledge_published', 'knowledge_updated', 'knowledge_unpublished', 'indexing_started', 'indexing_complete', 'activation_triggered', 'rollback_triggered', 'validation_failed');
  CREATE TYPE "public"."enum_knowledge_events_status" AS ENUM('pending', 'processing', 'complete', 'failed');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" "enum_users_role" DEFAULT 'editor',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "projects_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"caption" varchar
  );
  
  CREATE TABLE "projects_materials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL
  );
  
  CREATE TABLE "projects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"category" "enum_projects_category" NOT NULL,
  	"location" varchar NOT NULL,
  	"year" numeric NOT NULL,
  	"status" "enum_projects_status" NOT NULL,
  	"description" jsonb NOT NULL,
  	"hero_image_id" integer,
  	"published" boolean DEFAULT false,
  	"chatbot_visible" boolean DEFAULT true,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "services_capabilities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"capability" varchar NOT NULL
  );
  
  CREATE TABLE "services" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" jsonb NOT NULL,
  	"process" jsonb,
  	"hero_image_id" integer,
  	"published" boolean DEFAULT false,
  	"chatbot_visible" boolean DEFAULT true,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "articles_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag" varchar NOT NULL
  );
  
  CREATE TABLE "articles" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"excerpt" varchar NOT NULL,
  	"body" jsonb NOT NULL,
  	"cover_image_id" integer,
  	"author" varchar NOT NULL,
  	"category" varchar NOT NULL,
  	"published_at" timestamp(3) with time zone NOT NULL,
  	"published" boolean DEFAULT false,
  	"chatbot_visible" boolean DEFAULT true,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"alt" varchar NOT NULL,
  	"caption" varchar,
  	"photographer" varchar,
  	"copyright" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_square_url" varchar,
  	"sizes_square_width" numeric,
  	"sizes_square_height" numeric,
  	"sizes_square_mime_type" varchar,
  	"sizes_square_filesize" numeric,
  	"sizes_square_filename" varchar,
  	"sizes_tablet_url" varchar,
  	"sizes_tablet_width" numeric,
  	"sizes_tablet_height" numeric,
  	"sizes_tablet_mime_type" varchar,
  	"sizes_tablet_filesize" numeric,
  	"sizes_tablet_filename" varchar
  );
  
  CREATE TABLE "leads" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar,
  	"company" varchar,
  	"project_type" "enum_leads_project_type",
  	"location" varchar,
  	"budget_range" varchar,
  	"timeline" varchar,
  	"message" varchar NOT NULL,
  	"status" "enum_leads_status" DEFAULT 'new',
  	"source" "enum_leads_source" DEFAULT 'website',
  	"notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "chat_conversations_messages_sources" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"source_id" varchar,
  	"source_type" varchar,
  	"title" varchar
  );
  
  CREATE TABLE "chat_conversations_messages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"role" "enum_chat_conversations_messages_role" NOT NULL,
  	"content" varchar NOT NULL,
  	"intent" varchar,
  	"timestamp" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "chat_conversations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"status" "enum_chat_conversations_status" DEFAULT 'active',
  	"intent" varchar,
  	"lead_associated_id" integer,
  	"metadata_user_agent" varchar,
  	"metadata_ip_address" varchar,
  	"metadata_session_id" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "chat_requests" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"request_type" "enum_chat_requests_request_type" NOT NULL,
  	"status" "enum_chat_requests_status" DEFAULT 'new',
  	"priority" "enum_chat_requests_priority" DEFAULT 'normal',
  	"conversation_id" integer,
  	"lead_id" integer,
  	"assigned_to_id" integer,
  	"description" varchar,
  	"notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "faqs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" jsonb NOT NULL,
  	"category" varchar NOT NULL,
  	"related_service_id" integer,
  	"related_project_id" integer,
  	"published" boolean DEFAULT false,
  	"chatbot_visible" boolean DEFAULT true,
  	"priority" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "knowledge_sources" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"source_type" "enum_knowledge_sources_source_type" NOT NULL,
  	"source_id" varchar NOT NULL,
  	"source_title" varchar NOT NULL,
  	"source_url" varchar NOT NULL,
  	"published" boolean DEFAULT false,
  	"chatbot_visible" boolean DEFAULT true,
  	"active_version_id_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "knowledge_versions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"knowledge_source_id" integer NOT NULL,
  	"version_number" numeric NOT NULL,
  	"content_hash" varchar NOT NULL,
  	"normalized_content" varchar NOT NULL,
  	"status" "enum_knowledge_versions_status" DEFAULT 'received',
  	"created_by_id" integer,
  	"activated_at" timestamp(3) with time zone,
  	"retired_at" timestamp(3) with time zone,
  	"embedding_model" varchar DEFAULT 'text-embedding-3-small',
  	"chunk_count" numeric,
  	"knowledge_schema_version" numeric DEFAULT 1,
  	"validation_checks_source_exists" boolean,
  	"validation_checks_source_published" boolean,
  	"validation_checks_chatbot_visible" boolean,
  	"validation_checks_content_hash_valid" boolean,
  	"validation_checks_chunks_complete" boolean,
  	"validation_checks_embeddings_valid" boolean,
  	"validation_checks_schema_compatible" boolean,
  	"validation_checks_model_compatible" boolean,
  	"validation_checks_metadata_valid" boolean,
  	"validation_checks_retrieval_works" boolean,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "knowledge_chunks" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"knowledge_version_id" integer NOT NULL,
  	"chunk_index" numeric NOT NULL,
  	"section" varchar,
  	"content" varchar NOT NULL,
  	"embedding" jsonb,
  	"metadata" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "knowledge_events" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"event_type" "enum_knowledge_events_event_type" NOT NULL,
  	"source_id" varchar NOT NULL,
  	"version_id" varchar,
  	"payload_hash" varchar,
  	"status" "enum_knowledge_events_status" DEFAULT 'pending',
  	"error" varchar,
  	"processed_at" timestamp(3) with time zone,
  	"details" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"projects_id" integer,
  	"services_id" integer,
  	"articles_id" integer,
  	"media_id" integer,
  	"leads_id" integer,
  	"chat_conversations_id" integer,
  	"chat_requests_id" integer,
  	"faqs_id" integer,
  	"knowledge_sources_id" integer,
  	"knowledge_versions_id" integer,
  	"knowledge_chunks_id" integer,
  	"knowledge_events_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_gallery" ADD CONSTRAINT "projects_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_gallery" ADD CONSTRAINT "projects_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_materials" ADD CONSTRAINT "projects_materials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_capabilities" ADD CONSTRAINT "services_capabilities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services" ADD CONSTRAINT "services_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services" ADD CONSTRAINT "services_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles_tags" ADD CONSTRAINT "articles_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles" ADD CONSTRAINT "articles_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles" ADD CONSTRAINT "articles_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "chat_conversations_messages_sources" ADD CONSTRAINT "chat_conversations_messages_sources_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."chat_conversations_messages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "chat_conversations_messages" ADD CONSTRAINT "chat_conversations_messages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."chat_conversations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "chat_conversations" ADD CONSTRAINT "chat_conversations_lead_associated_id_leads_id_fk" FOREIGN KEY ("lead_associated_id") REFERENCES "public"."leads"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "chat_requests" ADD CONSTRAINT "chat_requests_conversation_id_chat_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."chat_conversations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "chat_requests" ADD CONSTRAINT "chat_requests_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "chat_requests" ADD CONSTRAINT "chat_requests_assigned_to_id_users_id_fk" FOREIGN KEY ("assigned_to_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "faqs" ADD CONSTRAINT "faqs_related_service_id_services_id_fk" FOREIGN KEY ("related_service_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "faqs" ADD CONSTRAINT "faqs_related_project_id_projects_id_fk" FOREIGN KEY ("related_project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "knowledge_sources" ADD CONSTRAINT "knowledge_sources_active_version_id_id_knowledge_versions_id_fk" FOREIGN KEY ("active_version_id_id") REFERENCES "public"."knowledge_versions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "knowledge_versions" ADD CONSTRAINT "knowledge_versions_knowledge_source_id_knowledge_sources_id_fk" FOREIGN KEY ("knowledge_source_id") REFERENCES "public"."knowledge_sources"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "knowledge_versions" ADD CONSTRAINT "knowledge_versions_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "knowledge_chunks" ADD CONSTRAINT "knowledge_chunks_knowledge_version_id_knowledge_versions_id_fk" FOREIGN KEY ("knowledge_version_id") REFERENCES "public"."knowledge_versions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_articles_fk" FOREIGN KEY ("articles_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_leads_fk" FOREIGN KEY ("leads_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_chat_conversations_fk" FOREIGN KEY ("chat_conversations_id") REFERENCES "public"."chat_conversations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_chat_requests_fk" FOREIGN KEY ("chat_requests_id") REFERENCES "public"."chat_requests"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_knowledge_sources_fk" FOREIGN KEY ("knowledge_sources_id") REFERENCES "public"."knowledge_sources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_knowledge_versions_fk" FOREIGN KEY ("knowledge_versions_id") REFERENCES "public"."knowledge_versions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_knowledge_chunks_fk" FOREIGN KEY ("knowledge_chunks_id") REFERENCES "public"."knowledge_chunks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_knowledge_events_fk" FOREIGN KEY ("knowledge_events_id") REFERENCES "public"."knowledge_events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "projects_gallery_order_idx" ON "projects_gallery" USING btree ("_order");
  CREATE INDEX "projects_gallery_parent_id_idx" ON "projects_gallery" USING btree ("_parent_id");
  CREATE INDEX "projects_gallery_image_idx" ON "projects_gallery" USING btree ("image_id");
  CREATE INDEX "projects_materials_order_idx" ON "projects_materials" USING btree ("_order");
  CREATE INDEX "projects_materials_parent_id_idx" ON "projects_materials" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "projects_slug_idx" ON "projects" USING btree ("slug");
  CREATE INDEX "projects_hero_image_idx" ON "projects" USING btree ("hero_image_id");
  CREATE INDEX "projects_seo_seo_image_idx" ON "projects" USING btree ("seo_image_id");
  CREATE INDEX "projects_updated_at_idx" ON "projects" USING btree ("updated_at");
  CREATE INDEX "projects_created_at_idx" ON "projects" USING btree ("created_at");
  CREATE INDEX "services_capabilities_order_idx" ON "services_capabilities" USING btree ("_order");
  CREATE INDEX "services_capabilities_parent_id_idx" ON "services_capabilities" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "services_slug_idx" ON "services" USING btree ("slug");
  CREATE INDEX "services_hero_image_idx" ON "services" USING btree ("hero_image_id");
  CREATE INDEX "services_seo_seo_image_idx" ON "services" USING btree ("seo_image_id");
  CREATE INDEX "services_updated_at_idx" ON "services" USING btree ("updated_at");
  CREATE INDEX "services_created_at_idx" ON "services" USING btree ("created_at");
  CREATE INDEX "articles_tags_order_idx" ON "articles_tags" USING btree ("_order");
  CREATE INDEX "articles_tags_parent_id_idx" ON "articles_tags" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "articles_slug_idx" ON "articles" USING btree ("slug");
  CREATE INDEX "articles_cover_image_idx" ON "articles" USING btree ("cover_image_id");
  CREATE INDEX "articles_seo_seo_image_idx" ON "articles" USING btree ("seo_image_id");
  CREATE INDEX "articles_updated_at_idx" ON "articles" USING btree ("updated_at");
  CREATE INDEX "articles_created_at_idx" ON "articles" USING btree ("created_at");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_square_sizes_square_filename_idx" ON "media" USING btree ("sizes_square_filename");
  CREATE INDEX "media_sizes_tablet_sizes_tablet_filename_idx" ON "media" USING btree ("sizes_tablet_filename");
  CREATE INDEX "leads_updated_at_idx" ON "leads" USING btree ("updated_at");
  CREATE INDEX "leads_created_at_idx" ON "leads" USING btree ("created_at");
  CREATE INDEX "chat_conversations_messages_sources_order_idx" ON "chat_conversations_messages_sources" USING btree ("_order");
  CREATE INDEX "chat_conversations_messages_sources_parent_id_idx" ON "chat_conversations_messages_sources" USING btree ("_parent_id");
  CREATE INDEX "chat_conversations_messages_order_idx" ON "chat_conversations_messages" USING btree ("_order");
  CREATE INDEX "chat_conversations_messages_parent_id_idx" ON "chat_conversations_messages" USING btree ("_parent_id");
  CREATE INDEX "chat_conversations_lead_associated_idx" ON "chat_conversations" USING btree ("lead_associated_id");
  CREATE INDEX "chat_conversations_updated_at_idx" ON "chat_conversations" USING btree ("updated_at");
  CREATE INDEX "chat_conversations_created_at_idx" ON "chat_conversations" USING btree ("created_at");
  CREATE INDEX "chat_requests_conversation_idx" ON "chat_requests" USING btree ("conversation_id");
  CREATE INDEX "chat_requests_lead_idx" ON "chat_requests" USING btree ("lead_id");
  CREATE INDEX "chat_requests_assigned_to_idx" ON "chat_requests" USING btree ("assigned_to_id");
  CREATE INDEX "chat_requests_updated_at_idx" ON "chat_requests" USING btree ("updated_at");
  CREATE INDEX "chat_requests_created_at_idx" ON "chat_requests" USING btree ("created_at");
  CREATE INDEX "faqs_related_service_idx" ON "faqs" USING btree ("related_service_id");
  CREATE INDEX "faqs_related_project_idx" ON "faqs" USING btree ("related_project_id");
  CREATE INDEX "faqs_updated_at_idx" ON "faqs" USING btree ("updated_at");
  CREATE INDEX "faqs_created_at_idx" ON "faqs" USING btree ("created_at");
  CREATE INDEX "knowledge_sources_active_version_id_idx" ON "knowledge_sources" USING btree ("active_version_id_id");
  CREATE INDEX "knowledge_sources_updated_at_idx" ON "knowledge_sources" USING btree ("updated_at");
  CREATE INDEX "knowledge_sources_created_at_idx" ON "knowledge_sources" USING btree ("created_at");
  CREATE INDEX "knowledge_versions_knowledge_source_idx" ON "knowledge_versions" USING btree ("knowledge_source_id");
  CREATE INDEX "knowledge_versions_created_by_idx" ON "knowledge_versions" USING btree ("created_by_id");
  CREATE INDEX "knowledge_versions_updated_at_idx" ON "knowledge_versions" USING btree ("updated_at");
  CREATE INDEX "knowledge_versions_created_at_idx" ON "knowledge_versions" USING btree ("created_at");
  CREATE INDEX "knowledge_chunks_knowledge_version_idx" ON "knowledge_chunks" USING btree ("knowledge_version_id");
  CREATE INDEX "knowledge_chunks_updated_at_idx" ON "knowledge_chunks" USING btree ("updated_at");
  CREATE INDEX "knowledge_chunks_created_at_idx" ON "knowledge_chunks" USING btree ("created_at");
  CREATE INDEX "knowledge_events_updated_at_idx" ON "knowledge_events" USING btree ("updated_at");
  CREATE INDEX "knowledge_events_created_at_idx" ON "knowledge_events" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_projects_id_idx" ON "payload_locked_documents_rels" USING btree ("projects_id");
  CREATE INDEX "payload_locked_documents_rels_services_id_idx" ON "payload_locked_documents_rels" USING btree ("services_id");
  CREATE INDEX "payload_locked_documents_rels_articles_id_idx" ON "payload_locked_documents_rels" USING btree ("articles_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_leads_id_idx" ON "payload_locked_documents_rels" USING btree ("leads_id");
  CREATE INDEX "payload_locked_documents_rels_chat_conversations_id_idx" ON "payload_locked_documents_rels" USING btree ("chat_conversations_id");
  CREATE INDEX "payload_locked_documents_rels_chat_requests_id_idx" ON "payload_locked_documents_rels" USING btree ("chat_requests_id");
  CREATE INDEX "payload_locked_documents_rels_faqs_id_idx" ON "payload_locked_documents_rels" USING btree ("faqs_id");
  CREATE INDEX "payload_locked_documents_rels_knowledge_sources_id_idx" ON "payload_locked_documents_rels" USING btree ("knowledge_sources_id");
  CREATE INDEX "payload_locked_documents_rels_knowledge_versions_id_idx" ON "payload_locked_documents_rels" USING btree ("knowledge_versions_id");
  CREATE INDEX "payload_locked_documents_rels_knowledge_chunks_id_idx" ON "payload_locked_documents_rels" USING btree ("knowledge_chunks_id");
  CREATE INDEX "payload_locked_documents_rels_knowledge_events_id_idx" ON "payload_locked_documents_rels" USING btree ("knowledge_events_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "projects_gallery" CASCADE;
  DROP TABLE "projects_materials" CASCADE;
  DROP TABLE "projects" CASCADE;
  DROP TABLE "services_capabilities" CASCADE;
  DROP TABLE "services" CASCADE;
  DROP TABLE "articles_tags" CASCADE;
  DROP TABLE "articles" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "leads" CASCADE;
  DROP TABLE "chat_conversations_messages_sources" CASCADE;
  DROP TABLE "chat_conversations_messages" CASCADE;
  DROP TABLE "chat_conversations" CASCADE;
  DROP TABLE "chat_requests" CASCADE;
  DROP TABLE "faqs" CASCADE;
  DROP TABLE "knowledge_sources" CASCADE;
  DROP TABLE "knowledge_versions" CASCADE;
  DROP TABLE "knowledge_chunks" CASCADE;
  DROP TABLE "knowledge_events" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_projects_category";
  DROP TYPE "public"."enum_projects_status";
  DROP TYPE "public"."enum_leads_project_type";
  DROP TYPE "public"."enum_leads_status";
  DROP TYPE "public"."enum_leads_source";
  DROP TYPE "public"."enum_chat_conversations_messages_role";
  DROP TYPE "public"."enum_chat_conversations_status";
  DROP TYPE "public"."enum_chat_requests_request_type";
  DROP TYPE "public"."enum_chat_requests_status";
  DROP TYPE "public"."enum_chat_requests_priority";
  DROP TYPE "public"."enum_knowledge_sources_source_type";
  DROP TYPE "public"."enum_knowledge_versions_status";
  DROP TYPE "public"."enum_knowledge_events_event_type";
  DROP TYPE "public"."enum_knowledge_events_status";`)
}
