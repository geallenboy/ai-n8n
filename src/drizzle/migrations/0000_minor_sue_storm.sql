CREATE TABLE "article_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "article_categories_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "articles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category_id" uuid,
	"title" text NOT NULL,
	"summary" text,
	"content" text NOT NULL,
	"cover_image_url" text,
	"author" text,
	"is_published" boolean DEFAULT false,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"full_name" varchar(255),
	"avatar" varchar(500),
	"bio" text,
	"skill_level" varchar(50) DEFAULT 'beginner',
	"preferences" jsonb,
	"total_learning_time" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"is_admin" boolean DEFAULT false,
	"provider" varchar(50) DEFAULT 'email',
	"provider_id" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"full_name" text,
	"avatar_url" text,
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "learning_modules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"section_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"content" text,
	"video_url" text,
	"estimated_time_minutes" integer,
	"order" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "learning_modules_section_id_order_unique" UNIQUE("section_id","order")
);
--> statement-breakpoint
CREATE TABLE "learning_sections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"order" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "learning_sections_order_unique" UNIQUE("order")
);
--> statement-breakpoint
CREATE TABLE "user_learning_progress" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"module_id" uuid NOT NULL,
	"status" text DEFAULT 'not_started' NOT NULL,
	"completed_at" timestamp with time zone,
	"started_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "user_learning_progress_user_id_module_id_unique" UNIQUE("user_id","module_id")
);
--> statement-breakpoint
CREATE TABLE "use_case_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"name_zh" text,
	"description" text,
	"description_zh" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "use_case_categories_name_unique" UNIQUE("name"),
	CONSTRAINT "use_case_categories_name_zh_unique" UNIQUE("name_zh")
);
--> statement-breakpoint
CREATE TABLE "use_case_to_category_links" (
	"use_case_id" uuid NOT NULL,
	"category_id" uuid NOT NULL,
	CONSTRAINT "use_case_to_category_links_use_case_id_category_id_pk" PRIMARY KEY("use_case_id","category_id")
);
--> statement-breakpoint
CREATE TABLE "use_cases" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"title_zh" text,
	"n8n_author" text,
	"original_url" text,
	"published_at" timestamp with time zone,
	"publish_date_display_en" text,
	"publish_date_display_zh" text,
	"readme" text,
	"readme_zh" text,
	"workflow_json" jsonb,
	"workflow_json_zh" jsonb,
	"summary" text,
	"summary_zh" text,
	"cover_image_url" text,
	"curator_id" uuid,
	"is_published" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "use_cases_original_url_unique" UNIQUE("original_url")
);
--> statement-breakpoint
ALTER TABLE "articles" ADD CONSTRAINT "articles_category_id_article_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."article_categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "learning_modules" ADD CONSTRAINT "learning_modules_section_id_learning_sections_id_fk" FOREIGN KEY ("section_id") REFERENCES "public"."learning_sections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_learning_progress" ADD CONSTRAINT "user_learning_progress_module_id_learning_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."learning_modules"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "use_case_to_category_links" ADD CONSTRAINT "use_case_to_category_links_use_case_id_use_cases_id_fk" FOREIGN KEY ("use_case_id") REFERENCES "public"."use_cases"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "use_case_to_category_links" ADD CONSTRAINT "use_case_to_category_links_category_id_use_case_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."use_case_categories"("id") ON DELETE cascade ON UPDATE no action;