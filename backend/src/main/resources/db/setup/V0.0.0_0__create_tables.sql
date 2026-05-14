-- =============================================================
-- Author: Maël Seewald
-- Date: 2025-06-25
-- Version: 1.0
-- Description: Database schema for the Impostor game including tables for game, player, words, vote, and seed data
-- =============================================================

-- Table for main words (e.g., the secret word in the game)
CREATE TABLE IF NOT EXISTS main_words (
    id SERIAL PRIMARY KEY,
    word TEXT NOT NULL UNIQUE
);

-- Table for game
CREATE TABLE IF NOT EXISTS game (
    game_id TEXT PRIMARY KEY,
    main_word_id INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    current_player_id INTEGER
);

-- Table for player
CREATE TABLE IF NOT EXISTS player (
    id SERIAL PRIMARY KEY,
    game_id TEXT NOT NULL,
    name TEXT NOT NULL,
    is_impostor BOOLEAN NOT NULL DEFAULT FALSE,
    is_host BOOLEAN NOT NULL DEFAULT FALSE,
    player_token TEXT NOT NULL UNIQUE
);

-- Words submitted by player
CREATE TABLE IF NOT EXISTS player_word (
    id SERIAL PRIMARY KEY,
    word TEXT NOT NULL,
    player_id INTEGER NOT NULL,
    game_id TEXT NOT NULL
);

-- Votes during the game (e.g., who voted for whom)
CREATE TABLE IF NOT EXISTS vote (
    id SERIAL PRIMARY KEY,
    game_id TEXT NOT NULL,
    voter_id INTEGER NOT NULL,
    votee_id INTEGER NOT NULL
);

