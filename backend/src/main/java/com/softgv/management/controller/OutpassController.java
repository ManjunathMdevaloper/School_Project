package com.softgv.management.controller;

import com.softgv.management.entity.Outpass;
import com.softgv.management.service.OutpassService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/outpasses")
public class OutpassController {

    @Autowired
    private OutpassService outpassService;

    @PostMapping
    public ResponseEntity<Outpass> requestOutpass(@RequestBody Outpass outpass) {
        Outpass newOutpass = outpassService.requestOutpass(outpass);
        return new ResponseEntity<>(newOutpass, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Outpass>> getAllOutpasses() {
        return new ResponseEntity<>(outpassService.getAllOutpasses(), HttpStatus.OK);
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Outpass>> getOutpassesByStudent(@PathVariable Long studentId) {
        return new ResponseEntity<>(outpassService.getOutpassesByStudent(studentId), HttpStatus.OK);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Outpass> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String status = body.get("status");
        String approvedBy = body.get("approvedBy");
        Outpass updatedOutpass = outpassService.updateOutpassStatus(id, status, approvedBy);
        if (updatedOutpass != null) {
            return new ResponseEntity<>(updatedOutpass, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
