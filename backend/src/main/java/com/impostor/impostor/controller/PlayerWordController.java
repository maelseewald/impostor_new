package com.impostor.impostor.controller;

import com.impostor.impostor.generated.api.PlayerwordApi;
import com.impostor.impostor.generated.model.PlayerWordDTO;
import com.impostor.impostor.service.PlayerWordService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")

public class PlayerWordController implements PlayerwordApi {
    private final PlayerWordService playerWordService;

    @Override
    public ResponseEntity<List<PlayerWordDTO>> getPlayerWords(
        String gameId
    ) {
        List<PlayerWordDTO> playerWordDTOs = playerWordService.getPlayerWords(gameId);
        return ResponseEntity
            .status(HttpStatus.OK)
            .body(playerWordDTOs);
    }
}
