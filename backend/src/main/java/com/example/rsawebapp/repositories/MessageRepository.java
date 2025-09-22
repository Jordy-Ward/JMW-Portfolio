package com.example.rsawebapp.repositories;

import com.example.rsawebapp.models.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.sql.Timestamp;

public interface MessageRepository extends JpaRepository <Message, Long>{
    List<Message> findByRecipient(String recipient);
    List<Message> findBySender(String sender);

    // Custom query to get all messages between two users
    @Query("SELECT m FROM Message m WHERE (m.sender = :user1 AND m.recipient = :user2) OR (m.sender = :user2 AND m.recipient = :user1) ORDER BY m.timeStamp ASC")
    List<Message> findMessagesBetweenUsers(String user1, String user2);
    
    // Check for new messages since a timestamp for a specific user
    @Query("SELECT m FROM Message m WHERE m.recipient = :username AND m.timeStamp > :since ORDER BY m.timeStamp DESC")
    List<Message> findNewMessagesForUserSince(@Param("username") String username, @Param("since") Timestamp since);
    
    // Get chat participants with new message indicators since timestamp
    @Query("SELECT DISTINCT CASE WHEN m.sender = :username THEN m.recipient ELSE m.sender END " +
           "FROM Message m WHERE (m.sender = :username OR m.recipient = :username) AND m.timeStamp > :since")
    List<String> findChatParticipantsWithNewMessagesSince(@Param("username") String username, @Param("since") Timestamp since);
}
