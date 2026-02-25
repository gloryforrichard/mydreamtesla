ALTER TABLE "vehicle" ADD COLUMN "ca_trim_name" varchar(100);--> statement-breakpoint
ALTER TABLE "vehicle" ADD COLUMN "ca_range_epa_km" integer;--> statement-breakpoint
ALTER TABLE "vehicle" ADD COLUMN "ca_acceleration_0100" numeric;--> statement-breakpoint
ALTER TABLE "vehicle" ADD COLUMN "ca_top_speed_kmh" integer;--> statement-breakpoint
ALTER TABLE "vehicle" ADD COLUMN "ca_horsepower" integer;--> statement-breakpoint
ALTER TABLE "vehicle" ADD COLUMN "ca_supercharger_rate_max" integer;--> statement-breakpoint
ALTER TABLE "vehicle" ADD COLUMN "ca_available" boolean DEFAULT true;