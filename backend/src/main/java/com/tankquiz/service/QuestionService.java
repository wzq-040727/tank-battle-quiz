package com.tankquiz.service;

import com.tankquiz.entity.Question;
import com.tankquiz.repository.QuestionRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class QuestionService {

    private final QuestionRepository questionRepository;

    public QuestionService(QuestionRepository questionRepository) {
        this.questionRepository = questionRepository;
    }

    public Optional<Question> getRandomQuestion() {
        return questionRepository.findRandomQuestion();
    }

    public Optional<Question> getRandomByDifficulty(String difficulty) {
        return questionRepository.findRandomByDifficulty(difficulty);
    }

    public Optional<Question> getQuestionById(Long id) {
        return questionRepository.findById(id);
    }
}
