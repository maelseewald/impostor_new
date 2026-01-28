package com.impostor.impostor.service;

import com.impostor.impostor.entity.Game;
import com.impostor.impostor.entity.Player;
import com.impostor.impostor.entity.PlayerWord;
import com.impostor.impostor.entity.Vote;
import com.impostor.impostor.exception.GameNotFound;
import com.impostor.impostor.generated.model.PlayerWordDTO;
import com.impostor.impostor.mapper.PlayerWordMapper;
import com.impostor.impostor.repository.GameRepository;
import com.impostor.impostor.repository.PlayerRepository;
import com.impostor.impostor.repository.PlayerWordRepository;
import com.impostor.impostor.repository.VoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PlayerWordService {

    private final PlayerWordRepository playerWordRepository;
    private final PlayerWordMapper playerWordMapper;
    private final GameRepository gameRepository;
    private final PlayerRepository playerRepository;
    private final VoteRepository voteRepository;

    public List<PlayerWordDTO> getPlayerWords(String gameId) {
        Optional<Game> optionalGame = gameRepository.findById(gameId);
        if (optionalGame.isEmpty()) {
            throw new GameNotFound(gameId);
        }
        Game game = optionalGame.get();
        List<PlayerWord> playerWords = playerWordRepository.findByGame(game);

        return playerWords.stream()
            .map(this::toPlayerWordDTO)
            .toList();

    }

    public PlayerWord submitWord(PlayerWordDTO data) {
        String gameId = data.getGameId();
        String word = data.getWord();
        String playerToken = data.getPlayerToken();

        Game game = gameRepository.findById(gameId)
            .orElseThrow(() -> new GameNotFound(gameId));

        Player player = playerRepository.findByPlayerTokenAndGame(playerToken, game)
            .orElseThrow(() -> new GameNotFound(gameId));

        if (!game.getCurrentPlayer().getId().equals(player.getId())) {
            throw new IllegalStateException("It's not your turn!");
        }

        if (playerWordRepository.findByPlayerAndGame(player, game).isPresent()) {
            throw new IllegalStateException("You have already submitted a word!");
        }

        PlayerWord playerWord = new PlayerWord();
        playerWord.setWord(word);
        playerWord.setPlayer(player);
        playerWord.setGame(game);

        return playerWordRepository.save(playerWord);
    }

    public boolean allPlayersVoted(String gameId) {
        Game game = gameRepository.findById(gameId)
            .orElseThrow(() -> new GameNotFound(gameId));

        List<Player> players = playerRepository.findPlayersByGame(game);

        List<Vote> votes = voteRepository.findByGame(game);

        return players.size() <= votes.size();
    }

    public PlayerWordDTO toPlayerWordDTO(PlayerWord playerWord) {
        return playerWordMapper.toPlayerWordDTO(playerWord);
    }
}
