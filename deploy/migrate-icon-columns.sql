-- Run this on production DB before deploying the icon upload feature.
-- Makes asset_key nullable and adds image_url for uploaded icons.

ALTER TABLE task_icons ALTER COLUMN asset_key DROP NOT NULL;
ALTER TABLE task_icons ADD COLUMN IF NOT EXISTS image_url TEXT;
