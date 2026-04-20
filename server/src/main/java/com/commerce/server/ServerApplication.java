package com.commerce.server;

import io.github.cdimascio.dotenv.Dotenv;
import io.github.cdimascio.dotenv.DotenvEntry;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class ServerApplication {

	public static void main(String[] args) {
		Dotenv dotenv = Dotenv.load();
		for (DotenvEntry entry : dotenv.entries()){
			System.setProperty(entry.getKey(),entry.getValue());
		}
		SpringApplication.run(ServerApplication.class, args);
	}

}
