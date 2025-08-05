import java.math.BigInteger;
import backend.src.utils.RsaUtils;
import backend.src.models.RsaKeyPair;

public class RsaService {

    private static final int KEY_SIZE = 2048;

    public RsaKeyPair createKeyPair() {
        
        BigInteger[] keyPair = RsaUtils.genKeyPair(KEY_SIZE);
        BigInteger n = keyPair[0];
        BigInteger e = keyPair[1];
        BigInteger d = keyPair[2];
        return new RsaKeyPair(e.toString(), d.toString(), n.toString());
    }

    public BigInteger encrypt(String plaintext, BigInteger e, BigInteger n) {
        BigInteger message = new BigInteger(plaintext.getBytes());
        BigInteger cipherText = RsaUtils.encrypt(message, e, n);
        
        return cipherText.toString();
    }

    public String decrypt(BigInteger ciphertext, BigInteger d, BigInteger n) {
        
        BigInteger decrypted = RsaUtils.decrypt(ciphertext, d, n);
        return new String(decrypted.toByteArray());
    }
}