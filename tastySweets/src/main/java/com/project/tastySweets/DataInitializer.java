package com.project.tastySweets;

import com.project.tastySweets.modal.UserRole;
import com.project.tastySweets.modal.User;
import com.project.tastySweets.repository.RoleRepository;
import com.project.tastySweets.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.util.HashSet;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(RoleRepository roleRepository, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (roleRepository.findByName("ROLE_USER") == null) {
            UserRole userRole = new UserRole();
            userRole.setName("ROLE_USER");
            roleRepository.save(userRole);
        }

        if (roleRepository.findByName("ROLE_ADMIN") == null) {
            UserRole adminRole = new UserRole();
            adminRole.setName("ROLE_ADMIN");
            roleRepository.save(adminRole);
        }

        if (userRepository.findByUsername("admin") == null) {
            User adminUser = new User();
            adminUser.setUsername("admin");
            adminUser.setPassword(passwordEncoder.encode("admin"));

            Set<UserRole> roles = new HashSet<>();
            roles.add(roleRepository.findByName("ROLE_ADMIN"));
            adminUser.setRoles(roles);

            userRepository.save(adminUser);
        }
    }
}