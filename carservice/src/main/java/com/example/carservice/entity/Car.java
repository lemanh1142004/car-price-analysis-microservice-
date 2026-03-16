package com.example.carservice.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "cars")
public class Car {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "brand", nullable = false, length = 100)
    private String brand;

    @Column(name = "model", nullable = false, length = 100)
    private String model;

    @Column(name = "year", nullable = false)
    private Integer year;

    @Column(name = "price", nullable = false, precision = 15, scale = 2)
    private BigDecimal price;

    @Column(name = "mileage")
    private Integer mileage;

    @Column(name = "fuel_type", length = 50)
    private String fuelType;

    @Column(name = "transmission", length = 50)
    private String transmission;

    @Column(name = "color", length = 50)
    private String color;

    @Column(name = "origin", length = 100)
    private String origin;

    @Column(name = "status", length = 50)
    private String status;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Car() {
    }

    public Car(Long id, String brand, String model, Integer year, BigDecimal price, Integer mileage,
               String fuelType, String transmission, String color, String origin, String status,
               String description, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.brand = brand;
        this.model = model;
        this.year = year;
        this.price = price;
        this.mileage = mileage;
        this.fuelType = fuelType;
        this.transmission = transmission;
        this.color = color;
        this.origin = origin;
        this.status = status;
        this.description = description;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public String getBrand() {
        return brand;
    }

    public String getModel() {
        return model;
    }

    public Integer getYear() {
        return year;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public Integer getMileage() {
        return mileage;
    }

    public String getFuelType() {
        return fuelType;
    }

    public String getTransmission() {
        return transmission;
    }

    public String getColor() {
        return color;
    }

    public String getOrigin() {
        return origin;
    }

    public String getStatus() {
        return status;
    }

    public String getDescription() {
        return description;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public void setMileage(Integer mileage) {
        this.mileage = mileage;
    }

    public void setFuelType(String fuelType) {
        this.fuelType = fuelType;
    }

    public void setTransmission(String transmission) {
        this.transmission = transmission;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public void setOrigin(String origin) {
        this.origin = origin;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}