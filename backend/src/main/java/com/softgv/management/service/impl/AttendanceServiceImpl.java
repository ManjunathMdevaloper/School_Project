package com.softgv.management.service.impl;

import com.softgv.management.dao.AttendanceDAO;
import com.softgv.management.dao.StudentDAO;
import com.softgv.management.entity.Attendance;
import com.softgv.management.entity.Student;
import com.softgv.management.service.AttendanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@org.springframework.transaction.annotation.Transactional
public class AttendanceServiceImpl implements AttendanceService {

    @Autowired
    private AttendanceDAO attendanceDAO;

    @Autowired
    private StudentDAO studentDAO;

    @Override
    public Attendance saveOrUpdateAttendance(Attendance attendance) {
        // Attendance object passed from controller might have student object with just
        // admissionNo
        String admNo = attendance.getStudent() != null ? attendance.getStudent().getAdmissionNo() : null;

        if (admNo == null) {
            throw new RuntimeException("Admission Number is required for attendance");
        }

        Optional<Attendance> existing = attendanceDAO.findByDateAndAdmissionNo(
                attendance.getAttendanceDate(), admNo);

        Attendance recordToSave;
        if (existing.isPresent()) {
            recordToSave = existing.get();
        } else {
            recordToSave = new Attendance();
            Optional<Student> student = studentDAO.findByAdmissionNo(admNo);
            if (!student.isPresent()) {
                throw new RuntimeException("Student not found with admission no: " + admNo);
            }
            recordToSave.setStudent(student.get());
            recordToSave.setAttendanceDate(attendance.getAttendanceDate());
        }

        recordToSave.setPresent(attendance.isPresent());
        recordToSave.setIntimation(attendance.isIntimation());
        recordToSave.setIntimatedBy(attendance.getIntimatedBy());
        recordToSave.setReason(attendance.getReason());

        return attendanceDAO.save(recordToSave);
    }

    @Override
    public List<Attendance> getAttendanceByDate(String date) {
        return attendanceDAO.findByDate(date);
    }

    @Override
    public List<Attendance> getAllAttendance() {
        return attendanceDAO.findAll();
    }
}
