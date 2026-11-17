package com.example.catalogservice.repository;

import com.example.catalogservice.model.Product;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class InMemoryProductRepositoryTest {

	private final InMemoryProductRepository repository = new InMemoryProductRepository();

	@Test
	void findAllReturnsSeededProducts() {
		assertThat(repository.findAll()).isNotEmpty();
	}

	@Test
	void findByIdReturnsSeededProduct() {
		Product first = repository.findAll().get(0);

		assertThat(repository.findById(first.id())).contains(first);
	}

	@Test
	void findByIdReturnsEmptyWhenNotFound() {
		assertThat(repository.findById(-1L)).isEmpty();
	}
}
