package com.example.carservice.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class CarResponse {

    private Long id;
    private String brand;
    private String model;
    private Integer year;
    private BigDecimal price;
    private Integer mileage;
    private String fuelType;
    private String transmission;
    private String color;
    private String origin;
    private String status;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String imageUrl;
    public CarResponse() {
    }

 public CarResponse(Long id, String brand, String model, Integer year, BigDecimal price,
                   Integer mileage, String fuelType, String transmission, String color,
                   String origin, String status, String description, String imageUrl,
                   LocalDateTime createdAt, LocalDateTime updatedAt) {
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
    this.imageUrl = imageUrl;
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
    public String getImageUrl() {
    return imageUrl;
}

public void setImageUrl(String imageUrl) {
    this.imageUrl = imageUrl;
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