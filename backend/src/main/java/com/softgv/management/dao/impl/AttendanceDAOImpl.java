package com.softgv.management.dao.impl;

import com.softgv.management.dao.AttendanceDAO;
import com.softgv.management.entity.Attendance;
import com.softgv.management.repository.AttendanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class AttendanceDAOImpl implements AttendanceDAO {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Override
    public Attendance save(Attendance attendance) {
        return attendanceRepository.save(attendance);
    }

    @Override
    public List<Attendance> findByDate(String date) {
        return attendanceRepository.findByAttendanceDate(date);
    }

    @Override
    public Optional<Attendance> findByDateAndAdmissionNo(String date, String admissionNo) {
        return attendanceRepository.findByAttendanceDateAndStudentAdmissionNo(date, admissionNo);
    }

    @Override
    public List<Attendance> findAll() {
        return attendanceRepository.findAll();
    }
}
