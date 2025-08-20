package com.example.prep_pilot.repository;

import com.example.prep_pilot.dto.TagCountDto;
import com.example.prep_pilot.entity.Tags;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TagsRepository extends JpaRepository<Tags, Long> {

    Boolean existsByName(String name);

    Tags findByName(String name);

    @Query("SELECT new com.example.prep_pilot.dto.TagCountDto(t.name, COUNT(t.name)) " +
            "FROM Post_tags pt " +
            "JOIN pt.tags t " +
            "JOIN pt.posts p " +
            "WHERE p.user.id = :userId " +
            "AND p.isPrivate = false " +
            "GROUP BY t.name " +
            "ORDER BY COUNT(t.name) DESC")
    List<TagCountDto> findTagUsageCountByUserId(@Param("userId") Long userId);
}
