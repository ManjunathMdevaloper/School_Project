package com.softgv.management.repository;

import com.softgv.management.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByAttendanceDate(String attendanceDate);

    Optional<Attendance> findByAttendanceDateAndStudentAdmissionNo(String attendanceDate, String admissionNo);
}
