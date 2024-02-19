FROM maven:latest AS build
COPY . .
RUN mvn clean package -DskipTests


FROM openjdk:21-slim
COPY --from=build /target/movies-0.0.1-SNAPSHOT.jar movies.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "movies.jar"]