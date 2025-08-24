package com.example.rsawebapp.controllers;

import com.example.rsawebapp.dto.SendMessageRequest;
import com.example.rsawebapp.models.Message;
import com.example.rsawebapp.repositories.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rsa/messages")
public class MessageController {
    
    @Autowired
    private MessageRepository messageRepository;

    //send a message end point
    @PostMapping("/send")
    public String sendMessage(@RequestBody SendMessageRequest request, Authentication authentication) {
        Message message = new Message();
        message.setSender(authentication.getName());
        message.setRecipient(request.getRecipient());
        message.setContent(request.getContent());
        message.setEncrypted(request.isEncrypted());
        messageRepository.save(message);
        return "Message sent";
    }

    //get messages for logged in user
    @GetMapping("/inbox")
    public List<Message> getInbox(Authentication authentication) {
        return messageRepository.findByRecipient(authentication.getName());
    }

    //get messages sent by logged in user
    @GetMapping("/sent")
    public List<Message> getSent(Authentication authentication) {
        return messageRepository.findBySender(authentication.getName());
    }
 }
