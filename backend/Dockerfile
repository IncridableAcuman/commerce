# ==========================================
# 1-Bosqich: Build (Gradle + JDK 21)
# ==========================================
FROM eclipse-temurin:21-jdk-alpine AS builder

WORKDIR /build

# Gradle wrapper va sozlamalarni nusxalash (keshdan unumli foydalanish uchun)
COPY gradlew settings.gradle build.gradle ./
COPY gradle ./gradle

# gradlew ijro ruxsatini ta'minlash
RUN chmod +x ./gradlew

# Dependency larni oldindan yuklash (keshlash)
RUN ./gradlew dependencies --no-daemon

# Loyiha manba kodini nusxalash va bootJar yaratish
COPY src ./src
RUN ./gradlew bootJar -x test --no-daemon

# ==========================================
# 2-Bosqich: Production Runtime (JRE 21 Alpine)
# ==========================================
FROM eclipse-temurin:21-jre-alpine

LABEL maintainer="izzatbek"
LABEL description="Commerce Backend Application"

# Xavfsizlik: curl va timezone o'rnatish, root bo'lmagan foydalanuvchi yaratish
RUN apk add --no-cache curl tzdata \
    && addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Fayl yuklashlar uchun papka yaratish
RUN mkdir -p /app/uploads && chown -R appuser:appgroup /app

# Yig'ilgan app.jar ni builder bosqichidan ko'chirish
COPY --from=builder --chown=appuser:appgroup /build/build/libs/app.jar app.jar

# Root bo'lmagan foydalanuvchiga o'tish
USER appuser

# Tarmoq porti
EXPOSE 8080

# Production JVM optimallashtirish bayroqlari (Render 512MB RAM chegarasi uchun maxsus sozlangan)
ENV JAVA_OPTS="-XX:+UseSerialGC -Xss512k -XX:MaxRAM=512m -Xms64m -Xmx200m -XX:MaxMetaspaceSize=100m -XX:ReservedCodeCacheSize=32m -Djava.security.egd=file:/dev/./urandom -Dfile.encoding=UTF-8"

# Salomatlik tekshiruvi (Healthcheck)
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:${PORT:-8080}/api/v1/actuator/health || exit 1

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]