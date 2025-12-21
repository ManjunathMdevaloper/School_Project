package com.softgv.management.dao.impl;

import com.softgv.management.dao.ExamBatchDAO;
import com.softgv.management.entity.ExamBatch;
import com.softgv.management.repository.ExamBatchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class ExamBatchDAOImpl implements ExamBatchDAO {

    @Autowired
    private ExamBatchRepository examBatchRepository;

    @Override
    public ExamBatch save(ExamBatch batch) {
        return examBatchRepository.save(batch);
    }

    @Override
    public List<ExamBatch> findAll() {
        return examBatchRepository.findAll();
    }

    @Override
    public Optional<ExamBatch> findById(Long id) {
        return examBatchRepository.findById(id);
    }

    @Override
    public void deleteById(Long id) {
        examBatchRepository.deleteById(id);
    }
}
