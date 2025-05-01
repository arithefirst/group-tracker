ALTER TABLE "location_data" DROP CONSTRAINT "location_data_user_approved_locations_name_fk";
--> statement-breakpoint
ALTER TABLE "location_data" ADD PRIMARY KEY ("user");--> statement-breakpoint
ALTER TABLE "location_data" ADD COLUMN "location" text NOT NULL;--> statement-breakpoint
ALTER TABLE "location_data" ADD CONSTRAINT "location_data_location_approved_locations_name_fk" FOREIGN KEY ("location") REFERENCES "public"."approved_locations"("name") ON DELETE cascade ON UPDATE no action;