ALTER TABLE "tutorial_sections" ADD COLUMN "title_zh" text;--> statement-breakpoint
ALTER TABLE "tutorial_sections" ADD COLUMN "description_zh" text;--> statement-breakpoint
ALTER TABLE "tutorial_sections" DROP COLUMN "title_en";--> statement-breakpoint
ALTER TABLE "tutorial_sections" DROP COLUMN "description_en";