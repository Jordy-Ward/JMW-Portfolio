package com.example.rsawebapp.dto;

public class SendMessageRequest {
    private String recipient;
    private String content;
    private boolean encrypted;

    public String getRecipient() { return recipient; };
    public void setRecipient(String inRecipient) { recipient = inRecipient; }

    public String getContent() { return content; }
    public void getContent(String inContent) { content = inContent; }

    public boolean isEncrypted() { return encrypted; }
    public void setEncrypted(boolean inEncrpted) { encrypted = inEncrpted; }
}
