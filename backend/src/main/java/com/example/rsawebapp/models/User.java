package com.example.rsawebapp.models;

import javax.persistence.*;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String username;

    private String password;

    @Column(length = 2048)
    private String publicKey;

    public User(){

    }

    public Long getID() { return id; }
    public void setID(Long inID) { id = inID; }

    public String getUsername() { return username; }
    public void setUsername(String inUsername) { username = inUsername; }

    public String getPassword() { return password; }
    public void setPassword(String inPassword) { password = inPassword; }

    public String getPublicKey() { return publicKey; }
    public void setPublicKey(String inPublicKey) { publicKey = inPublicKey; }
}
