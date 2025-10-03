package com.example.rsawebapp.config;


import com.example.rsawebapp.utils.JwtUtil;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;


//Intercepts every HTTP request to check for a JWT in the Authorization header
//If token is valid sets the authentication in the spring security context so the user is considered logged in for this request
//Ensures that only requests with a valid JWT acan access protected endpoints
@Component
public class JwtRequestFilter extends OncePerRequestFilter{
    
    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
        throws ServletException, IOException {
            final String authorizationHeader = request.getHeader("Authorization");

            String username = null;
            String jwt = null;
            boolean tokenValid = false;

            if (authorizationHeader != null && authorizationHeader.startsWith("Bearer")) {
                jwt = authorizationHeader.substring(7);
                try {
                    username = jwtUtil.extractUsername(jwt);
                    tokenValid = true; // If we got here, token structure is valid
                } catch (ExpiredJwtException e) {
                    System.out.println("JWT Token has expired: " + e.getMessage());
                    // Don't set username, so authentication will be null and request will be treated as unauthenticated
                } catch (MalformedJwtException e) {
                    System.out.println("JWT Token is malformed: " + e.getMessage());
                    // Don't set username, so authentication will be null and request will be treated as unauthenticated
                } catch (Exception e) {
                    System.out.println("Unable to get JWT Token: " + e.getMessage());
                    // Don't set username, so authentication will be null and request will be treated as unauthenticated
                }
            }

            if (username != null && tokenValid && SecurityContextHolder.getContext().getAuthentication() == null) {
                if (jwtUtil.validateToken(jwt, username)) {
                    UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(username, null, java.util.Collections.emptyList());
                    authToken.setDetails((new WebAuthenticationDetailsSource().buildDetails(request)));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
            chain.doFilter(request, response);
    }
}
