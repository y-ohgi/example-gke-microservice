package com.example.orderservice.catalog;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withServerError;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withStatus;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

class CatalogServiceClientTest {

	private RestClient.Builder newBuilder() {
		return RestClient.builder().baseUrl("http://catalog-service.test");
	}

	@Test
	void returnsProductWhenCatalogServiceRespondsOk() {
		RestClient.Builder builder = newBuilder();
		MockRestServiceServer server = MockRestServiceServer.bindTo(builder).build();
		CatalogServiceClient client = new CatalogServiceClient(builder.build());

		server.expect(requestTo("http://catalog-service.test/products/1"))
				.andRespond(withSuccess(
						"{\"id\":1,\"name\":\"コーヒー豆 200g\",\"price\":1200,\"stock\":50}",
						MediaType.APPLICATION_JSON));

		Optional<ProductView> result = client.findProduct(1L);

		assertThat(result).contains(new ProductView(1L, "コーヒー豆 200g", 1200, 50));
	}

	@Test
	void returnsEmptyWhenCatalogServiceReturns404() {
		RestClient.Builder builder = newBuilder();
		MockRestServiceServer server = MockRestServiceServer.bindTo(builder).build();
		CatalogServiceClient client = new CatalogServiceClient(builder.build());

		server.expect(requestTo("http://catalog-service.test/products/999"))
				.andRespond(withStatus(HttpStatus.NOT_FOUND));

		assertThat(client.findProduct(999L)).isEmpty();
	}

	@Test
	void throwsCatalogServiceUnavailableWhenCatalogServiceFails() {
		RestClient.Builder builder = newBuilder();
		MockRestServiceServer server = MockRestServiceServer.bindTo(builder).build();
		CatalogServiceClient client = new CatalogServiceClient(builder.build());

		server.expect(requestTo("http://catalog-service.test/products/1"))
				.andRespond(withServerError());

		assertThatThrownBy(() -> client.findProduct(1L))
				.isInstanceOf(CatalogServiceUnavailableException.class);
	}
}
