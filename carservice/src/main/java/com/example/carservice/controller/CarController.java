package com.example.carservice.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.carservice.dto.CarRequest;
import com.example.carservice.dto.CarResponse;
import com.example.carservice.service.CarService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/cars")
public class CarController {

    private final CarService carService;

    public CarController(CarService carService) {
        this.carService = carService;
    }

    @PostMapping
    public ResponseEntity<CarResponse> createCar(@Valid @RequestBody CarRequest request) {
        CarResponse createdCar = carService.createCar(request);
        return new ResponseEntity<>(createdCar, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<CarResponse>> getAllCars() {
        List<CarResponse> cars = carService.getAllCars();
        return ResponseEntity.ok(cars);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CarResponse> getCarById(@PathVariable Long id) {
        CarResponse car = carService.getCarById(id);
        return ResponseEntity.ok(car);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CarResponse> updateCar(@PathVariable Long id,
                                                 @Valid @RequestBody CarRequest request) {
        CarResponse updatedCar = carService.updateCar(id, request);
        return ResponseEntity.ok(updatedCar);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCar(@PathVariable Long id) {
        carService.deleteCar(id);
        return ResponseEntity.ok("Car deleted successfully");
    }
}