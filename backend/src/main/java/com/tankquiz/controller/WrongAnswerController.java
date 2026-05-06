package com.tankquiz.controller;

import com.tankquiz.entity.WrongAnswer;
import com.tankquiz.service.WrongAnswerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wrong-answers")
public class WrongAnswerController {

    private final WrongAnswerService wrongAnswerService;

    public WrongAnswerController(WrongAnswerService wrongAnswerService) {
        this.wrongAnswerService = wrongAnswerService;
    }

    @PostMapping
    public ResponseEntity<WrongAnswer> recordWrongAnswer(@RequestBody Map<String, Object> body) {
        Long questionId = Long.valueOf(body.get("questionId").toString());
        String playerName = body.get("playerName").toString();
        String wrongOption = body.get("wrongOption").toString();
        return ResponseEntity.ok(wrongAnswerService.recordWrongAnswer(questionId, playerName, wrongOption));
    }

    @GetMapping
    public ResponseEntity<List<WrongAnswer>> getWrongAnswers(@RequestParam String player) {
        return ResponseEntity.ok(wrongAnswerService.getWrongAnswersByPlayer(player));
    }
}
