DO $$ BEGIN
 CREATE TYPE "public"."fullness" AS ENUM('low', 'medium', 'high');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "cuisines" (
	"id" serial PRIMARY KEY NOT NULL,
	"label" varchar(256),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ingridients" (
	"id" serial PRIMARY KEY NOT NULL,
	"label" varchar(256),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "recipies" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(256) NOT NULL,
	"calories" integer DEFAULT 0 NOT NULL,
	"fullness" "fullness",
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"hero_picture_url" varchar(256),
	"content" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "recipies_to_cuisines" (
	"recipy_id" serial NOT NULL,
	"cuisine_id" serial NOT NULL,
	CONSTRAINT "recipies_to_cuisines_recipy_id_cuisine_id_pk" PRIMARY KEY("recipy_id","cuisine_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "recipies_to_ingridients" (
	"recipy_id" serial NOT NULL,
	"ingridient_id" serial NOT NULL,
	CONSTRAINT "recipies_to_ingridients_recipy_id_ingridient_id_pk" PRIMARY KEY("recipy_id","ingridient_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "recipies_to_cuisines" ADD CONSTRAINT "recipies_to_cuisines_recipy_id_recipies_id_fk" FOREIGN KEY ("recipy_id") REFERENCES "public"."recipies"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "recipies_to_cuisines" ADD CONSTRAINT "recipies_to_cuisines_cuisine_id_cuisines_id_fk" FOREIGN KEY ("cuisine_id") REFERENCES "public"."cuisines"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "recipies_to_ingridients" ADD CONSTRAINT "recipies_to_ingridients_recipy_id_recipies_id_fk" FOREIGN KEY ("recipy_id") REFERENCES "public"."recipies"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "recipies_to_ingridients" ADD CONSTRAINT "recipies_to_ingridients_ingridient_id_ingridients_id_fk" FOREIGN KEY ("ingridient_id") REFERENCES "public"."ingridients"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "cuisine_label_index" ON "cuisines" ("label");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "ingridient_label_index" ON "ingridients" ("label");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "title_index" ON "recipies" ("title");