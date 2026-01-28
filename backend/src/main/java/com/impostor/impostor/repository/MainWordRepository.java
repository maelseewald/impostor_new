package com.impostor.impostor.repository;

import com.impostor.impostor.entity.MainWord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface MainWordRepository extends JpaRepository<MainWord, Integer> {
    @Query("SELECT MIN(m.id) FROM MainWord m")
    Integer findMinId();
}

