FROM gradle:8-jdk21-jre AS builder
LABEL authors="izzatbek"
WORKDIR /app
COPY build.gradle settings.gradle ./
COPY gradle gradle
RUN ./gradlew bootJar dependencies --no-daemon
COPY src src
RUN ./gradlew bootJar -x test --no-daemon
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /app/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]