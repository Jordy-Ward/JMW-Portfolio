package com.example.rsawebapp.models;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "messages")
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String sender;
    private String recipient;

    @Column(length = 2048)
    private String content;

    private boolean encrypted;

    private LocalDateTime timeStamp = LocalDateTime.now();

    public Long getId() { return id; }
    public void setId(Long inId) { id = inId; }

    public String getSender() { return sender; }
    public void setSender(String inSender) { sender = inSender; }

    public String getRecipient() { return recipient; }
    public void setRecipient(String inRecipient) {recipient = inRecipient; }

    public String getContent() {return content; }
    public void setContent(String inContent) { content = inContent; }

    public boolean isEncrypted() { return encrypted; }
    public void setEncrypted(boolean inEncrpted) { encrypted = inEncrpted; }

    public LocalDateTime getTimeStamp() { return timeStamp; }
    public void setTimestamp(LocalDateTime inTimeStamp) { timeStamp = inTimeStamp; }

}
