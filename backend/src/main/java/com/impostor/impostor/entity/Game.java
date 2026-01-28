package com.impostor.impostor.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

@Entity
@Setter
@Getter
@Table(name = "game")
public class Game {
    @Id
    @Column(name = "game_id", nullable = false, length = 6)
    private String gameId;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "main_word_id", nullable = false)
    private MainWord mainWord;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @ColumnDefault("'LOBBY'")
    private GameStatus status = GameStatus.LOBBY;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "current_player_id")
    private Player currentPlayer;
}
