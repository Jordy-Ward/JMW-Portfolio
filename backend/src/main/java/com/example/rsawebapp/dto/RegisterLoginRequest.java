package com.example.rsawebapp.dto;

public class RegisterLoginRequest {
    private String username;
    private String password;

    public void setUsername(String inUsername) { username = inUsername; }
    public void setpassword(String inPassword) { password = inPassword; }
    public String getUsername() { return username; }
    public String getPassword() { return password; }

}
