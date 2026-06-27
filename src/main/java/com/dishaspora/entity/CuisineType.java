package com.dishaspora.entity;

import jakarta.persistence.*;
import lombok.*;

// Matches 013_create_cuisine_types.sql
// Granular cuisine lookup e.g. Ghanaian, Italian, Japanese
@Entity
@Table(name = "cuisine_types")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CuisineType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true)
    private String name;   // e.g. Ghanaian

    @Column(nullable = false, unique = true)
    private String slug;   // e.g. ghanaian

    private String region; // e.g. West Africa

    @Column(nullable = false)
    @Builder.Default
    private boolean active = true;
}
