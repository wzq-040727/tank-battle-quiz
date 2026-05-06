package com.tankquiz.controller;

import com.tankquiz.entity.Notebook;
import com.tankquiz.service.NotebookService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notebook")
public class NotebookController {

    private final NotebookService notebookService;

    public NotebookController(NotebookService notebookService) {
        this.notebookService = notebookService;
    }

    @PostMapping
    public ResponseEntity<Notebook> addToNotebook(@RequestBody Map<String, Object> body) {
        Long wrongAnswerId = Long.valueOf(body.get("wrongAnswerId").toString());
        String playerName = body.get("playerName").toString();
        try {
            return ResponseEntity.ok(notebookService.addToNotebook(wrongAnswerId, playerName));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<Notebook>> getNotebook(@RequestParam String player) {
        return ResponseEntity.ok(notebookService.getNotebookByPlayer(player));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Notebook> updateNotebook(@PathVariable Long id,
                                                    @RequestBody Map<String, Object> body) {
        String note = body.containsKey("note") ? body.get("note").toString() : null;
        Boolean mastered = body.containsKey("mastered") ? Boolean.valueOf(body.get("mastered").toString()) : null;
        return ResponseEntity.ok(notebookService.updateNotebook(id, note, mastered));
    }
}
