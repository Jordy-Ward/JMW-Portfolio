package com.example.rsawebapp.controllers;

import com.example.rsawebapp.dto.SendMessageRequest;
import com.example.rsawebapp.models.Message;
import com.example.rsawebapp.models.User;
import com.example.rsawebapp.models.LastSeen;
import com.example.rsawebapp.repositories.MessageRepository;
import com.example.rsawebapp.repositories.UserRepository;
import com.example.rsawebapp.repositories.LastSeenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Optional;
import java.util.ArrayList;
import java.sql.Timestamp;

@RestController
@RequestMapping("/api/rsa/messages")
public class MessageController {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LastSeenRepository lastSeenRepository;

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

    // Update last seen timestamp for a specific chat
    @PostMapping("/last-seen/{chatWith}")
    public Map<String, Object> updateLastSeen(
            @PathVariable String chatWith,
            Authentication authentication) {
        
        String currentUser = authentication.getName();
        Timestamp now = new Timestamp(System.currentTimeMillis());
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Find existing record or create new one
            Optional<LastSeen> existing = lastSeenRepository.findByUsernameAndChatWith(currentUser, chatWith);
            
            if (existing.isPresent()) {
                // Update existing record
                LastSeen lastSeen = existing.get();
                lastSeen.setLastSeenTimestamp(now);
                lastSeenRepository.save(lastSeen);
            } else {
                // Create new record
                LastSeen newLastSeen = new LastSeen(currentUser, chatWith, now);
                lastSeenRepository.save(newLastSeen);
            }
            
            response.put("success", true);
            response.put("timestamp", now.getTime());
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
        }
        
        return response;
    }

    // Get all last seen timestamps for current user
    @GetMapping("/last-seen")
    public Map<String, Object> getLastSeenForUser(Authentication authentication) {
        String currentUser = authentication.getName();
        
        Map<String, Object> response = new HashMap<>();
        Map<String, Long> lastSeenMap = new HashMap<>();
        
        try {
            List<LastSeen> userLastSeen = lastSeenRepository.findByUsername(currentUser);
            
            for (LastSeen lastSeen : userLastSeen) {
                lastSeenMap.put(lastSeen.getChatWith(), lastSeen.getLastSeenTimestamp().getTime());
            }
            
            response.put("success", true);
            response.put("lastSeen", lastSeenMap);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
        }
        
        return response;
    }

    // Enhanced check for new messages using server-side last seen data
    @GetMapping("/check-new-with-last-seen")
    public Map<String, Object> checkForNewMessagesWithLastSeen(Authentication authentication) {
        String currentUser = authentication.getName();
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Get all messages received by current user (only inbox messages matter for notifications)
            List<Message> allInbox = messageRepository.findByRecipient(currentUser);
            
            // Build map of latest RECEIVED message timestamp per chat
            // We only care about messages others sent to us, not messages we sent to others
            Map<String, Long> latestReceivedMessageTimestamps = new HashMap<>();
            
            // Process only inbox messages (messages others sent to us)
            for (Message msg : allInbox) {
                String sender = msg.getSender();
                long msgTime = java.sql.Timestamp.valueOf(msg.getTimeStamp()).getTime();
                latestReceivedMessageTimestamps.put(sender, Math.max(latestReceivedMessageTimestamps.getOrDefault(sender, 0L), msgTime));
            }
            
            // Get user's last seen data
            List<LastSeen> userLastSeen = lastSeenRepository.findByUsername(currentUser);
            Map<String, Long> lastSeenMap = new HashMap<>();
            for (LastSeen lastSeen : userLastSeen) {
                lastSeenMap.put(lastSeen.getChatWith(), lastSeen.getLastSeenTimestamp().getTime());
            }
            
            // Compare and find chats with new messages
            // Only check chats where others have sent us messages
            List<String> chatsWithNewMessages = new ArrayList<>();
            for (Map.Entry<String, Long> entry : latestReceivedMessageTimestamps.entrySet()) {
                String chatUser = entry.getKey();
                Long latestReceivedMessage = entry.getValue();
                Long lastSeen = lastSeenMap.getOrDefault(chatUser, 0L);
                
                if (latestReceivedMessage > lastSeen) {
                    chatsWithNewMessages.add(chatUser);
                }
            }
            
            response.put("success", true);
            response.put("hasNewMessages", !chatsWithNewMessages.isEmpty());
            response.put("chatsWithNewMessages", chatsWithNewMessages);
            response.put("lastSeenData", lastSeenMap);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
        }
        
        return response;
    }
}
