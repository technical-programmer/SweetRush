package com.project.tastySweets.repository;

import com.project.tastySweets.modal.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<UserRole, Long> {
    UserRole findByName(String name);
}