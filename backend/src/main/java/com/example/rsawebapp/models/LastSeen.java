package com.example.rsawebapp.models;

import javax.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "last_seen")
public class LastSeen {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "username")
    private String username;

    @Column(name = "chat_with")
    private String chatWith;

    @Column(name = "last_seen_timestamp")
    private Timestamp lastSeenTimestamp;

    public LastSeen() {}

    public LastSeen(String username, String chatWith, Timestamp lastSeenTimestamp) {
        this.username = username;
        this.chatWith = chatWith;
        this.lastSeenTimestamp = lastSeenTimestamp;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getChatWith() { return chatWith; }
    public void setChatWith(String chatWith) { this.chatWith = chatWith; }

    public Timestamp getLastSeenTimestamp() { return lastSeenTimestamp; }
    public void setLastSeenTimestamp(Timestamp lastSeenTimestamp) { this.lastSeenTimestamp = lastSeenTimestamp; }
}