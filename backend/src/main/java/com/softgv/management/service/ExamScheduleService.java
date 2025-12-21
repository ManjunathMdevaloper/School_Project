package com.softgv.management.service;

import com.softgv.management.entity.ExamBatch;
import java.util.List;

public interface ExamScheduleService {
    ExamBatch saveExamBatch(ExamBatch batch);

    List<ExamBatch> getAllBatches();

    void deleteBatch(Long id);
}
