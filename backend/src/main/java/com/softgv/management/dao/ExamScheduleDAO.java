package com.softgv.management.dao;

import com.softgv.management.entity.ExamSchedule;
import java.util.List;
import java.util.Optional;

public interface ExamScheduleDAO {
    ExamSchedule save(ExamSchedule examSchedule);

    List<ExamSchedule> findAll();

    List<ExamSchedule> findByClassName(String className);

    Optional<ExamSchedule> findById(Long id);

    void deleteById(Long id);
}
