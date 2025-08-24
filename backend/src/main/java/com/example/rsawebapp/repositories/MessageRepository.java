package com.example.rsawebapp.repositories;

import com.example.rsawebapp.models.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MessageRepository extends JpaRepository <Message, Long>{
    
    List<Message> findByRecipient(String recipient);
    List<Message> findBySender(String sender);
}
