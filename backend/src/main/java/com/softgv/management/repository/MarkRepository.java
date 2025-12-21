package com.softgv.management.repository;

import com.softgv.management.entity.Mark;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MarkRepository extends JpaRepository<Mark, Long> {
    List<Mark> findByStudentId(Long studentId);

    List<Mark> findByStudentIdAndMonth(Long studentId, String month);

    Optional<Mark> findByStudentIdAndMonthAndSubject(Long studentId, String month, String subject);
}
