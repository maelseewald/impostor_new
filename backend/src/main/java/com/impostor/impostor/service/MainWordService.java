package com.impostor.impostor.service;

import com.impostor.impostor.entity.MainWord;
import com.impostor.impostor.exception.GameNotFound;
import com.impostor.impostor.generated.model.MainWordDTO;
import com.impostor.impostor.mapper.MainWordMapper;
import com.impostor.impostor.repository.MainWordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.text.MessageFormat;

@Service
@RequiredArgsConstructor
public class MainWordService {
    private final MainWordRepository mainWordRepository;
    private final MainWordMapper mainWordMapper;

    public MainWord getMainWord(Integer mainWordId) {
        return mainWordRepository.findById(mainWordId)
            .orElseThrow(() -> new GameNotFound(
                MessageFormat.format("MainWord of Game with ID {0} not found", mainWordId)
            ));

    }

    public MainWordDTO toMainWordDTO(MainWord mainWord) {
        return mainWordMapper.toMainWordDTO(mainWord);
    }
}
