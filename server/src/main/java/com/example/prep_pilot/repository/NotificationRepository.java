package com.example.prep_pilot.repository;

import com.example.prep_pilot.entity.Notifications;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<Notifications, Long> {


}
