package com.example.carservice.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CarRequest {

    @NotBlank(message = "Brand is required")
    private String brand;

    @NotBlank(message = "Model is required")
    private String model;

    @NotNull(message = "Year is required")
    @Min(value = 1900, message = "Year must be greater than or equal to 1900")
    private Integer year;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    private BigDecimal price;

    @Min(value = 0, message = "Mileage must be greater than or equal to 0")
    private Integer mileage;

    private String fuelType;
    private String transmission;
    private String color;
    private String origin;
    private String status;
    private String description;

    public CarRequest() {
    }

    public CarRequest(String brand, String model, Integer year, BigDecimal price, Integer mileage,
                      String fuelType, String transmission, String color, String origin,
                      String status, String description) {
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
}