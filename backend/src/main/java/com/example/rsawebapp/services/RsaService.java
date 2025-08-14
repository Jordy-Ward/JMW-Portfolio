package com.example.rsawebapp.services;
import java.math.BigInteger;
import java.util.Base64;

import org.springframework.stereotype.Service;

import com.example.rsawebapp.models.RsaKeyPair;
import com.example.rsawebapp.utils.RsaUtils;

@Service
public class RsaService {

    private static final int KEY_SIZE = 2048;

    public RsaKeyPair createKeyPair() {
        
        BigInteger[] keyPair = RsaUtils.genKeyPair(KEY_SIZE);
        BigInteger n = keyPair[0];
        BigInteger e = keyPair[1];
        BigInteger d = keyPair[2];
        return new RsaKeyPair(e.toString(), d.toString(), n.toString());
    }

    public String encrypt(String plaintext, BigInteger e, BigInteger n) {
        BigInteger message = new BigInteger(plaintext.getBytes());
        BigInteger cipherText = RsaUtils.encrypt(message, e, n);
        
        return Base64.getEncoder().encodeToString(cipherText.toByteArray());
    }

    public String decrypt(String base64Ciphertext, BigInteger d, BigInteger n) {
        byte[] cipherBytes = Base64.getDecoder().decode(base64Ciphertext);
        BigInteger cipherText = new BigInteger(cipherBytes);
        BigInteger decrypted = RsaUtils.decrypt(cipherText, d, n);
        return new String(decrypted.toByteArray());
    }
}