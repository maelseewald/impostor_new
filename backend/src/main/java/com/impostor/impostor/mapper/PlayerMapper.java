package com.impostor.impostor.mapper;

import com.impostor.impostor.entity.Player;
import com.impostor.impostor.generated.model.PlayerDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public abstract class PlayerMapper {
    @Mapping(target = "playerId", source = "player.id")
    @Mapping(target = "gameId", source = "game.gameId")
    @Mapping(target = "isImpostor", source = "impostor")
    @Mapping(target = "isHost", source = "host")
    public abstract PlayerDTO toPlayerDTO(Player player);
}
