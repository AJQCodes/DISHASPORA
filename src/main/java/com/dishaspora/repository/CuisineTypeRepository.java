package com.dishaspora.repository;

import com.dishaspora.entity.CuisineType;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CuisineTypeRepository extends JpaRepository<CuisineType, Integer> {
    List<CuisineType> findByActiveTrue();
    List<CuisineType> findByRegion(String region);
}
