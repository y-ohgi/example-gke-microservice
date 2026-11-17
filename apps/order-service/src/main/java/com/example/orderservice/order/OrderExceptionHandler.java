package com.example.orderservice.order;

import com.example.orderservice.catalog.CatalogServiceUnavailableException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class OrderExceptionHandler {

	@ExceptionHandler(ProductNotFoundException.class)
	public ResponseEntity<Void> handleProductNotFound() {
		return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
	}

	@ExceptionHandler(IllegalArgumentException.class)
	public ResponseEntity<Void> handleInvalidRequest() {
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
	}

	@ExceptionHandler(CatalogServiceUnavailableException.class)
	public ResponseEntity<Void> handleCatalogServiceUnavailable() {
		return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).build();
	}
}
