package com.example.orderservice.order;

import com.example.orderservice.catalog.CatalogClient;
import com.example.orderservice.catalog.ProductView;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.mock;

class OrderServiceTest {

	private final CatalogClient catalogClient = mock(CatalogClient.class);
	private final OrderRepository orderRepository = new InMemoryOrderRepository();
	private final Clock clock = Clock.fixed(Instant.parse("2026-01-01T00:00:00Z"), ZoneOffset.UTC);

	private OrderService orderService;

	@BeforeEach
	void setUp() {
		orderService = new OrderService(orderRepository, catalogClient, clock);
	}

	@Test
	void createOrderCalculatesTotalPriceFromCatalogService() {
		when(catalogClient.findProduct(1L))
				.thenReturn(Optional.of(new ProductView(1L, "コーヒー豆 200g", 1200, 50)));

		Order order = orderService.createOrder(new CreateOrderRequest(1L, 3));

		assertThat(order.id()).isNotNull();
		assertThat(order.productId()).isEqualTo(1L);
		assertThat(order.productName()).isEqualTo("コーヒー豆 200g");
		assertThat(order.quantity()).isEqualTo(3);
		assertThat(order.unitPrice()).isEqualTo(1200);
		assertThat(order.totalPrice()).isEqualTo(3600);
	}

	@Test
	void createOrderThrowsWhenProductNotFound() {
		when(catalogClient.findProduct(999L)).thenReturn(Optional.empty());

		assertThatThrownBy(() -> orderService.createOrder(new CreateOrderRequest(999L, 1)))
				.isInstanceOf(ProductNotFoundException.class);
	}

	@Test
	void createOrderThrowsWhenQuantityIsNotPositive() {
		assertThatThrownBy(() -> orderService.createOrder(new CreateOrderRequest(1L, 0)))
				.isInstanceOf(IllegalArgumentException.class);
	}

	@Test
	void listOrdersReturnsCreatedOrders() {
		when(catalogClient.findProduct(1L))
				.thenReturn(Optional.of(new ProductView(1L, "コーヒー豆 200g", 1200, 50)));
		orderService.createOrder(new CreateOrderRequest(1L, 1));

		assertThat(orderService.listOrders()).hasSize(1);
	}
}
