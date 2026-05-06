package com.tankquiz.controller;

import com.tankquiz.entity.Question;
import com.tankquiz.service.QuestionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/questions")
public class QuestionController {

    private final QuestionService questionService;

    public QuestionController(QuestionService questionService) {
        this.questionService = questionService;
    }

    @GetMapping("/random")
    public ResponseEntity<Question> getRandomQuestion(
            @RequestParam(required = false) String difficulty) {
        if (difficulty != null && !difficulty.isEmpty()) {
            return questionService.getRandomByDifficulty(difficulty)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        }
        return questionService.getRandomQuestion()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Question> getQuestionById(@PathVariable Long id) {
        return questionService.getQuestionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
