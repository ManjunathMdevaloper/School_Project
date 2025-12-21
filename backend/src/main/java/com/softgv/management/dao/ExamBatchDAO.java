package com.softgv.management.dao;

import com.softgv.management.entity.ExamBatch;
import java.util.List;
import java.util.Optional;

public interface ExamBatchDAO {
    ExamBatch save(ExamBatch batch);

    List<ExamBatch> findAll();

    Optional<ExamBatch> findById(Long id);

    void deleteById(Long id);
}
