ALTER TYPE "public"."vocabulary_type" ADD VALUE 'number';--> statement-breakpoint
CREATE TABLE "language_level" (
	"id" serial PRIMARY KEY NOT NULL,
	"language_id" integer NOT NULL,
	"level" integer NOT NULL,
	"description" text NOT NULL,
	"complexity" text NOT NULL,
	"allowed_types" jsonb NOT NULL,
	"examples" jsonb NOT NULL,
	"grammar_focus" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "language_level" ADD CONSTRAINT "language_level_language_id_language_id_fk" FOREIGN KEY ("language_id") REFERENCES "public"."language"("id") ON DELETE no action ON UPDATE no action;