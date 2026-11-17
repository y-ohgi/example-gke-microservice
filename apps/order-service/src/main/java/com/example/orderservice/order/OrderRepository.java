package com.example.orderservice.order;

import java.util.List;

public interface OrderRepository {

	List<Order> findAll();

	Order save(Order order);
}
