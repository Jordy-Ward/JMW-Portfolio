# RSA Web Application Backend API

This backend API provides functionality for RSA encryption, including key generation and message encryption. It is built using Java and Spring Boot.

## Project Structure

- **src/controllers**: Contains the `RsaController` class that handles HTTP requests for RSA operations.
- **src/services**: Contains the `RsaService` class that implements the core RSA logic.
- **src/models**: Contains the `RsaKeyPair` class that represents the RSA key pair.
- **src/utils**: Contains the `RsaUtils` class with utility functions for RSA operations.
- **src/Application.java**: The entry point of the Spring Boot application.
- **pom.xml**: Maven configuration file for managing dependencies and build settings.

## Setup Instructions

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd rsa-web-app/backend
   ```

2. **Build the project**:
   ```
   mvn clean install
   ```

3. **Run the application**:
   ```
   mvn spring-boot:run
   ```

## API Endpoints

- **POST /api/rsa/generate**: Generates a new RSA key pair.
- **POST /api/rsa/encrypt**: Encrypts a given plaintext message using the public key.

## Usage Examples

### Generate RSA Key Pair

```bash
curl -X POST http://localhost:8080/api/rsa/generate
```

### Encrypt Text

```bash
curl -X POST http://localhost:8080/api/rsa/encrypt -H "Content-Type: application/json" -d '{"message": "Hello, World!", "publicKey": "<public-key>"}'
```

## License

This project is licensed under the MIT License. See the LICENSE file for details.