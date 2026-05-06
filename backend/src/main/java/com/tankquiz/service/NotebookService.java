package com.tankquiz.service;

import com.tankquiz.entity.Notebook;
import com.tankquiz.entity.WrongAnswer;
import com.tankquiz.repository.NotebookRepository;
import com.tankquiz.repository.WrongAnswerRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotebookService {

    private final NotebookRepository notebookRepository;
    private final WrongAnswerRepository wrongAnswerRepository;

    public NotebookService(NotebookRepository notebookRepository,
                           WrongAnswerRepository wrongAnswerRepository) {
        this.notebookRepository = notebookRepository;
        this.wrongAnswerRepository = wrongAnswerRepository;
    }

    public Notebook addToNotebook(Long wrongAnswerId, String playerName) {
        WrongAnswer wa = wrongAnswerRepository.findById(wrongAnswerId)
                .orElseThrow(() -> new RuntimeException("WrongAnswer not found: " + wrongAnswerId));
        if (notebookRepository.existsByWrongAnswerIdAndPlayerName(wrongAnswerId, playerName)) {
            throw new IllegalStateException("Already in notebook");
        }
        Notebook nb = new Notebook();
        nb.setWrongAnswer(wa);
        nb.setPlayerName(playerName);
        return notebookRepository.save(nb);
    }

    public List<Notebook> getNotebookByPlayer(String playerName) {
        return notebookRepository.findByPlayerNameOrderByCreatedAtDesc(playerName);
    }

    public Notebook updateNotebook(Long id, String note, Boolean mastered) {
        Notebook nb = notebookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notebook entry not found: " + id));
        if (note != null) nb.setNote(note);
        if (mastered != null) nb.setMastered(mastered);
        nb.setReviewCount(nb.getReviewCount() + 1);
        return notebookRepository.save(nb);
    }
}
