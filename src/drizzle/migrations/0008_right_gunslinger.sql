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
	"url" text,
	"title" text NOT NULL,
	"title_zh" text,
	"excerpt" text,
	"excerpt_zh" text,
	"thumbnail" text,
	"tags" jsonb DEFAULT '[]'::jsonb,
	"readme" text,
	"readme_zh" text,
	"crawled_at" timestamp with time zone,
	"summary" text,
	"content" text,
	"cover_image_url" text,
	"author" text,
	"estimated_read_time" integer,
	"is_published" boolean DEFAULT false,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "blogs_url_unique" UNIQUE("url")
);
--> statement-breakpoint
ALTER TABLE "blogs" ADD CONSTRAINT "blogs_category_id_blog_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."blog_categories"("id") ON DELETE set null ON UPDATE no action;