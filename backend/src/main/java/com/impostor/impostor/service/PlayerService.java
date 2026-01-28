package com.impostor.impostor.service;

import com.impostor.impostor.entity.Game;
import com.impostor.impostor.entity.Player;
import com.impostor.impostor.exception.GameNotFound;
import com.impostor.impostor.generated.model.PlayerDTO;
import com.impostor.impostor.mapper.PlayerMapper;
import com.impostor.impostor.repository.GameRepository;
import com.impostor.impostor.repository.PlayerRepository;
import com.impostor.impostor.repository.PlayerWordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.text.MessageFormat;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static com.impostor.impostor.entity.GameStatus.VOTING;

@Service
@RequiredArgsConstructor
public class PlayerService {

    private final PlayerRepository playerRepository;
    private final PlayerMapper playerMapper;
    private final GameRepository gameRepository;
    private final PlayerWordRepository playerWordRepository;

    public List<PlayerDTO> getPlayersByGameId(String gameId) {
        Optional<Game> optionalGame = gameRepository.findById(gameId);
        if (optionalGame.isEmpty()) {
            throw new GameNotFound(gameId);
        }
        Game game = optionalGame.get();

        return playerRepository.findPlayersByGame(game).stream()
            .map(this::toPlayerDTO)
            .toList();
    }

    public Player createPlayer(PlayerDTO dto) {

        Game game = gameRepository.findById(dto.getGameId())
            .orElseThrow(() -> new GameNotFound(MessageFormat.format("Game with ID {0} not found", dto.getGameId())));

        if (playerRepository.existsByNameAndGame(dto.getName(), game)) {
            throw new IllegalStateException(MessageFormat.format(
                "Player with name {0} already exists in game {1}",
                dto.getName(), dto.getGameId()
            ));
        }

        Player player = new Player();
        player.setGame(game);
        player.setName(dto.getName());
        player.setImpostor(false);
        player.setHost(dto.getIsHost());
        player.setPlayerToken(UUID.randomUUID().toString());

        return playerRepository.save(player);

    }

    public Player deletePlayer(String playerToken) {
        Player player = playerRepository.findByPlayerToken(playerToken)
            .orElseThrow(() -> new IllegalStateException(MessageFormat.format(
                "Player with token {0} not found",
                playerToken
            )));
        playerRepository.delete(player);
        return player;
    }

    public Player setImpostor(String gameId) {
        Optional<Game> optionalGame = gameRepository.findById(gameId);
        if (optionalGame.isEmpty()) {
            throw new GameNotFound(gameId);
        }

        Game game = optionalGame.get();
        List<Player> players = playerRepository.findPlayersByGame(game);
        if (players.isEmpty()) {
            throw new IllegalStateException(
                MessageFormat.format("No players found for game with ID {0}", gameId)
            );
        }

        for (Player player : players) {
            player.setImpostor(false);
        }

        int impostorIndex = (int) (Math.random() * players.size()); // NOSONAR
        Player impostor = players.get(impostorIndex);
        impostor.setImpostor(true);

        playerRepository.saveAll(players);

        return impostor;
    }

    public boolean allPlayersSubmittedWords(String gameId) {
        Game game = gameRepository.findById(gameId)
            .orElseThrow(() -> new IllegalArgumentException("Game not found: " + gameId));

        List<Player> players = playerRepository.findByGameOrderById(game);

        int currentIndex = -1;
        if (game.getCurrentPlayer() != null) {
            for (int i = 0; i < players.size(); i++) {
                if (players.get(i).getId().equals(game.getCurrentPlayer().getId())) {
                    currentIndex = i;
                    break;
                }
            }
        }

        List<Integer> submittedPlayerIds = playerWordRepository.findDistinctPlayerIdByGame(game);

        if (submittedPlayerIds.size() >= players.size()) {

            game.setStatus(VOTING);
            game.setCurrentPlayer(null);
            gameRepository.save(game);

            return true;

        } else {

            int nextIndex = (currentIndex + 1) % players.size();
            Player nextPlayer = players.get(nextIndex);
            game.setCurrentPlayer(nextPlayer);
            gameRepository.save(game);

            return false;

        }
    }

    public PlayerDTO toPlayerDTO(Player player) {
        return playerMapper.toPlayerDTO(player);
    }
}
