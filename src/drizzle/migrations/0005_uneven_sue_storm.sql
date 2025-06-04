CREATE TABLE "blog_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "blog_categories_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "blogs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category_id" uuid,
	"title" text NOT NULL,
	"summary" text,
	"content" text NOT NULL,
	"cover_image_url" text,
	"author" text,
	"estimated_read_time" integer,
	"is_published" boolean DEFAULT false,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "tutorial_modules" (
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
	CONSTRAINT "tutorial_modules_section_id_order_unique" UNIQUE("section_id","order")
);
--> statement-breakpoint
CREATE TABLE "tutorial_sections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"order" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "tutorial_sections_order_unique" UNIQUE("order")
);
--> statement-breakpoint
CREATE TABLE "user_tutorial_progress" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"module_id" uuid NOT NULL,
	"status" text DEFAULT 'not_started' NOT NULL,
	"completed_at" timestamp with time zone,
	"started_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "user_tutorial_progress_user_id_module_id_unique" UNIQUE("user_id","module_id")
);
--> statement-breakpoint
DROP TABLE "article_categories" CASCADE;--> statement-breakpoint
DROP TABLE "articles" CASCADE;--> statement-breakpoint
DROP TABLE "learning_modules" CASCADE;--> statement-breakpoint
DROP TABLE "learning_sections" CASCADE;--> statement-breakpoint
DROP TABLE "user_learning_progress" CASCADE;--> statement-breakpoint
ALTER TABLE "blogs" ADD CONSTRAINT "blogs_category_id_blog_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."blog_categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tutorial_modules" ADD CONSTRAINT "tutorial_modules_section_id_tutorial_sections_id_fk" FOREIGN KEY ("section_id") REFERENCES "public"."tutorial_sections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_tutorial_progress" ADD CONSTRAINT "user_tutorial_progress_module_id_tutorial_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."tutorial_modules"("id") ON DELETE cascade ON UPDATE no action;