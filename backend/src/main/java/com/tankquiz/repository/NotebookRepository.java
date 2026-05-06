package com.tankquiz.repository;

import com.tankquiz.entity.Notebook;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotebookRepository extends JpaRepository<Notebook, Long> {
    List<Notebook> findByPlayerNameOrderByCreatedAtDesc(String playerName);
    boolean existsByWrongAnswerIdAndPlayerName(Long wrongAnswerId, String playerName);
}
