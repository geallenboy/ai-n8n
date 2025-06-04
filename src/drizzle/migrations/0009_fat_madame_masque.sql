CREATE TABLE "tutorial_steps" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"module_id" uuid NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"step_type" text DEFAULT 'content' NOT NULL,
	"video_url" text,
	"exercise_data" jsonb,
	"order" integer NOT NULL,
	"estimated_time_minutes" integer DEFAULT 5,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "tutorial_steps_module_id_order_unique" UNIQUE("module_id","order")
);
--> statement-breakpoint
CREATE TABLE "user_step_progress" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"step_id" uuid NOT NULL,
	"is_completed" boolean DEFAULT false,
	"time_spent" integer DEFAULT 0,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "user_step_progress_user_id_step_id_unique" UNIQUE("user_id","step_id")
);
--> statement-breakpoint
ALTER TABLE "tutorial_modules" ADD COLUMN "difficulty" text DEFAULT 'beginner' NOT NULL;--> statement-breakpoint
ALTER TABLE "tutorial_modules" ADD COLUMN "prerequisites" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "tutorial_modules" ADD COLUMN "learning_objectives" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "tutorial_modules" ADD COLUMN "tags" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "tutorial_modules" ADD COLUMN "is_published" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "tutorial_sections" ADD COLUMN "icon" text DEFAULT 'BookOpen';--> statement-breakpoint
ALTER TABLE "tutorial_sections" ADD COLUMN "color" text DEFAULT 'blue';--> statement-breakpoint
ALTER TABLE "tutorial_sections" ADD COLUMN "difficulty" text DEFAULT 'beginner' NOT NULL;--> statement-breakpoint
ALTER TABLE "tutorial_sections" ADD COLUMN "is_active" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "user_tutorial_progress" ADD COLUMN "progress" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "user_tutorial_progress" ADD COLUMN "time_spent" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "user_tutorial_progress" ADD COLUMN "notes" text;--> statement-breakpoint
ALTER TABLE "user_tutorial_progress" ADD COLUMN "rating" integer;--> statement-breakpoint
ALTER TABLE "tutorial_steps" ADD CONSTRAINT "tutorial_steps_module_id_tutorial_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."tutorial_modules"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_step_progress" ADD CONSTRAINT "user_step_progress_step_id_tutorial_steps_id_fk" FOREIGN KEY ("step_id") REFERENCES "public"."tutorial_steps"("id") ON DELETE cascade ON UPDATE no action;