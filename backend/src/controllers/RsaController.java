import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/api/rsa")
public class RsaController {

    @Autowired
    private RsaService rsaService;

    @PostMapping("/generate-key-pair")
    public ResponseEntity<RsaKeyPair> generateKeyPair() {
        RsaKeyPair keyPair = rsaService.createKeyPair();
        return new ResponseEntity<>(keyPair, HttpStatus.OK);
    }

    @PostMapping("/encrypt")
    public ResponseEntity<String> encryptText(@RequestParam String plaintext, @RequestParam String publicKey) {
        String encryptedText = rsaService.encrypt(plaintext, publicKey);
        return new ResponseEntity<>(encryptedText, HttpStatus.OK);
    }
}