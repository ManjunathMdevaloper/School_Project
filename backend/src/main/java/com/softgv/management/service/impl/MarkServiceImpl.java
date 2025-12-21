package com.softgv.management.service.impl;

import com.softgv.management.entity.Mark;
import com.softgv.management.repository.MarkRepository;
import com.softgv.management.service.MarkService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MarkServiceImpl implements MarkService {

    @Autowired
    private MarkRepository markRepository;

    @Override
    public Mark saveMark(Mark mark) {
        // Upsert Logic
        if (mark.getStudent() != null) {
            Optional<Mark> existing = markRepository.findByStudentIdAndMonthAndSubject(
                    mark.getStudent().getId(),
                    mark.getMonth(),
                    mark.getSubject());

            if (existing.isPresent()) {
                Mark toUpdate = existing.get();
                toUpdate.setMarksObtained(mark.getMarksObtained());
                toUpdate.setGrade(mark.getGrade());
                toUpdate.setMaxMarks(mark.getMaxMarks());
                return markRepository.save(toUpdate);
            }
        }
        return markRepository.save(mark);
    }

    @Override
    public List<Mark> getAllMarks() {
        return markRepository.findAll();
    }

    @Override
    public List<Mark> getMarksByStudent(Long studentId) {
        return markRepository.findByStudentId(studentId);
    }

    @Override
    public List<Mark> getMarksByStudentAndMonth(Long studentId, String month) {
        return markRepository.findByStudentIdAndMonth(studentId, month);
    }
}
