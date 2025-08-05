# RSA Web Application

This project is a web application that implements RSA encryption from scratch. It consists of a backend API built with Java and Spring Boot, and a frontend application built with React.


## Backend

The backend is responsible for handling RSA key generation and encryption. It exposes the following API endpoints:

REST API Representation State Transfer Application Programming Interface. This is a way for your front end (what users see) and your back end (where the rsa magic occurs) to communicate using HTTP requests like GET, POST etc

- `POST /api/rsa/generate-key-pair`: Generates a new RSA key pair.
- `POST /api/rsa/encrypt`: Encrypts a given plaintext message using the public key.

