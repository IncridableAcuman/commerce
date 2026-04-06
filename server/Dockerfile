FROM gradle:8-jdk17 AS builder

LABEL author="IncridableAcuman"

WORKDIR /app

COPY buil.gradle settings.gradle ./gradlew ./

RUN ./gradlew --dependencies no-daemon

COPY src src

RUN ./gradlew bootJar -x test

FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

COPY --from=builder /app/build/libs/*.jar app.jar

EXPOSE 8080

ENTRYPOINT [ "java", "-jar", "app.jar" ]