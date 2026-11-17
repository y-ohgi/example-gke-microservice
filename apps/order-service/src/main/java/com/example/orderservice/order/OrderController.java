package com.example.orderservice.order;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/orders")
public class OrderController {

	private final OrderService orderService;

	public OrderController(OrderService orderService) {
		this.orderService = orderService;
	}

	@GetMapping
	public List<Order> list() {
		return orderService.listOrders();
	}

	@PostMapping
	public ResponseEntity<Order> create(@RequestBody CreateOrderRequest request) {
		Order order = orderService.createOrder(request);
		return ResponseEntity.status(HttpStatus.CREATED).body(order);
	}
}
