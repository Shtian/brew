CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS brews (
  id            UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  bean_name     TEXT          NOT NULL,
  grams         DECIMAL(5,1)  NOT NULL,
  brew_time     INTEGER       NOT NULL,
  grind_setting INTEGER       NOT NULL,
  comments      TEXT,
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);
