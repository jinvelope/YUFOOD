package com.example.demo.controller;

import com.example.demo.dto.AnswerRequest;
import com.example.demo.entity.Answer;
import com.example.demo.entity.Question;
import com.example.demo.repository.AnswerRepository;
import com.example.demo.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/answers")
public class AnswerController {

    private final AnswerRepository answerRepository;
    private final QuestionRepository questionRepository;

    @Autowired
    public AnswerController(AnswerRepository answerRepository, QuestionRepository questionRepository) {
        this.answerRepository = answerRepository;
        this.questionRepository = questionRepository;
    }

    // 특정 질문에 대한 모든 답변 조회
    @GetMapping("/question/{questionId}")
    public ResponseEntity<?> getAnswersByQuestionId(@PathVariable Long questionId) {
        List<Answer> answers = answerRepository.findByQuestionId(questionId);
        return ResponseEntity.ok(answers);
    }

    // 답변 등록
    @PostMapping
    public ResponseEntity<?> createAnswer(@RequestBody AnswerRequest answerRequest) {
        return questionRepository.findById(answerRequest.getQuestionId())
                .map(question -> {
                    Answer answer = new Answer();
                    answer.setContent(answerRequest.getContent());
                    answer.setCreatedAt(LocalDateTime.now());
                    answer.setUpdatedAt(LocalDateTime.now());
                    answer.setQuestion(question);
                    answer.setId(answerRequest.getUserId());

                    answerRepository.save(answer);
                    return ResponseEntity.ok("답변이 성공적으로 등록되었습니다.");
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body("질문을 찾을 수 없습니다."));
    }

    // 답변 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAnswer(@PathVariable Long id) {
        if (answerRepository.existsById(id)) {
            answerRepository.deleteById(id);
            return ResponseEntity.ok("답변이 성공적으로 삭제되었습니다.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("답변을 찾을 수 없습니다.");
        }
    }
}
