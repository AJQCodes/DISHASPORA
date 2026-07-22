package com.dishaspora.admin.repository;

import com.dishaspora.admin.entity.Flag;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FlagRepository extends JpaRepository<Flag, Long> {

    List<Flag> findByResolvedOrderByCreatedAtDesc(boolean resolved);

    List<Flag> findAllByOrderByCreatedAtDesc();
}
