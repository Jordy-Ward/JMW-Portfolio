package com.example.rsawebapp.repositories;

import com.example.rsawebapp.models.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MessageRepository extends JpaRepository <Message, Long>{
    List<Message> findByRecipient(String recipient);
    List<Message> findBySender(String sender);

    // Custom query to get all messages between two users
    @org.springframework.data.jpa.repository.Query("SELECT m FROM Message m WHERE (m.sender = :user1 AND m.recipient = :user2) OR (m.sender = :user2 AND m.recipient = :user1) ORDER BY m.timeStamp ASC")
    List<Message> findMessagesBetweenUsers(String user1, String user2);
}
