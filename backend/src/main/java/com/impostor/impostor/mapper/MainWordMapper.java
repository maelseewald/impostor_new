package com.impostor.impostor.mapper;

import com.impostor.impostor.entity.MainWord;
import com.impostor.impostor.generated.model.MainWordDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public abstract class MainWordMapper {
    public abstract MainWordDTO toMainWordDTO(MainWord mainWord);
}
