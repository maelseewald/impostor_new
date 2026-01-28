package com.impostor.impostor.mapper;

import com.impostor.impostor.entity.PlayerWord;
import com.impostor.impostor.generated.model.PlayerWordDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public abstract class PlayerWordMapper {
    @Mapping(target = "gameId", source = "game.gameId")
    @Mapping(target = "playerToken", source = "player.playerToken")
    @Mapping(target = "playerId", source = "player.id")
    @Mapping(target = "playerName", source = "player.name")
    public abstract PlayerWordDTO toPlayerWordDTO(PlayerWord playerWord);

}
