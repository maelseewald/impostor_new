package com.impostor.impostor.controller;

import com.impostor.impostor.entity.Player;
import com.impostor.impostor.generated.api.PlayerApi;
import com.impostor.impostor.generated.model.PlayerDTO;
import com.impostor.impostor.mapper.PlayerMapper;
import com.impostor.impostor.service.PlayerService;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")

public class PlayerController implements PlayerApi {
    private final PlayerService playerService;
    private final PlayerMapper playerMapper;

    @Override
    public ResponseEntity<List<PlayerDTO>> getPlayersByGameId(
        String gameId
    ) {
        List<PlayerDTO> playerDTOs = playerService.getPlayersByGameId(gameId);

        return ResponseEntity
            .status(HttpStatus.OK)
            .body(playerDTOs);
    }

    @Override
    public ResponseEntity<PlayerDTO> createPlayer(
        @Valid @RequestBody PlayerDTO playerDTO
    ) {
        Player player = playerService.createPlayer(playerDTO);
        PlayerDTO responseDTO = playerMapper.toPlayerDTO(player);

        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(responseDTO);
    }

    @Override
    public ResponseEntity<PlayerDTO> deletePlayer(String playerToken) {
        Player player = playerService.deletePlayer(playerToken);
        PlayerDTO responseDTO = playerMapper.toPlayerDTO(player);

        return ResponseEntity
            .status(HttpStatus.OK)
            .body(responseDTO);

    }

    @Override
    public ResponseEntity<PlayerDTO> setImpostor(String gameId) {
        Player player = playerService.setImpostor(gameId);
        PlayerDTO responseDTO = playerMapper.toPlayerDTO(player);

        return ResponseEntity
            .status(HttpStatus.OK)
            .body(responseDTO);

    }

}
