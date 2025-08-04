# RSA Web Application

This project is a web application that implements RSA encryption from scratch. It consists of a backend API built with Java and a frontend interface built with React.

## Project Structure

```
rsa-web-app
├── backend
│   ├── src
│   │   ├── controllers
│   │   │   └── RsaController.java
│   │   ├── services
│   │   │   └── RsaService.java
│   │   ├── models
│   │   │   └── RsaKeyPair.java
│   │   ├── utils
│   │   │   └── RsaUtils.java
│   │   └── Application.java
│   ├── pom.xml
│   └── README.md
├── frontend
│   ├── src
│   │   ├── components
│   │   │   └── RsaForm.jsx
│   │   ├── App.jsx
│   │   └── index.js
│   ├── package.json
│   └── README.md
└── README.md
```

## Backend

The backend is responsible for handling RSA key generation and encryption requests. It is built using Spring Boot and includes the following components:

- **Controllers**: Handle HTTP requests related to RSA operations.
- **Services**: Contain the core logic for RSA key generation and encryption.
- **Models**: Represent the RSA key pair.
- **Utils**: Provide utility functions for RSA operations.

### Setup Instructions

1. Navigate to the `backend` directory.
2. Build the project using Maven: `mvn clean install`.
3. Run the application: `mvn spring-boot:run`.

### API Endpoints

- `POST /api/rsa/generate`: Generates a new RSA key pair.
- `POST /api/rsa/encrypt`: Encrypts a given plaintext message using the public key.

## Frontend

The frontend provides a user interface for interacting with the RSA backend. It is built using React and includes the following components:

- **RsaForm**: A form for generating RSA keys and encrypting text.
- **App**: The main application component that renders the RsaForm.

### Setup Instructions

1. Navigate to the `frontend` directory.
2. Install dependencies: `npm install`.
3. Start the application: `npm start`.

## Project Goals

- Implement RSA encryption and decryption from scratch.
- Provide a user-friendly interface for key generation and message encryption.
- Ensure secure handling of cryptographic operations.