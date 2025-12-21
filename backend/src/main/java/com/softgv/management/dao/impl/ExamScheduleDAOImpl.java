package com.softgv.management.dao.impl;

import com.softgv.management.dao.ExamScheduleDAO;
import com.softgv.management.entity.ExamSchedule;
import com.softgv.management.repository.ExamScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class ExamScheduleDAOImpl implements ExamScheduleDAO {

    @Autowired
    private ExamScheduleRepository examScheduleRepository;

    @Override
    public ExamSchedule save(ExamSchedule examSchedule) {
        return examScheduleRepository.save(examSchedule);
    }

    @Override
    public List<ExamSchedule> findAll() {
        return examScheduleRepository.findAll();
    }

    @Override
    public List<ExamSchedule> findByClassName(String className) {
        return examScheduleRepository.findByClassName(className);
    }

    @Override
    public Optional<ExamSchedule> findById(Long id) {
        return examScheduleRepository.findById(id);
    }

    @Override
    public void deleteById(Long id) {
        examScheduleRepository.deleteById(id);
    }
}
