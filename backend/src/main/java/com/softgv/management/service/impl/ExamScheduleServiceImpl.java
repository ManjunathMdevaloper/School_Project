package com.softgv.management.service.impl;

import com.softgv.management.dao.ExamBatchDAO;
import com.softgv.management.entity.ExamBatch;
import com.softgv.management.entity.SubjectSchedule;
import com.softgv.management.service.ExamScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ExamScheduleServiceImpl implements ExamScheduleService {

    @Autowired
    private ExamBatchDAO examBatchDAO;

    @Override
    public ExamBatch saveExamBatch(ExamBatch batch) {
        // Ensure bidirectional relationship is set for JPA to save children
        if (batch.getSubjects() != null) {
            for (SubjectSchedule subject : batch.getSubjects()) {
                subject.setExamBatch(batch);
            }
        }
        return examBatchDAO.save(batch);
    }

    @Override
    public List<ExamBatch> getAllBatches() {
        return examBatchDAO.findAll();
    }

    @Override
    public void deleteBatch(Long id) {
        examBatchDAO.deleteById(id);
    }
}
