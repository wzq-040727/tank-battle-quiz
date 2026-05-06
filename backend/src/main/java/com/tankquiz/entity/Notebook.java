package com.tankquiz.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notebook")
public class Notebook {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "wrong_answer_id", nullable = false)
    private WrongAnswer wrongAnswer;

    @Column(nullable = false, length = 50)
    private String playerName;

    @Column(columnDefinition = "TEXT")
    private String note;

    @Column(nullable = false)
    private Integer reviewCount = 0;

    @Column(nullable = false)
    private Boolean mastered = false;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public WrongAnswer getWrongAnswer() { return wrongAnswer; }
    public void setWrongAnswer(WrongAnswer wrongAnswer) { this.wrongAnswer = wrongAnswer; }
    public String getPlayerName() { return playerName; }
    public void setPlayerName(String playerName) { this.playerName = playerName; }
    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
    public Integer getReviewCount() { return reviewCount; }
    public void setReviewCount(Integer reviewCount) { this.reviewCount = reviewCount; }
    public Boolean getMastered() { return mastered; }
    public void setMastered(Boolean mastered) { this.mastered = mastered; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
