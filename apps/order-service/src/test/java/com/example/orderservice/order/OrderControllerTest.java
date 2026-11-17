package com.example.orderservice.order;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(OrderController.class)
class OrderControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private ObjectMapper objectMapper;

	@MockitoBean
	private OrderService orderService;

	@Test
	void listReturnsOrders() throws Exception {
		when(orderService.listOrders()).thenReturn(List.of(
				new Order(1L, 1L, "コーヒー豆 200g", 2, 1200, 2400, Instant.parse("2026-01-01T00:00:00Z"))
		));

		mockMvc.perform(get("/orders"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$[0].totalPrice").value(2400));
	}

	@Test
	void createReturns201WithCreatedOrder() throws Exception {
		CreateOrderRequest request = new CreateOrderRequest(1L, 2);
		when(orderService.createOrder(request)).thenReturn(
				new Order(1L, 1L, "コーヒー豆 200g", 2, 1200, 2400, Instant.parse("2026-01-01T00:00:00Z"))
		);

		mockMvc.perform(post("/orders")
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.id").value(1))
				.andExpect(jsonPath("$.totalPrice").value(2400));
	}

	@Test
	void createReturns404WhenProductNotFound() throws Exception {
		CreateOrderRequest request = new CreateOrderRequest(999L, 1);
		when(orderService.createOrder(request)).thenThrow(new ProductNotFoundException(999L));

		mockMvc.perform(post("/orders")
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isNotFound());
	}

	@Test
	void createReturns400WhenQuantityInvalid() throws Exception {
		CreateOrderRequest request = new CreateOrderRequest(1L, 0);
		when(orderService.createOrder(request)).thenThrow(new IllegalArgumentException("quantity must be greater than 0"));

		mockMvc.perform(post("/orders")
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isBadRequest());
	}
}
