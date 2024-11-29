package com.example.demo.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;

@RestController
@RequestMapping("/api")
public class ProfileController {

    private final UserRepository userRepository;

    public ProfileController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // 프로필 정보 조회
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("인증되지 않은 사용자입니다.");
        }

        String name = authentication.getName(); // JWT에서 이메일 추출

        return userRepository.findByUsername(name)
                .<ResponseEntity<?>>map(user -> {
                    Map<String, String> response = new HashMap<>();
                    response.put("username", user.getUsername());
                    response.put("email", user.getEmail());
                    response.put("name", user.getName());
                    return ResponseEntity.ok(response);
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body("사용자를 찾을 수 없습니다."));
    }

    // 프로필 정보 수정
    @PutMapping("/profile/update")
    public ResponseEntity<?> updateProfile(Authentication authentication, @RequestBody Map<String, String> updates) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("인증되지 않은 사용자입니다.");
        }

        String name = authentication.getName(); // JWT에서 이메일 추출

        return userRepository.findByUsername(name)
                .<ResponseEntity<?>>map(user -> {
                    String newUsername = updates.get("username");
                    String newName = updates.get("name");

                    user.setUsername(newUsername);
                    user.setName(newName);

                    userRepository.save(user); // 변경된 값 저장

                    Map<String, String> response = new HashMap<>();
                    response.put("message", "프로필 정보가 성공적으로 수정되었습니다.");
                    return ResponseEntity.ok(response);
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body("사용자를 찾을 수 없습니다."));
    }
}
