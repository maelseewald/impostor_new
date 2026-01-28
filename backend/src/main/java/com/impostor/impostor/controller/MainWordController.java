package com.impostor.impostor.controller;

import com.impostor.impostor.entity.MainWord;
import com.impostor.impostor.generated.api.MainwordApi;
import com.impostor.impostor.generated.model.MainWordDTO;
import com.impostor.impostor.service.MainWordService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class MainWordController implements MainwordApi {
    private final MainWordService mainWordService;

    @Override
    public ResponseEntity<MainWordDTO> getMainWord(
        Integer mainWordId
    ) {
        MainWord mainWord = mainWordService.getMainWord(mainWordId);
        MainWordDTO mainWordDTO = mainWordService.toMainWordDTO(mainWord);

        return ResponseEntity
            .status(HttpStatus.OK)
            .body(mainWordDTO);
    }
}
