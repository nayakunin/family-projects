DO $$ BEGIN
 CREATE TYPE "public"."groupRole" AS ENUM('owner', 'member');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."permission" AS ENUM('read', 'write', 'delete');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "group" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"ownerId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "userGroupPermissions" (
	"userId" text NOT NULL,
	"groupId" text NOT NULL,
	"permission" "permission" NOT NULL,
	CONSTRAINT "userGroupPermissions_userId_groupId_permission_pk" PRIMARY KEY("userId","groupId","permission")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "userGroups" (
	"userId" text NOT NULL,
	"role" "groupRole" DEFAULT 'member' NOT NULL,
	"groupId" text NOT NULL,
	CONSTRAINT "userGroups_userId_groupId_pk" PRIMARY KEY("userId","groupId")
);
--> statement-breakpoint
ALTER TABLE "recipes" ADD COLUMN "createdBy" text NOT NULL;--> statement-breakpoint
ALTER TABLE "recipes" ADD COLUMN "groupId" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "group" ADD CONSTRAINT "group_ownerId_user_id_fk" FOREIGN KEY ("ownerId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "userGroupPermissions" ADD CONSTRAINT "userGroupPermissions_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "userGroupPermissions" ADD CONSTRAINT "userGroupPermissions_groupId_group_id_fk" FOREIGN KEY ("groupId") REFERENCES "public"."group"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "userGroups" ADD CONSTRAINT "userGroups_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "userGroups" ADD CONSTRAINT "userGroups_groupId_group_id_fk" FOREIGN KEY ("groupId") REFERENCES "public"."group"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "uniqueName" ON "group" ("name");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "recipes" ADD CONSTRAINT "recipes_createdBy_user_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "recipes" ADD CONSTRAINT "recipes_groupId_group_id_fk" FOREIGN KEY ("groupId") REFERENCES "public"."group"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
