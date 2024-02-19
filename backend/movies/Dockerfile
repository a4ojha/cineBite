FROM openjdk:21-slim
COPY target/movies-0.0.1-SNAPSHOT.jar movies.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "movies.jar"]