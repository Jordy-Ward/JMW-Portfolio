package com.example.rsawebapp.repositories;

import com.example.rsawebapp.models.LastSeen;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LastSeenRepository extends JpaRepository<LastSeen, Long> {
    
    // Find last seen record for a specific user and chat
    Optional<LastSeen> findByUsernameAndChatWith(String username, String chatWith);
    
    // Get all last seen records for a user (for all their chats)
    List<LastSeen> findByUsername(String username);
    
    // Delete a specific last seen record
    void deleteByUsernameAndChatWith(String username, String chatWith);
}