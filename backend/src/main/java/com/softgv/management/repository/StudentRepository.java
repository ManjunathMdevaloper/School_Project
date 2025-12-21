package com.softgv.management.repository;

import com.softgv.management.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByAdmissionNo(String admissionNo);

    Optional<Student> findByEmail(String email);
}
