package com.example.orderservice.catalog;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import java.util.Optional;

@Component
public class CatalogServiceClient implements CatalogClient {

	private static final Logger log = LoggerFactory.getLogger(CatalogServiceClient.class);

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
		} catch (RestClientException e) {
			log.error("catalog-service call failed for productId={}", productId, e);
			throw new CatalogServiceUnavailableException(e);
		}
	}
}
