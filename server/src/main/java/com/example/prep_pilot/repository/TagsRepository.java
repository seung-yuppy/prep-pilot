package com.example.prep_pilot.repository;

import com.example.prep_pilot.entity.Tags;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TagsRepository extends JpaRepository<Tags, Long> {

    Boolean existsByName(String name);

    Tags findByName(String name);
}
