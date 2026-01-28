package com.impostor.impostor.repository;

import com.impostor.impostor.entity.Game;
import com.impostor.impostor.entity.Vote;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VoteRepository extends JpaRepository<Vote, Integer> {
    void deleteByGame(Game game);

    List<Vote> findByGame(Game game);

    boolean existsByGameAndVoterPlayerToken(Game game, String playerToken);
}

