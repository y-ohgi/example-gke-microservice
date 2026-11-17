package com.example.orderservice.order;

import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;

/**
 * MVP用のインメモリ実装。将来 PostgreSQL 実装へ差し替える前提で
 * {@link OrderRepository} インターフェース経由でのみ参照する。
 */
@Repository
public class InMemoryOrderRepository implements OrderRepository {

	private final List<Order> orders = new ArrayList<>();
	private final AtomicLong nextId = new AtomicLong(1);

	@Override
	public synchronized List<Order> findAll() {
		return List.copyOf(orders);
	}

	@Override
	public synchronized Order save(Order order) {
		Order saved = new Order(
				nextId.getAndIncrement(),
				order.productId(),
				order.productName(),
				order.quantity(),
				order.unitPrice(),
				order.totalPrice(),
				order.createdAt());
		orders.add(saved);
		return saved;
	}
}
