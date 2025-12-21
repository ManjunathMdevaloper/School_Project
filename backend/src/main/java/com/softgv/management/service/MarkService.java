package com.softgv.management.service;

import com.softgv.management.entity.Mark;
import java.util.List;

public interface MarkService {
    Mark saveMark(Mark mark);

    List<Mark> getAllMarks();

    List<Mark> getMarksByStudent(Long studentId);

    List<Mark> getMarksByStudentAndMonth(Long studentId, String month);
}
