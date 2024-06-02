DO $$ BEGIN
 CREATE TYPE "public"."fullness" AS ENUM('low', 'medium', 'high');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "cuisines" (
	"id" serial PRIMARY KEY NOT NULL,
	"label" varchar(256) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ingredients" (
	"id" serial PRIMARY KEY NOT NULL,
	"label" varchar(256) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "recipies" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(256) NOT NULL,
	"calories" integer DEFAULT 0 NOT NULL,
	"fullness" "fullness" DEFAULT 'medium' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"hero_picture_url" varchar(256),
	"content" text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "recipies_to_cuisines" (
	"recipy_id" serial NOT NULL,
	"cuisine_id" serial NOT NULL,
	CONSTRAINT "recipies_to_cuisines_recipy_id_cuisine_id_pk" PRIMARY KEY("recipy_id","cuisine_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "recipies_to_ingredients" (
	"recipy_id" serial NOT NULL,
	"ingredient_id" serial NOT NULL,
	CONSTRAINT "recipies_to_ingredients_recipy_id_ingredient_id_pk" PRIMARY KEY("recipy_id","ingredient_id")
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
 ALTER TABLE "recipies_to_ingredients" ADD CONSTRAINT "recipies_to_ingredients_recipy_id_recipies_id_fk" FOREIGN KEY ("recipy_id") REFERENCES "public"."recipies"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "recipies_to_ingredients" ADD CONSTRAINT "recipies_to_ingredients_ingredient_id_ingredients_id_fk" FOREIGN KEY ("ingredient_id") REFERENCES "public"."ingredients"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "cuisine_label_index" ON "cuisines" ("label");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "ingredient_label_index" ON "ingredients" ("label");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "title_index" ON "recipies" ("title");