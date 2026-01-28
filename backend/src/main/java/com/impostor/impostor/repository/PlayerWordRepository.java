package com.impostor.impostor.repository;

import com.impostor.impostor.entity.Game;
import com.impostor.impostor.entity.Player;
import com.impostor.impostor.entity.PlayerWord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PlayerWordRepository extends JpaRepository<PlayerWord, Integer> {
    List<PlayerWord> findByGame(Game game);

    void deleteByGame(Game game);

    Optional<PlayerWord> findByPlayerAndGame(Player player, Game game);

    @Query("SELECT DISTINCT pw.player.id FROM PlayerWord pw WHERE pw.game = :game")
    List<Integer> findDistinctPlayerIdByGame(@Param("game") Game game);

}

