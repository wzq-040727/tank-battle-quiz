package com.tankquiz.repository;

import com.tankquiz.entity.WrongAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface WrongAnswerRepository extends JpaRepository<WrongAnswer, Long> {
    List<WrongAnswer> findByPlayerNameOrderByCreatedAtDesc(String playerName);
}
