package com.impostor.impostor.repository;

import com.impostor.impostor.entity.Game;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GameRepository extends JpaRepository<Game, String> {
}
