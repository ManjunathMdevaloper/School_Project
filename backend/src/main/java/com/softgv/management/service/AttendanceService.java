package com.softgv.management.service;

import com.softgv.management.entity.Attendance;
import java.util.List;

public interface AttendanceService {
    Attendance saveOrUpdateAttendance(Attendance attendance);

    List<Attendance> getAttendanceByDate(String date);

    List<Attendance> getAllAttendance();
}
