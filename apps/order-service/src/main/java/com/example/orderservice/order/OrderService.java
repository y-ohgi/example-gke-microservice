package com.example.orderservice.order;

import com.example.orderservice.catalog.CatalogClient;
import com.example.orderservice.catalog.ProductView;
import org.springframework.stereotype.Service;

import java.time.Clock;
import java.time.Instant;
import java.util.List;

@Service
public class OrderService {

	private final OrderRepository orderRepository;
	private final CatalogClient catalogClient;
	private final Clock clock;

	public OrderService(OrderRepository orderRepository, CatalogClient catalogClient, Clock clock) {
		this.orderRepository = orderRepository;
		this.catalogClient = catalogClient;
		this.clock = clock;
	}

	public List<Order> listOrders() {
		return orderRepository.findAll();
	}

	public Order createOrder(CreateOrderRequest request) {
		if (request.productId() == null) {
			throw new IllegalArgumentException("productId is required");
		}
		if (request.quantity() == null || request.quantity() <= 0) {
			throw new IllegalArgumentException("quantity must be greater than 0");
		}

		ProductView product = catalogClient.findProduct(request.productId())
				.orElseThrow(() -> new ProductNotFoundException(request.productId()));

		long totalPrice = product.price() * request.quantity();
		Order order = new Order(
				null,
				product.id(),
				product.name(),
				request.quantity(),
				product.price(),
				totalPrice,
				Instant.now(clock));

		return orderRepository.save(order);
	}
}
