package com.example.carservice.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.carservice.dto.CarRequest;
import com.example.carservice.dto.CarResponse;
import com.example.carservice.dto.PagedResponse;
import com.example.carservice.entity.Car;
import com.example.carservice.exception.ResourceNotFoundException;
import com.example.carservice.repository.CarRepository;

@Service
public class CarService {

    private final CarRepository carRepository;

    public CarService(CarRepository carRepository) {
        this.carRepository = carRepository;
    }

    public CarResponse createCar(CarRequest request) {
        Car car = new Car();
        mapRequestToEntity(request, car);
        Car savedCar = carRepository.save(car);
        return mapEntityToResponse(savedCar);
    }

public PagedResponse<CarResponse> getValidCars(int page, int size) {
    Pageable pageable = PageRequest.of(page, size);
    Page<Car> carPage = carRepository.findAllValidCars(pageable);

    List<CarResponse> content = carPage.getContent()
            .stream()
            .map(this::mapEntityToResponse)
            .collect(Collectors.toList());

    return new PagedResponse<>(
            content,
            carPage.getNumber(),
            carPage.getSize(),
            carPage.getTotalElements(),
            carPage.getTotalPages(),
            carPage.isLast()
    );
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
        Car updatedCar = carRepository.save(existingCar);
        return mapEntityToResponse(updatedCar);
    }

    public void deleteCar(Long id) {
        Car existingCar = carRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Car not found with id: " + id));

        carRepository.delete(existingCar);
    }

    private void mapRequestToEntity(CarRequest request, Car car) {
        car.setMaTin(request.getMaTin());
        car.setTieuDe(request.getTieuDe());
        car.setUrl(request.getUrl());
        car.setUrlHinhAnh(request.getUrlHinhAnh());
        car.setNgayDang(request.getNgayDang());
        car.setNamSX(request.getNamSX());
        car.setXuatXu(request.getXuatXu());
        car.setDiaDiem(request.getDiaDiem());
        car.setKieuDang(request.getKieuDang());
        car.setSoKmDaDi(request.getSoKmDaDi());
        car.setHopSo(request.getHopSo());
        car.setTinhTrang(request.getTinhTrang());
        car.setNhienLieu(request.getNhienLieu());
        car.setGia(request.getGia());
        car.setTenNguoiBan(request.getTenNguoiBan());
car.setSdtNguoiBan(request.getSdtNguoiBan());
car.setSalonShowroom(request.getSalonShowroom());
car.setLoaiNguoiBan(request.getLoaiNguoiBan());
car.setDiaChiNguoiBan(request.getDiaChiNguoiBan());
    }

    private CarResponse mapEntityToResponse(Car car) {
        CarResponse response = new CarResponse();
        response.setId(car.getId());
        response.setMaTin(car.getMaTin());
        response.setTieuDe(car.getTieuDe());
        response.setUrl(car.getUrl());
        response.setUrlHinhAnh(car.getUrlHinhAnh());
        response.setNgayDang(car.getNgayDang());
        response.setNamSX(car.getNamSX());
        response.setXuatXu(car.getXuatXu());
        response.setDiaDiem(car.getDiaDiem());
        response.setKieuDang(car.getKieuDang());
        response.setSoKmDaDi(car.getSoKmDaDi());
        response.setHopSo(car.getHopSo());
        response.setTinhTrang(car.getTinhTrang());
        response.setNhienLieu(car.getNhienLieu());
        response.setGia(car.getGia());
        response.setTenNguoiBan(car.getTenNguoiBan());
response.setSdtNguoiBan(car.getSdtNguoiBan());
response.setSalonShowroom(car.getSalonShowroom());
response.setLoaiNguoiBan(car.getLoaiNguoiBan());
response.setDiaChiNguoiBan(car.getDiaChiNguoiBan());
        return response;
    }
}