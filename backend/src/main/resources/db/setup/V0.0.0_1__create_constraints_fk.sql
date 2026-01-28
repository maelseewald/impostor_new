ALTER TABLE game
ADD CONSTRAINT games_main_word_id_fk
FOREIGN KEY (main_word_id)
REFERENCES main_words(id);

ALTER TABLE game
ADD CONSTRAINT games_current_player_id_fk
FOREIGN KEY (current_player_id)
REFERENCES player(id);

ALTER TABLE player
ADD CONSTRAINT players_game_id_fk
FOREIGN KEY (game_id)
REFERENCES game(game_id)
ON DELETE CASCADE;

ALTER TABLE player_word
ADD CONSTRAINT playerwords_game_id_fk
FOREIGN KEY (game_id)
REFERENCES game(game_id)
ON DELETE CASCADE;

ALTER TABLE player_word
ADD CONSTRAINT playerwords_players_id_fk
FOREIGN KEY (player_id)
REFERENCES player(id)
ON DELETE CASCADE;

ALTER TABLE vote
ADD CONSTRAINT votes_game_id_fk
FOREIGN KEY (game_id)
REFERENCES game(game_id)
ON DELETE CASCADE;

ALTER TABLE vote
ADD CONSTRAINT votes_voter_id_fk
FOREIGN KEY (voter_id)
REFERENCES player(id)
ON DELETE CASCADE;

ALTER TABLE vote
ADD CONSTRAINT votes_votee_id_fk
FOREIGN KEY (votee_id)
REFERENCES player(id)
ON DELETE CASCADE;
