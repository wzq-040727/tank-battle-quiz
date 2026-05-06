package com.tankquiz.service;

import com.tankquiz.entity.Question;
import com.tankquiz.entity.WrongAnswer;
import com.tankquiz.repository.QuestionRepository;
import com.tankquiz.repository.WrongAnswerRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WrongAnswerService {

    private final WrongAnswerRepository wrongAnswerRepository;
    private final QuestionRepository questionRepository;

    public WrongAnswerService(WrongAnswerRepository wrongAnswerRepository,
                              QuestionRepository questionRepository) {
        this.wrongAnswerRepository = wrongAnswerRepository;
        this.questionRepository = questionRepository;
    }

    public WrongAnswer recordWrongAnswer(Long questionId, String playerName, String wrongOption) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found: " + questionId));
        WrongAnswer wa = new WrongAnswer();
        wa.setQuestion(question);
        wa.setPlayerName(playerName);
        wa.setWrongOption(wrongOption);
        return wrongAnswerRepository.save(wa);
    }

    public List<WrongAnswer> getWrongAnswersByPlayer(String playerName) {
        return wrongAnswerRepository.findByPlayerNameOrderByCreatedAtDesc(playerName);
    }
}
