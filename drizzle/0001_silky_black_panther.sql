CREATE TABLE "approved_locations" (
	"name" text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE "location_data" (
	"user" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "location_data" ADD CONSTRAINT "location_data_user_user_id_fk" FOREIGN KEY ("user") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "location_data" ADD CONSTRAINT "location_data_user_approved_locations_name_fk" FOREIGN KEY ("user") REFERENCES "public"."approved_locations"("name") ON DELETE cascade ON UPDATE no action;