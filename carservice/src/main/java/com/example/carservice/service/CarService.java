package com.example.carservice.service;

import com.example.carservice.dto.CarRequest;
import com.example.carservice.dto.CarResponse;
import com.example.carservice.entity.Car;
import com.example.carservice.exception.ResourceNotFoundException;
import com.example.carservice.repository.CarRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CarService {

    private final CarRepository carRepository;

    public CarService(CarRepository carRepository) {
        this.carRepository = carRepository;
    }

    public CarResponse createCar(CarRequest request) {
        Car car = new Car();
        mapRequestToEntity(request, car);

        LocalDateTime now = LocalDateTime.now();
        car.setCreatedAt(now);
        car.setUpdatedAt(now);

        Car savedCar = carRepository.save(car);
        return mapEntityToResponse(savedCar);
    }

    public List<CarResponse> getAllCars() {
        List<Car> cars = carRepository.findAll();
        return cars.stream()
                .map(this::mapEntityToResponse)
                .collect(Collectors.toList());
    }

    public CarResponse getCarById(Long id) {
        Car car = carRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Car not found with id: " + id));

        return mapEntityToResponse(car);
    }

    public CarResponse updateCar(Long id, CarRequest request) {
        Car existingCar = carRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Car not found with id: " + id));

        mapRequestToEntity(request, existingCar);
        existingCar.setUpdatedAt(LocalDateTime.now());

        Car updatedCar = carRepository.save(existingCar);
        return mapEntityToResponse(updatedCar);
    }

    public void deleteCar(Long id) {
        Car existingCar = carRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Car not found with id: " + id));

        carRepository.delete(existingCar);
    }

    private void mapRequestToEntity(CarRequest request, Car car) {
        car.setBrand(request.getBrand());
        car.setModel(request.getModel());
        car.setYear(request.getYear());
        car.setPrice(request.getPrice());
        car.setMileage(request.getMileage());
        car.setFuelType(request.getFuelType());
        car.setTransmission(request.getTransmission());
        car.setColor(request.getColor());
        car.setOrigin(request.getOrigin());
        car.setStatus(request.getStatus());
        car.setDescription(request.getDescription());
        car.setImageUrl(request.getImageUrl());
    }

    private CarResponse mapEntityToResponse(Car car) {
        CarResponse response = new CarResponse();
        response.setId(car.getId());
        response.setBrand(car.getBrand());
        response.setModel(car.getModel());
        response.setYear(car.getYear());
        response.setPrice(car.getPrice());
        response.setMileage(car.getMileage());
        response.setFuelType(car.getFuelType());
        response.setTransmission(car.getTransmission());
        response.setColor(car.getColor());
        response.setOrigin(car.getOrigin());
        response.setStatus(car.getStatus());
        response.setDescription(car.getDescription());
        response.setCreatedAt(car.getCreatedAt());
        response.setUpdatedAt(car.getUpdatedAt());
        response.setImageUrl(car.getImageUrl());
        return response;
    }
}