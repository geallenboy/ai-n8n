ALTER TABLE "learning_modules" DROP CONSTRAINT "learning_modules_slug_unique";--> statement-breakpoint
ALTER TABLE "learning_modules" DROP CONSTRAINT "learning_modules_section_id_slug_unique";--> statement-breakpoint
ALTER TABLE "learning_sections" DROP CONSTRAINT "learning_sections_slug_unique";--> statement-breakpoint
ALTER TABLE "learning_modules" DROP COLUMN "slug";--> statement-breakpoint
ALTER TABLE "learning_sections" DROP COLUMN "slug";