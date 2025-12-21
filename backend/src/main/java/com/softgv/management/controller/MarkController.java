package com.softgv.management.controller;

import com.softgv.management.entity.Mark;
import com.softgv.management.service.MarkService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/marks")
public class MarkController {

    @Autowired
    private MarkService markService;

    @PostMapping
    public ResponseEntity<Mark> addMark(@RequestBody Mark mark) {
        Mark newMark = markService.saveMark(mark);
        return new ResponseEntity<>(newMark, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Mark>> getAllMarks() {
        return new ResponseEntity<>(markService.getAllMarks(), HttpStatus.OK);
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Mark>> getMarksByStudent(@PathVariable Long studentId) {
        return new ResponseEntity<>(markService.getMarksByStudent(studentId), HttpStatus.OK);
    }

    @GetMapping("/student/{studentId}/month/{month}")
    public ResponseEntity<List<Mark>> getMarksByStudentAndMonth(@PathVariable Long studentId,
            @PathVariable String month) {
        return new ResponseEntity<>(markService.getMarksByStudentAndMonth(studentId, month), HttpStatus.OK);
    }
}
