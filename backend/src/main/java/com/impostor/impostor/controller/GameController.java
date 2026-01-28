package com.impostor.impostor.controller;

import com.impostor.impostor.entity.Game;
import com.impostor.impostor.generated.api.GameApi;
import com.impostor.impostor.generated.model.GameDTO;
import com.impostor.impostor.service.GameService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class GameController implements GameApi {

    private final GameService gameService;

    @Override
    public ResponseEntity<GameDTO> getGameById(
        String gameId
    ) {
        GameDTO gameDTO = gameService.getGameById(gameId);

        return ResponseEntity
            .status(HttpStatus.OK)
            .body(gameDTO);
    }

    @Override
    public ResponseEntity<GameDTO> createGame() {
        Game game = gameService.createGame();
        GameDTO gameDTO = gameService.toGameDTO(game);

        return ResponseEntity
            .status(HttpStatus.OK)
            .body(gameDTO);
    }

    @Override
    public ResponseEntity<GameDTO> updateGameWord(
        String gameId
    ) {
        Game game = gameService.updateGameWord(gameId);
        GameDTO gameDTO = gameService.toGameDTO(game);

        return ResponseEntity
            .status(HttpStatus.OK)
            .body(gameDTO);
    }

}
