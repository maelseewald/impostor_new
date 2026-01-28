package com.impostor.impostor.mapper;

import com.impostor.impostor.entity.Vote;
import com.impostor.impostor.generated.model.VoteDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public abstract class VoteMapper {
    @Mapping(target = "gameId", source = "game.gameId")
    @Mapping(target = "voterId", source = "vote.voter.id")
    @Mapping(target = "votedPlayerId", source = "vote.votee.id")
    public abstract VoteDTO toVoteDTO(Vote vote);
}
