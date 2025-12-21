package com.softgv.management.repository;

import com.softgv.management.entity.Outpass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OutpassRepository extends JpaRepository<Outpass, Long> {
    List<Outpass> findByStudentId(Long studentId);

    List<Outpass> findByStatus(String status);
}
