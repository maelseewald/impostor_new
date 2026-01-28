package com.impostor.impostor.service;

import com.impostor.impostor.entity.Game;
import com.impostor.impostor.entity.Player;
import com.impostor.impostor.entity.Vote;
import com.impostor.impostor.exception.GameNotFound;
import com.impostor.impostor.generated.model.GameDTO;
import com.impostor.impostor.generated.model.ResultDTO;
import com.impostor.impostor.generated.model.VoteDTO;
import com.impostor.impostor.generated.model.VoteRequestDTO;
import com.impostor.impostor.mapper.GameMapper;
import com.impostor.impostor.mapper.VoteMapper;
import com.impostor.impostor.repository.GameRepository;
import com.impostor.impostor.repository.PlayerRepository;
import com.impostor.impostor.repository.VoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.text.MessageFormat;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class VoteService {

    private final VoteRepository voteRepository;
    private final GameRepository gameRepository;
    private final PlayerRepository playerRepository;
    private final VoteMapper voteMapper;
    private final GameMapper gameMapper;

    public Vote voteForPlayer(String gameId, VoteRequestDTO dto) {
        Game game = gameRepository.findById(gameId)
            .orElseThrow(() -> new GameNotFound(
                MessageFormat.format("Game with ID {0} not found", gameId)));

        Player voter = playerRepository.findByPlayerToken(dto.getPlayerToken())
            .orElseThrow(() -> new IllegalStateException("Voter not found"));

        Player votedFor = playerRepository.findByGameAndName(game, dto.getVotedFor())
            .orElseThrow(() -> new IllegalStateException("Votee not found"));

        boolean hasAlreadyVoted = voteRepository.existsByGameAndVoterPlayerToken(game, voter.getPlayerToken());

        if (hasAlreadyVoted) {
            throw new IllegalStateException("Player has already voted");
        }

        Vote vote = new Vote();
        vote.setGame(game);
        vote.setVoter(voter);
        vote.setVotee(votedFor);

        return voteRepository.save(vote);
    }

    public List<VoteDTO> getVotesByGameId(String gameId) {
        Optional<Game> optionalGame = gameRepository.findById(gameId);
        if (optionalGame.isEmpty()) {
            throw new GameNotFound(gameId);
        }
        List<Vote> votes = voteRepository.findByGame(optionalGame.get());

        return votes.stream()
            .map(this::toVoteDTO)
            .toList();

    }

    public ResultDTO getResultsByGameId(String gameId) {
        Optional<Game> game = gameRepository.findById(gameId);
        if (game.isEmpty()) {
            throw new GameNotFound(gameId);
        }
        GameDTO gameDTO = gameMapper.toGameDTO(game.get());

        List<VoteDTO> votesDTOs = voteRepository.findByGame(game.get()).stream()
            .map(this::toVoteDTO)
            .toList();

        ResultDTO resultDTO = new ResultDTO();
        resultDTO.setVotes(votesDTOs);
        resultDTO.setGame(gameDTO);
        return resultDTO;
    }

    public VoteDTO toVoteDTO(Vote vote) {
        return voteMapper.toVoteDTO(vote);
    }

}
