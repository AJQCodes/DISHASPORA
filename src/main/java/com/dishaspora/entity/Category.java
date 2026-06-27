package com.dishaspora.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "categories")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true)
    private String name; // e.g. Local Dishes, Continental, Foreign Dishes, Drinks

    @Column(nullable = false, unique = true)
    private String slug; // e.g. local, continental, foreign, drinks

    @Column(nullable = false)
    @Builder.Default
    private boolean active = true;
}
