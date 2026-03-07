-- Remove CA-specific columns and add unified range_km + region_note
ALTER TABLE "vehicle" ADD COLUMN "range_km" integer;
ALTER TABLE "vehicle" ADD COLUMN "region_note" varchar(50);

-- Populate range_km from existing range_epa data (miles * 1.60934)
UPDATE "vehicle" SET "range_km" = ROUND("range_epa" * 1.60934) WHERE "range_epa" IS NOT NULL;

-- Mark vehicles that were CA-unavailable as "US only"
UPDATE "vehicle" SET "region_note" = 'US only' WHERE "ca_available" = false;

-- Drop CA-specific columns
ALTER TABLE "vehicle" DROP COLUMN IF EXISTS "ca_trim_name";
ALTER TABLE "vehicle" DROP COLUMN IF EXISTS "ca_range_epa_km";
ALTER TABLE "vehicle" DROP COLUMN IF EXISTS "ca_acceleration_0100";
ALTER TABLE "vehicle" DROP COLUMN IF EXISTS "ca_top_speed_kmh";
ALTER TABLE "vehicle" DROP COLUMN IF EXISTS "ca_horsepower";
ALTER TABLE "vehicle" DROP COLUMN IF EXISTS "ca_supercharger_rate_max";
ALTER TABLE "vehicle" DROP COLUMN IF EXISTS "ca_available";
