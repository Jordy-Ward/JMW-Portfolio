# RSA Web Application

This project is a web application that implements RSA encryption from scratch. It consists of a backend API built with Java and Spring Boot, and a frontend application built with React.

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

The backend is responsible for handling RSA key generation and encryption. It exposes the following API endpoints:

- `POST /api/rsa/generate-key-pair`: Generates a new RSA key pair.
- `POST /api/rsa/encrypt`: Encrypts a given plaintext message using the public key.

### Technologies Used

- Java
- Spring Boot
- Maven

### Setup Instructions

1. Navigate to the `backend` directory.
2. Run `mvn clean install` to build the project.
3. Run the application using `mvn spring-boot:run`.

## Frontend

The frontend provides a user interface for interacting with the RSA backend API. Users can generate RSA keys and encrypt messages through a simple form.

### Technologies Used

- React
- JavaScript

### Setup Instructions

1. Navigate to the `frontend` directory.
2. Run `npm install` to install dependencies.
3. Run `npm start` to start the development server.

## Project Goals

- Implement RSA encryption and decryption from scratch.
- Provide a user-friendly interface for key generation and message encryption.
- Ensure secure handling of cryptographic operations.

## License

This project is licensed under the MIT License.