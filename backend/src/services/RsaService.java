public class RsaService {
    
    private static final int KEY_SIZE = 2048;

    public RsaKeyPair createKeyPair() {
        // Generate two large prime numbers
        BigInteger p = BigInteger.probablePrime(KEY_SIZE / 2, new SecureRandom());
        BigInteger q = BigInteger.probablePrime(KEY_SIZE / 2, new SecureRandom());

        // Calculate n = p * q
        BigInteger n = p.multiply(q);

        // Calculate Euler's totient: φ(n) = (p-1)(q-1)
        BigInteger phi = p.subtract(BigInteger.ONE).multiply(q.subtract(BigInteger.ONE));

        // Choose a public exponent e
        BigInteger e = BigInteger.valueOf(65537); // Common choice for e

        // Calculate the private exponent d
        BigInteger d = e.modInverse(phi);

        // Return the RSA key pair
        return new RsaKeyPair(n, e, d);
    }

    public BigInteger encrypt(String plaintext, BigInteger publicKey) {
        BigInteger message = new BigInteger(plaintext.getBytes());
        return message.modPow(publicKey, publicKey); // Encrypt the message
    }
}