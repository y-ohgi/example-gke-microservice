package com.example.catalogservice.repository;

import com.example.catalogservice.model.Product;

import java.util.List;
import java.util.Optional;

public interface ProductRepository {

	List<Product> findAll();

	Optional<Product> findById(Long id);
}
