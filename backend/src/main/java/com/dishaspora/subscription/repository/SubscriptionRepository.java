package com.dishaspora.subscription.repository;

import com.dishaspora.subscription.entity.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {

    Optional<Subscription> findByReference(String reference);
}
