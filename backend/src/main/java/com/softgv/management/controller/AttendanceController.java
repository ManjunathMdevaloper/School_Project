package com.softgv.management.controller;

import com.softgv.management.entity.Attendance;
import com.softgv.management.service.AttendanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin(origins = "http://localhost:5173")
public class AttendanceController {

    @Autowired
    private AttendanceService attendanceService;

    @PostMapping
    public ResponseEntity<Attendance> saveAttendance(@RequestBody Attendance attendance) {
        Attendance saved = attendanceService.saveOrUpdateAttendance(attendance);
        return new ResponseEntity<>(saved, HttpStatus.OK);
    }

    @GetMapping("/date/{date}")
    public ResponseEntity<List<Attendance>> getAttendanceByDate(@PathVariable String date) {
        List<Attendance> list = attendanceService.getAttendanceByDate(date);
        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<Attendance>> getAllAttendance() {
        List<Attendance> list = attendanceService.getAllAttendance();
        return new ResponseEntity<>(list, HttpStatus.OK);
    }
}
