ALTER TABLE "download_records" DROP CONSTRAINT "download_records_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "favorites" DROP CONSTRAINT "favorites_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "share_records" DROP CONSTRAINT "share_records_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "system_logs" DROP CONSTRAINT "system_logs_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "view_records" DROP CONSTRAINT "view_records_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "download_records" ALTER COLUMN "user_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "favorites" ALTER COLUMN "user_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "share_records" ALTER COLUMN "user_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "system_logs" ALTER COLUMN "user_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "view_records" ALTER COLUMN "user_id" SET DATA TYPE text;