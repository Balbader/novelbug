CREATE TABLE "likes" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"story_id" text NOT NULL,
	"created_at" integer NOT NULL,
	FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
	FOREIGN KEY ("story_id") REFERENCES "stories"("id") ON DELETE CASCADE
);
--> statement-breakpoint
CREATE UNIQUE INDEX "likes_user_story_unique" ON "likes" ("user_id", "story_id");
