package com.example.prep_pilot.repository;

import com.example.prep_pilot.entity.Notifications;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notifications, Long> {

    List<Notifications> findByUserToUsername(String username);

    List<Notifications> findByUserToUsernameAndIsReadFalse(String username);
}
