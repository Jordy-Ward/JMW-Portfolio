package com.example.rsawebapp.controllers;

import com.example.rsawebapp.dto.SendMessageRequest;
import com.example.rsawebapp.models.Message;
import com.example.rsawebapp.models.User;
import com.example.rsawebapp.repositories.MessageRepository;
import com.example.rsawebapp.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.sql.Timestamp;

@RestController
@RequestMapping("/api/rsa/messages")
public class MessageController {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    // Send a message (frontend handles encryption if needed)
    @PostMapping("/send")
    public String sendMessage(@RequestBody SendMessageRequest request, Authentication authentication) {
        Message message = new Message();
        message.setSender(authentication.getName());
        message.setRecipient(request.getRecipient());
        message.setEncrypted(request.isEncrypted());
        message.setContent(request.getContent());
        messageRepository.save(message);
        return "Message sent!";
    }

    // Get messages for logged in user (inbox)
    @GetMapping("/inbox")
    public List<Message> getInbox(Authentication authentication) {
        return messageRepository.findByRecipient(authentication.getName());
    }

    // Get messages sent by logged in user
    @GetMapping("/sent")
    public List<Message> getSent(Authentication authentication) {
        return messageRepository.findBySender(authentication.getName());
    }

    // Public key lookup
    @GetMapping("/public-key/{username}")
    public String getPublicKey(@PathVariable String username) {
        User user = userRepository.findByUsername(username);
        if (user != null && user.getPublicKey() != null) {
            return user.getPublicKey();
        } else {
            throw new RuntimeException("User or public key not found");
        }
    }
    
    // Lightweight endpoint to check for new messages since a timestamp
    @GetMapping("/check-new")
    public Map<String, Object> checkForNewMessages(
            @RequestParam(required = false) Long since,
            Authentication authentication) {
        
        String currentUser = authentication.getName();
        Map<String, Object> response = new HashMap<>();
        
        if (since == null) {
            // If no timestamp provided, return empty result
            response.put("hasNewMessages", false);
            response.put("newChatParticipants", List.of());
            return response;
        }
        
        try {
            Timestamp sinceTimestamp = new Timestamp(since);
            
            // Get chat participants who have sent new messages since the timestamp
            List<String> participantsWithNewMessages = messageRepository
                .findChatParticipantsWithNewMessagesSince(currentUser, sinceTimestamp);
            
            boolean hasNewMessages = !participantsWithNewMessages.isEmpty();
            
            response.put("hasNewMessages", hasNewMessages);
            response.put("newChatParticipants", participantsWithNewMessages);
            response.put("timestamp", System.currentTimeMillis());
            
            return response;
            
        } catch (Exception e) {
            response.put("hasNewMessages", false);
            response.put("newChatParticipants", List.of());
            response.put("error", "Invalid timestamp format");
            return response;
        }
    }

    // Get messages between logged in user and another user after a timestamp
    @GetMapping("/with/{otherUser}")
    public List<Message> getMessagesWithUserAfter(
            @PathVariable String otherUser,
            @RequestParam(required = false) Long after,
            Authentication authentication) {
        String currentUser = authentication.getName();
        List<Message> all = messageRepository.findMessagesBetweenUsers(currentUser, otherUser);
        if (after != null) {
            return all.stream()
                    .filter(m -> m.getTimeStamp() != null && java.sql.Timestamp.valueOf(m.getTimeStamp()).getTime() > after)
                    .toList();
        } else {
            return all;
        }
    }
}
