package com.example.orderservice.catalog;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestClient;

@Configuration
public class CatalogClientConfig {

	private static final int CONNECT_TIMEOUT_MS = 3_000;
	private static final int READ_TIMEOUT_MS = 5_000;

	@Bean
	public RestClient catalogRestClient(
			@Value("${catalog-service.base-url}") String baseUrl) {
		SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
		requestFactory.setConnectTimeout(CONNECT_TIMEOUT_MS);
		requestFactory.setReadTimeout(READ_TIMEOUT_MS);

		return RestClient.builder()
				.baseUrl(baseUrl)
				.requestFactory(requestFactory)
				.build();
	}
}
