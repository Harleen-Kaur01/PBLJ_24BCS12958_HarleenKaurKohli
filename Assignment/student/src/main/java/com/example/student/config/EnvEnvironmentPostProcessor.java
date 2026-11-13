package com.example.student.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

import java.io.File;
import java.util.HashMap;
import java.util.Map;

public class EnvEnvironmentPostProcessor implements EnvironmentPostProcessor {

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        Dotenv dotenv = null;

        // Try current working directory
        if (new File(".env").exists()) {
            dotenv = Dotenv.configure().ignoreIfMissing().load();
        } else if (new File("Assignment/student/.env").exists()) {
            dotenv = Dotenv.configure().directory("Assignment/student").ignoreIfMissing().load();
        } else {
            dotenv = Dotenv.configure().ignoreIfMissing().load();
        }

        Map<String, Object> envMap = new HashMap<>();
        dotenv.entries().forEach(entry -> envMap.put(entry.getKey(), entry.getValue()));

        if (!envMap.isEmpty()) {
            environment.getPropertySources().addFirst(new MapPropertySource("dotenvProperties", envMap));
        }
    }
}

