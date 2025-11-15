# Build stage
FROM maven:3.9-eclipse-temurin-21 AS builder
WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:21
WORKDIR /app

COPY --from=builder /app/target/*.jar app.jar
ENV SPRING_DATASOURCE_URL=jdbc:mysql://127.0.0.1:3306/sweetShop
ENV SPRING_DATASOURCE_USERNAME=root
ENV SPRING_DATASOURCE_PASSWORD=Ankit@1234

EXPOSE 8084
ENTRYPOINT ["java", "-jar", "app.jar"]
