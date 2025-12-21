package com.softgv.management.dao;

import com.softgv.management.entity.Attendance;
import java.util.List;
import java.util.Optional;

public interface AttendanceDAO {
    Attendance save(Attendance attendance);

    List<Attendance> findByDate(String date);

    Optional<Attendance> findByDateAndAdmissionNo(String date, String admissionNo);

    List<Attendance> findAll();
}
