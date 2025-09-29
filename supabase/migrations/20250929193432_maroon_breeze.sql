-- This file will be executed when the PostgreSQL container starts
-- It's used to initialize the database with any required setup

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- The actual tables will be created by the migration script