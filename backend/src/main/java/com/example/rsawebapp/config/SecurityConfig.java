package com.example.rsawebapp.config;

import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@org.springframework.context.annotation.Configuration
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .authorizeRequests()
                .antMatchers("/api/rsa/register/registerUser", "/h2-console/**").permitAll()
                .anyRequest().authenticated()
            .and()
            .headers().frameOptions().sameOrigin() // Allow H2 console frames
            .and()
            .httpBasic();
        return http.build();
    }
}