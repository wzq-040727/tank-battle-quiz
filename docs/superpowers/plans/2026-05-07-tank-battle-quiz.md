# 坦克大战 + Java面试题 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建网页版坦克大战游戏，击败敌方坦克触发Java面试题，答对加攻击力，答错扣血并记录错题。

**Architecture:** 前端HTML5 Canvas单页游戏 + 后端Spring Boot REST API。前端模块化（Engine/Renderer/MapGen/Quiz/UI），后端JPA + MySQL/H2。前后端通过JSON API通信。

**Tech Stack:** HTML5 Canvas, JavaScript (ES6 Modules), Java 17+, Spring Boot 3, Spring Data JPA, MySQL/H2, Maven

---

## File Structure

### 后端 (backend/)
```
backend/
├── pom.xml
├── src/main/java/com/tankquiz/
│   ├── TankQuizApplication.java
│   ├── entity/
│   │   ├── Question.java
│   │   ├── WrongAnswer.java
│   │   └── Notebook.java
│   ├── repository/
│   │   ├── QuestionRepository.java
│   │   ├── WrongAnswerRepository.java
│   │   └── NotebookRepository.java
│   ├── service/
│   │   ├── QuestionService.java
│   │   ├── WrongAnswerService.java
│   │   └── NotebookService.java
│   ├── controller/
│   │   ├── QuestionController.java
│   │   ├── WrongAnswerController.java
│   │   └── NotebookController.java
│   └── config/
│       └── CorsConfig.java
├── src/main/resources/
│   ├── application.yml
│   └── data.sql
└── src/test/java/com/tankquiz/
    ├── service/
    │   ├── QuestionServiceTest.java
    │   ├── WrongAnswerServiceTest.java
    │   └── NotebookServiceTest.java
    └── controller/
        ├── QuestionControllerTest.java
        ├── WrongAnswerControllerTest.java
        └── NotebookControllerTest.java
```

### 前端 (frontend/)
```
frontend/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── main.js
│   ├── engine/
│   │   ├── GameEngine.js
│   │   ├── InputMgr.js
│   │   └── CollisionMgr.js
│   ├── entities/
│   │   ├── Tank.js
│   │   ├── PlayerTank.js
│   │   ├── EnemyTank.js
│   │   ├── Bullet.js
│   │   └── QuizItem.js
│   ├── map/
│   │   ├── MapGen.js
│   │   └── maps.js
│   ├── quiz/
│   │   ├── QuizModule.js
│   │   └── questions.js
│   └── ui/
│       ├── Renderer.js
│       ├── UIOverlay.js
│       └── Notebook.js
└── assets/
    ├── tanks/
    ├── tiles/
    └── effects/
```

---

## Task 1: Spring Boot 项目初始化

**Files:**
- Create: `backend/pom.xml`
- Create: `backend/src/main/java/com/tankquiz/TankQuizApplication.java`
- Create: `backend/src/main/resources/application.yml`

- [ ] **Step 1: 创建 Maven pom.xml**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.5</version>
    </parent>
    <groupId>com.tankquiz</groupId>
    <artifactId>tank-quiz</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>tank-quiz</name>

    <properties>
        <java.version>17</java.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>com.h2database</groupId>
            <artifactId>h2</artifactId>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```

- [ ] **Step 2: 创建启动类**

```java
package com.tankquiz;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class TankQuizApplication {
    public static void main(String[] args) {
        SpringApplication.run(TankQuizApplication.class, args);
    }
}
```

- [ ] **Step 3: 创建 application.yml**

```yaml
server:
  port: 8080

spring:
  datasource:
    url: jdbc:h2:mem:tankquiz
    driver-class-name: org.h2.Driver
    username: sa
    password:
  h2:
    console:
      enabled: true
      path: /h2-console
  jpa:
    hibernate:
      ddl-auto: create-drop
    show-sql: true
    properties:
      hibernate:
        format_sql: true
  sql:
    init:
      mode: always
```

- [ ] **Step 4: 验证项目启动**

Run: `cd backend && mvn spring-boot:run`
Expected: 启动成功，端口8080可访问

- [ ] **Step 5: Commit**

```bash
git add backend/
git commit -m "feat: initialize Spring Boot project with H2"
```

---

## Task 2: Question 实体 + Repository + Service + Controller

**Files:**
- Create: `backend/src/main/java/com/tankquiz/entity/Question.java`
- Create: `backend/src/main/java/com/tankquiz/repository/QuestionRepository.java`
- Create: `backend/src/main/java/com/tankquiz/service/QuestionService.java`
- Create: `backend/src/main/java/com/tankquiz/controller/QuestionController.java`
- Test: `backend/src/test/java/com/tankquiz/service/QuestionServiceTest.java`
- Test: `backend/src/test/java/com/tankquiz/controller/QuestionControllerTest.java`

- [ ] **Step 1: 创建 Question 实体**

```java
package com.tankquiz.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "question")
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String category;

    @Column(nullable = false, length = 20)
    private String difficulty;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(nullable = false, length = 500)
    private String optionA;

    @Column(nullable = false, length = 500)
    private String optionB;

    @Column(nullable = false, length = 500)
    private String optionC;

    @Column(nullable = false, length = 500)
    private String optionD;

    @Column(nullable = false, length = 1)
    private String answer;

    @Column(columnDefinition = "TEXT")
    private String explanation;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public String getOptionA() { return optionA; }
    public void setOptionA(String optionA) { this.optionA = optionA; }
    public String getOptionB() { return optionB; }
    public void setOptionB(String optionB) { this.optionB = optionB; }
    public String getOptionC() { return optionC; }
    public void setOptionC(String optionC) { this.optionC = optionC; }
    public String getOptionD() { return optionD; }
    public void setOptionD(String optionD) { this.optionD = optionD; }
    public String getAnswer() { return answer; }
    public void setAnswer(String answer) { this.answer = answer; }
    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }
}
```

- [ ] **Step 2: 创建 QuestionRepository**

```java
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
```

- [ ] **Step 3: 写 QuestionService 测试**

```java
package com.tankquiz.service;

import com.tankquiz.entity.Question;
import com.tankquiz.repository.QuestionRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class QuestionServiceTest {

    @Mock
    private QuestionRepository questionRepository;

    @InjectMocks
    private QuestionService questionService;

    @Test
    void getRandomQuestion_shouldReturnQuestion() {
        Question q = new Question();
        q.setId(1L);
        q.setContent("Test question");
        when(questionRepository.findRandomQuestion()).thenReturn(Optional.of(q));

        Optional<Question> result = questionService.getRandomQuestion();

        assertTrue(result.isPresent());
        assertEquals("Test question", result.get().getContent());
    }

    @Test
    void getRandomQuestion_shouldReturnEmptyWhenNoQuestions() {
        when(questionRepository.findRandomQuestion()).thenReturn(Optional.empty());

        Optional<Question> result = questionService.getRandomQuestion();

        assertFalse(result.isPresent());
    }

    @Test
    void getRandomByDifficulty_shouldDelegateToRepository() {
        Question q = new Question();
        q.setDifficulty("hard");
        when(questionRepository.findRandomByDifficulty("hard")).thenReturn(Optional.of(q));

        Optional<Question> result = questionService.getRandomByDifficulty("hard");

        assertTrue(result.isPresent());
        assertEquals("hard", result.get().getDifficulty());
    }

    @Test
    void getQuestionById_shouldReturnQuestion() {
        Question q = new Question();
        q.setId(1L);
        when(questionRepository.findById(1L)).thenReturn(Optional.of(q));

        Optional<Question> result = questionService.getQuestionById(1L);

        assertTrue(result.isPresent());
    }
}
```

- [ ] **Step 4: 运行测试验证失败**

Run: `cd backend && mvn test -pl . -Dtest=QuestionServiceTest`
Expected: FAIL - QuestionService 类不存在

- [ ] **Step 5: 实现 QuestionService**

```java
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
```

- [ ] **Step 6: 运行测试验证通过**

Run: `cd backend && mvn test -pl . -Dtest=QuestionServiceTest`
Expected: PASS

- [ ] **Step 7: 写 QuestionController 测试**

```java
package com.tankquiz.controller;

import com.tankquiz.entity.Question;
import com.tankquiz.service.QuestionService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.bean.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(QuestionController.class)
class QuestionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private QuestionService questionService;

    @Test
    void getRandomQuestion_shouldReturnQuestion() throws Exception {
        Question q = new Question();
        q.setId(1L);
        q.setContent("What is HashMap?");
        q.setAnswer("A");
        when(questionService.getRandomQuestion()).thenReturn(Optional.of(q));

        mockMvc.perform(get("/api/questions/random"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").value("What is HashMap?"));
    }

    @Test
    void getRandomQuestion_shouldReturn404WhenEmpty() throws Exception {
        when(questionService.getRandomQuestion()).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/questions/random"))
                .andExpect(status().isNotFound());
    }

    @Test
    void getQuestionById_shouldReturnQuestion() throws Exception {
        Question q = new Question();
        q.setId(1L);
        q.setContent("Test");
        when(questionService.getQuestionById(1L)).thenReturn(Optional.of(q));

        mockMvc.perform(get("/api/questions/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));
    }
}
```

- [ ] **Step 8: 运行测试验证失败**

Run: `cd backend && mvn test -pl . -Dtest=QuestionControllerTest`
Expected: FAIL - QuestionController 类不存在

- [ ] **Step 9: 实现 QuestionController**

```java
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
```

- [ ] **Step 10: 运行测试验证通过**

Run: `cd backend && mvn test -pl . -Dtest=QuestionControllerTest`
Expected: PASS

- [ ] **Step 11: Commit**

```bash
git add backend/src/main/java/com/tankquiz/entity/Question.java \
        backend/src/main/java/com/tankquiz/repository/QuestionRepository.java \
        backend/src/main/java/com/tankquiz/service/QuestionService.java \
        backend/src/main/java/com/tankquiz/controller/QuestionController.java \
        backend/src/test/java/com/tankquiz/service/QuestionServiceTest.java \
        backend/src/test/java/com/tankquiz/controller/QuestionControllerTest.java
git commit -m "feat: add Question entity, repository, service, and controller"
```

---

## Task 3: WrongAnswer + Notebook 实体/Repository/Service/Controller

**Files:**
- Create: `backend/src/main/java/com/tankquiz/entity/WrongAnswer.java`
- Create: `backend/src/main/java/com/tankquiz/entity/Notebook.java`
- Create: `backend/src/main/java/com/tankquiz/repository/WrongAnswerRepository.java`
- Create: `backend/src/main/java/com/tankquiz/repository/NotebookRepository.java`
- Create: `backend/src/main/java/com/tankquiz/service/WrongAnswerService.java`
- Create: `backend/src/main/java/com/tankquiz/service/NotebookService.java`
- Create: `backend/src/main/java/com/tankquiz/controller/WrongAnswerController.java`
- Create: `backend/src/main/java/com/tankquiz/controller/NotebookController.java`
- Test: `backend/src/test/java/com/tankquiz/service/WrongAnswerServiceTest.java`
- Test: `backend/src/test/java/com/tankquiz/service/NotebookServiceTest.java`

- [ ] **Step 1: 创建 WrongAnswer 实体**

```java
package com.tankquiz.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "wrong_answer")
public class WrongAnswer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    @Column(nullable = false, length = 50)
    private String playerName;

    @Column(nullable = false, length = 1)
    private String wrongOption;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Question getQuestion() { return question; }
    public void setQuestion(Question question) { this.question = question; }
    public String getPlayerName() { return playerName; }
    public void setPlayerName(String playerName) { this.playerName = playerName; }
    public String getWrongOption() { return wrongOption; }
    public void setWrongOption(String wrongOption) { this.wrongOption = wrongOption; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
```

- [ ] **Step 2: 创建 Notebook 实体**

```java
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

    // Getters and Setters
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
```

- [ ] **Step 3: 创建 WrongAnswerRepository**

```java
package com.tankquiz.repository;

import com.tankquiz.entity.WrongAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface WrongAnswerRepository extends JpaRepository<WrongAnswer, Long> {
    List<WrongAnswer> findByPlayerNameOrderByCreatedAtDesc(String playerName);
}
```

- [ ] **Step 4: 创建 NotebookRepository**

```java
package com.tankquiz.repository;

import com.tankquiz.entity.Notebook;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotebookRepository extends JpaRepository<Notebook, Long> {
    List<Notebook> findByPlayerNameOrderByCreatedAtDesc(String playerName);
    boolean existsByWrongAnswerIdAndPlayerName(Long wrongAnswerId, String playerName);
}
```

- [ ] **Step 5: 写 WrongAnswerService 测试**

```java
package com.tankquiz.service;

import com.tankquiz.entity.Question;
import com.tankquiz.entity.WrongAnswer;
import com.tankquiz.repository.WrongAnswerRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class WrongAnswerServiceTest {

    @Mock
    private WrongAnswerRepository wrongAnswerRepository;

    @InjectMocks
    private WrongAnswerService wrongAnswerService;

    @Test
    void recordWrongAnswer_shouldSaveAndReturn() {
        Question q = new Question();
        q.setId(1L);
        WrongAnswer wa = new WrongAnswer();
        wa.setQuestion(q);
        wa.setPlayerName("player1");
        wa.setWrongOption("B");
        when(wrongAnswerRepository.save(any(WrongAnswer.class))).thenReturn(wa);

        WrongAnswer result = wrongAnswerService.recordWrongAnswer(1L, "player1", "B");

        assertNotNull(result);
        assertEquals("player1", result.getPlayerName());
        verify(wrongAnswerRepository).save(any(WrongAnswer.class));
    }

    @Test
    void getWrongAnswersByPlayer_shouldReturnList() {
        when(wrongAnswerRepository.findByPlayerNameOrderByCreatedAtDesc("player1"))
                .thenReturn(List.of(new WrongAnswer(), new WrongAnswer()));

        List<WrongAnswer> result = wrongAnswerService.getWrongAnswersByPlayer("player1");

        assertEquals(2, result.size());
    }
}
```

- [ ] **Step 6: 运行测试验证失败**

Run: `cd backend && mvn test -pl . -Dtest=WrongAnswerServiceTest`
Expected: FAIL

- [ ] **Step 7: 实现 WrongAnswerService**

```java
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
```

- [ ] **Step 8: 运行测试验证通过**

Run: `cd backend && mvn test -pl . -Dtest=WrongAnswerServiceTest`
Expected: PASS

- [ ] **Step 9: 写 NotebookService 测试**

```java
package com.tankquiz.service;

import com.tankquiz.entity.Notebook;
import com.tankquiz.entity.WrongAnswer;
import com.tankquiz.repository.NotebookRepository;
import com.tankquiz.repository.WrongAnswerRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class NotebookServiceTest {

    @Mock
    private NotebookRepository notebookRepository;

    @Mock
    private WrongAnswerRepository wrongAnswerRepository;

    @InjectMocks
    private NotebookService notebookService;

    @Test
    void addToNotebook_shouldSaveWhenNotExists() {
        WrongAnswer wa = new WrongAnswer();
        wa.setId(1L);
        when(wrongAnswerRepository.findById(1L)).thenReturn(Optional.of(wa));
        when(notebookRepository.existsByWrongAnswerIdAndPlayerName(1L, "player1")).thenReturn(false);
        when(notebookRepository.save(any(Notebook.class))).thenReturn(new Notebook());

        Notebook result = notebookService.addToNotebook(1L, "player1");

        assertNotNull(result);
        verify(notebookRepository).save(any(Notebook.class));
    }

    @Test
    void addToNotebook_shouldThrowWhenAlreadyExists() {
        WrongAnswer wa = new WrongAnswer();
        wa.setId(1L);
        when(wrongAnswerRepository.findById(1L)).thenReturn(Optional.of(wa));
        when(notebookRepository.existsByWrongAnswerIdAndPlayerName(1L, "player1")).thenReturn(true);

        assertThrows(IllegalStateException.class, () ->
                notebookService.addToNotebook(1L, "player1"));
    }

    @Test
    void getNotebookByPlayer_shouldReturnList() {
        when(notebookRepository.findByPlayerNameOrderByCreatedAtDesc("player1"))
                .thenReturn(List.of(new Notebook()));

        List<Notebook> result = notebookService.getNotebookByPlayer("player1");

        assertEquals(1, result.size());
    }

    @Test
    void updateNotebook_shouldUpdateNoteAndMastered() {
        Notebook nb = new Notebook();
        nb.setId(1L);
        nb.setNote("old");
        nb.setMastered(false);
        when(notebookRepository.findById(1L)).thenReturn(Optional.of(nb));
        when(notebookRepository.save(any(Notebook.class))).thenReturn(nb);

        Notebook result = notebookService.updateNotebook(1L, "new note", true);

        assertEquals("new note", result.getNote());
        assertTrue(result.getMastered());
    }
}
```

- [ ] **Step 10: 运行测试验证失败**

Run: `cd backend && mvn test -pl . -Dtest=NotebookServiceTest`
Expected: FAIL

- [ ] **Step 11: 实现 NotebookService**

```java
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
```

- [ ] **Step 12: 运行测试验证通过**

Run: `cd backend && mvn test -pl . -Dtest=NotebookServiceTest`
Expected: PASS

- [ ] **Step 13: 实现 WrongAnswerController**

```java
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
```

- [ ] **Step 14: 实现 NotebookController**

```java
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
```

- [ ] **Step 15: 创建 CorsConfig**

```java
package com.tankquiz.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {
    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.addAllowedOriginPattern("*");
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}
```

- [ ] **Step 16: 运行全部后端测试**

Run: `cd backend && mvn test`
Expected: 全部PASS

- [ ] **Step 17: Commit**

```bash
git add backend/src/main/java/com/tankquiz/entity/ \
        backend/src/main/java/com/tankquiz/repository/ \
        backend/src/main/java/com/tankquiz/service/ \
        backend/src/main/java/com/tankquiz/controller/ \
        backend/src/main/java/com/tankquiz/config/ \
        backend/src/test/
git commit -m "feat: add WrongAnswer, Notebook entities with full CRUD API"
```

---

## Task 4: 初始题库数据 (data.sql)

**Files:**
- Create: `backend/src/main/resources/data.sql`

- [ ] **Step 1: 编写初始题库 (50道Java面试题)**

创建 `backend/src/main/resources/data.sql`，包含50道Java面试题，覆盖以下分类：
- 集合框架 (10题)
- 多线程与并发 (10题)
- JVM (8题)
- IO与NIO (5题)
- 设计模式 (5题)
- Spring框架 (7题)
- 基础语法 (5题)

每题包含：category, difficulty, content, option_a~d, answer, explanation

示例格式：
```sql
INSERT INTO question (category, difficulty, content, option_a, option_b, option_c, option_d, answer, explanation) VALUES
('集合', 'easy', 'HashMap的初始容量是多少？', '8', '16', '32', '64', 'B', 'HashMap默认初始容量为16，必须是2的幂次方。'),
('多线程', 'medium', 'synchronized和ReentrantLock的区别？', '...', '...', '...', '...', 'A', '...');
-- ... 共50道
```

- [ ] **Step 2: 验证数据加载**

Run: `cd backend && mvn spring-boot:run`
访问 `http://localhost:8080/api/questions/random` 验证返回题目

- [ ] **Step 3: Commit**

```bash
git add backend/src/main/resources/data.sql
git commit -m "feat: add 50 Java interview questions as initial data"
```

---

## Task 5: 前端项目结构 + HTML/CSS

**Files:**
- Create: `frontend/index.html`
- Create: `frontend/css/style.css`

- [ ] **Step 1: 创建 index.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>坦克大战 - Java面试题版</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div id="game-container">
        <canvas id="game-canvas" width="640" height="480"></canvas>
        <div id="hud">
            <div id="hud-left">
                <span id="hp-bar">HP: 100</span>
                <span id="atk-bar">ATK: 10</span>
            </div>
            <div id="hud-right">
                <span id="score">Score: 0</span>
                <span id="enemies">Enemies: 5</span>
            </div>
        </div>
        <div id="menu-overlay" class="overlay">
            <div class="menu-box">
                <h1>坦克大战</h1>
                <p>Java面试题版</p>
                <input type="text" id="player-name" placeholder="输入昵称" maxlength="20">
                <button id="btn-start">开始游戏</button>
                <button id="btn-notebook">错题本</button>
            </div>
        </div>
        <div id="quiz-overlay" class="overlay hidden">
            <div class="quiz-box">
                <div id="quiz-timer">30</div>
                <div id="quiz-category"></div>
                <h2 id="quiz-content"></h2>
                <div id="quiz-options">
                    <button class="quiz-option" data-option="A"></button>
                    <button class="quiz-option" data-option="B"></button>
                    <button class="quiz-option" data-option="C"></button>
                    <button class="quiz-option" data-option="D"></button>
                </div>
                <div id="quiz-result" class="hidden">
                    <p id="quiz-result-text"></p>
                    <p id="quiz-explanation"></p>
                    <button id="quiz-continue">继续游戏</button>
                </div>
            </div>
        </div>
        <div id="notebook-overlay" class="overlay hidden">
            <div class="notebook-box">
                <h2>错题本</h2>
                <div id="notebook-list"></div>
                <button id="notebook-close">关闭</button>
            </div>
        </div>
        <div id="gameover-overlay" class="overlay hidden">
            <div class="menu-box">
                <h1 id="gameover-title">游戏结束</h1>
                <div id="gameover-stats"></div>
                <button id="btn-restart">重新开始</button>
                <button id="btn-back-menu">返回菜单</button>
            </div>
        </div>
    </div>
    <script type="module" src="js/main.js"></script>
</body>
</html>
```

- [ ] **Step 2: 创建 style.css**

```css
* { margin: 0; padding: 0; box-sizing: border-box; }
body { background: #1a1a2e; display: flex; justify-content: center; align-items: center; min-height: 100vh; font-family: 'Microsoft YaHei', sans-serif; }
#game-container { position: relative; }
#game-canvas { display: block; border: 2px solid #333; }
#hud { display: flex; justify-content: space-between; padding: 8px 12px; background: #16213e; color: #e0e0e0; font-size: 14px; }
#hud-left span, #hud-right span { margin-right: 16px; }
#hp-bar { color: #4ecca3; }
#atk-bar { color: #f0a500; }

.overlay { position: absolute; top: 0; left: 0; width: 640px; height: 480px; background: rgba(0,0,0,0.85); display: flex; justify-content: center; align-items: center; z-index: 10; }
.overlay.hidden { display: none; }
.menu-box { text-align: center; color: #fff; }
.menu-box h1 { font-size: 36px; margin-bottom: 10px; color: #4ecca3; }
.menu-box p { font-size: 16px; margin-bottom: 20px; color: #aaa; }
.menu-box input { padding: 8px 12px; font-size: 16px; border: 1px solid #555; border-radius: 4px; background: #222; color: #fff; margin-bottom: 12px; width: 200px; }
.menu-box button { display: block; width: 200px; margin: 8px auto; padding: 10px; font-size: 16px; border: none; border-radius: 4px; cursor: pointer; background: #4ecca3; color: #1a1a2e; font-weight: bold; }
.menu-box button:hover { background: #3ba88a; }

.quiz-box { background: #16213e; padding: 24px; border-radius: 8px; width: 500px; color: #fff; text-align: center; }
#quiz-timer { font-size: 28px; color: #f0a500; margin-bottom: 8px; }
#quiz-category { font-size: 13px; color: #888; margin-bottom: 12px; }
#quiz-content { font-size: 18px; margin-bottom: 20px; line-height: 1.5; text-align: left; }
#quiz-options { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.quiz-option { padding: 12px; font-size: 15px; border: 2px solid #333; border-radius: 6px; background: #1a1a2e; color: #fff; cursor: pointer; text-align: left; }
.quiz-option:hover { border-color: #4ecca3; }
.quiz-option.correct { border-color: #4ecca3; background: #1b4332; }
.quiz-option.wrong { border-color: #e74c3c; background: #3b1a1a; }
#quiz-result { margin-top: 16px; }
#quiz-result-text { font-size: 20px; font-weight: bold; margin-bottom: 8px; }
#quiz-explanation { font-size: 14px; color: #aaa; margin-bottom: 12px; text-align: left; }
#quiz-continue { padding: 8px 24px; font-size: 15px; border: none; border-radius: 4px; cursor: pointer; background: #4ecca3; color: #1a1a2e; }

.notebook-box { background: #16213e; padding: 24px; border-radius: 8px; width: 560px; max-height: 420px; color: #fff; overflow-y: auto; }
.notebook-box h2 { margin-bottom: 16px; color: #4ecca3; }
.notebook-item { background: #1a1a2e; padding: 12px; border-radius: 6px; margin-bottom: 10px; }
.notebook-item .nb-question { font-size: 14px; margin-bottom: 6px; }
.notebook-item .nb-meta { font-size: 12px; color: #888; }
.notebook-item .nb-actions { margin-top: 8px; }
.notebook-item .nb-actions button { padding: 4px 12px; font-size: 12px; border: 1px solid #555; border-radius: 4px; background: transparent; color: #fff; cursor: pointer; margin-right: 6px; }
.notebook-item .nb-actions button:hover { border-color: #4ecca3; }
#notebook-close { margin-top: 12px; padding: 8px 24px; border: none; border-radius: 4px; background: #4ecca3; color: #1a1a2e; cursor: pointer; }
```

- [ ] **Step 3: 验证页面可访问**

用浏览器打开 `frontend/index.html`，确认样式渲染正确

- [ ] **Step 4: Commit**

```bash
git add frontend/index.html frontend/css/style.css
git commit -m "feat: add HTML structure and CSS styling"
```

---

## Task 6: GameEngine + InputMgr

**Files:**
- Create: `frontend/js/engine/GameEngine.js`
- Create: `frontend/js/engine/InputMgr.js`
- Create: `frontend/js/main.js`

- [ ] **Step 1: 创建 InputMgr**

```javascript
// frontend/js/engine/InputMgr.js
export class InputMgr {
    constructor() {
        this.keys = {};
        this.justPressed = {};
        window.addEventListener('keydown', (e) => {
            if (!this.keys[e.code]) this.justPressed[e.code] = true;
            this.keys[e.code] = true;
            e.preventDefault();
        });
        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
            e.preventDefault();
        });
    }

    isDown(code) { return !!this.keys[code]; }

    wasJustPressed(code) {
        if (this.justPressed[code]) {
            this.justPressed[code] = false;
            return true;
        }
        return false;
    }

    clearJustPressed() { this.justPressed = {}; }
}
```

- [ ] **Step 2: 创建 GameEngine**

```javascript
// frontend/js/engine/GameEngine.js
export const GameState = {
    MENU: 'menu',
    PLAYING: 'playing',
    QUIZ: 'quiz',
    PAUSED: 'paused',
    GAME_OVER: 'gameOver',
    WIN: 'win'
};

export class GameEngine {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.state = GameState.MENU;
        this.score = 0;
        this.lastTime = 0;
        this.systems = []; // update/render systems
    }

    addSystem(system) {
        this.systems.push(system);
    }

    start() {
        requestAnimationFrame(this.loop.bind(this));
    }

    loop(timestamp) {
        const dt = timestamp - this.lastTime;
        this.lastTime = timestamp;

        if (this.state === GameState.PLAYING) {
            for (const sys of this.systems) {
                if (sys.update) sys.update(dt);
            }
        }

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (const sys of this.systems) {
            if (sys.render) sys.render(this.ctx);
        }

        requestAnimationFrame(this.loop.bind(this));
    }

    setState(newState) { this.state = newState; }
    getState() { return this.state; }
    addScore(pts) { this.score += pts; }
    getScore() { return this.score; }
}
```

- [ ] **Step 3: 创建 main.js 入口**

```javascript
// frontend/js/main.js
import { GameEngine, GameState } from './engine/GameEngine.js';
import { InputMgr } from './engine/InputMgr.js';

const canvas = document.getElementById('game-canvas');
const engine = new GameEngine(canvas);
const input = new InputMgr();

// Menu logic
const menuOverlay = document.getElementById('menu-overlay');
const btnStart = document.getElementById('btn-start');
const btnNotebook = document.getElementById('btn-notebook');

btnStart.addEventListener('click', () => {
    const name = document.getElementById('player-name').value.trim();
    if (!name) { alert('请输入昵称'); return; }
    window.playerName = name;
    menuOverlay.classList.add('hidden');
    engine.setState(GameState.PLAYING);
    engine.start();
});

btnNotebook.addEventListener('click', () => {
    // Will be implemented in Notebook UI task
    alert('错题本功能开发中');
});
```

- [ ] **Step 4: 验证菜单显示**

浏览器打开 `index.html`，确认菜单渲染，点击开始可触发

- [ ] **Step 5: Commit**

```bash
git add frontend/js/engine/ frontend/js/main.js
git commit -m "feat: add GameEngine, InputMgr, and main entry"
```

---

## Task 7: 地图生成 + 渲染

**Files:**
- Create: `frontend/js/map/maps.js`
- Create: `frontend/js/map/MapGen.js`
- Create: `frontend/js/ui/Renderer.js`

- [ ] **Step 1: 创建预设地图数据**

```javascript
// frontend/js/map/maps.js
// 0=通道, 1=墙壁, 2=玩家出生点, 3=敌方出生点, 4=道具点
export const CELL_SIZE = 40;
export const COLS = 16;
export const ROWS = 12;

export const mapTemplates = [
    // Map 1
    {
        name: "经典迷宫",
        grid: [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,2,0,0,1,0,0,0,0,0,1,0,0,0,3,1],
            [1,0,1,0,1,0,1,1,1,0,1,0,1,1,0,1],
            [1,0,1,0,0,0,0,4,1,0,0,0,0,1,0,1],
            [1,0,1,1,1,1,0,1,1,1,1,1,0,1,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1],
            [1,0,0,4,1,0,0,0,0,0,1,4,0,0,0,1],
            [1,3,1,0,0,0,1,0,1,0,0,0,1,0,3,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        ]
    },
    // Map 2
    {
        name: "开阔战场",
        grid: [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,2,0,0,0,0,1,0,0,1,0,0,0,0,3,1],
            [1,0,1,1,0,0,0,0,0,0,0,0,1,1,0,1],
            [1,0,1,0,0,1,0,4,0,1,0,0,0,1,0,1],
            [1,0,0,0,0,1,1,0,1,1,0,0,0,0,0,1],
            [1,0,0,1,0,0,0,0,0,0,0,1,0,0,0,1],
            [1,0,0,1,0,0,0,0,0,0,0,1,0,0,0,1],
            [1,0,0,0,0,1,1,0,1,1,0,0,0,0,0,1],
            [1,0,1,0,0,1,0,4,0,1,0,0,0,1,0,1],
            [1,0,1,1,0,0,0,0,0,0,0,0,1,1,0,1],
            [1,3,0,0,0,0,1,0,0,1,0,0,0,0,3,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        ]
    },
    // Map 3
    {
        name: "蜿蜒通道",
        grid: [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,2,0,0,1,0,0,0,1,0,0,0,0,0,3,1],
            [1,1,1,0,1,0,1,0,1,0,1,1,1,1,0,1],
            [1,0,0,0,0,0,1,0,0,0,1,4,0,0,0,1],
            [1,0,1,1,1,1,1,1,1,0,1,1,1,1,0,1],
            [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1],
            [1,0,1,1,1,0,1,0,1,1,1,1,1,0,1,1],
            [1,0,0,4,1,0,1,0,0,0,0,0,1,0,0,1],
            [1,1,1,0,1,0,1,1,1,0,1,0,1,1,0,1],
            [1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1],
            [1,3,1,1,0,1,1,0,1,1,1,0,1,1,3,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        ]
    }
];
```

- [ ] **Step 2: 创建 MapGen**

```javascript
// frontend/js/map/MapGen.js
import { mapTemplates, CELL_SIZE, COLS, ROWS } from './maps.js';

export class MapGen {
    constructor() {
        this.grid = null;
        this.playerSpawn = null;
        this.enemySpawns = [];
        this.quizItemSpawns = [];
    }

    loadRandomMap() {
        const template = mapTemplates[Math.floor(Math.random() * mapTemplates.length)];
        this.grid = template.grid.map(row => [...row]);
        this.playerSpawn = null;
        this.enemySpawns = [];
        this.quizItemSpawns = [];

        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                const cell = this.grid[r][c];
                if (cell === 2) {
                    this.playerSpawn = { x: c * CELL_SIZE, y: r * CELL_SIZE };
                    this.grid[r][c] = 0;
                } else if (cell === 3) {
                    this.enemySpawns.push({ x: c * CELL_SIZE, y: r * CELL_SIZE });
                    this.grid[r][c] = 0;
                } else if (cell === 4) {
                    this.quizItemSpawns.push({ x: c * CELL_SIZE, y: r * CELL_SIZE });
                    this.grid[r][c] = 0;
                }
            }
        }
    }

    isWall(col, row) {
        if (col < 0 || col >= COLS || row < 0 || row >= ROWS) return true;
        return this.grid[row][col] === 1;
    }

    isWallAtPixel(px, py) {
        const col = Math.floor(px / CELL_SIZE);
        const row = Math.floor(py / CELL_SIZE);
        return this.isWall(col, row);
    }

    getPlayerSpawn() { return this.playerSpawn; }
    getEnemySpawns() { return this.enemySpawns; }
    getQuizItemSpawns() { return this.quizItemSpawns; }
    getGrid() { return this.grid; }
}
```

- [ ] **Step 3: 创建 Renderer**

```javascript
// frontend/js/ui/Renderer.js
import { CELL_SIZE, COLS, ROWS } from '../map/maps.js';

export class Renderer {
    constructor(canvas, mapGen) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.mapGen = mapGen;
    }

    renderMap() {
        const grid = this.mapGen.getGrid();
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                const x = c * CELL_SIZE;
                const y = r * CELL_SIZE;
                if (grid[r][c] === 1) {
                    this.ctx.fillStyle = '#3a3a5c';
                    this.ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
                    this.ctx.strokeStyle = '#2a2a4c';
                    this.ctx.strokeRect(x, y, CELL_SIZE, CELL_SIZE);
                } else {
                    this.ctx.fillStyle = '#1a1a2e';
                    this.ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
                }
            }
        }
    }

    renderTank(tank) {
        const ctx = this.ctx;
        ctx.fillStyle = tank.color;
        // Body
        ctx.fillRect(tank.x + 4, tank.y + 4, tank.width - 8, tank.height - 8);
        // Turret direction
        ctx.fillStyle = tank.turretColor || '#fff';
        const cx = tank.x + tank.width / 2;
        const cy = tank.y + tank.height / 2;
        const barrelLen = 18;
        let bx = cx, by = cy;
        if (tank.direction === 'up') by = cy - barrelLen;
        else if (tank.direction === 'down') by = cy + barrelLen;
        else if (tank.direction === 'left') bx = cx - barrelLen;
        else if (tank.direction === 'right') bx = cx + barrelLen;
        ctx.beginPath();
        ctx.arc(cx, cy, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = tank.turretColor || '#fff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(bx, by);
        ctx.stroke();
    }

    renderBullet(bullet) {
        this.ctx.fillStyle = '#f0a500';
        this.ctx.beginPath();
        this.ctx.arc(bullet.x, bullet.y, 3, 0, Math.PI * 2);
        this.ctx.fill();
    }

    renderQuizItem(item) {
        if (!item.active) return;
        const ctx = this.ctx;
        const cx = item.x + CELL_SIZE / 2;
        const cy = item.y + CELL_SIZE / 2;
        ctx.fillStyle = '#f0a500';
        ctx.font = 'bold 24px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('?', cx, cy);
    }

    renderHUD(player, enemyCount) {
        const ctx = this.ctx;
        // HP bar
        ctx.fillStyle = '#333';
        ctx.fillRect(10, 10, 120, 16);
        ctx.fillStyle = player.hp > 30 ? '#4ecca3' : '#e74c3c';
        ctx.fillRect(10, 10, Math.max(0, (player.hp / player.maxHp) * 120), 16);
        ctx.fillStyle = '#fff';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`HP: ${player.hp}/${player.maxHp}`, 14, 23);
        // ATK
        ctx.fillText(`ATK: ${player.attack}`, 140, 23);
        // Enemies
        ctx.fillText(`Enemies: ${enemyCount}`, 250, 23);
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    update(dt) {
        // Render is called explicitly, no update needed
    }

    render(ctx) {
        this.renderMap();
    }
}
```

- [ ] **Step 4: 集成到 GameEngine**

在 `main.js` 中添加地图加载和渲染：

```javascript
import { MapGen } from './map/MapGen.js';
import { Renderer } from './ui/Renderer.js';

const mapGen = new MapGen();
mapGen.loadRandomMap();

const renderer = new Renderer(canvas, mapGen);
engine.addSystem(renderer);
```

- [ ] **Step 5: Commit**

```bash
git add frontend/js/map/ frontend/js/ui/Renderer.js
git commit -m "feat: add map generation and rendering"
```

---

## Task 8: 坦克实体 + 玩家移动

**Files:**
- Create: `frontend/js/entities/Tank.js`
- Create: `frontend/js/entities/PlayerTank.js`
- Create: `frontend/js/entities/Bullet.js`

- [ ] **Step 1: 创建 Tank 基类**

```javascript
// frontend/js/entities/Tank.js
import { CELL_SIZE } from '../map/maps.js';

export class Tank {
    constructor(x, y, config = {}) {
        this.x = x;
        this.y = y;
        this.width = CELL_SIZE;
        this.height = CELL_SIZE;
        this.hp = config.hp || 100;
        this.maxHp = this.hp;
        this.attack = config.attack || 10;
        this.speed = config.speed || 3;
        this.direction = 'up';
        this.color = config.color || '#4ecca3';
        this.turretColor = config.turretColor || '#fff';
        this.alive = true;
        this.shootCooldown = 0;
        this.cooldownTime = config.cooldownTime || 500;
    }

    takeDamage(dmg) {
        this.hp -= dmg;
        if (this.hp <= 0) {
            this.hp = 0;
            this.alive = false;
        }
    }

    canShoot(now) {
        return now - this.shootCooldown >= this.cooldownTime;
    }

    shoot(now) {
        this.shootCooldown = now;
        const cx = this.x + this.width / 2;
        const cy = this.y + this.height / 2;
        const bulletSpeed = 6;
        let vx = 0, vy = 0;
        if (this.direction === 'up') vy = -bulletSpeed;
        else if (this.direction === 'down') vy = bulletSpeed;
        else if (this.direction === 'left') vx = -bulletSpeed;
        else if (this.direction === 'right') vx = bulletSpeed;
        return { x: cx, y: cy, vx, vy, attack: this.attack, owner: this };
    }

    getBounds() {
        return { x: this.x, y: this.y, w: this.width, h: this.height };
    }
}
```

- [ ] **Step 2: 创建 PlayerTank**

```javascript
// frontend/js/entities/PlayerTank.js
import { Tank } from './Tank.js';

export class PlayerTank extends Tank {
    constructor(x, y) {
        super(x, y, { hp: 100, attack: 10, speed: 3, color: '#4ecca3', turretColor: '#fff' });
    }

    addAttack(pts) { this.attack += pts; }
}
```

- [ ] **Step 3: 创建 Bullet**

```javascript
// frontend/js/entities/Bullet.js
export class Bullet {
    constructor(x, y, vx, vy, attack, owner) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.attack = attack;
        this.owner = owner;
        this.alive = true;
    }

    update(dt) {
        this.x += this.vx;
        this.y += this.vy;
    }

    getBounds() {
        return { x: this.x - 3, y: this.y - 3, w: 6, h: 6 };
    }
}
```

- [ ] **Step 4: 集成玩家坦克到 main.js**

```javascript
import { PlayerTank } from './entities/PlayerTank.js';
import { Bullet } from './entities/Bullet.js';

const player = new PlayerTank(mapGen.getPlayerSpawn().x, mapGen.getPlayerSpawn().y);
const bullets = [];

// In game loop (PLAYING state):
// Handle input for player movement
// WASD: up/down/left/right, Space: shoot
```

- [ ] **Step 5: Commit**

```bash
git add frontend/js/entities/Tank.js \
        frontend/js/entities/PlayerTank.js \
        frontend/js/entities/Bullet.js
git commit -m "feat: add Tank, PlayerTank, and Bullet entities"
```

---

## Task 9: 敌方坦克 AI

**Files:**
- Create: `frontend/js/entities/EnemyTank.js`

- [ ] **Step 1: 创建 EnemyTank**

```javascript
// frontend/js/entities/EnemyTank.js
import { Tank } from './Tank.js';

export const EnemyType = {
    NORMAL: 'normal',
    ELITE: 'elite'
};

export class EnemyTank extends Tank {
    constructor(x, y, type = EnemyType.NORMAL) {
        const config = type === EnemyType.ELITE
            ? { hp: 60, attack: 10, speed: 2, color: '#e74c3c', turretColor: '#ff6b6b', cooldownTime: 800 }
            : { hp: 30, attack: 5, speed: 2, color: '#f0a500', turretColor: '#ffd93d', cooldownTime: 1200 };
        super(x, y, config);
        this.type = type;
        this.aiTimer = 0;
        this.aiDirection = this.randomDirection();
        this.aiChangeInterval = 2000 + Math.random() * 2000;
    }

    randomDirection() {
        const dirs = ['up', 'down', 'left', 'right'];
        return dirs[Math.floor(Math.random() * dirs.length)];
    }

    updateAI(dt, playerX, playerY, mapGen) {
        this.aiTimer += dt;

        if (this.type === EnemyType.ELITE) {
            // Elite: chase player
            const dx = playerX - this.x;
            const dy = playerY - this.y;
            if (Math.abs(dx) > Math.abs(dy)) {
                this.aiDirection = dx > 0 ? 'right' : 'left';
            } else {
                this.aiDirection = dy > 0 ? 'down' : 'up';
            }
        } else {
            // Normal: random patrol
            if (this.aiTimer >= this.aiChangeInterval) {
                this.aiTimer = 0;
                this.aiDirection = this.randomDirection();
                this.aiChangeInterval = 2000 + Math.random() * 2000;
            }
        }

        this.direction = this.aiDirection;

        // Move
        let nx = this.x, ny = this.y;
        if (this.direction === 'up') ny -= this.speed;
        else if (this.direction === 'down') ny += this.speed;
        else if (this.direction === 'left') nx -= this.speed;
        else if (this.direction === 'right') nx += this.speed;

        // Wall collision check
        if (!mapGen.isWallAtPixel(nx, ny) &&
            !mapGen.isWallAtPixel(nx + this.width - 1, ny + this.height - 1)) {
            this.x = nx;
            this.y = ny;
        } else {
            this.aiDirection = this.randomDirection();
        }
    }

    shouldShoot(playerX, playerY) {
        const dx = Math.abs(playerX - this.x);
        const dy = Math.abs(playerY - this.y);
        // Shoot if roughly aligned with player
        if (this.direction === 'up' || this.direction === 'down') {
            return dx < 40 && dy < 300;
        }
        return dy < 40 && dx < 300;
    }
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/js/entities/EnemyTank.js
git commit -m "feat: add EnemyTank with AI behavior"
```

---

## Task 10: 碰撞检测 + 子弹系统

**Files:**
- Create: `frontend/js/engine/CollisionMgr.js`

- [ ] **Step 1: 创建 CollisionMgr**

```javascript
// frontend/js/engine/CollisionMgr.js
export class CollisionMgr {
    static rectsOverlap(a, b) {
        return a.x < b.x + b.w && a.x + a.w > b.x &&
               a.y < b.y + b.h && a.y + a.h > b.y;
    }

    static bulletHitTank(bullet, tank) {
        if (!bullet.alive || !tank.alive) return false;
        return this.rectsOverlap(bullet.getBounds(), tank.getBounds());
    }

    static bulletHitWall(bullet, mapGen) {
        if (!bullet.alive) return false;
        return mapGen.isWallAtPixel(bullet.x, bullet.y);
    }

    static tankHitItem(tank, item) {
        if (!tank.alive || !item.active) return false;
        const itemBounds = { x: item.x, y: item.y, w: 40, h: 40 };
        return this.rectsOverlap(tank.getBounds(), itemBounds);
    }

    static tankCanMove(tank, mapGen) {
        const b = tank.getBounds();
        return !mapGen.isWallAtPixel(b.x, b.y) &&
               !mapGen.isWallAtPixel(b.x + b.w - 1, b.y) &&
               !mapGen.isWallAtPixel(b.x, b.y + b.h - 1) &&
               !mapGen.isWallAtPixel(b.x + b.w - 1, b.y + b.h - 1);
    }
}
```

- [ ] **Step 2: 集成碰撞检测到游戏循环**

在 `main.js` 的游戏循环中：
- 玩家移动后检查墙壁碰撞
- 子弹更新后检查墙壁/坦克碰撞
- 子弹击中敌方：扣血，检查是否击败
- 子弹击中玩家：扣血
- 玩家碰触答题道具：触发答题

- [ ] **Step 3: Commit**

```bash
git add frontend/js/engine/CollisionMgr.js
git commit -m "feat: add collision detection system"
```

---

## Task 11: 答题系统 + 内置题库

**Files:**
- Create: `frontend/js/quiz/questions.js`
- Create: `frontend/js/quiz/QuizModule.js`

- [ ] **Step 1: 创建前端内置题库**

```javascript
// frontend/js/quiz/questions.js
export const builtInQuestions = [
    {
        id: 1, category: "集合", difficulty: "easy",
        content: "HashMap的默认初始容量是多少？",
        optionA: "8", optionB: "16", optionC: "32", optionD: "64",
        answer: "B", explanation: "HashMap默认初始容量为16，必须是2的幂次方。"
    },
    {
        id: 2, category: "集合", difficulty: "medium",
        content: "ArrayList和LinkedList的主要区别？",
        optionA: "ArrayList基于数组，LinkedList基于链表",
        optionB: "ArrayList线程安全",
        optionC: "LinkedList占用内存更少",
        optionD: "两者性能完全相同",
        answer: "A", explanation: "ArrayList底层是动态数组，LinkedList底层是双向链表，随机访问和插入删除性能不同。"
    },
    // ... 共50道题（与后端data.sql对应）
];
```

- [ ] **Step 2: 创建 QuizModule**

```javascript
// frontend/js/quiz/QuizModule.js
import { builtInQuestions } from './questions.js';

const API_BASE = 'http://localhost:8080/api';

export class QuizModule {
    constructor() {
        this.currentQuestion = null;
        this.timer = 30;
        this.timerInterval = null;
        this.onAnswer = null; // callback(isCorrect, question)
    }

    async triggerQuiz(difficulty) {
        // Try backend first, fall back to built-in
        try {
            const url = difficulty
                ? `${API_BASE}/questions/random?difficulty=${difficulty}`
                : `${API_BASE}/questions/random`;
            const res = await fetch(url);
            if (res.ok) {
                this.currentQuestion = await res.json();
            } else {
                this.currentQuestion = this.getRandomBuiltIn(difficulty);
            }
        } catch {
            this.currentQuestion = this.getRandomBuiltIn(difficulty);
        }
        this.showQuizUI();
    }

    getRandomBuiltIn(difficulty) {
        let pool = builtInQuestions;
        if (difficulty) pool = pool.filter(q => q.difficulty === difficulty);
        return pool[Math.floor(Math.random() * pool.length)];
    }

    showQuizUI() {
        const q = this.currentQuestion;
        document.getElementById('quiz-content').textContent = q.content;
        document.getElementById('quiz-category').textContent = `[${q.category}] ${q.difficulty}`;
        document.getElementById('quiz-result').classList.add('hidden');
        document.getElementById('quiz-options').classList.remove('hidden');

        const options = document.querySelectorAll('.quiz-option');
        options.forEach(btn => {
            btn.className = 'quiz-option';
            btn.disabled = false;
            const opt = btn.dataset.option;
            btn.textContent = `${opt}. ${q['option' + opt]}`;
        });

        document.getElementById('quiz-overlay').classList.remove('hidden');
        this.startTimer();
    }

    startTimer() {
        this.timer = 30;
        document.getElementById('quiz-timer').textContent = this.timer;
        this.timerInterval = setInterval(() => {
            this.timer--;
            document.getElementById('quiz-timer').textContent = this.timer;
            if (this.timer <= 0) {
                clearInterval(this.timerInterval);
                this.handleAnswer(null); // timeout = wrong
            }
        }, 1000);
    }

    handleAnswer(selected) {
        clearInterval(this.timerInterval);
        const q = this.currentQuestion;
        const isCorrect = selected === q.answer;

        // Highlight options
        const options = document.querySelectorAll('.quiz-option');
        options.forEach(btn => {
            btn.disabled = true;
            if (btn.dataset.option === q.answer) btn.classList.add('correct');
            if (btn.dataset.option === selected && !isCorrect) btn.classList.add('wrong');
        });

        // Show result
        document.getElementById('quiz-result').classList.remove('hidden');
        document.getElementById('quiz-options').classList.add('hidden');
        const resultText = document.getElementById('quiz-result-text');
        resultText.textContent = isCorrect ? '回答正确！攻击力 +5' : '回答错误！血量 -10';
        resultText.style.color = isCorrect ? '#4ecca3' : '#e74c3c';
        document.getElementById('quiz-explanation').textContent = q.explanation;

        // Record wrong answer to backend
        if (!isCorrect && selected) {
            this.recordWrongAnswer(q.id, selected);
        }

        if (this.onAnswer) this.onAnswer(isCorrect, q);
    }

    async recordWrongAnswer(questionId, wrongOption) {
        try {
            await fetch(`${API_BASE}/wrong-answers`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    questionId, wrongOption,
                    playerName: window.playerName || 'player'
                })
            });
        } catch (e) { console.error('Failed to record wrong answer:', e); }
    }

    bindEvents() {
        document.querySelectorAll('.quiz-option').forEach(btn => {
            btn.addEventListener('click', () => this.handleAnswer(btn.dataset.option));
        });
        document.getElementById('quiz-continue').addEventListener('click', () => {
            document.getElementById('quiz-overlay').classList.add('hidden');
            if (this.onContinue) this.onContinue();
        });
    }
}
```

- [ ] **Step 3: 集成答题触发**

在 `main.js` 中：
- 击败敌方 → `quizModule.triggerQuiz()`
- 碰触答题道具 → `quizModule.triggerQuiz()`
- 答对 → `player.addAttack(5)`
- 答错 → `player.takeDamage(10)`
- 答题时游戏状态切换为 `QUIZ`

- [ ] **Step 4: Commit**

```bash
git add frontend/js/quiz/
git commit -m "feat: add quiz system with built-in question bank"
```

---

## Task 12: 错题本 UI

**Files:**
- Create: `frontend/js/ui/Notebook.js`

- [ ] **Step 1: 创建 Notebook UI**

```javascript
// frontend/js/ui/Notebook.js
const API_BASE = 'http://localhost:8080/api';

export class NotebookUI {
    constructor() {
        this.overlay = document.getElementById('notebook-overlay');
        this.listEl = document.getElementById('notebook-list');
        document.getElementById('notebook-close').addEventListener('click', () => this.hide());
    }

    async show() {
        const playerName = window.playerName || 'player';
        try {
            const res = await fetch(`${API_BASE}/notebook?player=${encodeURIComponent(playerName)}`);
            if (res.ok) {
                const items = await res.json();
                this.render(items);
            }
        } catch {
            this.listEl.innerHTML = '<p style="color:#888">无法连接后端</p>';
        }
        this.overlay.classList.remove('hidden');
    }

    hide() {
        this.overlay.classList.add('hidden');
    }

    render(items) {
        if (items.length === 0) {
            this.listEl.innerHTML = '<p style="color:#888">错题本为空</p>';
            return;
        }
        this.listEl.innerHTML = items.map(item => `
            <div class="notebook-item" data-id="${item.id}">
                <div class="nb-question">${item.wrongAnswer.question.content}</div>
                <div class="nb-meta">
                    正确答案: ${item.wrongAnswer.question.answer} |
                    你的选择: ${item.wrongAnswer.wrongOption} |
                    复习${item.reviewCount}次 |
                    ${item.mastered ? '已掌握' : '未掌握'}
                </div>
                <div class="nb-actions">
                    <button class="nb-master" data-id="${item.id}">
                        ${item.mastered ? '取消掌握' : '标记掌握'}
                    </button>
                    <button class="nb-add-note" data-id="${item.id}">添加笔记</button>
                </div>
            </div>
        `).join('');

        // Bind events
        this.listEl.querySelectorAll('.nb-master').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.dataset.id;
                const item = items.find(i => i.id == id);
                await fetch(`${API_BASE}/notebook/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ mastered: !item.mastered })
                });
                this.show(); // refresh
            });
        });
    }

    async addToNotebook(wrongAnswerId) {
        const playerName = window.playerName || 'player';
        try {
            await fetch(`${API_BASE}/notebook`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ wrongAnswerId, playerName })
            });
        } catch (e) { console.error('Failed to add to notebook:', e); }
    }
}
```

- [ ] **Step 2: 集成到 main.js**

```javascript
import { NotebookUI } from './ui/Notebook.js';

const notebookUI = new NotebookUI();
btnNotebook.addEventListener('click', () => notebookUI.show());
```

- [ ] **Step 3: Commit**

```bash
git add frontend/js/ui/Notebook.js
git commit -m "feat: add in-game notebook UI for wrong answers"
```

---

## Task 13: 游戏菜单 + 结算画面

**Files:**
- Modify: `frontend/js/main.js`

- [ ] **Step 1: 实现游戏结束逻辑**

在 `main.js` 中：
- 玩家血量归零 → `GameState.GAME_OVER`，显示失败画面
- 所有敌方被消灭 → `GameState.WIN`，显示胜利画面
- 结算画面显示：得分、答对题数、答错题数

```javascript
function showGameOver(isWin) {
    const overlay = document.getElementById('gameover-overlay');
    const title = document.getElementById('gameover-title');
    const stats = document.getElementById('gameover-stats');
    title.textContent = isWin ? '胜利！' : '游戏结束';
    title.style.color = isWin ? '#4ecca3' : '#e74c3c';
    stats.innerHTML = `
        <p>得分: ${engine.getScore()}</p>
        <p>消灭敌方: ${totalEnemies - enemyCount}/${totalEnemies}</p>
        <p>答对: ${quizCorrect}题 | 答错: ${quizWrong}题</p>
    `;
    overlay.classList.remove('hidden');
}

document.getElementById('btn-restart').addEventListener('click', () => {
    document.getElementById('gameover-overlay').classList.add('hidden');
    // Reset game state
    resetGame();
    engine.setState(GameState.PLAYING);
});

document.getElementById('btn-back-menu').addEventListener('click', () => {
    document.getElementById('gameover-overlay').classList.add('hidden');
    menuOverlay.classList.remove('hidden');
    engine.setState(GameState.MENU);
});
```

- [ ] **Step 2: Commit**

```bash
git add frontend/js/main.js
git commit -m "feat: add game over/win screens with stats"
```

---

## Task 14: 完整游戏循环集成 + 联调

**Files:**
- Modify: `frontend/js/main.js`

- [ ] **Step 1: 完善 main.js 完整游戏循环**

整合所有模块到 `main.js`：
- GameEngine 主循环
- InputMgr 处理玩家输入（WASD移动，空格射击）
- 玩家移动 + 碰撞检测
- 敌方AI更新 + 射击
- 子弹更新 + 碰撞检测
- 答题触发 + 奖惩
- HUD渲染
- 游戏结束判断

- [ ] **Step 2: 启动后端验证联调**

Run: `cd backend && mvn spring-boot:run`
浏览器打开 `frontend/index.html`（需要本地HTTP服务器，如 `python -m http.server 8000`）
验证：
- 玩家可移动射击
- 敌方AI巡逻/追踪
- 击败敌方弹出答题
- 答对加攻击，答错扣血
- 错题可查看
- 胜负判定正确

- [ ] **Step 3: Commit**

```bash
git add frontend/js/
git commit -m "feat: complete game loop with all systems integrated"
```

---

## Task 15: 完善50道内置题库

**Files:**
- Modify: `frontend/js/quiz/questions.js`
- Modify: `backend/src/main/resources/data.sql`

- [ ] **Step 1: 补全前端 questions.js 到50道**

覆盖分类：
- 集合框架 (10题): HashMap, ArrayList, ConcurrentHashMap, HashSet, TreeMap, etc.
- 多线程与并发 (10题): synchronized, volatile, ThreadPool, ReentrantLock, CAS, etc.
- JVM (8题): 内存模型, GC, 类加载, JVM参数, etc.
- IO与NIO (5题): BIO, NIO, Channel, Buffer, Selector
- 设计模式 (5题): 单例, 工厂, 观察者, 代理, 策略
- Spring框架 (7题): IOC, AOP, 事务, Bean生命周期, etc.
- 基础语法 (5题): 泛型, 异常, String, 自动装箱, etc.

- [ ] **Step 2: 同步后端 data.sql**

确保后端 `data.sql` 包含相同的50道题

- [ ] **Step 3: Commit**

```bash
git add frontend/js/quiz/questions.js backend/src/main/resources/data.sql
git commit -m "feat: complete 50-question Java interview bank"
```

---

## Task 16: 最终测试 + 优化

- [ ] **Step 1: 全流程测试**

手动测试清单：
- [ ] 开始菜单输入昵称
- [ ] 玩家WASD移动，空格射击
- [ ] 墙壁碰撞正确阻挡
- [ ] 敌方普通型随机巡逻
- [ ] 敌方精英型追踪玩家
- [ ] 子弹击中敌方扣血
- [ ] 子弹击中玩家扣血
- [ ] 击败敌方弹出答题
- [ ] 答题道具碰触弹出答题
- [ ] 答对攻击力+5
- [ ] 答错血量-10
- [ ] 错题自动记录到后端
- [ ] 错题本可查看错题
- [ ] 错题本可标记掌握
- [ ] 胜利条件：消灭所有敌方
- [ ] 失败条件：血量归零
- [ ] 结算画面显示正确数据
- [ ] 重新开始/返回菜单正常

- [ ] **Step 2: 修复发现的问题**

- [ ] **Step 3: 最终 Commit**

```bash
git add -A
git commit -m "feat: tank battle game with Java interview quiz - final integration"
```
