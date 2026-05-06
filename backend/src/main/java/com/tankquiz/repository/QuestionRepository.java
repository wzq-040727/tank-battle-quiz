package com.tankquiz.repository;

import com.tankquiz.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.Optional;

public interface QuestionRepository extends JpaRepository<Question, Long> {

    @Query(value = "SELECT * FROM question ORDER BY RANDOM() LIMIT 1", nativeQuery = true)
    Optional<Question> findRandomQuestion();

    @Query(value = "SELECT * FROM question WHERE difficulty = :difficulty ORDER BY RANDOM() LIMIT 1", nativeQuery = true)
    Optional<Question> findRandomByDifficulty(String difficulty);
}
