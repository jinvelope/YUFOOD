package com.example.demo.controller;

import com.example.demo.dto.QuestionResponse;
import com.example.demo.entity.Question;
import com.example.demo.entity.User;
import com.example.demo.repository.QuestionRepository;
import com.example.demo.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/questions")
public class QuestionController {

    private final QuestionRepository questionRepository;
    private final UserRepository userRepository;

    @Autowired
    public QuestionController(QuestionRepository questionRepository, UserRepository userRepository) {
        this.questionRepository = questionRepository;
        this.userRepository = userRepository;
    }

    // 모든 질문 조회 (QnA 메인페이지)
    @GetMapping
    public ResponseEntity<List<Question>> getAllQuestions() {
        List<Question> questions = questionRepository.findAll();
        return ResponseEntity.ok(questions); // 데이터베이스에서 가져온 모든 질문 반환
    }

    // 특정 질문 조회
    @GetMapping("/{id}")
    public ResponseEntity<?> getQuestionById(@PathVariable("id") Long id) {
        return questionRepository.findById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body("질문을 찾을 수 없습니다."));
    }

    // 질문 등록
    @PostMapping
    public ResponseEntity<?> createQuestion(@RequestBody QuestionResponse questionRequest, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("인증되지 않은 사용자입니다.");
        }

        try {
            // 사용자 확인
            String name = authentication.getName(); // JWT에서 이메일 추출
            User user = userRepository.findByUsername(name)
                    .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

            // 질문 생성
            Question question = new Question();
            question.setTitle(questionRequest.getTitle());
            question.setContent(questionRequest.getContent());
            question.setUser(user);
            question.setCreatedAt(LocalDateTime.now());
            question.setUpdatedAt(LocalDateTime.now());

            questionRepository.save(question);

            return ResponseEntity.status(HttpStatus.CREATED).body("질문이 성공적으로 등록되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("질문 등록 중 오류가 발생했습니다.");
        }
    }

    // 질문 조회수 증가
    @PutMapping("/{id}/view")
    public ResponseEntity<?> incrementViews(@PathVariable Long id) {
        return questionRepository.findById(id)
                .map(question -> {
                    question.setViews(question.getViews() + 1);
                    questionRepository.save(question);
                    return ResponseEntity.ok("조회수가 증가되었습니다.");
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body("질문을 찾을 수 없습니다."));
    }
}
