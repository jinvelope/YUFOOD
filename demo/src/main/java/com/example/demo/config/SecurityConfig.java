package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // CSRF 비활성화 (개발 중에만)
            .authorizeHttpRequests(auth -> auth
                // 로그인 없이 접근 가능한 경로
                .requestMatchers("/", "/api/yufood/**", "/css/**", "/js/**", "/images/**", "/login", "/signup", "/api/users/**", "/restaurant/**", "/qna/view/**", "/api/profile/**").permitAll() 
                // 인증이 필요한 경로
                .requestMatchers("/qna/write/**", "/review/write/**", "/api/user/status").authenticated() // Q&A 작성 및 리뷰 작성은 인증 필요
                .anyRequest().permitAll() // 그 외 모든 요청 허용
            )
            .formLogin(form -> form
                .loginPage("/login") // 로그인 페이지 설정
                .defaultSuccessUrl("/") // 로그인 성공 후 리다이렉트
                .permitAll()
            )
            .logout(logout -> logout
                .logoutUrl("/logout")
                .logoutSuccessUrl("/")
                .permitAll()
            );
        	
        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
