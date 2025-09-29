# Dockerfile for backend deployment
FROM openjdk:11-jre-slim

# Set working directory
WORKDIR /app

# Copy the built jar file
COPY backend/target/*.jar app.jar

# Expose port (Railway will set PORT environment variable)
EXPOSE 8080

# Run the application
CMD ["java", "-Dspring.profiles.active=cloud", "-Dserver.port=${PORT:-8080}", "-jar", "app.jar"]