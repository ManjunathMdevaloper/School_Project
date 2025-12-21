package com.softgv.management.controller;

import com.softgv.management.entity.ExamBatch;
import com.softgv.management.service.ExamScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exam-schedules")
@CrossOrigin(origins = "http://localhost:5173")
public class ExamScheduleController {

    @Autowired
    private ExamScheduleService examScheduleService;

    @PostMapping
    public ResponseEntity<ExamBatch> saveBatch(@RequestBody ExamBatch batch) {
        ExamBatch saved = examScheduleService.saveExamBatch(batch);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ExamBatch>> getAllBatches() {
        return new ResponseEntity<>(examScheduleService.getAllBatches(), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBatch(@PathVariable Long id) {
        examScheduleService.deleteBatch(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
