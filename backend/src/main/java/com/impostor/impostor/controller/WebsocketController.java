package com.impostor.impostor.controller;

import com.impostor.impostor.entity.PlayerWord;
import com.impostor.impostor.entity.RestartGameStatus;
import com.impostor.impostor.generated.model.GameDTO;
import com.impostor.impostor.generated.model.PlayerDTO;
import com.impostor.impostor.generated.model.PlayerWordDTO;
import com.impostor.impostor.generated.model.RestartRequestDTO;
import com.impostor.impostor.service.GameService;
import com.impostor.impostor.service.PlayerService;
import com.impostor.impostor.service.PlayerWordService;
import com.corundumstudio.socketio.AckRequest;
import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.SocketIOServer;
import com.corundumstudio.socketio.listener.DataListener;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

import static com.impostor.impostor.entity.GameStatus.VOTING;

@Component
@RequiredArgsConstructor
public class WebsocketController {

    private static final Logger LOGGER = LoggerFactory.getLogger(WebsocketController.class);
    private static final String MESSAGE_KEY = "message";
    private static final String LOBBY_PLAYERS_KEY = "lobbyPlayers";

    private final SocketIOServer socketServer;
    private final PlayerService playerService;
    private final PlayerWordService playerWordService;
    private final GameService gameService;

    private final DataListener<String> joinGame = initializeJoinGameListener();

    private final DataListener<String> joinVoting = initializejoinVotingListener();

    private final DataListener<String> updateLobby = initializeUpdateLobby();

    private final DataListener<String> startGame = initializeStartGame();

    private final DataListener<PlayerWordDTO> submitWord = initializeSubmitWord();

    private final DataListener<String> voted = initializeVoted();

    private final DataListener<RestartRequestDTO> restartGame = initializeRestartGame();

    @PostConstruct
    public void registerEventListeners() {
        socketServer.addEventListener("joinGame", String.class, joinGame);
        socketServer.addEventListener("updateLobby", String.class, updateLobby);
        socketServer.addEventListener("startGame", String.class, startGame);
        socketServer.addEventListener("submitWord", PlayerWordDTO.class, submitWord);
        socketServer.addEventListener("voted", String.class, voted);
        socketServer.addEventListener("joinVoting", String.class, joinVoting);
        socketServer.addEventListener("restartGame", RestartRequestDTO.class, restartGame);

    }

    private DataListener<String> initializejoinVotingListener() {
        return new DataListener<>() {
            @Override
            public void onData(SocketIOClient client, String gameId, AckRequest ackRequest) {
                client.joinRoom(gameId);
            }
        };
    }

    private DataListener<String> initializeVoted() {
        return new DataListener<>() {
            @Override
            public void onData(SocketIOClient client, String gameId, AckRequest ackRequest) {
                boolean allPlayersVoted = playerWordService.allPlayersVoted(gameId);
                if (allPlayersVoted) {
                    socketServer.getRoomOperations(gameId).sendEvent("votingComplete");
                    gameService.completeGame(gameId);
                }
            }
        };
    }

    private DataListener<RestartRequestDTO> initializeRestartGame() {
        return new DataListener<>() {
            @Override
            public void onData(SocketIOClient client, RestartRequestDTO restartRequestDTO, AckRequest ackRequest) {
                try {
                    RestartGameStatus restartGameStatus = gameService.prepareGameRestart(restartRequestDTO);
                    if (restartGameStatus == RestartGameStatus.SUCCESS) {
                        client.sendEvent(
                            "restartSuccess", Map.of(
                                MESSAGE_KEY, "Game successfully restarted",
                                "gameId", restartRequestDTO.getGameId()
                            )
                        );

                        socketServer.getRoomOperations(restartRequestDTO.getGameId()).sendEvent(
                            "gameRestarted", Map.of(
                                "gameId", restartRequestDTO.getGameId(),
                                MESSAGE_KEY, "The game has been restarted. New round begins!"
                            )
                        );

                    } else if (restartGameStatus == RestartGameStatus.PLAYER_NOT_HOST) {
                        client.sendEvent(
                            "restartError", Map.of(
                                MESSAGE_KEY, "Only the host can restart the game"
                            )
                        );
                    }
                } catch (RuntimeException e) {
                    client.sendEvent(
                        "restartError", Map.of(
                            MESSAGE_KEY, "An error occurred while restarting the game"
                        )
                    );
                }
            }
        };
    }

    private DataListener<String> initializeJoinGameListener() {
        return new DataListener<>() {
            @Override
            public void onData(SocketIOClient client, String gameId, AckRequest ackRequest) {
                client.joinRoom(gameId);
                LOGGER.info("🧩 Client {} joined game {}", client.getSessionId(), gameId);
            }
        };
    }

    private DataListener<String> initializeUpdateLobby() {
        return new DataListener<>() {
            @Override
            public void onData(SocketIOClient client, String gameId, AckRequest ackRequest) {
                // Add client to game room
                client.joinRoom(gameId);
                LOGGER.info("Lobby update for game {} from client {}", gameId, client.getSessionId());

                List<PlayerDTO> playerDTOs = playerService.getPlayersByGameId(gameId);
                socketServer.getRoomOperations(gameId).sendEvent(LOBBY_PLAYERS_KEY, playerDTOs);
            }
        };
    }

    private DataListener<String> initializeStartGame() {
        return new DataListener<>() {
            @Override
            public void onData(SocketIOClient client, String gameId, AckRequest ackRequest) {
                LOGGER.info("Game started in lobby {}", gameId);

                gameService.startgame(gameId);
                socketServer.getRoomOperations(gameId).sendEvent("gameStarted");
            }
        };
    }

    private DataListener<PlayerWordDTO> initializeSubmitWord() {
        return new DataListener<>() {
            @Override
            public void onData(SocketIOClient client, PlayerWordDTO data, AckRequest ackRequest) {
                String gameId = data.getGameId();

                PlayerWord playerWord = playerWordService.submitWord(data);

                client.sendEvent(
                    "wordSubmitSuccess", Map.of(
                        MESSAGE_KEY, "Word submitted successfully!",
                        "word", playerWord.getWord()
                    )
                );

                List<PlayerWordDTO> words = playerWordService.getPlayerWords(gameId);
                socketServer.getRoomOperations(gameId).sendEvent("gameWords", words);

                boolean allPlayersSubmittedWords = playerService.allPlayersSubmittedWords(gameId);

                if (allPlayersSubmittedWords) {
                    socketServer.getRoomOperations(gameId).sendEvent(
                        "gamePhaseChanged", Map.of(
                            "phase", VOTING,
                            MESSAGE_KEY, "All players have submitted their words. Voting phase begins!"
                        )
                    );
                } else {
                    List<PlayerDTO> players = playerService.getPlayersByGameId(gameId);
                    GameDTO gameDTO = gameService.getGameById(gameId);
                    Integer currentPlayerId = gameDTO.getCurrentPlayerId();

                    socketServer.getRoomOperations(gameId).sendEvent(
                        "gameUpdate", Map.of(
                            "currentPlayerId", currentPlayerId,
                            "players", players
                        )
                    );
                }
            }
        };
    }
}
