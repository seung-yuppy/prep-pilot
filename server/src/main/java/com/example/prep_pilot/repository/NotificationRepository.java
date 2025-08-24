package com.example.prep_pilot.repository;

import com.example.prep_pilot.entity.NotificationType;
import com.example.prep_pilot.entity.Notifications;
import com.example.prep_pilot.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface NotificationRepository extends JpaRepository<Notifications, Long> {

    List<Notifications> findByUserToUsername(String username);

    List<Notifications> findByUserToUsernameAndIsReadFalse(String username);

    Optional<Notifications> findByUserToAndUserFromAndType(User userTo, User userFrom, NotificationType type);
}
