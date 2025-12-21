package com.softgv.management.dao;

import com.softgv.management.entity.Student;
import java.util.List;
import java.util.Optional;

public interface StudentDAO {
    Student save(Student student);

    List<Student> findAll();

    Optional<Student> findById(Long id);

    Optional<Student> findByAdmissionNo(String admissionNo);

    void deleteById(Long id);

    boolean existsByEmail(String email);
}
