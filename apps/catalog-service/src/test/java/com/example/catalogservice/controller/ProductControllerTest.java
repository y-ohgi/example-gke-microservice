package com.example.catalogservice.controller;

import com.example.catalogservice.model.Product;
import com.example.catalogservice.repository.ProductRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;

import static org.hamcrest.Matchers.hasSize;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ProductController.class)
class ProductControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@MockitoBean
	private ProductRepository productRepository;

	@Test
	void listReturnsAllProducts() throws Exception {
		when(productRepository.findAll()).thenReturn(List.of(
				new Product(1L, "コーヒー豆 200g", 1200, 50)
		));

		mockMvc.perform(get("/products"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(1)))
				.andExpect(jsonPath("$[0].name").value("コーヒー豆 200g"));
	}

	@Test
	void getByIdReturnsProductWhenFound() throws Exception {
		when(productRepository.findById(1L)).thenReturn(Optional.of(
				new Product(1L, "コーヒー豆 200g", 1200, 50)
		));

		mockMvc.perform(get("/products/1"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.id").value(1))
				.andExpect(jsonPath("$.price").value(1200));
	}

	@Test
	void getByIdReturns404WhenNotFound() throws Exception {
		when(productRepository.findById(999L)).thenReturn(Optional.empty());

		mockMvc.perform(get("/products/999"))
				.andExpect(status().isNotFound());
	}
}
