package com.example.carservice.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.carservice.entity.Car;

public interface CarRepository extends JpaRepository<Car, Long> {

    @Query("""
        SELECT c FROM Car c
        WHERE c.tieuDe IS NOT NULL AND TRIM(c.tieuDe) <> ''
          AND c.urlHinhAnh IS NOT NULL AND TRIM(c.urlHinhAnh) <> ''
          AND c.gia IS NOT NULL AND TRIM(c.gia) <> ''
          AND c.namSX IS NOT NULL AND TRIM(c.namSX) <> ''
          AND c.soKmDaDi IS NOT NULL AND TRIM(c.soKmDaDi) <> ''
          AND c.nhienLieu IS NOT NULL AND TRIM(c.nhienLieu) <> ''
          AND c.hopSo IS NOT NULL AND TRIM(c.hopSo) <> ''
    """)
    Page<Car> findAllValidCars(Pageable pageable);
}