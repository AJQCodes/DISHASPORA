package com.dishaspora.repository;

import com.dishaspora.entity.Country;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CountryRepository extends JpaRepository<Country, Integer> {
    List<Country> findByActiveTrue();
    Optional<Country> findByCode(String code);
}
