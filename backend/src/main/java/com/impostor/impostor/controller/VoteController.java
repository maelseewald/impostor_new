package com.impostor.impostor.controller;

import com.impostor.impostor.entity.Vote;
import com.impostor.impostor.generated.api.VoteApi;
import com.impostor.impostor.generated.model.VoteDTO;
import com.impostor.impostor.generated.model.VoteRequestDTO;
import com.impostor.impostor.mapper.VoteMapper;
import com.impostor.impostor.service.VoteService;
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
public class VoteController implements VoteApi {
    private final VoteService voteService;
    private final VoteMapper voteMapper;

    @Override
    public ResponseEntity<VoteDTO> voteForPlayer(
        String gameId, @Valid @RequestBody VoteRequestDTO voteRequestDTO
    ) {
        Vote vote = voteService.voteForPlayer(gameId, voteRequestDTO);
        VoteDTO responseDTO = voteMapper.toVoteDTO(vote);

        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(responseDTO);
    }

    @Override
    public ResponseEntity<List<VoteDTO>> getVotesByGameId(
        String gameId
    ) {
        List<VoteDTO> voteDTOs = voteService.getVotesByGameId(gameId);

        return ResponseEntity
            .status(HttpStatus.OK)
            .body(voteDTOs);
    }

}
