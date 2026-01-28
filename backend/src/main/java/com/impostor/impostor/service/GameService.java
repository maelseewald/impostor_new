package com.impostor.impostor.service;

import com.impostor.impostor.entity.*;
import com.impostor.impostor.exception.GameNotFound;
import com.impostor.impostor.generated.model.GameDTO;
import com.impostor.impostor.generated.model.RestartRequestDTO;
import com.impostor.impostor.mapper.GameMapper;
import com.impostor.impostor.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.text.MessageFormat;
import java.util.List;
import java.util.Optional;
import java.util.Random;

import static com.impostor.impostor.entity.GameStatus.COMPLETED;
import static com.impostor.impostor.entity.GameStatus.LOBBY;

@Service
@RequiredArgsConstructor
public class GameService {

    private static final Random RANDOM = new Random(); // NOSONAR
    private final GameRepository gameRepository;
    private final GameMapper gameMapper;
    private final MainWordRepository mainWordRepository;
    private final PlayerRepository playerRepository;
    private final PlayerWordRepository playerWordRepository;
    private final VoteRepository voteRepository;

    public String generateUniqueGameId() {
        String newIdString;

        do {
            int newId = RANDOM.nextInt(100000, 1000000);
            newIdString = String.valueOf(newId);
        } while (gameRepository.existsById(newIdString));

        return newIdString;
    }

    public int generateRandomGameWordId() {
        long numOfWords = mainWordRepository.count();
        if (numOfWords <= 0) {
            throw new IllegalStateException("No main words available in the database");

        }
        int minId = mainWordRepository.findMinId();
        return RANDOM.nextInt((int) numOfWords) + minId;
    }

    public GameDTO getGameById(String gameId) {
        Game game = gameRepository.findById(gameId)
            .orElseThrow(() -> new GameNotFound(MessageFormat.format("Game with ID {0} not found", gameId)));
        return toGameDTO(game);
    }

    public Game createGame() {
        int mainWordId = generateRandomGameWordId();
        String gameId = generateUniqueGameId();

        MainWord mainWord = mainWordRepository.findById(mainWordId)
            .orElseThrow(() -> new IllegalStateException("Mainword not found"));

        Game game = new Game();
        game.setGameId(gameId);
        game.setMainWord(mainWord);
        game.setStatus(LOBBY);

        return gameRepository.save(game);
    }

    public Game updateGameWord(
        String gameId
    ) {
        int mainWordId = generateRandomGameWordId();
        MainWord mainWord = mainWordRepository.findById(mainWordId)
            .orElseThrow(() -> new IllegalStateException("Mainword not found"));

        Game game = gameRepository.findById(gameId)
            .orElseThrow(() -> new GameNotFound(MessageFormat.format("Game with ID {0} not found", gameId)));

        game.setMainWord(mainWord);
        return gameRepository.save(game);
    }

    public Game startgame(String gameId) {
        Game game = gameRepository.findById(gameId)
            .orElseThrow(() -> new IllegalArgumentException("Game not found: " + gameId));

        List<Player> players = playerRepository.findByGameOrderById(game);
        if (players.isEmpty()) {
            throw new IllegalStateException("No players found for game " + gameId);
        }

        Player firstPlayer = players.getFirst();

        game.setStatus(GameStatus.PLAYING);
        game.setCurrentPlayer(firstPlayer);
        return gameRepository.save(game);

    }

    public void completeGame(String gameId) {
        Game game = gameRepository.findById(gameId)
            .orElseThrow(() -> new GameNotFound(gameId));

        game.setStatus(COMPLETED);
        gameRepository.save(game);

    }

    @Transactional
    public RestartGameStatus prepareGameRestart(RestartRequestDTO restartRequestDTO) {
        String gameId = restartRequestDTO.getGameId();
        String playerToken = restartRequestDTO.getPlayerToken();
        Game game = gameRepository.findById(gameId)
            .orElseThrow(() -> new GameNotFound(gameId));

        Optional<Player> player = playerRepository.findByPlayerTokenAndHostTrue(playerToken);
        if (player.isEmpty()) {
            return RestartGameStatus.PLAYER_NOT_HOST;
        }

        playerWordRepository.deleteByGame(game);
        voteRepository.deleteByGame(game);
        playerRepository.resetPlayersInGame(gameId);
        game.setStatus(LOBBY);
        gameRepository.save(game);

        return RestartGameStatus.SUCCESS;

    }

    public GameDTO toGameDTO(Game game) {
        return gameMapper.toGameDTO(game);
    }

}
