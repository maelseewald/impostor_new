package com.impostor.impostor.mapper;

import com.impostor.impostor.entity.Game;
import com.impostor.impostor.generated.model.GameDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public abstract class GameMapper {
    @Mapping(target = "mainWord", source = "mainWord.word")
    @Mapping(target = "currentPlayerId", source = "currentPlayer.id")
    public abstract GameDTO toGameDTO(Game game);
}
