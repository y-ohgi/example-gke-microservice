package com.example.orderservice.catalog;

import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClient;

import java.util.Optional;

@Component
public class CatalogServiceClient implements CatalogClient {

	private final RestClient restClient;

	public CatalogServiceClient(RestClient catalogRestClient) {
		this.restClient = catalogRestClient;
	}

	@Override
	public Optional<ProductView> findProduct(Long productId) {
		try {
			ProductView product = restClient.get()
					.uri("/products/{id}", productId)
					.retrieve()
					.body(ProductView.class);
			return Optional.ofNullable(product);
		} catch (HttpClientErrorException.NotFound e) {
			return Optional.empty();
		}
	}
}
