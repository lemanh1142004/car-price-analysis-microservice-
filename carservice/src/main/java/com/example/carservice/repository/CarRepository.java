package com.example.carservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.carservice.entity.Car;

@Repository
public interface CarRepository extends JpaRepository<Car, Long> {
}