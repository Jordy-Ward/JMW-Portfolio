package com.example.rsawebapp.utils;
import java.math.BigInteger;
import java.security.PublicKey;
import java.security.SecureRandom;
import java.util.Base64;

import javax.crypto.Cipher;

/**
 * Util class for generating RSA key pair, encrypting and decrypting
 */
public class RsaUtils {

    private static final SecureRandom random = new SecureRandom();

    /**
     * Generate a number probably prime
     * @param bitLength the length of the probable prime
     * @return a BigInteger value probably prime
     */
    public static BigInteger genPrime(int bitLength) {
        return BigInteger.probablePrime(bitLength, random);
    }


    /**
     * Generate the RSA key pair. The euler totient n, public exp e and the public exp d
     * @param bitLength the length of KeyPair values n,e,d
     * @return BigInteger array containing n,e,d
     */
    public static BigInteger[] genKeyPair(int bitLength) {
        BigInteger p = genPrime(bitLength/2);
        BigInteger q = genPrime(bitLength/2);
        BigInteger n = p.multiply(q);
        BigInteger phi = (p.subtract(BigInteger.ONE)).multiply(q.subtract(BigInteger.ONE));
        BigInteger e = BigInteger.valueOf(65537);

        //make sure e and phi are co prime
        //gcd between both is 1
        while (phi.gcd(e).equals(BigInteger.ONE) == false) {
            e = e.add(BigInteger.TWO);
        }

        //find a value d so e*d mod phi = 1
        BigInteger d = e.modInverse(phi);
        return new BigInteger[]{n, e, d};
    }

    /**
     * Encrypt a message in BigInteger using the passed keyPair values
     * @param message the BigInteger message to encrypt
     * @param e the public exponent
     * @param n the euler totient
     * @return  BigInteger value of the encrypted message
     */
    public static BigInteger encrypt(BigInteger message, BigInteger e, BigInteger n) {
        return message.modPow(e, n);
    }

    /**
     * Decrypt a message in BigInteger using the passed keyPair values
     * @param cipher the BigInteger message to decrypt
     * @param d the private exponent
     * @param n the euler totient
     * @return BigInteger value of the decrypted message
     */
    public static BigInteger decrypt(BigInteger cipher, BigInteger d, BigInteger n) {
        return cipher.modPow(d, n);
    }

    public static String encryptWithPublicKey(String plainText, PublicKey publicKey) throws Exception {
        Cipher cipher = Cipher.getInstance("RSA");
        cipher.init(Cipher.ENCRYPT_MODE, publicKey);
        byte[] encryptedBytes = cipher.doFinal(plainText.getBytes());
        return Base64.getEncoder().encodeToString(encryptedBytes);
    }

}