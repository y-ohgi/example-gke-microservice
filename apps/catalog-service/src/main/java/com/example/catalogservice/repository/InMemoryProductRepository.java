package com.example.catalogservice.repository;

import com.example.catalogservice.model.Product;
import org.springframework.stereotype.Repository;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * MVP用のインメモリ実装。将来 PostgreSQL 実装へ差し替える前提で
 * {@link ProductRepository} インターフェース経由でのみ参照する。
 */
@Repository
public class InMemoryProductRepository implements ProductRepository {

	private final Map<Long, Product> products = new LinkedHashMap<>();

	public InMemoryProductRepository() {
		seed(new Product(1L, "コーヒー豆 200g", 1200, 50));
		seed(new Product(2L, "紅茶缶 100g", 900, 30));
		seed(new Product(3L, "マグカップ", 1500, 20));
		seed(new Product(4L, "ドリッパーセット", 3200, 10));
	}

	private void seed(Product product) {
		products.put(product.id(), product);
	}

	@Override
	public List<Product> findAll() {
		return List.copyOf(products.values());
	}

	@Override
	public Optional<Product> findById(Long id) {
		return Optional.ofNullable(products.get(id));
	}
}
