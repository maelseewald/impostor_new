package com.impostor.impostor.repository;

import com.impostor.impostor.entity.Game;
import com.impostor.impostor.entity.Player;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PlayerRepository extends JpaRepository<Player, Integer> {

    List<Player> findPlayersByGame(Game game);

    boolean existsByNameAndGame(String name, Game game);

    Optional<Player> findByPlayerToken(String playerToken);

    Optional<Player> findByGameAndName(Game game, String name);

    Optional<Player> findByPlayerTokenAndGame(String playerToken, Game game);

    List<Player> findByGameOrderById(Game game);

    Optional<Player> findByPlayerTokenAndHostTrue(String playerToken);

    @Modifying
    @Query(value = "UPDATE player SET is_impostor = false WHERE game_id = :gameId", nativeQuery = true)
    void resetPlayersInGame(@Param("gameId") String gameId);

}

