ALTER TABLE player
    ALTER COLUMN is_impostor DROP DEFAULT,
    ALTER COLUMN is_impostor TYPE boolean USING is_impostor::boolean,
    ALTER COLUMN is_impostor SET DEFAULT FALSE;


ALTER TABLE player
    ALTER COLUMN is_host DROP DEFAULT,
    ALTER COLUMN is_host TYPE boolean USING is_host::boolean,
    ALTER COLUMN is_host SET DEFAULT FALSE;

