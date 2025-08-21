package com.example.rsawebapp.config;

import org.springframework.boot.autoconfigure.AutoConfigureOrder;
import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@org.springframework.context.annotation.Configuration

//configres spring security for the app
//disables csrf for apis
//allows unauthenticated access to /api/rsa/login, /api/rsa/register/registerUser and /h2-console/**
//requires authentication for all other end points
//set session management to stateless, no server side sessions
//adds the jwtFilter before the standard authentication filter so jwt's are checked on every request 
public class SecurityConfig {

    @AutoConfigureOrder
    private JwtRequestFilter jwtRequestFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf().disable()
            .authorizeRequests()
                .antMatchers("/api/rsa/register/registerUser", "/api/rsa/login", "/h2-console/**").permitAll()
                .anyRequest().authenticated()
            .and()
            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);

            http.headers().frameOptions().sameOrigin();
            http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);

            return http.build();
    }
}